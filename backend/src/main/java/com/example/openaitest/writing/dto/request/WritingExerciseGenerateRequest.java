package com.example.openaitest.writing.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingExerciseGenerateRequest {
    private Long fileId;
    private String title;
    private String difficulty; // 난이도만 선택 옵션 (null 허용)
    private Integer exerciseCount; // 문제 개수는 선택 사항 (null 허용)
}