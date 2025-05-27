// src/main/java/com/example/openaitest/controller/ScriptController.java
package com.example.openaitest.script.controller;

import com.example.openaitest.file.dto.UserFileDto;
import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.repository.UserFileRepository;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.script.dto.request.ScriptTranslateRequest;
import com.example.openaitest.script.dto.response.ScriptTranslateResponse;
import com.example.openaitest.script.model.ScriptAnalysis;
import com.example.openaitest.script.repository.ScriptAnalysisRepository;
import com.example.openaitest.script.service.ScriptService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/script")
public class ScriptController {

    @Autowired
    private UserFileRepository userFileRepository;

    @Autowired
    private UserFileService userFileService;
    @Autowired
    private ScriptAnalysisRepository scriptRepository;

    @Autowired
    private ScriptService scriptService;

    @Autowired
    private UserService userService;

    @PostMapping("/translate")
    public ResponseEntity<?> translateScript(
            @RequestBody ScriptTranslateRequest request,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        // 사용량 제한 확인
        if (user.getUserUsage() != null &&
                user.getUserUsage().getDailyUsageCount() >= 3 &&
                (user.getSubscription() == null || !user.getSubscription().getIsPremium())) {
            return ResponseEntity.badRequest().body("Daily usage limit exceeded");
        }

        // 스크립트 처리
        ScriptTranslateResponse response = scriptService.translateAndAnalyzeScript(
                request.getScript(),
                request.getTranslationLanguage(),
                user);

        // ID 값이 설정되었는지 확인
        if (response.getId() == null) {
            // 로그 추가
            System.out.println("경고: 응답 ID가 null입니다!");
        }

        // 사용량 증가
        userService.incrementUsageCountByUsername(user.getEmail());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{scriptId}")
    public ResponseEntity<byte[]> downloadScriptPdf(
            @PathVariable Long scriptId,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        // PDF 다운로드 로직
        byte[] pdfData = scriptService.generateScriptPdf(scriptId, user);

        // Response 헤더 설정
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=script_analysis.pdf")
                .body(pdfData);
    }

    @GetMapping("/audio/{scriptId}")
    public ResponseEntity<byte[]> downloadScriptAudio(
            @PathVariable Long scriptId,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        try {
            // MP3 다운로드 로직
            byte[] audioData = scriptService.getScriptAudio(scriptId, user);

            // 유효한 오디오 데이터인지 확인 (빈 배열이나 더미 데이터가 아님)
            if (audioData == null || audioData.length == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            // Response 헤더 설정
            return ResponseEntity.ok()
                    .header("Content-Type", "audio/mpeg")
                    .header("Content-Disposition", "attachment; filename=script_audio_" + scriptId + ".mp3")
                    .body(audioData);
        } catch (Exception e) {
            System.err.println("오디오 다운로드 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{scriptId}")
    public ResponseEntity<ScriptTranslateResponse> getScriptById(
            @PathVariable Long scriptId,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        // 스크립트 분석 결과 조회
        ScriptAnalysis scriptAnalysis = scriptRepository.findByIdAndUser(scriptId, user)
                .orElseThrow(() -> new RuntimeException("스크립트를 찾을 수 없습니다."));

        // DTO 변환
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<ScriptTranslateResponse.ScriptParagraphAnalysis> analyses = mapper.readValue(
                    scriptAnalysis.getAnalysisJson(),
                    mapper.getTypeFactory().constructCollectionType(
                            List.class,
                            ScriptTranslateResponse.ScriptParagraphAnalysis.class));

            // 응답 객체 생성
            ScriptTranslateResponse response = new ScriptTranslateResponse();
            response.setId(scriptAnalysis.getId());
            response.setParagraphs(analyses);
            response.setOriginalScript(scriptAnalysis.getOriginalScript());
            response.setTranslationLanguage(scriptAnalysis.getTranslationLanguage());
            response.setDetectedScriptLanguage(scriptAnalysis.getDetectedLanguage());
            response.setAudioUrl("/api/script/audio/" + scriptAnalysis.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            throw new RuntimeException("스크립트 분석 결과 변환 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/save/{scriptId}")
    public ResponseEntity<?> saveScriptToProfile(
            @PathVariable Long scriptId,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        try {
            // 1. 현재 오디오 파일 개수 확인 (MP3 + SCRIPT_AUDIO)
            List<UserFile> mp3Files = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, "MP3");
            List<UserFile> scriptAudioFiles = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user,
                    "SCRIPT_AUDIO");
            int totalAudioFiles = mp3Files.size() + scriptAudioFiles.size();

            // 2. 저장 한도(2개) 초과 시 저장 거부
            if (totalAudioFiles >= 2) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "status", "error",
                                "message", "오디오 파일은 최대 2개까지만 저장할 수 있습니다. " +
                                        "기존 파일을 삭제하고 다시 시도해주세요.",
                                "limitReached", true));
            }

            // 3. 스크립트 분석 데이터 가져오기
            ScriptAnalysis script = scriptRepository.findById(scriptId)
                    .orElseThrow(() -> new RuntimeException("스크립트를 찾을 수 없습니다."));

            // 4. 사용자가 스크립트 소유자인지 확인
            if (!script.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("권한이 없습니다.");
            }

            // 5. 오디오 파일 S3 키 가져오기
            String audioS3Key = script.getAudioS3Key();

            if (audioS3Key == null || audioS3Key.isEmpty()) {
                throw new RuntimeException("오디오 파일이 없습니다.");
            }

            // 6. 오디오 파일 저장
            UserFile savedAudioFile = userFileService.saveFile(
                    user,
                    "Script_Audio_" + script.getDetectedLanguage() + "_" + scriptId + ".mp3",
                    "SCRIPT_AUDIO",
                    audioS3Key,
                    100000L // 임의의 크기
            );

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "스크립트 음성이 프로필에 저장되었습니다.");
            response.put("audioFile", convertToDto(savedAudioFile));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "스크립트 저장 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // UserFile -> UserFileDto 변환 메소드
    private UserFileDto convertToDto(UserFile file) {
        return UserFileDto.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .fileType(file.getFileType())
                .fileSize(file.getFileSize())
                .createdAt(file.getCreatedAt())
                .expireAt(file.getExpireAt())
                .build();
    }
}