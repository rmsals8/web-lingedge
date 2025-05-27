package com.example.openaitest.writing.service;

import com.example.openaitest.file.model.UserFile;

import com.example.openaitest.file.service.AWSS3Service;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.pdf.service.PDFService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.writing.model.WritingExercise;
import com.example.openaitest.writing.repository.WritingExerciseRepository;
import com.example.openaitest.writing.service.OpenAIWritingService.WritingQuestion;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class WritingExerciseService {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private WritingExerciseRepository writingExerciseRepository;

    @Autowired
    private UserFileService userFileService;

    @Autowired
    private PDFService pdfService;

    @Autowired
    private OpenAIWritingService openAIWritingService;

    @Autowired
    private AWSS3Service awsS3Service;

    /**
     * 사용자의 영작 연습 목록 조회
     */
    public List<WritingExercise> getUserWritingExercises(User user) {
        return writingExerciseRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * 영작 연습 ID로 상세 정보 조회
     */
    public WritingExercise getWritingExerciseById(Long exerciseId, User user) {
        WritingExercise exercise = writingExerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("영작 연습을 찾을 수 없습니다."));

        if (!exercise.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        return exercise;
    }

    /**
     * PDF 파일로부터 영작 연습 생성 및 저장
     */
    @Transactional
    public Map<String, Object> generateAndSaveWritingExercise(Long fileId, User user, String title,
            String difficulty, Integer exerciseCount) {
        // 사용자의 영작 연습 수 확인
        long count = writingExerciseRepository.countByUser(user);
        if (count >= 2) {
            throw new RuntimeException("영작 연습은 최대 2개까지만 생성할 수 있습니다. 새 영작 연습을 생성하려면 기존 영작 연습을 삭제해주세요.");
        }

        // 1. PDF 파일 로드
        UserFile pdfFile = userFileService.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // 파일 타입 확인
        if (!"CONVERSATION_PDF".equals(pdfFile.getFileType())) {
            throw new RuntimeException("선택한 파일은 대화 PDF가 아닙니다.");
        }

        // 2. 파일이 사용자의 것인지 확인
        if (!pdfFile.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 3. PDF 파일 다운로드
        byte[] pdfData = userFileService.downloadFile(fileId, user);

        // 4. PDF 내용 추출
        String pdfContent = extractTextFromPdf(pdfData);

        // 5. PDF 내용에서 언어 정보 추출
        Map<String, String> languageInfo = extractLanguageInfoFromPdf(pdfContent);
        String targetLanguage = languageInfo.get("learningLanguage");
        String sourceLanguage = languageInfo.get("translationLanguage");

        // 6. 기본값 설정
        if (difficulty == null)
            difficulty = "medium";
        if (exerciseCount == null)
            exerciseCount = 5;

        // 8. OpenAI를 사용하여 영작 연습 문제 생성
        List<WritingQuestion> questions = openAIWritingService.generateWritingExercises(
                pdfContent,
                targetLanguage,
                sourceLanguage,
                exerciseCount,
                difficulty);

        // 9. PDF 생성
        byte[] exercisePdf = pdfService.generateWritingExercisePdf(
                null, // 전달할 객체가 없어도 예외 처리를 통해 대응
                questions,
                targetLanguage,
                sourceLanguage);

        // 10. 생성된 PDF를 S3에 저장
        String s3Key = awsS3Service.uploadFile(
                "writing-exercises/" + user.getId(),
                "writing_exercise_" + title + ".pdf",
                exercisePdf,
                MediaType.APPLICATION_PDF_VALUE);

        // 11. UserFile 객체 생성 및 저장 (WRITING_PDF 타입으로 지정)
        UserFile savedFile = userFileService.saveFile(
                user,
                "Writing_" + title + ".pdf",
                "WRITING_PDF",
                s3Key,
                (long) exercisePdf.length);

        // 7. 영작 연습 객체 생성 - 수정된 부분
        WritingExercise exercise = WritingExercise.builder()
                .user(user)
                .userFile(savedFile) // 핵심 수정: userFile을 설정
                .title(title)
                .difficulty(difficulty)
                .exerciseCount(exerciseCount)
                .build();

        WritingExercise savedExercise = writingExerciseRepository.save(exercise);

        // 13. 결과 반환
        Map<String, Object> result = new HashMap<>();
        result.put("exercise", savedExercise);
        result.put("file", savedFile);

        return result;
    }

    /**
     * 영작 연습 PDF 다운로드
     */
    public byte[] downloadWritingExercise(Long exerciseId, User user) {
        WritingExercise exercise = writingExerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("영작 연습을 찾을 수 없습니다."));

        if (!exercise.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // UserFile에서 PDF 다운로드
        return userFileService.downloadFile(exercise.getUserFile().getId(), user);
    }

    /**
     * 영작 연습 삭제
     */
    @Transactional
    public void deleteWritingExercise(Long exerciseId, User user) {
        WritingExercise exercise = writingExerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("영작 연습을 찾을 수 없습니다."));

        if (!exercise.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 1. 해당 영작 연습이 생성한 영작 PDF 파일 가져오기
        UserFile writingFile = exercise.getUserFile();
        Long writingFileId = null;
        if (writingFile != null && "WRITING_EXERCISE".equals(writingFile.getFileType())) {
            writingFileId = writingFile.getId();
        }

        // 2. 영작 연습 삭제
        writingExerciseRepository.delete(exercise);

        // 3. 영작 연습 PDF 파일 삭제
        if (writingFileId != null) {
            userFileService.deleteFile(writingFileId, user);
        }
    }

    /**
     * PDF 텍스트 추출 메서드
     */
    private String extractTextFromPdf(byte[] pdfData) {
        try {
            PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfData));
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();
            return text;
        } catch (IOException e) {
            throw new RuntimeException("PDF 텍스트 추출 오류", e);
        }
    }

    /**
     * PDF 내용에서 언어 정보 추출
     */
    private Map<String, String> extractLanguageInfoFromPdf(String pdfContent) {
        Map<String, String> languageInfo = new HashMap<>();
        String learningLanguage = "English"; // 기본값
        String translationLanguage = "Korean"; // 기본값

        // 언어 감지 로직
        if (pdfContent.contains("Language Learning Session") ||
                pdfContent.contains("Vocabulary:") ||
                pdfContent.contains("Conversation:")) {

            // 영어 기반 PDF
            learningLanguage = "English";

            // 번역 언어 감지
            if (pdfContent.contains("번역") || pdfContent.contains("한국어")) {
                translationLanguage = "Korean";
            } else if (pdfContent.contains("翻訳") || pdfContent.contains("日本語")) {
                translationLanguage = "Japanese";
            } else if (pdfContent.contains("翻译") || pdfContent.contains("中文")) {
                translationLanguage = "Chinese";
            } else if (pdfContent.contains("Traducción") || pdfContent.contains("Español")) {
                translationLanguage = "Spanish";
            } else if (pdfContent.contains("Traduction") || pdfContent.contains("Français")) {
                translationLanguage = "French";
            } else if (pdfContent.contains("Übersetzung") || pdfContent.contains("Deutsch")) {
                translationLanguage = "German";
            }
        } else if (pdfContent.contains("언어 학습 세션") ||
                pdfContent.contains("어휘:") ||
                pdfContent.contains("대화:")) {

            // 한국어 기반 PDF
            translationLanguage = "Korean";

            // 학습 언어 감지
            if (pdfContent.contains("English") || pdfContent.contains("영어")) {
                learningLanguage = "English";
            } else if (pdfContent.contains("Japanese") || pdfContent.contains("일본어")) {
                learningLanguage = "Japanese";
            } else if (pdfContent.contains("Chinese") || pdfContent.contains("중국어")) {
                learningLanguage = "Chinese";
            } else if (pdfContent.contains("Spanish") || pdfContent.contains("스페인어")) {
                learningLanguage = "Spanish";
            } else if (pdfContent.contains("French") || pdfContent.contains("프랑스어")) {
                learningLanguage = "French";
            } else if (pdfContent.contains("German") || pdfContent.contains("독일어")) {
                learningLanguage = "German";
            }
        }

        // 더 구체적인 정보 추출 시도
        // 예: "Learning Language: English" 또는 "학습 언어: 영어" 형태의 텍스트 검색
        Pattern learningPattern = Pattern.compile("(?i)Learning Language: (\\w+)|학습 언어: (\\w+)");
        Pattern translationPattern = Pattern.compile("(?i)Translation Language: (\\w+)|번역 언어: (\\w+)");

        Matcher learningMatcher = learningPattern.matcher(pdfContent);
        Matcher translationMatcher = translationPattern.matcher(pdfContent);

        if (learningMatcher.find()) {
            String match = learningMatcher.group(1) != null ? learningMatcher.group(1) : learningMatcher.group(2);
            if (match != null) {
                learningLanguage = match;
            }
        }

        if (translationMatcher.find()) {
            String match = translationMatcher.group(1) != null ? translationMatcher.group(1)
                    : translationMatcher.group(2);
            if (match != null) {
                translationLanguage = match;
            }
        }

        languageInfo.put("learningLanguage", learningLanguage);
        languageInfo.put("translationLanguage", translationLanguage);

        return languageInfo;
    }
}