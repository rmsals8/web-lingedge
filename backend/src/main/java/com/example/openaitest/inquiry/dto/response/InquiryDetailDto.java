package com.example.openaitest.inquiry.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class InquiryDetailDto {
    private Long id;
    private String title;
    private String content;
    private String username;
    private Boolean isPrivate;
    private String status;
    private LocalDateTime createdAt;
    private String countryName; // 국가 정보 필드 추가
    private List<InquiryResponseDto> responses;
}