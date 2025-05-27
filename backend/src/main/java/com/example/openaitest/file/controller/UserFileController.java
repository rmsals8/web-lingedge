package com.example.openaitest.file.controller;

import com.example.openaitest.file.dto.UserFileDto;
import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.repository.UserFileRepository;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;
import com.google.auto.value.AutoBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
public class UserFileController {

    @Autowired
    private UserFileRepository userFileRepository;
    @Autowired
    private UserFileService userFileService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserFileDto>> getUserFiles(
            @RequestParam(required = false) String fileType,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());
        List<UserFile> files;

        if (fileType != null && !fileType.isEmpty()) {
            // 파일 타입이 지정된 경우 해당 타입만 조회 (생성일 내림차순)
            files = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, fileType.toUpperCase());
            System.out.println("파일 타입 " + fileType + "의 파일 개수: " + files.size());
        } else {
            // 파일 타입이 지정되지 않은 경우 모든 파일 조회 (생성일 내림차순)
            files = userFileRepository.findByUserOrderByCreatedAtDesc(user);
            System.out.println("전체 파일 개수: " + files.size());
        }

        // 각 파일의 ID와 생성일 로깅
        for (UserFile file : files) {
            System.out.println("파일 ID: " + file.getId() + ", 타입: " + file.getFileType() +
                    ", 생성일: " + file.getCreatedAt());
        }

        return ResponseEntity.ok(files.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<UserFileDto>> getUserFilesByType(
            @PathVariable String type, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        List<UserFile> files = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, type.toUpperCase());

        System.out.println("파일 타입 " + type + "의 파일 개수: " + files.size());

        // 각 파일의 ID와 생성일 로깅
        for (UserFile file : files) {
            System.out.println("파일 ID: " + file.getId() + ", 생성일: " + file.getCreatedAt());
        }

        return ResponseEntity.ok(files.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            UserFile file = userFileService.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

            // 사용자 확인
            if (!file.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            byte[] fileData = userFileService.downloadFile(fileId, user);

            HttpHeaders headers = new HttpHeaders();
            if ("PDF".equals(file.getFileType())) {
                headers.setContentType(MediaType.APPLICATION_PDF);
            } else {
                headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
            }

            headers.setContentDispositionFormData("attachment", file.getFileName());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

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

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());

            // 파일 조회
            UserFile file = userFileService.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

            // 권한 확인 (파일 소유자인지)
            if (!file.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("이 파일을 삭제할 권한이 없습니다.");
            }

            // 파일 삭제
            userFileService.deleteFileFromBoth(fileId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "파일이 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "파일 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}