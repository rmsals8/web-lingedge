package com.example.openaitest.inquiry.repository;

import com.example.openaitest.inquiry.model.Log;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 일반 로그 저장
     */
    @Transactional
    public Log saveLog(User user, String actionType, String description, String ipAddress, String userAgent) {
        Log log = Log.builder()
                .user(user)
                .actionType(actionType)
                .description(description)
                .ipAddress(ipAddress)
                .userAgent(userAgent != null ? userAgent : "Unknown")
                .status("COMPLETED")
                .createdAt(LocalDateTime.now())
                .build();

        return logRepository.save(log);
    }

    /**
     * 로그인 성공 로그 저장
     */
    @Transactional
    public Log saveLoginSuccessLog(User user, String ipAddress, String userAgent) {
        return saveLog(user, "LOGIN_SUCCESS", "로그인 성공: " + user.getUsername(),
                ipAddress, userAgent);
    }

    /**
     * 로그인 실패 로그 저장
     */
    @Transactional
    public Log saveLoginFailLog(User user, String username, String reason, String ipAddress, String userAgent) {
        return saveLog(user, "LOGIN_FAIL",
                "로그인 실패: " + username + ", 사유: " + reason,
                ipAddress, userAgent);
    }

    /**
     * 로그아웃 로그 저장
     */
    @Transactional
    public Log saveLogoutLog(User user, String ipAddress, String userAgent) {
        return saveLog(user, "LOGOUT", "로그아웃: " + user.getUsername(),
                ipAddress, userAgent);
    }

    /**
     * 토큰 갱신 로그 저장
     */
    @Transactional
    public Log saveTokenRefreshLog(User user, String ipAddress, String userAgent) {
        return saveLog(user, "TOKEN_REFRESH", "토큰 갱신: " + user.getUsername(),
                ipAddress, userAgent);
    }

    /**
     * 계정 생성 로그 저장
     */
    @Transactional
    public Log saveAccountCreationLog(User user, String ipAddress, String userAgent) {
        return saveLog(user, "ACCOUNT_CREATION", "계정 생성: " + user.getUsername(),
                ipAddress, userAgent);
    }

    /**
     * 사용자 ID 기준 로그 조회
     */
    public List<Log> findByUserId(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(logRepository::findByUser)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    /**
     * 액션 타입별 로그 조회
     */
    public List<Log> findByActionType(String actionType) {
        return logRepository.findByActionType(actionType);
    }

    /**
     * 기간별 로그 조회
     */
    public List<Log> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return logRepository.findByCreatedAtBetween(start, end);
    }

    /**
     * 사용자 접속 로그 저장 (국가 정보 포함)
     */
    @Transactional
    public Log saveAccessLog(User user, String ipAddress, String userAgent, String countryCode, String countryName) {
        Log log = Log.builder()
                .user(user)
                .actionType("PAGE_VIEW")
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .countryCode(countryCode)
                .countryName(countryName)
                .status("COMPLETED")
                .createdAt(LocalDateTime.now())
                .build();

        return logRepository.save(log);
    }

    /**
     * 일별 접속자 통계 조회
     */
    public Map<LocalDate, Long> getDailyVisitorStats(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = logRepository.countDailyVisitors(startDate, endDate);
        Map<LocalDate, Long> stats = new LinkedHashMap<>();

        for (Object[] result : results) {
            LocalDate date = (LocalDate) result[0];
            Long count = (Long) result[1];
            stats.put(date, count);
        }

        return stats;
    }

    /**
     * 국가별 접속자 통계 조회
     */
    public Map<String, Long> getCountryVisitorStats(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = logRepository.countVisitorsByCountry(startDate, endDate);
        Map<String, Long> stats = new LinkedHashMap<>();

        for (Object[] result : results) {
            String country = (String) result[0];
            Long count = (Long) result[1];
            stats.put(country != null ? country : "Unknown", count);
        }

        return stats;
    }
}