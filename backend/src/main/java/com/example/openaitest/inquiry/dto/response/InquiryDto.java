package com.example.openaitest.inquiry.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class InquiryDto {
    private Long id;
    private String title;
    private String username;
    private Boolean isPrivate;
    private String status;
    private LocalDateTime createdAt;
    private Boolean hasResponse;
}