package com.example.openaitest.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.example.openaitest.quiz.dto.question.QuizQuestionDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDetailDto {
    private Long id;
    private String title;
    private Long fileId;
    private String fileName;
    private LocalDateTime createdAt;
    private List<QuizQuestionDto> questions;
}