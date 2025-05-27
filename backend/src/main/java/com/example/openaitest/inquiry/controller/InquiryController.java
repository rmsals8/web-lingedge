package com.example.openaitest.inquiry.controller;

import com.example.openaitest.common.security.UserDetailsImpl;
import com.example.openaitest.inquiry.dto.request.InquiryCreateRequest;
import com.example.openaitest.inquiry.dto.response.InquiryDetailDto;
import com.example.openaitest.inquiry.dto.response.InquiryDto;
import com.example.openaitest.inquiry.dto.response.InquiryResponseDto;
import com.example.openaitest.inquiry.model.Inquiry;
import com.example.openaitest.inquiry.repository.GeoLocationService;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {
    @Autowired
    private InquiryService inquiryService;

    @Autowired
    private GeoLocationService geoLocationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<InquiryDto>> getInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        // UserDetailsImpl으로 캐스팅하고 User 객체 조회
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 관리자 여부 확인
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Inquiry> inquiries = inquiryService.getInquiries(user, isAdmin, pageable);

        Page<InquiryDto> inquiryDtos = inquiries.map(this::convertToDto);
        return ResponseEntity.ok(inquiryDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryDetailDto> getInquiry(
            @PathVariable Long id,
            Authentication authentication) {

        // UserDetailsImpl으로 캐스팅하고 User 객체 조회
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 관리자 여부 확인
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Inquiry inquiry = inquiryService.getInquiry(id, user, isAdmin);
        return ResponseEntity.ok(convertToDetailDto(inquiry));
    }

    @PostMapping
    public ResponseEntity<InquiryDto> createInquiry(
            @RequestBody InquiryCreateRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication) {

        // UserDetailsImpl으로 캐스팅하고 User 객체 조회
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String ipAddress = getClientIp(httpRequest);

        // IP 기반 국가 정보 조회
        Map<String, String> countryInfo = geoLocationService.getCountryFromIp(ipAddress);

        Inquiry inquiry = inquiryService.createInquiry(
                user, request.getTitle(), request.getContent(), request.getIsPrivate(),
                ipAddress, countryInfo.get("countryCode"), countryInfo.get("countryName"));

        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(inquiry));
    }

    // 내 문의 목록 조회
    @GetMapping("/me")
    public ResponseEntity<Page<InquiryDto>> getMyInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        // UserDetailsImpl으로 캐스팅하고 User 객체 조회
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Inquiry> inquiries = inquiryService.getMyInquiries(user, pageable);

        Page<InquiryDto> inquiryDtos = inquiries.map(this::convertToDto);
        return ResponseEntity.ok(inquiryDtos);
    }

    // 헬퍼 메서드
    private String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    private InquiryDto convertToDto(Inquiry inquiry) {
        InquiryDto dto = new InquiryDto();
        dto.setId(inquiry.getId());
        dto.setTitle(inquiry.getTitle());
        dto.setUsername(inquiry.getUser().getUsername());
        dto.setIsPrivate(inquiry.getIsPrivate());
        dto.setStatus(inquiry.getStatus());
        dto.setCreatedAt(inquiry.getCreatedAt());
        dto.setHasResponse(inquiry.getResponses() != null && !inquiry.getResponses().isEmpty());
        return dto;
    }

    private InquiryDetailDto convertToDetailDto(Inquiry inquiry) {
        InquiryDetailDto dto = new InquiryDetailDto();
        dto.setId(inquiry.getId());
        dto.setTitle(inquiry.getTitle());
        dto.setContent(inquiry.getContent());
        dto.setUsername(inquiry.getUser().getUsername());
        dto.setIsPrivate(inquiry.getIsPrivate());
        dto.setStatus(inquiry.getStatus());
        dto.setCreatedAt(inquiry.getCreatedAt());
        dto.setCountryName(inquiry.getCountryName());

        List<InquiryResponseDto> responseDtos = inquiry.getResponses().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        dto.setResponses(responseDtos);
        return dto;
    }

    private InquiryResponseDto convertToResponseDto(com.example.openaitest.inquiry.model.InquiryResponse response) {
        InquiryResponseDto dto = new InquiryResponseDto();
        dto.setId(response.getId());
        dto.setContent(response.getContent());
        dto.setAdminName(response.getAdmin().getUsername());
        dto.setCreatedAt(response.getCreatedAt());
        return dto;
    }
}