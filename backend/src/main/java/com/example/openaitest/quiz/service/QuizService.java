package com.example.openaitest.quiz.service;

import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.pdf.service.PDFService;
import com.example.openaitest.quiz.dto.question.QuizQuestionDto;
import com.example.openaitest.quiz.dto.request.AnswerSubmitRequest;
import com.example.openaitest.quiz.dto.response.AnswerResult;
import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.quiz.model.QuizAnswer;
import com.example.openaitest.quiz.model.QuizAttempt;
import com.example.openaitest.quiz.model.QuizQuestion;
import com.example.openaitest.quiz.repository.QuizAnswerRepository;
import com.example.openaitest.quiz.repository.QuizAttemptRepository;
import com.example.openaitest.quiz.repository.QuizQuestionRepository;
import com.example.openaitest.quiz.repository.QuizRepository;
import com.example.openaitest.user.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository questionRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private QuizAnswerRepository answerRepository;

    @Autowired
    private UserFileService userFileService;

    @Autowired
    private PDFService pdfService;

    @Autowired
    private OpenAIQuizService openAIQuizService;

    public QuizAttempt getAttemptById(Long attemptId, User user) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("퀴즈 응시를 찾을 수 없습니다."));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        return attempt;
    }

    /**
     * 사용자의 퀴즈 목록 조회
     */
    public List<Quiz> getUserQuizzes(User user) {
        return quizRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * 퀴즈 ID로 상세 정보 조회
     */
    public Quiz getQuizById(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));

        if (!quiz.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        return quiz;
    }

    /**
     * PDF 파일로부터 퀴즈 생성
     */
    @Transactional
    public Quiz generateQuizFromPdf(Long fileId, User user, String title,
            int numMultipleChoice, int numShortAnswer) {

        // 사용자의 퀴즈 수 확인
        List<Quiz> userQuizzes = quizRepository.findByUserOrderByCreatedAtDesc(user);
        if (userQuizzes.size() >= 2) {
            throw new RuntimeException("퀴즈는 최대 2개까지만 생성할 수 있습니다. 새 퀴즈를 생성하려면 기존 퀴즈를 삭제해주세요.");
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

        // 4. PDF 내용 추출 (Apache PDFBox 라이브러리 사용)
        String pdfContent = extractTextFromPdf(pdfData);

        // 5. OpenAI API를 사용하여 퀴즈 질문 생성
        List<QuizQuestionDto> generatedQuestions = openAIQuizService.generateQuizQuestions(
                pdfContent, numMultipleChoice, numShortAnswer);

        // 6. 퀴즈 객체 생성 및 저장
        Quiz quiz = Quiz.builder()
                .user(user)
                .userFile(pdfFile)
                .title(title)
                .build();

        Quiz savedQuiz = quizRepository.save(quiz);

        // 7. 질문 객체 생성 및 저장
        List<QuizQuestion> questions = new ArrayList<>();
        int orderIndex = 0;

        for (QuizQuestionDto questionDto : generatedQuestions) {
            QuizQuestion question = QuizQuestion.builder()
                    .quiz(savedQuiz)
                    .questionText(questionDto.getQuestionText())
                    .questionType(questionDto.getQuestionType())
                    .correctAnswer(questionDto.getCorrectAnswer())
                    .orderIndex(orderIndex++)
                    .build();

            // 객관식 문제인 경우 선택지 저장
            if ("MULTIPLE_CHOICE".equals(questionDto.getQuestionType())) {
                // 객관식 선택지를 JSON 형태로 변환하여 저장
                ObjectMapper mapper = new ObjectMapper();
                try {
                    question.setOptions(mapper.writeValueAsString(questionDto.getOptions()));
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("선택지 변환 오류", e);
                }
            }

            questions.add(questionRepository.save(question));
        }

        savedQuiz.setQuestions(questions);
        return savedQuiz;
    }

    /**
     * 퀴즈를 PDF로 내보내기
     */
    public byte[] exportQuizToPdf(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));

        if (!quiz.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        List<QuizQuestion> questions = questionRepository.findByQuizOrderByOrderIndexAsc(quiz);

        // PDFService를 사용하여 퀴즈 PDF 생성
        return pdfService.generateQuizPdf(quiz, questions);
    }

    /**
     * 퀴즈 응시 시작
     */
    @Transactional
    public QuizAttempt startQuizAttempt(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));

        if (!quiz.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 이미 시작한 미완료 응시가 있는지 확인
        Optional<QuizAttempt> existingAttempt = attemptRepository.findTopByUserAndQuizOrderByStartedAtDesc(user, quiz);
        if (existingAttempt.isPresent() && existingAttempt.get().getCompletedAt() == null) {
            return existingAttempt.get();
        }

        // 새 퀴즈 응시 생성
        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .startedAt(LocalDateTime.now())
                .totalQuestions(quiz.getQuestions().size())
                .build();

        return attemptRepository.save(attempt);
    }

    @Transactional
    public void deleteQuiz(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));

        if (!quiz.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 1. 연관된 quiz_answers 삭제
        List<QuizQuestion> questions = questionRepository.findByQuizOrderByOrderIndexAsc(quiz);
        for (QuizQuestion question : questions) {
            answerRepository.deleteByQuestion(question);
        }

        // 2. quiz_questions 삭제
        questionRepository.deleteByQuiz(quiz);

        // 3. 해당 퀴즈가 생성한 퀴즈 파일 가져오기
        UserFile quizFile = quiz.getUserFile();
        Long quizFileId = null;
        if (quizFile != null && "QUIZ".equals(quizFile.getFileType())) {
            quizFileId = quizFile.getId();
        }

        // 4. 퀴즈 자체 삭제
        quizRepository.delete(quiz);

        // 5. 퀴즈 파일 삭제 (퀴즈 결과물 PDF가 있는 경우)
        if (quizFileId != null) {
            userFileService.deleteFile(quizFileId, user);
        }
    }

    @Transactional
    public QuizAttempt completeAttempt(Long attemptId, User user) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("퀴즈 응시를 찾을 수 없습니다."));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 이미 완료된 응시인지 확인
        if (attempt.getCompletedAt() != null) {
            return attempt;
        }

        // 문제 목록 가져오기
        Quiz quiz = attempt.getQuiz();
        List<QuizQuestion> questions = questionRepository.findByQuizOrderByOrderIndexAsc(quiz);

        // 답변 목록 가져오기
        List<QuizAnswer> allAnswers = answerRepository.findByAttempt(attempt);

        // 문제별 최신 답변만 필터링 (중복 제거)
        Map<Long, QuizAnswer> latestAnswers = new HashMap<>();
        for (QuizAnswer answer : allAnswers) {
            Long questionId = answer.getQuestion().getId();
            // 이미 저장된 답변이 있으면 ID가 더 큰(최신) 것으로 교체
            if (!latestAnswers.containsKey(questionId) ||
                    answer.getId() > latestAnswers.get(questionId).getId()) {
                latestAnswers.put(questionId, answer);
            }
        }

        List<QuizAnswer> finalAnswers = new ArrayList<>(latestAnswers.values());

        // 미응답 문제 처리
        for (QuizQuestion question : questions) {
            boolean answered = latestAnswers.containsKey(question.getId());

            if (!answered) {
                // 빈 답변 자동 제출
                QuizAnswer emptyAnswer = QuizAnswer.builder()
                        .attempt(attempt)
                        .question(question)
                        .userAnswer("")
                        .isCorrect(false)
                        .build();

                QuizAnswer savedAnswer = answerRepository.save(emptyAnswer);
                finalAnswers.add(savedAnswer);
            }
        }

        // 정답 수 계산 (중복 없는 최종 답변만 사용)
        long correctAnswers = finalAnswers.stream()
                .filter(QuizAnswer::getIsCorrect)
                .count();

        System.out.println("퀴즈 완료 - 총 답변 수(중복 포함): " + allAnswers.size());
        System.out.println("퀴즈 완료 - 최종 답변 수(중복 제거): " + finalAnswers.size());
        System.out.println("퀴즈 완료 - 정답 수: " + correctAnswers);

        // 총 문제 수 설정
        int totalQuestions = questions.size();
        attempt.setTotalQuestions(totalQuestions);

        // 점수 계산
        int score = totalQuestions > 0 ? (int) (((double) correctAnswers / totalQuestions) * 100) : 0;

        System.out.println("퀴즈 완료 - 점수 계산: (" + correctAnswers + " / " + totalQuestions + ") * 100 = " + score + "%");

        // 완료 정보 설정
        attempt.setCompletedAt(LocalDateTime.now());
        attempt.setScore(score);

        return attemptRepository.save(attempt);
    }

    /**
     * 사용자 답변 검증
     */
    private boolean checkAnswer(QuizQuestion question, String userAnswer) {
        if ("MULTIPLE_CHOICE".equals(question.getQuestionType())) {
            // 객관식 문제는 정확히 일치해야 함
            return question.getCorrectAnswer().equals(userAnswer);
        } else {
            // 주관식 문제는 핵심 키워드가 포함되어 있는지 확인
            String[] keywords = question.getCorrectAnswer().toLowerCase().split("\\s*,\\s*");
            String lowerUserAnswer = userAnswer.toLowerCase();

            // 핵심 키워드 중 하나 이상 포함되어 있으면 정답으로 간주
            for (String keyword : keywords) {
                if (lowerUserAnswer.contains(keyword)) {
                    return true;
                }
            }
            return false;
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

    @Transactional
    public List<AnswerResult> submitAllAnswers(Long attemptId, List<AnswerSubmitRequest> answerRequests, User user) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("퀴즈 응시를 찾을 수 없습니다."));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        List<AnswerResult> results = new ArrayList<>();

        // 모든 답변 처리
        for (AnswerSubmitRequest answerRequest : answerRequests) {
            Long questionId = answerRequest.getQuestionId();
            String userAnswer = answerRequest.getUserAnswer();

            QuizQuestion question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다: " + questionId));

            // 이미 답변한 문제인지 확인
            boolean alreadyAnswered = attempt.getAnswers().stream()
                    .anyMatch(a -> a.getQuestion().getId().equals(questionId));

            // 이미 답변한 경우 건너뛰기
            if (alreadyAnswered) {
                // 기존 답변의 정답 여부 결과에 추가
                AnswerResult result = attempt.getAnswers().stream()
                        .filter(a -> a.getQuestion().getId().equals(questionId))
                        .findFirst()
                        .map(a -> AnswerResult.builder()
                                .questionId(questionId)
                                .userAnswer(a.getUserAnswer())
                                .isCorrect(a.getIsCorrect())
                                .build())
                        .orElse(null);

                if (result != null) {
                    results.add(result);
                }
                continue;
            }

            // 답변 검증
            boolean isCorrect = checkAnswer(question, userAnswer);

            // 답변 저장
            QuizAnswer answer = QuizAnswer.builder()
                    .attempt(attempt)
                    .question(question)
                    .userAnswer(userAnswer)
                    .isCorrect(isCorrect)
                    .build();

            QuizAnswer savedAnswer = answerRepository.save(answer);

            // 결과 추가
            results.add(AnswerResult.builder()
                    .questionId(questionId)
                    .userAnswer(userAnswer)
                    .isCorrect(isCorrect)
                    .build());
        }

        return results;
    }
}