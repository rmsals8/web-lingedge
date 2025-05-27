package com.example.openaitest.chat.service;

import com.example.openaitest.chat.dto.openai.ChatGPTRequest;
import com.example.openaitest.chat.dto.openai.ChatGPTResponse;
import com.example.openaitest.chat.dto.request.ChatRequest;
import com.example.openaitest.chat.dto.response.ChatResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Primary
@Service
public class ChatService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${OPENAI_MODEL}")
    private String model;

    @Value("${OPENAI_API_URL}")
    private String apiUrl;

    public ChatResponse generateChat(ChatRequest request) {
        // 프롬프트 수정 - 발음 명시적 요청 추가
        String prompt = String.format(
                // 기본 정보 (5개의 %s)
                "Create a %s level conversation about %s in %s with a %s length. " +
                        "if short length, make more than 10 sentences and 500 letter, if Medium length, make more than 20 sentences and 1500 letters, if Long length, make more than 40 sentences and 2500 letters "
                        +
                        "Then translate it to %s. " +
                        "Finally, provide a list of exactly 10 key vocabulary words with their translations and pronunciations. "
                        +

                        "==============================================================\n" +
                        "!!!! ULTRA CRITICAL PRONUNCIATION INSTRUCTION !!!!\n" +
                        "==============================================================\n\n" +

                        // 발음 형식 지침 (5개의 %s)
                        "FORMAT: [%s word] | [how to pronounce this %s word using %s sounds/characters] | [%s meaning]\n\n"
                        +

                        "✅ THE SECOND COLUMN MUST BE THE %s PRONUNCIATION OF THE WORD!\n" +
                        "❌ DO NOT use phonetic romanization (like 'sek-su' or 'a-mi-go') in the second column.\n" +
                        "❌ DO NOT use the original word in the second column.\n\n" +

                        "==============================================================\n" +
                        "EXACT PRONUNCIATION EXAMPLES FOR ALL LANGUAGE COMBINATIONS\n" +
                        "==============================================================\n\n" +

                        "• English→Korean:\n" +
                        "'sex | 섹스 | 성관계' ✅ ('sex' pronounced in Korean sounds like '섹스')\n" +

                        "• Japanese→Korean:\n" +
                        "'友達 | 토모다치 | 친구' ✅ ('友達' pronounced in Korean sounds like '토모다치')\n" +

                        "• Spanish→Korean:\n" +
                        "'amigo | 아미고 | 친구' ✅ ('amigo' pronounced in Korean sounds like '아미고')\n" +

                        "• Chinese→Korean:\n" +
                        "'朋友 | 펑요우 | 친구' ✅ ('朋友' pronounced in Korean sounds like '펑요우')\n" +

                        "• German→Korean:\n" +
                        "'Freund | 프로인트 | 친구' ✅ ('Freund' pronounced in Korean sounds like '프로인트')\n" +

                        "• Korean→English:\n" +
                        "'친구 | friend | friend' ✅ ('친구' pronounced in English sounds like 'friend')\n" +

                        "• Japanese→English:\n" +
                        "'友達 | friend | friend' ✅ ('友達' pronounced in English sounds like 'friend')\n" +

                        "• English→Japanese:\n" +
                        "'friend | フレンド | 友達' ✅ ('friend' pronounced in Japanese sounds like 'フレンド')\n" +

                        "==============================================================\n" +
                        "ULTRA CRITICAL FINAL REMINDER\n" +
                        "==============================================================\n\n" +

                        // 학습 언어와 번역 언어를 명시 (16개의 %s 중 10개 사용)
                        "I am using %s as the learning language and %s as the translation language.\n\n" +

                        "Therefore, the vocabulary list MUST follow this format:\n" +
                        "1. [%s word] | [how this %s word is pronounced using %s sounds] | [%s meaning]\n\n" +

                        "For example, if learning language is %s and translation language is %s, then:\n" +
                        "'%s | %s | %s' \n\n" +

                        "The second column MUST ONLY contain the pronunciation of the word in the first column.\n\n" +

                        // 응답 형식 (마지막 2개의 %s)
                        "Format the response as follows:\n" +
                        "Conversation:\n[%s conversation]\n\n" +
                        "Translation:\n[%s translation]\n\n" +
                        "Vocabulary:\n[List of vocabulary words with proper pronunciations and translations]",

                request.getLevel(), // %s #1: 난이도
                request.getTopic(), // %s #2: 주제
                request.getLearningLanguage(), // %s #3: 학습 언어
                request.getConversationLength(), // %s #4: 대화 길이
                request.getTranslationLanguage(), // %s #5: 번역 언어

                request.getLearningLanguage(), // %s #6: 학습 언어 단어
                request.getLearningLanguage(), // %s #7: 학습 언어 단어
                request.getTranslationLanguage(), // %s #8: 번역 언어 발음
                request.getTranslationLanguage(), // %s #9: 번역 언어로 의미
                request.getTranslationLanguage(), // %s #10: 번역 언어

                request.getLearningLanguage(), // %s #11: 학습 언어
                request.getTranslationLanguage(), // %s #12: 번역 언어

                request.getLearningLanguage(), // %s #13: 학습 언어
                request.getLearningLanguage(), // %s #14: 학습 언어
                request.getTranslationLanguage(), // %s #15: 번역 언어
                request.getTranslationLanguage(), // %s #16: 번역 언어

                request.getLearningLanguage(), // %s #17: 학습 언어
                request.getTranslationLanguage(), // %s #18: 번역 언어

                request.getLearningLanguage(), // %s #19: 학습 언어 예시 단어
                request.getTranslationLanguage(), // %s #20: 번역 언어 예시 발음
                request.getTranslationLanguage(), // %s #21: 번역 언어 예시 의미

                // 중요한 지시와 포맷 지정자 수 맞추기 위한 추가 변수들
                request.getLearningLanguage(), // %s #22: 추가 학습 언어
                request.getTranslationLanguage(), // %s #23: 추가 번역 언어
                request.getLearningLanguage(), // %s #24: 추가 학습 언어

                request.getLearningLanguage(), // %s #25: 대화 언어
                request.getTranslationLanguage() // %s #26: 번역 언어
        );

        // 프롬프트 디버깅 로그
        System.out.println("Generated prompt: " + prompt);

        // 이하 코드는 기존과 동일
        ChatGPTRequest gptRequest = new ChatGPTRequest(model, prompt);
        ChatGPTResponse gptResponse = restTemplate.postForObject(apiUrl, gptRequest, ChatGPTResponse.class);

        String fullResponse = gptResponse.getChoices().get(0).getMessage().getContent();
        // 원본 응답 로깅 추가
        System.out.println("ChatGPT 원본 응답:\n" + fullResponse);

        // Parse the full response
        String[] parts = fullResponse.split("\n\n");

        ChatResponse response = new ChatResponse();
        response.setConversation(extractSection(parts, "Conversation:"));
        response.setTranslation(extractSection(parts, "Translation:"));
        response.setVocabulary(extractSection(parts, "Vocabulary:"));

        // 요청의 번역 언어와 학습 언어를 ChatResponse 객체에 설정
        response.setTranslationLanguage(request.getTranslationLanguage());
        response.setLearningLanguage(request.getLearningLanguage());

        return response;
    }

    private String extractSection(String[] parts, String sectionName) {
        for (String part : parts) {
            if (part.trim().startsWith(sectionName)) {
                return part.substring(sectionName.length()).trim();
            }
        }
        return "";
    }
}