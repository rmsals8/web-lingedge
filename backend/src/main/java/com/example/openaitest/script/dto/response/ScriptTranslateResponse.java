// src/main/java/com/example/openaitest/dto/ScriptTranslateResponse.java
package com.example.openaitest.script.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScriptTranslateResponse {
    private Long id;
    private List<ScriptParagraphAnalysis> paragraphs;
    private String originalScript;
    private String translationLanguage;
    private String detectedScriptLanguage;
    private String audioUrl; // MP3 URL

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScriptParagraphAnalysis {
        private String originalText;
        private String translation;
        private String summary;
        private List<VocabularyItem> vocabulary;
        private List<String> expectedQuestions;
        private List<String> expectedAnswers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VocabularyItem {
        private String word;
        private String meaning;
        private String pronunciation;
        private String example;
    }
}