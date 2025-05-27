package com.example.openaitest.file.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFileDto {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime createdAt;
    private LocalDateTime expireAt;
}