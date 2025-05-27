package com.example.openaitest.chat.dto.request;

import lombok.Data;

@Data
public class ChatRequest {
    private String topic;
    private String level;
    private String learningLanguage;
    private String translationLanguage;
    private String conversationLength; // 새로운 필드 추가
}