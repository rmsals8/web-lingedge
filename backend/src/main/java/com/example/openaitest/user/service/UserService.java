package com.example.openaitest.user.service;

import com.example.openaitest.user.dto.request.RegisterRequestDto;
import com.example.openaitest.user.model.User;

import java.time.LocalDate;
import java.util.List;

public interface UserService {
    User registerUser(RegisterRequestDto registerRequest);

    User findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> getAllUsers();

    void resetDailyUsageCount(User user);

    boolean canUseService(User user);

    void incrementUsageCount(User user);

    void incrementUsageCountByUsername(String username);

    User getCurrentUser();

    User updateSubscriptionStatus(User user, String status, LocalDate endDate);

    void resetHourlyUsageCount(User user);

    void incrementHourlyUsageCount(User user);

    void incrementDailyUsageCount(User user);

    String findUsername(String email);

    void resetPasswordByEmail(String email);

    void changePassword(String username, String newPassword);

    boolean verifyPassword(User user, String password);

    User findByEmail(String email);

    // 이메일 인증 관련 메소드 추가
    boolean verifyEmail(String email, String code);

    void resendVerificationEmail(String email);

    void sendVerificationEmail(User user);

    String generateVerificationCode();

    String generateRandomPassword();

    void changePasswordByEmail(String email, String newPassword);

    void deleteAccount(User user);

    void initializeUserData(User user);
}