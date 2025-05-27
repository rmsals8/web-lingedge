package com.example.openaitest.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDto {
    private Long id;
    private Long quizId;
    private String quizTitle;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer score;
    private Integer totalQuestions;
    private Integer answeredQuestions;
}