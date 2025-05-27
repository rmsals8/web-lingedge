package com.example.openaitest.tts.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;

@Service
public class TTSService {

    @Value("${OPENAI_API_TTS_URL}")
    private String apiUrl;

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    // 사용 가능한 성우 목록
    private static final List<String> AVAILABLE_VOICES = Arrays.asList(
            "alloy", "echo", "fable", "onyx", "nova", "shimmer");

    public byte[] generateSpeech(String text, String voice) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // 기본 성우를 'alloy'로 설정
        String selectedVoice = "alloy";

        // 요청에서 성우를 지정했고, 사용 가능한 성우 목록에 있는 경우 해당 성우 사용
        if (voice != null && !voice.isEmpty() && AVAILABLE_VOICES.contains(voice.toLowerCase())) {
            selectedVoice = voice.toLowerCase();
        }

        Map<String, Object> body = new HashMap<>();
        body.put("model", "tts-1");
        body.put("input", text);
        body.put("voice", selectedVoice);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                byte[].class);

        return response.getBody();
    }

    // 사용 가능한 성우 목록을 반환하는 메서드 추가
    public List<String> getAvailableVoices() {
        return AVAILABLE_VOICES;
    }
}