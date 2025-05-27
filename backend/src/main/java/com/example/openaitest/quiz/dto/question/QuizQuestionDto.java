package com.example.openaitest.quiz.dto.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDto {
    private Long id;
    private String questionText;
    private String questionType; // "MULTIPLE_CHOICE" 또는 "SHORT_ANSWER"
    private List<String> options; // 객관식 선택지
    private String correctAnswer;
    private Integer orderIndex;
}