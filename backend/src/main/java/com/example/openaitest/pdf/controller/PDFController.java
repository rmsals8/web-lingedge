package com.example.openaitest.pdf.controller;

import com.example.openaitest.chat.dto.response.ChatResponse;
import com.example.openaitest.file.dto.UserFileDto;
import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.service.AWSS3Service;
import com.example.openaitest.file.service.UserFileService;
import com.example.openaitest.pdf.service.PDFService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pdf")
public class PDFController {

    @Autowired
    private PDFService pdfService;

    @Autowired
    private UserService userService;

    @Autowired
    private AWSS3Service awsS3Service;

    @Autowired
    private UserFileService userFileService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generatePDF(@RequestBody ChatResponse chatResponse,
            Authentication authentication) {
        try {
            // 사용자 인증 확인
            if (authentication != null) {
                String username = authentication.getName();
                userService.incrementUsageCountByUsername(username);
            }

            // PDF 생성
            byte[] pdfBytes = pdfService.generatePDF(chatResponse);

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "language_learning_session.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePDF(@RequestBody ChatResponse chatResponse,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());

            // 파일 개수 체크 (사전 검사)
            List<UserFile> existingPdfFiles = userFileService.getUserFilesByType(user, "CONVERSATION_PDF");
            if (existingPdfFiles.size() >= UserFileService.MAX_FILES_PER_TYPE) {
                // 저장 가능한 최대 개수를 초과한 경우
                Map<String, Object> response = new HashMap<>();
                response.put("status", "warning");
                response.put("message",
                        "이미 최대 " + UserFileService.MAX_FILES_PER_TYPE + "개의 PDF 파일이 저장되어 있습니다. 가장 오래된 파일이 삭제됩니다.");
                response.put("replaced", true);
                response.put("replacedFile", convertToDto(existingPdfFiles.get(existingPdfFiles.size() - 1)));

                // PDF 생성 및 저장 로직
                byte[] pdfBytes = pdfService.generatePDF(chatResponse);
                String s3Key = awsS3Service.uploadFile("pdfs/" + user.getId(), "language_learning_session.pdf",
                        pdfBytes, MediaType.APPLICATION_PDF_VALUE);
                UserFile userFile = userFileService.saveFile(user, "Language_Session_" + LocalDate.now() + ".pdf",
                        "CONVERSATION_PDF", s3Key, Long.valueOf(pdfBytes.length));

                response.put("savedFile", convertToDto(userFile));
                return ResponseEntity.ok(response);
            }

            // 일반적인 경우 - 제한 미만으로 저장 중
            byte[] pdfBytes = pdfService.generatePDF(chatResponse);
            String s3Key = awsS3Service.uploadFile("pdfs/" + user.getId(), "language_learning_session.pdf", pdfBytes,
                    MediaType.APPLICATION_PDF_VALUE);
            UserFile userFile = userFileService.saveFile(user, "Language_Session_" + LocalDate.now() + ".pdf",
                    "CONVERSATION_PDF", s3Key, Long.valueOf(pdfBytes.length));

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "PDF가 성공적으로 저장되었습니다.");
            response.put("replaced", false);
            response.put("savedFile", convertToDto(userFile));
            response.put("totalFiles", userFileService.getUserFilesByType(user, "CONVERSATION_PDF").size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "PDF 저장 중 오류가 발생했습니다.");
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