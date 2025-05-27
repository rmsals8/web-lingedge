// src/main/java/com/example/openaitest/dto/ScriptTranslateRequest.java
package com.example.openaitest.script.dto.request;

import lombok.Data;

@Data
public class ScriptTranslateRequest {
    private String script;
    private String translationLanguage;
}