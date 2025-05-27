// src/main/java/com/example/openaitest/service/ScriptService.java
package com.example.openaitest.script.service;

import com.example.openaitest.chat.dto.openai.ChatGPTRequest;
import com.example.openaitest.chat.dto.openai.ChatGPTResponse;
import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.service.AWSS3Service;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.pdf.service.PDFService;
import com.example.openaitest.script.dto.response.ScriptTranslateResponse;
import com.example.openaitest.script.model.ScriptAnalysis;
import com.example.openaitest.script.repository.ScriptAnalysisRepository;
import com.example.openaitest.tts.service.TTSService;
import com.example.openaitest.user.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ScriptService {

    @Autowired
    private TTSService ttsService; // TTSService 주입

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PDFService pdfService;

    @Autowired
    private AWSS3Service awsS3Service;

    @Autowired
    private UserFileService userFileService;

    @Autowired
    private ScriptAnalysisRepository scriptRepository;

    @Value("${OPENAI_MODEL}")
    private String model;

    @Value("${OPENAI_API_URL}")
    private String apiUrl;

    @Value("${OPENAI_API_TTS_URL}")
    private String ttsApiUrl;

    public ScriptTranslateResponse translateAndAnalyzeScript(String script, String translationLanguage, User user) {
        try {
            // 스크립트 언어 감지
            String detectedLanguage = detectScriptLanguage(script);

            // 문단 분리
            List<String> paragraphs = splitIntoParagraphs(script);

            // 각 문단 처리
            List<ScriptTranslateResponse.ScriptParagraphAnalysis> analyses = new ArrayList<>();

            for (String paragraph : paragraphs) {
                ScriptTranslateResponse.ScriptParagraphAnalysis analysis = analyzeParagraph(
                        paragraph,
                        detectedLanguage,
                        translationLanguage);
                analyses.add(analysis);
            }

            // MP3 생성
            byte[] audioData = generateAudio(script, detectedLanguage);
            String audioKey = awsS3Service.uploadFile(
                    "audio/" + user.getId(),
                    "script_audio.mp3",
                    audioData,
                    "audio/mpeg");

            // 분석 결과 저장
            ScriptAnalysis scriptAnalysis = new ScriptAnalysis();
            scriptAnalysis.setUser(user);
            scriptAnalysis.setOriginalScript(script);
            scriptAnalysis.setDetectedLanguage(detectedLanguage);
            scriptAnalysis.setTranslationLanguage(translationLanguage);
            scriptAnalysis.setAudioS3Key(audioKey);

            ObjectMapper mapper = new ObjectMapper();
            scriptAnalysis.setAnalysisJson(mapper.writeValueAsString(analyses));

            ScriptAnalysis savedScript = scriptRepository.save(scriptAnalysis);

            // PDF 생성
            byte[] pdfData = generateScriptPdf(savedScript.getId(), user);
            String pdfKey = awsS3Service.uploadFile(
                    "pdfs/" + user.getId(),
                    "script_analysis.pdf",
                    pdfData,
                    "application/pdf");

            // 파일 저장
            UserFile audioFile = userFileService.saveFile(
                    user,
                    "Script_Audio_" + detectedLanguage + ".mp3",
                    "SCRIPT_AUDIO",
                    audioKey,
                    (long) audioData.length);

            UserFile pdfFile = userFileService.saveFile(
                    user,
                    "Script_Analysis_" + detectedLanguage + ".pdf",
                    "SCRIPT_PDF",
                    pdfKey,
                    (long) pdfData.length);

            // 결과 반환
            ScriptTranslateResponse response = new ScriptTranslateResponse();
            response.setId(savedScript.getId()); // 이 라인을 추가하여 ID 설정
            response.setParagraphs(analyses);
            response.setOriginalScript(script);
            response.setTranslationLanguage(translationLanguage);
            response.setDetectedScriptLanguage(detectedLanguage);
            response.setAudioUrl("/api/script/audio/" + savedScript.getId());

            return response;

        } catch (Exception e) {
            throw new RuntimeException("스크립트 처리 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    private String detectScriptLanguage(String script) {
        // OpenAI API를 사용하여 언어 감지
        String prompt = "Detect the language of the following text and respond with just the language name (English, Korean, Japanese, Chinese, Spanish, French, German): \n\n"
                + script;

        ChatGPTRequest request = new ChatGPTRequest(model, prompt);
        ChatGPTResponse response = restTemplate.postForObject(apiUrl, request, ChatGPTResponse.class);

        String detectedLanguage = response.getChoices().get(0).getMessage().getContent().trim();

        // 언어 이름 정규화
        switch (detectedLanguage.toLowerCase()) {
            case "english":
                return "English";
            case "korean":
                return "Korean";
            case "japanese":
                return "Japanese";
            case "chinese":
                return "Chinese";
            case "spanish":
                return "Spanish";
            case "french":
                return "French";
            case "german":
                return "German";
            default:
                return "English"; // 기본값
        }
    }

    private List<String> splitIntoParagraphs(String script) {
        List<String> paragraphs = new ArrayList<>();

        // 빈 줄로 문단 구분
        Pattern pattern = Pattern.compile("(?m)^\\s*$");
        Matcher matcher = pattern.matcher(script);

        int lastIndex = 0;
        while (matcher.find()) {
            String paragraph = script.substring(lastIndex, matcher.start()).trim();
            if (!paragraph.isEmpty()) {
                paragraphs.add(paragraph);
            }
            lastIndex = matcher.end();
        }

        // 마지막 문단 추가
        if (lastIndex < script.length()) {
            String paragraph = script.substring(lastIndex).trim();
            if (!paragraph.isEmpty()) {
                paragraphs.add(paragraph);
            }
        }

        // 너무 긴 문단 분리 (500자 이상)
        List<String> result = new ArrayList<>();
        for (String paragraph : paragraphs) {
            if (paragraph.length() <= 500) {
                result.add(paragraph);
            } else {
                // 문장 단위로 분리
                String[] sentences = paragraph.split("(?<=[.!?]\\s)");
                StringBuilder currentParagraph = new StringBuilder();

                for (String sentence : sentences) {
                    if (currentParagraph.length() + sentence.length() <= 500) {
                        currentParagraph.append(sentence);
                    } else {
                        result.add(currentParagraph.toString().trim());
                        currentParagraph = new StringBuilder(sentence);
                    }
                }

                if (currentParagraph.length() > 0) {
                    result.add(currentParagraph.toString().trim());
                }
            }
        }

        return result;
    }

    private ScriptTranslateResponse.ScriptParagraphAnalysis analyzeParagraph(
            String paragraph, String scriptLanguage, String translationLanguage) {
        // 프롬프트 작성
        String prompt = "원본 텍스트: " + paragraph + "\n" +
                "원본 언어: " + scriptLanguage + "\n" +
                "번역 언어: " + translationLanguage + "\n\n" +
                "위 텍스트를 분석하여 정확히 다음 형식으로 JSON 응답을 제공해주세요:\n" +
                "{\n" +
                "  \"translation\": \"번역된 텍스트\",\n" +
                "  \"summary\": \"한 줄 요약\",\n" +
                "  \"vocabulary\": [\n" +
                "    {\"word\": \"단어1\", \"meaning\": \"의미1\", \"pronunciation\": \"발음1\", \"example\": \"예문1\"},\n" +
                "    {\"word\": \"단어2\", \"meaning\": \"의미2\", \"pronunciation\": \"발음2\", \"example\": \"예문2\"}\n" +
                "  ],\n" +
                "  \"expectedQuestions\": [\"예상 질문1\", \"예상 질문2\"],\n" +
                "  \"expectedAnswers\": [\"예상 답변1\", \"예상 답변2\"]\n" +
                "}";

        // 기존 생성자 사용
        ChatGPTRequest request = new ChatGPTRequest(model, prompt);

        // API 호출
        try {
            ChatGPTResponse response = restTemplate.postForObject(apiUrl, request, ChatGPTResponse.class);

            // 응답 파싱 및 분석 결과 생성
            String jsonResponse = response.getChoices().get(0).getMessage().getContent();

            // JSON 형식에서 필요한 부분 추출
            String jsonContent = extractJsonFromResponse(jsonResponse);

            // JSON 파싱
            ObjectMapper mapper = new ObjectMapper();
            ScriptTranslateResponse.ScriptParagraphAnalysis analysis = mapper.readValue(
                    jsonContent,
                    ScriptTranslateResponse.ScriptParagraphAnalysis.class);

            // 원본 텍스트 설정
            analysis.setOriginalText(paragraph);

            return analysis;

        } catch (Exception e) {
            // 예외 발생 시 기본 분석 결과 생성
            ScriptTranslateResponse.ScriptParagraphAnalysis analysis = new ScriptTranslateResponse.ScriptParagraphAnalysis();
            analysis.setOriginalText(paragraph);
            analysis.setTranslation("번역 실패: " + e.getMessage());
            analysis.setSummary("요약 실패");
            analysis.setVocabulary(new ArrayList<>());
            analysis.setExpectedQuestions(new ArrayList<>());
            analysis.setExpectedAnswers(new ArrayList<>());

            return analysis;
        }
    }

    private String extractJsonFromResponse(String response) {
        // JSON 블록 추출
        int startIdx = response.indexOf("{");
        int endIdx = response.lastIndexOf("}") + 1;

        if (startIdx >= 0 && endIdx > startIdx) {
            return response.substring(startIdx, endIdx);
        }

        return "{}"; // 기본 빈 JSON
    }

    private byte[] generateAudio(String script, String language) {
        try {
            System.out.println("오디오 생성 시작: 언어 = " + language + ", 텍스트 길이 = " + script.length());

            // 긴 텍스트는 적절한 길이로 자름
            if (script.length() > 4000) {
                System.out.println("텍스트가 너무 길어 분할 처리합니다: " + script.length() + "자");
                script = script.substring(0, 4000);
            }

            // 고정된 성우 사용 - nova를 기본값으로 설정
            String voice = "nova";

            // TTSService 사용해 오디오 생성
            byte[] audioData = ttsService.generateSpeech(script, voice);

            // 오디오 데이터 유효성 검사
            if (audioData == null || audioData.length <= 0) {
                throw new RuntimeException("생성된 오디오 데이터가 없습니다.");
            }

            System.out.println("오디오 생성 완료: " + audioData.length + " 바이트");
            return audioData;

        } catch (Exception e) {
            System.err.println("오디오 생성 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("오디오 생성에 실패했습니다: " + e.getMessage());
        }
    }

    public byte[] generateScriptPdf(Long scriptId, User user) {
        ScriptAnalysis script = scriptRepository.findById(scriptId)
                .orElseThrow(() -> new RuntimeException("스크립트를 찾을 수 없습니다."));

        if (!script.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            List<ScriptTranslateResponse.ScriptParagraphAnalysis> analyses = mapper.readValue(
                    script.getAnalysisJson(),
                    mapper.getTypeFactory().constructCollectionType(
                            List.class,
                            ScriptTranslateResponse.ScriptParagraphAnalysis.class));

            // PDF 생성 (PDFService에 새 메소드 추가 필요)
            return pdfService.generateScriptAnalysisPdf(
                    script.getOriginalScript(),
                    script.getDetectedLanguage(),
                    script.getTranslationLanguage(),
                    analyses);

        } catch (Exception e) {
            throw new RuntimeException("PDF 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    public byte[] getScriptAudio(Long scriptId, User user) {
        ScriptAnalysis script = scriptRepository.findById(scriptId)
                .orElseThrow(() -> new RuntimeException("스크립트를 찾을 수 없습니다."));

        if (!script.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // S3에서 오디오 파일 다운로드
        return awsS3Service.downloadFile(script.getAudioS3Key());
    }
}