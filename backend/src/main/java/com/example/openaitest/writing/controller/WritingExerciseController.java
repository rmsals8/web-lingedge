package com.example.openaitest.writing.controller;

import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;
import com.example.openaitest.writing.dto.request.WritingExerciseGenerateRequest;
import com.example.openaitest.writing.dto.response.WritingExerciseDto;
import com.example.openaitest.writing.model.WritingExercise;
import com.example.openaitest.writing.service.WritingExerciseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ContentDisposition;

@RestController
@RequestMapping("/api/writing-exercises")
public class WritingExerciseController {

    @Autowired
    private WritingExerciseService writingExerciseService;

    @Autowired
    private UserService userService;

    /**
     * 영작 연습 생성 및 저장
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateAndSaveWritingExercise(@RequestBody WritingExerciseGenerateRequest request,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());

            // 영작 연습 생성 및 PDF 저장
            Map<String, Object> result = writingExerciseService.generateAndSaveWritingExercise(
                    request.getFileId(),
                    user,
                    request.getTitle(),
                    request.getDifficulty(),
                    request.getExerciseCount());

            WritingExercise exercise = (WritingExercise) result.get("exercise");
            UserFile file = (UserFile) result.get("file");

            // 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "영작 연습이 성공적으로 생성되었습니다.");
            response.put("exercise", convertToWritingExerciseDto(exercise, file));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 사용자의 영작 연습 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getUserWritingExercises(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            List<WritingExercise> exercises = writingExerciseService.getUserWritingExercises(user);

            // DTO 목록으로 변환
            List<WritingExerciseDto> exerciseDtos = exercises.stream()
                    .map(exercise -> convertToWritingExerciseDto(
                            exercise,
                            exercise.getUserFile()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(exerciseDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 영작 연습 PDF 다운로드
     */
    @GetMapping("/{exerciseId}/download")
    public ResponseEntity<byte[]> downloadWritingExercise(@PathVariable Long exerciseId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            WritingExercise exercise = writingExerciseService.getWritingExerciseById(exerciseId, user);
            byte[] pdfData = writingExerciseService.downloadWritingExercise(exerciseId, user);

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            // 파일명 설정
            String filename = "Writing_" + exercise.getTitle() + ".pdf";

            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename(filename)
                    .build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 영작 연습 삭제
     */
    @DeleteMapping("/{exerciseId}")
    public ResponseEntity<?> deleteWritingExercise(@PathVariable Long exerciseId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            writingExerciseService.deleteWritingExercise(exerciseId, user);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "영작 연습이 성공적으로 삭제되었습니다.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * WritingExercise 모델을 DTO로 변환
     */
    private WritingExerciseDto convertToWritingExerciseDto(WritingExercise exercise, UserFile file) {
        return WritingExerciseDto.builder()
                .id(exercise.getId())
                .title(exercise.getTitle())
                .fileId(file != null ? file.getId() : null)
                .fileName(file != null ? file.getFileName() : null)
                .exerciseCount(exercise.getExerciseCount())
                .difficulty(exercise.getDifficulty())
                .createdAt(exercise.getCreatedAt())
                .build();
    }
}