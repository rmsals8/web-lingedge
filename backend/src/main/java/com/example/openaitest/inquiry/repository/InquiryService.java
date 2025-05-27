package com.example.openaitest.inquiry.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.openaitest.auth.service.EmailService;
import com.example.openaitest.inquiry.model.Inquiry;
import com.example.openaitest.inquiry.model.InquiryResponse;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InquiryService {
    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private InquiryResponseRepository inquiryResponseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    /**
     * 내 문의 목록 조회
     */
    public Page<Inquiry> getMyInquiries(User user, Pageable pageable) {
        return inquiryRepository.findByUser(user, pageable);
    }

    /**
     * 문의 생성
     */
    @Transactional
    public Inquiry createInquiry(User user, String title, String content,
            boolean isPrivate, String ipAddress,
            String countryCode, String countryName) {
        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .title(title)
                .content(content)
                .isPrivate(isPrivate)
                .ipAddress(ipAddress)
                .countryCode(countryCode)
                .countryName(countryName)
                .build();

        return inquiryRepository.save(inquiry);
    }

    /**
     * 문의 목록 조회 (페이징)
     */
    public Page<Inquiry> getInquiries(User user, boolean isAdmin, Pageable pageable) {
        if (isAdmin) {
            return inquiryRepository.findAll(pageable);
        } else {
            return inquiryRepository.findAllVisibleToUser(user, pageable);
        }
    }

    /**
     * 문의 상세 조회
     */
    public Inquiry getInquiry(Long id, User user, boolean isAdmin) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));

        // 비밀글인 경우 작성자 또는 관리자만 조회 가능
        if (inquiry.getIsPrivate() && !isAdmin && !inquiry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }

        return inquiry;
    }

    /**
     * 관리자용 - 모든 문의 조회 (페이징)
     */
    public Page<Inquiry> getAllInquiries(Pageable pageable) {
        return inquiryRepository.findAll(pageable);
    }

    /**
     * 관리자용 - 상태별 문의 조회 (페이징)
     */
    public Page<Inquiry> getInquiriesByStatus(String status, Pageable pageable) {
        return inquiryRepository.findByStatus(status, pageable);
    }

    /**
     * 관리자용 - 문의 ID로 조회
     */
    public Inquiry getInquiryById(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));
    }

    /**
     * 문의 상태 변경
     */
    @Transactional
    public Inquiry updateInquiryStatus(Long id, String status, User admin) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));

        inquiry.setStatus(status);
        return inquiryRepository.save(inquiry);
    }

    /**
     * 문의 답변 작성
     */
    @Transactional
    public InquiryResponse createResponse(Long inquiryId, String content, User admin) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));

        InquiryResponse response = InquiryResponse.builder()
                .inquiry(inquiry)
                .admin(admin)
                .content(content)
                .build();

        response = inquiryResponseRepository.save(response);

        // 문의 상태 업데이트
        inquiry.setStatus("IN_PROGRESS");
        inquiryRepository.save(inquiry);

        // 이메일 전송
        sendResponseNotification(inquiry, response);

        return response;
    }

    /**
     * 답변 이메일 알림 전송
     */
    private void sendResponseNotification(Inquiry inquiry, InquiryResponse response) {
        User user = inquiry.getUser();
        String subject = "[LingEdge] 문의에 답변이 등록되었습니다.";

        String inquiryUrl = "https://your-domain.com/inquiries/" + inquiry.getId();

        String message = String.format(
                "안녕하세요 %s님,\n\n" +
                        "귀하의 문의에 답변이 등록되었습니다.\n\n" +
                        "문의 제목: %s\n" +
                        "답변 내용: %s\n\n" +
                        "자세한 내용은 아래 링크를 통해 확인하실 수 있습니다:\n%s\n\n" +
                        "감사합니다.\nLingEdge 고객지원팀",
                user.getUsername(), inquiry.getTitle(), response.getContent(), inquiryUrl);

        emailService.sendSimpleMessage(user.getEmail(), subject, message);
    }

    /**
     * 문의 통계 - 상태별 문의 수 집계
     */
    public Map<String, Long> getInquiryStatsByStatus() {
        List<Map<String, Object>> results = inquiryRepository.countByStatus();
        Map<String, Long> stats = new HashMap<>();

        // 모든 가능한 상태에 대해 0으로 초기화
        stats.put("PENDING", 0L);
        stats.put("IN_PROGRESS", 0L);
        stats.put("RESOLVED", 0L);
        stats.put("TOTAL", 0L);

        for (Map<String, Object> row : results) {
            String status = (String) row.get("status");
            Long count = ((Number) row.get("count")).longValue();

            stats.put(status, count);
            stats.put("TOTAL", stats.get("TOTAL") + count);
        }

        return stats;
    }

    /**
     * 문의 통계 - 특정 기간 동안의 상태별 문의 수 집계
     */
    public Map<String, Long> getInquiryStatsByStatusAndDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Map<String, Object>> results = inquiryRepository.countByStatusAndDateRange(startDateTime, endDateTime);
        Map<String, Long> stats = new HashMap<>();

        // 모든 가능한 상태에 대해 0으로 초기화
        stats.put("PENDING", 0L);
        stats.put("IN_PROGRESS", 0L);
        stats.put("RESOLVED", 0L);
        stats.put("TOTAL", 0L);

        for (Map<String, Object> row : results) {
            String status = (String) row.get("status");
            Long count = ((Number) row.get("count")).longValue();

            stats.put(status, count);
            stats.put("TOTAL", stats.get("TOTAL") + count);
        }

        // 총 문의수도 따로 조회해서 확인
        Long totalCount = inquiryRepository.countByDateRange(startDateTime, endDateTime);
        stats.put("TOTAL", totalCount);

        return stats;
    }

    /**
     * 문의 통계 - 일별 문의 수 집계
     */
    public Map<LocalDate, Long> getDailyInquiryStats(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Map<String, Object>> results = inquiryRepository.countDailyInquiries(startDateTime, endDateTime);
        Map<LocalDate, Long> stats = new HashMap<>();

        for (Map<String, Object> row : results) {
            LocalDate date = ((java.sql.Date) row.get("date")).toLocalDate();
            Long count = ((Number) row.get("count")).longValue();

            stats.put(date, count);
        }

        return stats;
    }
}