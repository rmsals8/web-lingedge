package com.example.openaitest.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerResult {
    private Long questionId;
    private String userAnswer;
    private Boolean isCorrect;
}