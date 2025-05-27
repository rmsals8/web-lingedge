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
public class QuizDto {
    private Long id;
    private String title;
    private Long fileId;
    private String fileName;
    private Integer questionCount;
    private LocalDateTime createdAt;
}