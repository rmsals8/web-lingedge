package com.example.openaitest.writing.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.openaitest.chat.dto.openai.ChatGPTRequest;
import com.example.openaitest.chat.dto.openai.ChatGPTResponse;
import com.example.openaitest.chat.dto.openai.Message;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
public class OpenAIWritingService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiUrl;

    /**
     * 원본 대화 내용을 기반으로 영작 연습 문제 생성
     */
    public List<WritingQuestion> generateWritingExercises(String originalContent,
            String targetLanguage,
            String sourceLanguage,
            int count,
            String difficulty) {
        try {
            String systemPrompt = String.format(
                    "당신은 언어 학습을 위한 영작 연습 문제를 생성하는 전문가입니다. " +
                            "제공된 대화 내용을 분석하여 %s개의 영작 연습 문제를 만들어주세요. " +
                            "난이도는 %s이며, 원어(%s)로 된 문장을 목표 언어(%s)로 번역하는 연습입니다. " +
                            "JSON 형식으로 다음 요소를 포함하여 응답해주세요: " +
                            "sourceText(원어 문장), targetText(목표 언어로 번역), " +
                            "hint(난이도에 따른 힌트), explanation(문법 설명 및 표현 설명)",
                    count, difficulty, sourceLanguage, targetLanguage);

            String userPrompt = String.format(
                    "다음은 %s와 %s로 된 대화 내용입니다. 이를 분석하여 영작 연습 문제를 만들어주세요:\n\n%s",
                    sourceLanguage, targetLanguage, originalContent);

            List<Message> messages = new ArrayList<>();
            messages.add(new Message("system", systemPrompt));
            messages.add(new Message("user", userPrompt));

            // 디버깅 로그 추가
            System.out.println("OpenAI API 호출 시작");
            System.out.println("모델: " + model);
            System.out.println("메시지 개수: " + messages.size());

            // ChatGPTRequest 생성자 문제 수정 필요
            ChatGPTRequest gptRequest = new ChatGPTRequest(model, messages, 2000);

            // API 호출
            System.out.println("API 호출 직전");
            ChatGPTResponse gptResponse = restTemplate.postForObject(apiUrl, gptRequest, ChatGPTResponse.class);
            System.out.println("API 호출 완료");

            if (gptResponse == null || gptResponse.getChoices() == null || gptResponse.getChoices().isEmpty()) {
                System.err.println("OpenAI API 응답이 비어있습니다.");
                throw new RuntimeException("영작 연습 생성에 실패했습니다: API 응답이 비어있습니다.");
            }

            String responseContent = gptResponse.getChoices().get(0).getMessage().getContent();
            System.out.println(
                    "API 응답 내용 확인: " + responseContent.substring(0, Math.min(100, responseContent.length())) + "...");

            // JSON 응답 파싱
            return parseWritingQuestions(responseContent);
        } catch (Exception e) {
            System.err.println("OpenAI API 호출 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("영작 연습 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * GPT 응답에서 JSON 파싱하여 WritingQuestion 리스트 생성
     */
    private List<WritingQuestion> parseWritingQuestions(String jsonResponse) {
        List<WritingQuestion> questions = new ArrayList<>();

        try {
            System.out.println("JSON 파싱 시작");
            // JSON 부분만 추출 (중괄호 시작부터 끝까지)
            int startIndex = jsonResponse.indexOf("{");
            int endIndex = jsonResponse.lastIndexOf("}") + 1;

            if (startIndex < 0 || endIndex <= startIndex) {
                System.err.println("유효한 JSON 형식을 찾을 수 없습니다: " + jsonResponse);
                throw new RuntimeException("유효한 JSON 응답을 받지 못했습니다.");
            }

            String jsonPart = jsonResponse.substring(startIndex, endIndex);
            System.out.println("추출된 JSON: " + jsonPart.substring(0, Math.min(100, jsonPart.length())) + "...");

            // JSON 파싱
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseMap = mapper.readValue(jsonPart, new TypeReference<Map<String, Object>>() {
            });

            // 'questions' 또는 'exercises' 키 찾기
            List<Map<String, String>> questionsList = null;
            if (responseMap.containsKey("questions")) {
                questionsList = (List<Map<String, String>>) responseMap.get("questions");
                System.out.println("'questions' 키에서 " + questionsList.size() + "개 항목 발견");
            } else if (responseMap.containsKey("exercises")) {
                questionsList = (List<Map<String, String>>) responseMap.get("exercises");
                System.out.println("'exercises' 키에서 " + questionsList.size() + "개 항목 발견");
            } else {
                System.err.println("응답에 'questions' 또는 'exercises' 키가 없습니다: " + responseMap.keySet());
                throw new RuntimeException("응답 형식이 예상과 다릅니다.");
            }

            if (questionsList != null) {
                for (Map<String, String> q : questionsList) {
                    if (!q.containsKey("sourceText") || !q.containsKey("targetText")) {
                        System.err.println("필수 필드가 없는 항목: " + q);
                        continue;
                    }

                    WritingQuestion question = new WritingQuestion(
                            q.get("sourceText"),
                            q.get("targetText"),
                            q.getOrDefault("hint", ""),
                            q.getOrDefault("explanation", ""));
                    questions.add(question);
                }
            }

            System.out.println("총 " + questions.size() + "개 문제 파싱 완료");
        } catch (Exception e) {
            System.err.println("JSON 파싱 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("영작 문제 파싱 오류: " + e.getMessage(), e);
        }

        if (questions.isEmpty()) {
            System.err.println("파싱된 문제가 없습니다.");
            throw new RuntimeException("영작 문제를 생성하지 못했습니다.");
        }

        return questions;
    }

    /**
     * 영작 문제 클래스
     */
    public static class WritingQuestion {
        private final String sourceText; // 원본 문장 (한국어 또는 번역 언어)
        private final String targetText; // 목표 문장 (영어 또는 학습 언어)
        private final String hint; // 힌트
        private final String explanation; // 설명

        public WritingQuestion(String sourceText, String targetText, String hint, String explanation) {
            this.sourceText = sourceText;
            this.targetText = targetText;
            this.hint = hint;
            this.explanation = explanation;
        }

        public String getSourceText() {
            return sourceText;
        }

        public String getTargetText() {
            return targetText;
        }

        public String getHint() {
            return hint;
        }

        public String getExplanation() {
            return explanation;
        }
    }
}