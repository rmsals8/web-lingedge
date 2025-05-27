package com.example.openaitest.chat.dto.openai;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ChatGPTRequest {
    private String model;
    private List<Message> messages;

    public ChatGPTRequest(String model, String prompt) {
        this.model = model;
        this.messages = new ArrayList<>();
        this.messages.add(new Message("user", prompt));
    }

    public ChatGPTRequest(String model2, List<Message> messages2, int maxTokens) {
        this.model = model2;
        this.messages = messages2;
        // maxTokens를 사용한다면 추가 필드가 필요함
    }
}
