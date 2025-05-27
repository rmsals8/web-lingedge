package com.example.openaitest.tts.model;

public class TextRequest {
    private String text;
    private String voice; // 성우 선택 필드 추가

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getVoice() {
        return voice;
    }

    public void setVoice(String voice) {
        this.voice = voice;
    }
}