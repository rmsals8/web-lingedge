package com.example.openaitest.quiz.controller;

import com.example.openaitest.quiz.dto.question.QuizQuestionDto;
import com.example.openaitest.quiz.dto.request.BulkAnswerSubmitRequest;
import com.example.openaitest.quiz.dto.request.QuizGenerateRequest;
import com.example.openaitest.quiz.dto.response.AnswerResult;
import com.example.openaitest.quiz.dto.response.QuizAttemptDto;
import com.example.openaitest.quiz.dto.response.QuizDetailDto;
import com.example.openaitest.quiz.dto.response.QuizDto;
import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.quiz.model.QuizAnswer;
import com.example.openaitest.quiz.model.QuizAttempt;
import com.example.openaitest.quiz.model.QuizQuestion;
import com.example.openaitest.quiz.repository.QuizAnswerRepository;
import com.example.openaitest.quiz.service.QuizService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.http.ContentDisposition;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    @Autowired
    private QuizAnswerRepository quizAnswerRepository;

    /**
     * PDF 파일로부터 퀴즈 생성
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody QuizGenerateRequest request,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());

            // 퀴즈 생성
            Quiz quiz = quizService.generateQuizFromPdf(
                    request.getFileId(),
                    user,
                    request.getTitle(),
                    request.getNumMultipleChoice(),
                    request.getNumShortAnswer());

            // 응답 생성
            QuizDto quizDto = convertToQuizDto(quiz);

            return ResponseEntity.ok(quizDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 사용자의 퀴즈 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getUserQuizzes(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            List<Quiz> quizzes = quizService.getUserQuizzes(user);

            // 퀴즈 DTO 목록으로 변환
            List<QuizDto> quizDtos = quizzes.stream()
                    .map(this::convertToQuizDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(quizDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 퀴즈 상세 정보 조회
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizDetails(@PathVariable Long quizId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            Quiz quiz = quizService.getQuizById(quizId, user);

            // 퀴즈와 문제 정보를 포함한 상세 DTO 생성
            QuizDetailDto quizDetailDto = convertToQuizDetailDto(quiz);

            return ResponseEntity.ok(quizDetailDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 퀴즈 PDF 다운로드
     */
    @GetMapping("/{quizId}/pdf")
    public ResponseEntity<byte[]> downloadQuizPdf(@PathVariable Long quizId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            Quiz quiz = quizService.getQuizById(quizId, user);
            byte[] pdfBytes = quizService.exportQuizToPdf(quizId, user);

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            // 한글 제거 및 ASCII 문자만 사용하여 파일명 생성
            String safeTitle = quiz.getTitle()
                    .replaceAll("[^a-zA-Z0-9_\\-\\.]", "_") // 안전한 ASCII 문자만 남김
                    .trim();

            if (safeTitle.isEmpty()) {
                safeTitle = "quiz";
            }

            String filename = safeTitle + "_with_answers.pdf";

            // RFC 5987 형식으로 인코딩하여 파일명 설정
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20"); // URL 인코딩은 공백을 +로 변환하므로 %20으로 변경

            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename(filename)
                    .build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 퀴즈 응시 시작
     */
    @PostMapping("/{quizId}/start")
    public ResponseEntity<?> startQuizAttempt(@PathVariable Long quizId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            QuizAttempt attempt = quizService.startQuizAttempt(quizId, user);

            // 응시 정보 DTO 반환
            QuizAttemptDto attemptDto = convertToAttemptDto(attempt);

            return ResponseEntity.ok(attemptDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 퀴즈 응시 완료
     */
    @PostMapping("/attempts/{attemptId}/complete")
    public ResponseEntity<?> completeQuizAttempt(@PathVariable Long attemptId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            QuizAttempt attempt = quizService.completeAttempt(attemptId, user);

            // 최종 결과 DTO 반환
            QuizAttemptDto attemptDto = convertToAttemptDto(attempt);

            return ResponseEntity.ok(attemptDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<?> getQuizAttemptResult(@PathVariable Long attemptId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            QuizAttempt attempt = quizService.getAttemptById(attemptId, user);

            // 응시 결과 DTO 반환
            QuizAttemptDto attemptDto = convertToAttemptDto(attempt);

            return ResponseEntity.ok(attemptDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO 변환 헬퍼 메서드들

    private QuizDto convertToQuizDto(Quiz quiz) {
        return QuizDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .fileId(quiz.getUserFile().getId())
                .fileName(quiz.getUserFile().getFileName())
                .questionCount(quiz.getQuestions().size())
                .createdAt(quiz.getCreatedAt())
                .build();
    }

    private QuizDetailDto convertToQuizDetailDto(Quiz quiz) {
        List<QuizQuestionDto> questionDtos = quiz.getQuestions().stream()
                .map(this::convertToQuestionDto)
                .collect(Collectors.toList());

        return QuizDetailDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .fileId(quiz.getUserFile().getId())
                .fileName(quiz.getUserFile().getFileName())
                .createdAt(quiz.getCreatedAt())
                .questions(questionDtos)
                .build();
    }

    private QuizQuestionDto convertToQuestionDto(QuizQuestion question) {
        QuizQuestionDto dto = QuizQuestionDto.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .correctAnswer(question.getCorrectAnswer())
                .orderIndex(question.getOrderIndex())
                .build();

        // 객관식 문제인 경우 선택지 파싱
        if ("MULTIPLE_CHOICE".equals(question.getQuestionType()) && question.getOptions() != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<String> options = mapper.readValue(
                        question.getOptions(),
                        mapper.getTypeFactory().constructCollectionType(List.class, String.class));
                dto.setOptions(options);
            } catch (JsonProcessingException e) {
                // 선택지 파싱 오류 시 빈 리스트 설정
                dto.setOptions(List.of());
            }
        }

        return dto;
    }

    private QuizAttemptDto convertToAttemptDto(QuizAttempt attempt) {
        return QuizAttemptDto.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuiz().getId())
                .quizTitle(attempt.getQuiz().getTitle())
                .startedAt(attempt.getStartedAt())
                .completedAt(attempt.getCompletedAt())
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .answeredQuestions(attempt.getAnswers().size())
                .build();
    }

    // QuizController.java에 추가
    @PostMapping("/attempts/{attemptId}/submit-all")
    public ResponseEntity<?> submitAllAnswers(@PathVariable Long attemptId,
            @RequestBody BulkAnswerSubmitRequest request,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            List<AnswerResult> results = quizService.submitAllAnswers(
                    attemptId,
                    request.getAnswers(),
                    user);

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // QuizController.java에 추가
    @GetMapping("/attempts/{attemptId}/answers")
    public ResponseEntity<?> getQuizAttemptAnswers(@PathVariable Long attemptId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            QuizAttempt attempt = quizService.getAttemptById(attemptId, user);

            // 답변 목록 조회 및 변환
            List<QuizAnswer> answers = quizAnswerRepository.findByAttempt(attempt);
            List<AnswerResult> answerResults = answers.stream()
                    .map(answer -> AnswerResult.builder()
                            .questionId(answer.getQuestion().getId())
                            .userAnswer(answer.getUserAnswer())
                            .isCorrect(answer.getIsCorrect())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(answerResults);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}