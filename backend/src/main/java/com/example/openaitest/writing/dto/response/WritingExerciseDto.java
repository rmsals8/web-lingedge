package com.example.openaitest.writing.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingExerciseDto {
    private Long id;
    private String title;
    private Long fileId;
    private String fileName;
    private Integer exerciseCount;
    private String difficulty;
    private LocalDateTime createdAt;
}