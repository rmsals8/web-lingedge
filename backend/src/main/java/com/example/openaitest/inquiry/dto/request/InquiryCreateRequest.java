package com.example.openaitest.inquiry.dto.request;

import lombok.Data;

@Data
public class InquiryCreateRequest {
    private String title;
    private String content;
    private Boolean isPrivate = false;
}