package com.example.openaitest.quiz.service;

import com.example.openaitest.chat.dto.openai.ChatGPTRequest;
import com.example.openaitest.chat.dto.openai.ChatGPTResponse;
import com.example.openaitest.quiz.dto.question.QuizQuestionDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpenAIQuizService {
    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    @Value("${OPENAI_API_URL}")
    private String apiUrl;

    @Value("${OPENAI_MODEL}")
    private String model;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * OpenAI API를 사용하여 퀴즈 질문 생성
     */
    public List<QuizQuestionDto> generateQuizQuestions(String content,
            int numMultipleChoice,
            int numShortAnswer) {
        String prompt = buildQuizGenerationPrompt(content, numMultipleChoice, numShortAnswer);

        ChatGPTRequest request = new ChatGPTRequest(model, prompt);
        ChatGPTResponse response = restTemplate.postForObject(apiUrl, request, ChatGPTResponse.class);

        String responseContent = response.getChoices().get(0).getMessage().getContent();

        // JSON 응답 파싱
        return parseQuizQuestions(responseContent);
    }

    /**
     * 퀴즈 생성 프롬프트 구성
     */
    private String buildQuizGenerationPrompt(String content, int numMultipleChoice, int numShortAnswer) {
        return String.format(
                "다음 텍스트를 기반으로 %d개의 객관식 문제와 %d개의 주관식 문제를 생성해주세요. " +
                        "문제는 텍스트의 핵심 내용을 테스트하는 것이어야 합니다.\n\n" +
                        "텍스트 내용:\n%s\n\n" +
                        "다음 JSON 형식으로 응답해주세요:\n" +
                        "{\n" +
                        "  \"questions\": [\n" +
                        "    {\n" +
                        "      \"type\": \"MULTIPLE_CHOICE\",\n" +
                        "      \"question\": \"문제 텍스트\",\n" +
                        "      \"options\": [\"선택지 A\", \"선택지 B\", \"선택지 C\", \"선택지 D\"],\n" +
                        "      \"correctAnswer\": \"정답 선택지\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"type\": \"SHORT_ANSWER\",\n" +
                        "      \"question\": \"문제 텍스트\",\n" +
                        "      \"correctAnswer\": \"정답 또는 정답에 포함되어야 할 핵심 키워드(쉼표로 구분)\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}\n",
                numMultipleChoice, numShortAnswer, content);
    }

    /**
     * OpenAI 응답을 QuizQuestionDto 목록으로 파싱
     */
    private List<QuizQuestionDto> parseQuizQuestions(String responseContent) {
        List<QuizQuestionDto> questions = new ArrayList<>();

        try {
            // JSON 응답에서 코드 블록 제거
            String jsonContent = responseContent.replaceAll("```json", "").replaceAll("```", "").trim();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(jsonContent);
            JsonNode questionsNode = rootNode.get("questions");

            if (questionsNode != null && questionsNode.isArray()) {
                for (JsonNode questionNode : questionsNode) {
                    String type = questionNode.get("type").asText();
                    String questionText = questionNode.get("question").asText();
                    String correctAnswer = questionNode.get("correctAnswer").asText();

                    QuizQuestionDto questionDto = new QuizQuestionDto();
                    questionDto.setQuestionType(type);
                    questionDto.setQuestionText(questionText);
                    questionDto.setCorrectAnswer(correctAnswer);

                    if ("MULTIPLE_CHOICE".equals(type)) {
                        List<String> options = new ArrayList<>();
                        JsonNode optionsNode = questionNode.get("options");
                        if (optionsNode != null && optionsNode.isArray()) {
                            for (JsonNode optionNode : optionsNode) {
                                options.add(optionNode.asText());
                            }
                        }
                        questionDto.setOptions(options);
                    }

                    questions.add(questionDto);
                }
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("퀴즈 문제 파싱 오류", e);
        }

        return questions;
    }
}