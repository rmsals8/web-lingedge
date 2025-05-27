package com.example.openaitest.tts.controller;

import com.example.openaitest.file.dto.UserFileDto;
import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.repository.UserFileRepository;
import com.example.openaitest.file.service.AWSS3Service;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.tts.model.TextRequest;
import com.example.openaitest.tts.service.TTSService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tts")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class TTSController {

    @Autowired
    private UserFileRepository userFileRepository;
    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Autowired
    private TTSService ttsService;

    @Autowired
    private UserService userService;

    @Autowired
    private AWSS3Service awsS3Service;

    @Autowired
    private UserFileService userFileService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateSpeech(@RequestBody TextRequest request) {
        byte[] audioData = ttsService.generateSpeech(request.getText(), request.getVoice());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "generated_speech.mp3");
        return new ResponseEntity<>(audioData, headers, HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveAudio(@RequestBody TextRequest request,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());

            // 현재 오디오 파일 개수 확인 (MP3 + SCRIPT_AUDIO)
            List<UserFile> mp3Files = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, "MP3");
            List<UserFile> scriptAudioFiles = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user,
                    "SCRIPT_AUDIO");
            int totalAudioFiles = mp3Files.size() + scriptAudioFiles.size();

            // 이미 2개 있다면 거부
            if (totalAudioFiles >= 2) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "status", "error",
                                "message", "오디오 파일은 최대 2개까지만 저장할 수 있습니다. 기존 파일을 삭제하고 다시 시도해주세요.",
                                "limitReached", true));
            }

            // 새 음성 생성
            byte[] audioData = ttsService.generateSpeech(request.getText(), request.getVoice());

            // S3에 업로드
            String s3Key = awsS3Service.uploadFile(
                    "audio/" + user.getId(),
                    "tts_audio_" + LocalDate.now() + ".mp3",
                    audioData,
                    "audio/mpeg");

            // 파일 정보 저장
            UserFile userFile = userFileService.saveFile(
                    user,
                    "Audio_" + LocalDate.now() + ".mp3",
                    "MP3",
                    s3Key,
                    Long.valueOf(audioData.length));

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "오디오가 성공적으로 저장되었습니다.");
            response.put("savedFile", convertToDto(userFile));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "오디오 저장 중 오류가 발생했습니다: " + e.getMessage());
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

    // 사용 가능한 성우 목록을 반환하는 엔드포인트 추가
    @GetMapping("/voices")
    public ResponseEntity<Map<String, Object>> getAvailableVoices() {
        List<String> voices = ttsService.getAvailableVoices();
        Map<String, Object> response = new HashMap<>();
        response.put("voices", voices);
        return ResponseEntity.ok(response);
    }

}