package com.example.openaitest.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String conversation;
    private String translation;
    private String vocabulary;
    private String translationLanguage; // 번역 언어
    private String learningLanguage; // 학습 언어 추가

    @Override
    public String toString() {
        return "Conversation: " + conversation + "\n\n" +
                "Translation: " + translation + "\n\n" +
                "Vocabulary: " + vocabulary;
    }
}