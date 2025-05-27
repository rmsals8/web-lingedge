package com.example.openaitest.inquiry.controller;

import com.example.openaitest.common.security.UserDetailsImpl;
import com.example.openaitest.inquiry.dto.request.ResponseCreateRequest;
import com.example.openaitest.inquiry.dto.request.StatusUpdateRequest;
import com.example.openaitest.inquiry.dto.response.InquiryDetailDto;
import com.example.openaitest.inquiry.dto.response.InquiryDto;
import com.example.openaitest.inquiry.dto.response.InquiryResponseDto;
import com.example.openaitest.inquiry.model.Inquiry;
import com.example.openaitest.inquiry.model.InquiryResponse;
import com.example.openaitest.inquiry.repository.InquiryRepository;
import com.example.openaitest.inquiry.repository.InquiryResponseRepository;
import com.example.openaitest.inquiry.repository.InquiryService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/inquiries")
@PreAuthorize("hasRole('ADMIN')")
public class AdminInquiryController {

    @Autowired
    private InquiryService inquiryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private InquiryResponseRepository inquiryResponseRepository;

    /**
     * 모든 문의 목록을 페이징하여 조회합니다.
     */
    @GetMapping
    public ResponseEntity<?> getAllInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            Authentication authentication) {

        try {
            // 현재 인증된 사용자 조회
            User admin = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 정렬 조건과 함께 페이징 요청 생성
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

            // 상태 필터링이 있다면 적용
            Page<Inquiry> inquiries;
            if (status != null && !status.isEmpty()) {
                inquiries = inquiryService.getInquiriesByStatus(status, pageable);
            } else {
                inquiries = inquiryService.getAllInquiries(pageable);
            }

            // DTO로 변환하여 반환
            Page<InquiryDto> inquiryDtos = inquiries.map(inquiry -> {
                InquiryDto dto = new InquiryDto();
                dto.setId(inquiry.getId());
                dto.setTitle(inquiry.getTitle());
                dto.setUsername(inquiry.getUser().getUsername());
                dto.setIsPrivate(inquiry.getIsPrivate());
                dto.setStatus(inquiry.getStatus());
                dto.setCreatedAt(inquiry.getCreatedAt());
                dto.setHasResponse(!inquiry.getResponses().isEmpty());
                return dto;
            });

            return ResponseEntity.ok(inquiryDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("문의 목록을 가져오는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 문의 상세 정보를 조회합니다.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getInquiryDetail(@PathVariable Long id, Authentication authentication) {
        try {
            // 현재 인증된 사용자 조회
            User admin = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 문의 상세 조회
            Inquiry inquiry = inquiryService.getInquiryById(id);
            if (inquiry == null) {
                return ResponseEntity.notFound().build();
            }

            // DTO로 변환
            InquiryDetailDto dto = new InquiryDetailDto();
            dto.setId(inquiry.getId());
            dto.setTitle(inquiry.getTitle());
            dto.setContent(inquiry.getContent());
            dto.setUsername(inquiry.getUser().getUsername());
            dto.setIsPrivate(inquiry.getIsPrivate());
            dto.setStatus(inquiry.getStatus());
            dto.setCreatedAt(inquiry.getCreatedAt());

            // countryName이 있는 경우만 설정 (DTO에 해당 필드가 있는지 확인)
            if (inquiry.getCountryName() != null) {
                try {
                    dto.setCountryName(inquiry.getCountryName());
                } catch (Exception e) {
                    // countryName 필드가 없는 경우 무시
                    System.out.println("Warning: countryName field not available in DTO");
                }
            }

            // 답변 목록 변환
            List<InquiryResponseDto> responseDtos = inquiry.getResponses().stream()
                    .map(response -> {
                        InquiryResponseDto respDto = new InquiryResponseDto();
                        respDto.setId(response.getId());
                        respDto.setContent(response.getContent());
                        respDto.setAdminName(response.getAdmin().getUsername());
                        respDto.setCreatedAt(response.getCreatedAt());
                        return respDto;
                    })
                    .collect(Collectors.toList());

            dto.setResponses(responseDtos);

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("문의 상세 정보를 가져오는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 문의의 상태를 업데이트합니다.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateInquiryStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {

        try {
            // 현재 인증된 사용자 조회
            User admin = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 문의 상태 업데이트
            Inquiry updatedInquiry = inquiryService.updateInquiryStatus(id, request.getStatus(), admin);

            // DTO로 변환
            InquiryDetailDto dto = new InquiryDetailDto();
            dto.setId(updatedInquiry.getId());
            dto.setTitle(updatedInquiry.getTitle());
            dto.setContent(updatedInquiry.getContent());
            dto.setUsername(updatedInquiry.getUser().getUsername());
            dto.setIsPrivate(updatedInquiry.getIsPrivate());
            dto.setStatus(updatedInquiry.getStatus());
            dto.setCreatedAt(updatedInquiry.getCreatedAt());

            // countryName이 있는 경우만 설정 (DTO에 해당 필드가 있는지 확인)
            if (updatedInquiry.getCountryName() != null) {
                try {
                    dto.setCountryName(updatedInquiry.getCountryName());
                } catch (Exception e) {
                    // countryName 필드가 없는 경우 무시
                    System.out.println("Warning: countryName field not available in DTO");
                }
            }

            // 답변 목록 변환
            List<InquiryResponseDto> responseDtos = updatedInquiry.getResponses().stream()
                    .map(response -> {
                        InquiryResponseDto respDto = new InquiryResponseDto();
                        respDto.setId(response.getId());
                        respDto.setContent(response.getContent());
                        respDto.setAdminName(response.getAdmin().getUsername());
                        respDto.setCreatedAt(response.getCreatedAt());
                        return respDto;
                    })
                    .collect(Collectors.toList());

            dto.setResponses(responseDtos);

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("문의 상태를 업데이트하는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 문의에 대한 답변을 생성합니다.
     */
    @PostMapping("/{inquiryId}/responses")
    public ResponseEntity<?> createResponse(
            @PathVariable Long inquiryId,
            @RequestBody ResponseCreateRequest request,
            Authentication authentication) {

        try {
            // 현재 인증된 사용자 확인
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // 역할 확인 로직 - 더 유연하게 "ADMIN"과 "ROLE_ADMIN" 모두 체크
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> {
                        String role = a.getAuthority();
                        return "ADMIN".equals(role) || "ROLE_ADMIN".equals(role);
                    });

            // 로깅 추가
            System.out.println("사용자 권한: " + userDetails.getAuthorities());
            System.out.println("관리자 여부: " + isAdmin);

            if (!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("관리자만 답변을 작성할 수 있습니다.");
            }

            // 현재 인증된 사용자 조회
            User admin = userRepository.findByEmail(userDetails.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 답변 생성
            InquiryResponse response = inquiryService.createResponse(inquiryId, request.getContent(), admin);

            // DTO로 변환
            InquiryResponseDto dto = new InquiryResponseDto();
            dto.setId(response.getId());
            dto.setContent(response.getContent());
            dto.setAdminName(admin.getUsername());
            dto.setCreatedAt(response.getCreatedAt());

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("답변을 생성하는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 문의를 삭제합니다 (관리자 전용).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInquiry(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            // 현재 인증된 사용자 확인
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // 관리자 권한 확인
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> {
                        String role = a.getAuthority();
                        return "ADMIN".equals(role) || "ROLE_ADMIN".equals(role);
                    });

            if (!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("관리자만 문의를 삭제할 수 있습니다.");
            }

            // 문의 존재 여부 확인
            Optional<Inquiry> inquiryOpt = inquiryRepository.findById(id);
            if (inquiryOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("문의를 찾을 수 없습니다.");
            }

            // 문의 삭제
            inquiryRepository.deleteById(id);

            return ResponseEntity.ok().body(Map.of("message", "문의가 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("문의를 삭제하는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 문의 답변을 삭제합니다 (관리자 전용).
     */
    @DeleteMapping("/{inquiryId}/responses/{responseId}")
    public ResponseEntity<?> deleteResponse(
            @PathVariable Long inquiryId,
            @PathVariable Long responseId,
            Authentication authentication) {

        try {
            // 현재 인증된 사용자 확인
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // 관리자 권한 확인
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> {
                        String role = a.getAuthority();
                        return "ADMIN".equals(role) || "ROLE_ADMIN".equals(role);
                    });

            if (!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("관리자만 답변을 삭제할 수 있습니다.");
            }

            // 문의 존재 여부 확인
            Optional<Inquiry> inquiryOpt = inquiryRepository.findById(inquiryId);
            if (inquiryOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("문의를 찾을 수 없습니다.");
            }

            // 답변 존재 여부 확인
            Optional<InquiryResponse> responseOpt = inquiryResponseRepository.findById(responseId);
            if (responseOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("답변을 찾을 수 없습니다.");
            }

            // 답변이 해당 문의에 속하는지 확인
            InquiryResponse response = responseOpt.get();
            if (!response.getInquiry().getId().equals(inquiryId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("답변이 해당 문의에 속하지 않습니다.");
            }

            // 답변 삭제
            inquiryResponseRepository.deleteById(responseId);

            return ResponseEntity.ok().body(Map.of("message", "답변이 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("답변을 삭제하는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}