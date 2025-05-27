package com.example.openaitest.quiz.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizGenerateRequest {
    private Long fileId;
    private String title;
    private Integer numMultipleChoice = 5;
    private Integer numShortAnswer = 3;
}