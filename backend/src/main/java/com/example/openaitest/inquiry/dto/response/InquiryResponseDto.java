package com.example.openaitest.inquiry.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class InquiryResponseDto {
    private Long id;
    private String content;
    private String adminName;
    private LocalDateTime createdAt;
}