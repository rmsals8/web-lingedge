package com.example.openaitest.user.service;

import com.example.openaitest.auth.service.EmailService;
import com.example.openaitest.inquiry.repository.LogService;

import com.example.openaitest.user.dto.request.RegisterRequestDto;
import com.example.openaitest.user.model.Password;
import com.example.openaitest.user.model.Subscription;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserSettings;
import com.example.openaitest.user.model.UserUsage;
import com.example.openaitest.user.repository.PasswordRepository;
import com.example.openaitest.user.repository.SubscriptionRepository;
import com.example.openaitest.user.repository.UserRepository;
import com.example.openaitest.user.repository.UserSettingsRepository;
import com.example.openaitest.user.repository.UserUsageRepository;

import jakarta.transaction.Transactional;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserUsageRepository userUsageRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LogService logService;

    @Override
    @Transactional
    public void changePasswordByEmail(String email, String newPassword) {
        // 이메일로 사용자를 찾아서
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // 비밀번호 업데이트
        Optional<Password> passwordOpt = passwordRepository.findTopByUserOrderByCreatedAtDesc(user);
        Password password;
        if (passwordOpt.isPresent()) {
            password = passwordOpt.get();
            password.setPassword(passwordEncoder.encode(newPassword));
        } else {
            password = new Password();
            password.setUser(user);
            password.setPassword(passwordEncoder.encode(newPassword));
        }
        passwordRepository.save(password);

        // 강제 비밀번호 변경 플래그 해제
        user.setForcePasswordChange(false);
        userRepository.save(user);
    }

    // 6자리 숫자 인증번호 생성 메소드 - 반드시 이 메소드 사용
    public String generateVerificationCode() {
        // 6자리 순수한 숫자 인증코드 생성 (100000-999999)
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public User findByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return userOptional.get();
    }

    // 회원가입 시 이메일 인증 토큰 생성 및 발송 (registerUser 메소드 수정)
    @Override
    @Transactional
    public User registerUser(RegisterRequestDto registerRequest) {
        // 영문자, 숫자, 한글을 허용하는 정규표현식 패턴
        Pattern pattern = Pattern.compile("^[a-zA-Z0-9가-힣]+$");

        // 사용자 이름이 영문자, 숫자, 한글로만 구성되어 있는지 확인
        if (!pattern.matcher(registerRequest.getUsername()).matches()) {
            throw new IllegalArgumentException("사용자 이름은 영문자, 숫자, 한글만 포함할 수 있습니다.");
        }

        // 사용자 객체 생성 및 기본 설정
        User newUser = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .loginType(0) // 일반 로그인
                .roles(new HashSet<>(Collections.singletonList("USER")))
                .forcePasswordChange(false)
                .emailVerified(false) // 이메일 인증 전 false로 설정
                .emailNotifications(false) // 이메일 알림 기본값 설정
                .build();

        // UUID 토큰 생성 (내부용)
        String token = UUID.randomUUID().toString();
        newUser.setVerificationToken(token);

        // 인증 코드는 이메일 요청 시 생성
        newUser.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24)); // 24시간으로 설정

        User savedUser = userRepository.save(newUser);

        // 비밀번호 저장
        Password password = new Password();
        password.setUser(savedUser);
        password.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        passwordRepository.save(password);

        // 사용량 정보 초기화
        UserUsage userUsage = new UserUsage();
        userUsage.setUser(savedUser);
        userUsage.setDailyUsageCount(0);
        userUsage.setLastUsageReset(LocalDate.now());
        userUsageRepository.save(userUsage);

        // 구독 정보 초기화
        Subscription subscription = new Subscription();
        subscription.setUser(savedUser);
        subscription.setIsPremium(false);
        subscriptionRepository.save(subscription);

        // 사용자 설정 초기화
        UserSettings userSettings = new UserSettings();
        userSettings.setUser(savedUser);
        userSettings.setEmailNotifications(false);
        userSettingsRepository.save(userSettings);

        // 여기서 이메일 발송하지 않음

        return savedUser;
    }

    // 이메일 인증 확인 메소드
    @Override
    @Transactional
    public boolean verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자를 찾을 수 없습니다."));

        // 이미 인증된 경우
        if (user.getEmailVerified()) {
            return true;
        }

        // 인증 만료 확인
        if (user.getVerificationTokenExpiry() == null ||
                user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("인증번호가 만료되었습니다. 인증번호를 재발급 받으세요.");
        }

        // 인증번호 확인
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new RuntimeException("유효하지 않은 인증번호입니다.");
        }

        // 인증 성공 처리
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationCode(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        return true;
    }

    // 인증 토큰 재발급 메소드
    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자를 찾을 수 없습니다."));

        if (user.getEmailVerified()) {
            throw new RuntimeException("이미 인증된 이메일입니다.");
        }

        // 새 인증번호 생성
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // 인증 이메일 재발송
        sendVerificationEmail(user);
    }

    @Override
    public User findByUsername(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return userOptional.get();
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public boolean canUseService(User user) {
        UserUsage userUsage = getOrCreateUserUsage(user);

        LocalDate today = LocalDate.now();
        if (!today.equals(userUsage.getLastUsageReset())) {
            resetDailyUsageCount(user);
            return true;
        }

        Subscription subscription = getOrCreateSubscription(user);
        if (subscription.getIsPremium()) {
            // Premium users: 100 requests per day
            return userUsage.getDailyUsageCount() < 100;
        } else {
            // Free users: 3 requests per day
            return userUsage.getDailyUsageCount() < 3;
        }
    }

    @Override
    @Transactional
    public void incrementDailyUsageCount(User user) {
        UserUsage userUsage = getOrCreateUserUsage(user);
        userUsage.setDailyUsageCount(userUsage.getDailyUsageCount() + 1);
        userUsageRepository.save(userUsage);
    }

    @Override
    @Transactional
    public void incrementUsageCount(User user) {
        UserUsage userUsage = getOrCreateUserUsage(user);
        Subscription subscription = getOrCreateSubscription(user);

        if (userUsage.getDailyUsageCount() < 3 || subscription.getIsPremium()) {
            userUsage.setDailyUsageCount(userUsage.getDailyUsageCount() + 1);
            userUsageRepository.save(userUsage);
        }
    }

    @Override
    @Transactional
    public void incrementUsageCountByUsername(String username) {
        User user = findByUsername(username);
        incrementUsageCount(user);
    }

    @Override
    @Transactional
    public void resetDailyUsageCount(User user) {
        UserUsage userUsage = getOrCreateUserUsage(user);
        userUsage.setDailyUsageCount(0);
        userUsage.setLastUsageReset(LocalDate.now());
        userUsageRepository.save(userUsage);
    }

    @Override
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return findByUsername(username);
    }

    @Override
    @Transactional
    public User updateSubscriptionStatus(User user, String status, LocalDate endDate) {
        Subscription subscription = getOrCreateSubscription(user);

        subscription.setSubscriptionStatus(status);
        subscription.setSubscriptionEndDate(endDate);
        subscription.setIsPremium("active".equals(status)); // active인 경우에만 프리미엄으로 설정
        subscriptionRepository.save(subscription);

        return user;
    }

    @Override
    @Transactional
    public void resetHourlyUsageCount(User user) {
        UserUsage userUsage = getOrCreateUserUsage(user);

        userUsage.setHourlyUsageCount(0);
        userUsage.setLastHourlyReset(LocalDateTime.now());
        userUsageRepository.save(userUsage);
    }

    @Override
    @Transactional
    public void incrementHourlyUsageCount(User user) {
        UserUsage userUsage = getOrCreateUserUsage(user);

        userUsage.setHourlyUsageCount(userUsage.getHourlyUsageCount() + 1);
        userUsageRepository.save(userUsage);
    }

    @Override
    public String findUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email"));
        return user.getUsername();
    }

    @Override
    @Transactional
    public void resetPasswordByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email"));

        String tempPassword = generateRandomPassword();

        // 비밀번호 업데이트
        Optional<Password> passwordOpt = passwordRepository.findTopByUserOrderByCreatedAtDesc(user);
        Password password;
        if (passwordOpt.isPresent()) {
            password = passwordOpt.get();
            password.setPassword(passwordEncoder.encode(tempPassword));
        } else {
            password = new Password();
            password.setUser(user);
            password.setPassword(passwordEncoder.encode(tempPassword));
        }
        passwordRepository.save(password);

        // 비밀번호 변경 강제 설정
        user.setForcePasswordChange(true);
        userRepository.save(user);

        emailService.sendSimpleMessage(email, "Password Reset",
                "Your temporary password is: " + tempPassword +
                        "\nPlease log in and change your password immediately.");
    }

    @Override
    @Transactional
    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 비밀번호 업데이트
        Optional<Password> passwordOpt = passwordRepository.findTopByUserOrderByCreatedAtDesc(user);
        Password password;
        if (passwordOpt.isPresent()) {
            password = passwordOpt.get();
            password.setPassword(passwordEncoder.encode(newPassword));
        } else {
            password = new Password();
            password.setUser(user);
            password.setPassword(passwordEncoder.encode(newPassword));
        }
        passwordRepository.save(password);

        user.setForcePasswordChange(false);
        userRepository.save(user);
    }

    @Override
    public boolean verifyPassword(User user, String password) {
        // 비밀번호가 null이면 false 반환
        if (password == null || password.isEmpty()) {
            return false;
        }

        Optional<Password> passwordOpt = passwordRepository.findTopByUserOrderByCreatedAtDesc(user);
        if (passwordOpt.isPresent()) {
            return passwordEncoder.matches(password, passwordOpt.get().getPassword());
        }
        return false;
    }

    private UserUsage getOrCreateUserUsage(User user) {
        if (user.getUserUsage() == null) {
            UserUsage userUsage = new UserUsage();
            userUsage.setUser(user);
            userUsage.setDailyUsageCount(0);
            userUsage.setHourlyUsageCount(0);
            userUsage.setLastUsageReset(LocalDate.now());
            return userUsageRepository.save(userUsage);
        }
        return user.getUserUsage();
    }

    private Subscription getOrCreateSubscription(User user) {
        if (user.getSubscription() == null) {
            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setIsPremium(false);
            return subscriptionRepository.save(subscription);
        }
        return user.getSubscription();
    }

    public String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        // 8자리 비밀번호 생성
        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }

        return sb.toString();
    }

    @Override
    public void sendVerificationEmail(User user) {
        String subject = "회원가입 인증번호를 확인해주세요";

        // verificationCode를 사용 (이것은 6자리 숫자여야 함)
        String text = "안녕하세요 " + user.getUsername() + "님,\n\n"
                + "회원가입을 완료하려면 아래 인증번호를 입력해주세요.\n\n"
                + "인증번호: " + user.getVerificationCode() + "\n\n"
                + "이 인증번호는 1시간 동안 유효합니다.\n\n"
                + "감사합니다.\n"
                + "LinguaEdge 드림";

        // 이메일 서비스에서 발신자 이름 설정
        emailService.sendSimpleMessage(user.getEmail(), "LinguaEdge <noreply@lingualeap.com>", subject, text);
    }

    @Override
    @Transactional
    public void deleteAccount(User user) {
        try {
            // 1. 구독이 있는 경우 처리 (Stripe 관련 코드 제거)
            if (user.getSubscription() != null && user.getSubscription().getIsPremium()) {
                // 구독 정보 업데이트 - 상태를 취소로 변경
                user.getSubscription().setIsPremium(false);
                user.getSubscription().setSubscriptionStatus("canceled");

                // 구독 저장
                subscriptionRepository.save(user.getSubscription());
            }

            // 2. 로그 남기기 (기존 코드 유지)
            logService.saveLog(user, "ACCOUNT_DELETION",
                    "계정 삭제: " + user.getUsername(), "SYSTEM", "SYSTEM");

            // 3. 이메일 알림 발송 (기존 코드 유지)
            try {
                emailService.sendSimpleMessage(
                        user.getEmail(),
                        "계정 삭제 완료",
                        "안녕하세요 " + user.getUsername() + "님,\n\n" +
                                "요청하신 대로 계정이 성공적으로 삭제되었습니다.\n" +
                                "그동안 LinguaEdge 서비스를 이용해 주셔서 감사합니다.\n\n" +
                                "다시 돌아오실 때를 기다리겠습니다.\n\n" +
                                "감사합니다,\n" +
                                "LinguaEdge 팀");
            } catch (Exception e) {
                // 이메일 발송 실패해도 계정 삭제는 진행
                System.err.println("탈퇴 알림 이메일 발송 실패: " + e.getMessage());
            }

            // 4. 사용자 데이터 삭제 (기존 코드 유지)
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException("계정 삭제 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 새 사용자의 관련 데이터를 초기화하는 메서드
     */
    @Transactional
    public void initializeUserData(User user) {
        // 사용량 정보 초기화
        UserUsage userUsage = new UserUsage();
        userUsage.setUser(user);
        userUsage.setDailyUsageCount(0);
        userUsage.setLastUsageReset(LocalDate.now());
        userUsageRepository.save(userUsage);

        // 구독 정보 초기화
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setIsPremium(false);
        subscriptionRepository.save(subscription);

        // 사용자 설정 초기화
        UserSettings userSettings = new UserSettings();
        userSettings.setUser(user);
        userSettings.setEmailNotifications(false);
        userSettingsRepository.save(userSettings);
    }
}