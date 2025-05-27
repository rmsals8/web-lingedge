package com.example.openaitest.user.controller;

import com.example.openaitest.auth.dto.request.LoginRequest;
import com.example.openaitest.auth.dto.response.JwtResponse;
import com.example.openaitest.auth.model.SocialLogin;
import com.example.openaitest.auth.repository.SocialLoginRepository;
import com.example.openaitest.auth.service.EmailService;
import com.example.openaitest.auth.service.GoogleAuthService;
import com.example.openaitest.common.security.JwtUtils;
import com.example.openaitest.common.security.UserDetailsImpl;
import com.example.openaitest.user.dto.request.GoogleLoginWithAgreementsRequest;
import com.example.openaitest.user.dto.request.RegisterRequestDto;
import com.example.openaitest.user.dto.request.RegisterWithAgreementDto;
import com.example.openaitest.user.dto.response.UserInfoResponse;
import com.example.openaitest.user.model.Subscription;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserSettings;
import com.example.openaitest.user.model.UserUsage;
import com.example.openaitest.user.repository.SubscriptionRepository;
import com.example.openaitest.user.repository.UserRepository;
import com.example.openaitest.user.repository.UserSettingsRepository;
import com.example.openaitest.user.repository.UserUsageRepository;
import com.example.openaitest.user.service.UserAgreementService;
import com.example.openaitest.user.service.UserService;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocialLoginRepository socialLoginRepository;

    @Autowired
    private UserAgreementService userAgreementService;

    @Autowired
    private UserUsageRepository userUsageRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @PostMapping("/register-with-agreements")
    public ResponseEntity<?> registerUserWithAgreements(
            @Valid @RequestBody RegisterWithAgreementDto request) {

        // 필수 약관 동의 확인
        if (!request.getAgreement().getTermsOfUse() || !request.getAgreement().getPrivacyPolicy()) {
            return ResponseEntity.badRequest().body("필수 약관에 동의해야 합니다.");
        }

        // 기존 회원가입 로직 실행
        User user = userService.registerUser(request.getRegisterRequest());

        // 약관 동의 정보 저장
        userAgreementService.saveUserAgreement(user, request.getAgreement());

        return ResponseEntity.ok(user);
    }

    @PostMapping("/google-login-with-agreements")
    public ResponseEntity<?> googleLoginWithAgreements(@RequestBody GoogleLoginWithAgreementsRequest request) {
        try {
            // 구글 사용자 정보 가져오기
            Map<String, Object> googleUserInfo = googleAuthService.checkGoogleToken(request.getToken());
            String email = (String) googleUserInfo.get("email");
            String name = request.getName() != null ? request.getName() : (String) googleUserInfo.get("name");
            String googleId = request.getGoogleId() != null ? request.getGoogleId()
                    : (String) googleUserInfo.get("googleId");

            // 이메일로 사용자 조회
            Optional<User> existingUserOpt = userRepository.findByEmail(email);

            User user;
            boolean isNewUser = false;

            if (existingUserOpt.isPresent()) {
                // 기존 사용자
                user = existingUserOpt.get();
            } else {
                // 소셜 로그인 사용자는 JPA 유효성 검사를 우회하여 직접 SQL 실행
                // 1. 사용자 이름 생성 (적절한 형식으로)
                String safeUsername = getSafeUsername(name, email);

                // 2. 직접 SQL로 사용자 생성
                KeyHolder keyHolder = new GeneratedKeyHolder();
                jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(
                            "INSERT INTO users (username, email, login_type, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                            new String[] { "id" });
                    ps.setString(1, safeUsername);
                    ps.setString(2, email);
                    ps.setInt(3, 1); // 소셜 로그인
                    ps.setBoolean(4, true); // 이메일 인증됨
                    Timestamp now = Timestamp.from(Instant.now());
                    ps.setTimestamp(5, now); // created_at
                    ps.setTimestamp(6, now); // updated_at
                    return ps;
                }, keyHolder);

                Long userId = keyHolder.getKey().longValue();

                // 3. 사용자 권한 추가
                jdbcTemplate.update(
                        "INSERT INTO user_roles (user_id, role) VALUES (?, ?)",
                        userId, "USER");

                // 4. 이제 JPA로 사용자 엔티티 로드
                user = userRepository.findById(userId).orElseThrow();
                isNewUser = true;

                // 5. 소셜 로그인 정보 추가
                SocialLogin socialLogin = new SocialLogin();
                socialLogin.setUser(user);
                socialLogin.setProvider("google");
                socialLogin.setProviderId(googleId);
                socialLogin.setAccessToken(request.getToken());
                socialLogin.setTokenExpiresAt(LocalDateTime.now().plusHours(1));
                socialLoginRepository.save(socialLogin);

                // 6. 기타 관련 데이터 생성 (UserUsage, Subscription, UserSettings)
                UserUsage userUsage = new UserUsage();
                userUsage.setUser(user);
                userUsage.setDailyUsageCount(0);
                userUsage.setLastUsageReset(LocalDate.now());
                userUsageRepository.save(userUsage);

                Subscription subscription = new Subscription();
                subscription.setUser(user);
                subscription.setIsPremium(false);
                subscriptionRepository.save(subscription);

                UserSettings userSettings = new UserSettings();
                userSettings.setUser(user);
                userSettings.setEmailNotifications(false);
                userSettingsRepository.save(userSettings);

                // 7. 약관 동의 정보 저장
                if (request.getAgreement() != null) {
                    userAgreementService.saveUserAgreement(user, request.getAgreement());
                }
            }

            // 토큰 생성 및 반환
            String jwt = jwtUtils.generateTokenFromUsername(user.getEmail(),
                    Duration.ofMillis(jwtUtils.getJwtExpirationMs()));

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    user.getUsername(),
                    user.getEmail(),
                    user.isPremium()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * 정규식 패턴에 맞는 안전한 사용자명 생성
     */
    private String getSafeUsername(String name, String email) {
        // 이름이 null인 경우 이메일에서 추출
        String baseUsername = (name != null) ? name : email.split("@")[0];

        // 정규식 패턴에 맞지 않는 문자 제거
        String safeUsername = baseUsername.replaceAll("[^a-zA-Z0-9가-힣]", "");

        // 길이 제한 (3-20자)
        if (safeUsername.length() < 3) {
            // 3자 미만인 경우, 임의의 문자 추가
            safeUsername += "User";
        } else if (safeUsername.length() > 20) {
            // 20자 초과인 경우, 잘라내기
            safeUsername = safeUsername.substring(0, 20);
        }

        // 중복 확인 및 처리
        String finalUsername = safeUsername;
        int counter = 1;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = safeUsername + counter;
            counter++;

            // 길이 체크 다시 수행
            if (finalUsername.length() > 20) {
                int trimLength = String.valueOf(counter).length();
                finalUsername = safeUsername.substring(0, 20 - trimLength) + counter;
            }
        }

        return finalUsername;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {

        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent() && existingUser.get().getEmailVerified()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        } else if (existingUser.isPresent()) {
            // 인증되지 않은 계정이 있는 경우 삭제하고 진행
            userRepository.delete(existingUser.get());
        }

        User registeredUser = userService.registerUser(registerRequest);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getIsPremium()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("로그인 실패: " + e.getMessage());
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest googleLoginRequest) {
        try {
            User user = googleAuthService.verifyGoogleToken(googleLoginRequest.getToken());
            if (user != null) {
                // 이메일을 주체(subject)로 사용하여 JWT 토큰 생성
                String jwt = jwtUtils.generateTokenFromUsername(user.getEmail(),
                        Duration.ofMillis(jwtUtils.getJwtExpirationMs()));

                return ResponseEntity.ok(new JwtResponse(
                        jwt,
                        user.getUsername(),
                        user.getEmail(),
                        user.getSubscription() != null ? user.getSubscription().getIsPremium() : false));
            } else {
                return ResponseEntity.badRequest().body("Invalid Google token");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing Google login: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body("User not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getEmail();

        User user = userService.findByEmail(email);

        UserInfoResponse userInfoResponse = new UserInfoResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getSubscription() != null ? user.getSubscription().getIsPremium() : false,
                user.getUserUsage() != null ? user.getUserUsage().getDailyUsageCount() : 0,
                user.getSubscription() != null ? user.getSubscription().getSubscriptionStatus() : null,
                user.getSubscription() != null ? user.getSubscription().getSubscriptionEndDate() : null,
                user.getLoginType() // 로그인 타입 추가
        );

        return ResponseEntity.ok(userInfoResponse);
    }

    @PostMapping("/incrementUsage")
    public ResponseEntity<?> incrementUsage(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body("User not authenticated");
        }

        User user = userService.findByUsername(authentication.getName());

        // 사용량 제한 확인
        if (user.getUserUsage() != null &&
                user.getUserUsage().getDailyUsageCount() >= 3 &&
                (user.getSubscription() == null || !user.getSubscription().getIsPremium())) {
            return ResponseEntity.badRequest().body("Daily usage limit exceeded");
        }

        userService.incrementUsageCount(user);
        return ResponseEntity.ok("Usage count incremented");
    }

    // 비밀번호 변경 엔드포인트 (사용자가 로그인 후 비밀번호를 변경할 때 사용)
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            // authentication.getName()은 이메일을 반환합니다
            String email = authentication.getName();
            String newPassword = request.get("newPassword");

            // 이메일로 직접 비밀번호 변경
            userService.changePasswordByEmail(email, newPassword);

            return ResponseEntity.ok("Password has been changed successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody Map<String, String> request, Authentication authentication) {
        String password = request.get("password");
        User user = userService.findByUsername(authentication.getName());
        if (userService.verifyPassword(user, password)) {
            return ResponseEntity.ok().build();
        } else {
            // 주석: 401 대신 400 Bad Request 반환
            return ResponseEntity.badRequest().body("Incorrect password");
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body("이메일과 인증번호를 모두 입력해주세요.");
            }

            // 이메일 인증 처리
            boolean isVerified = userService.verifyEmail(email, code);

            if (isVerified) {
                return ResponseEntity.ok("이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.");
            } else {
                return ResponseEntity.badRequest().body("이메일 인증에 실패했습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류: " + e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            userService.resendVerificationEmail(email);
            return ResponseEntity.ok("Verification code has been sent again to your email");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/verification-code")
    public ResponseEntity<?> getVerificationCode(@RequestParam String verificationToken) {
        try {
            Optional<User> userOpt = userRepository.findByVerificationToken(verificationToken);

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("유효하지 않은 인증 토큰입니다.");
            }

            User user = userOpt.get();

            if (user.getEmailVerified()) {
                return ResponseEntity.badRequest().body("이미 인증된 이메일입니다.");
            }

            // 토큰 만료 확인
            if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("인증 토큰이 만료되었습니다. 다시 회원가입해주세요.");
            }

            // 6자리 숫자 인증코드 생성
            String verificationCode = userService.generateVerificationCode();
            user.setVerificationCode(verificationCode);
            userRepository.save(user);

            // 인증 이메일 발송 (6자리 숫자 사용)
            userService.sendVerificationEmail(user);

            return ResponseEntity.ok("인증번호가 이메일(" + user.getEmail() + ")로 발송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류: " + e.getMessage());
        }
    }

    @PostMapping("/send-verification-for-credential")
    public ResponseEntity<?> sendVerificationForCredential(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            // 사용자 검증
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("해당 이메일로 등록된 사용자가 없습니다.");
            }

            User user = userOpt.get();

            // 인증 코드 생성
            String verificationCode = userService.generateVerificationCode();

            // 사용자 객체에 인증 코드와 만료 시간 저장
            user.setVerificationCode(verificationCode);
            user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(30)); // 30분 유효
            userRepository.save(user);

            // 인증 코드 이메일 발송
            String subject = "계정 정보 찾기 인증번호";
            String text = "안녕하세요 " + user.getUsername() + "님,\n\n"
                    + "계정 정보 찾기를 위한 인증번호입니다.\n\n"
                    + "인증번호: " + verificationCode + "\n\n"
                    + "이 인증번호는 30분 동안 유효합니다.\n\n"
                    + "감사합니다.\n"
                    + "LinguaEdge 드림";

            emailService.sendSimpleMessage(email, subject, text);

            return ResponseEntity.ok("인증번호가 이메일로 발송되었습니다. 30분 안에 입력해주세요.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류: " + e.getMessage());
        }
    }

    @PostMapping("/verify-for-username")
    public ResponseEntity<?> verifyForUsername(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body("이메일과 인증번호를 모두 입력해주세요.");
            }

            // 사용자 조회
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자를 찾을 수 없습니다."));

            // 인증 만료 확인
            if (user.getVerificationTokenExpiry() == null ||
                    user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("인증번호가 만료되었습니다. 인증번호를 재발급 받으세요.");
            }

            // 인증번호 확인
            if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
                return ResponseEntity.badRequest().body("유효하지 않은 인증번호입니다.");
            }

            // 인증 성공 시 사용자명 반환
            return ResponseEntity.ok(Map.of("username", user.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류: " + e.getMessage());
        }
    }

    @PostMapping("/verify-for-password-reset")
    public ResponseEntity<?> verifyForPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body("이메일과 인증번호를 모두 입력해주세요.");
            }

            // 사용자 조회 - 이메일로 찾기
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자를 찾을 수 없습니다."));

            // 인증 만료 확인
            if (user.getVerificationTokenExpiry() == null ||
                    user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("인증번호가 만료되었습니다. 인증번호를 재발급 받으세요.");
            }

            // 인증번호 확인
            if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
                return ResponseEntity.badRequest().body("유효하지 않은 인증번호입니다.");
            }

            // 인증 성공 시 임시 비밀번호 생성 및 설정
            String tempPassword = userService.generateRandomPassword();

            // 이메일로 사용자를 찾아 비밀번호 변경
            userService.changePasswordByEmail(email, tempPassword);

            // 비밀번호 변경 이메일 발송
            String subject = "임시 비밀번호 발급";
            String text = "안녕하세요 " + user.getUsername() + "님,\n\n"
                    + "임시 비밀번호가 발급되었습니다.\n\n"
                    + "임시 비밀번호: " + tempPassword + "\n\n"
                    + "로그인 후 비밀번호를 변경해주세요.\n\n"
                    + "감사합니다.\n"
                    + "LinguaEdge 드림";

            emailService.sendSimpleMessage(email, subject, text);

            return ResponseEntity.ok("임시 비밀번호가 이메일로 발송되었습니다. 로그인 후 비밀번호를 변경해주세요.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(Authentication authentication,
            @RequestBody Map<String, Object> request) {
        try {
            // 현재 로그인한 사용자 정보 가져오기
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            // 요청에서 소셜 로그인 플래그 확인
            Boolean isSocialLogin = (Boolean) request.get("isSocialLogin");

            // 소셜 로그인 사용자이거나 요청에 isSocialLogin=true가 있으면 비밀번호 검증 건너뛰기
            if ((user.getLoginType() != null && user.getLoginType() == 1) ||
                    (isSocialLogin != null && isSocialLogin)) {
                // 비밀번호 검증 없이 진행
            } else {
                // 일반 로그인 사용자는 비밀번호 검증
                String password = (String) request.get("password");

                if (password == null || password.isEmpty()) {
                    return ResponseEntity.badRequest().body("비밀번호를 입력해주세요.");
                }

                if (!userService.verifyPassword(user, password)) {
                    return ResponseEntity.badRequest().body("잘못된 비밀번호입니다.");
                }
            }

            // 회원 탈퇴 처리
            userService.deleteAccount(user);

            return ResponseEntity.ok("계정이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("계정 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/google-login-check")
    public ResponseEntity<?> googleLoginCheck(@RequestBody GoogleLoginRequest googleLoginRequest) {
        try {
            // 구글 사용자 정보 확인
            Map<String, Object> googleUserInfo = googleAuthService.checkGoogleToken(googleLoginRequest.getToken());
            String email = (String) googleUserInfo.get("email");
            String name = (String) googleUserInfo.get("name");
            String googleId = (String) googleUserInfo.get("googleId");

            // 이메일로 사용자 조회
            Optional<User> existingUserOpt = userRepository.findByEmail(email);
            boolean isRegistered = existingUserOpt.isPresent();

            // 소셜 로그인 정보도 확인 (이메일로 사용자가 없어도 소셜 로그인 정보가 있을 수 있음)
            if (!isRegistered && googleId != null) {
                Optional<SocialLogin> socialLoginOpt = socialLoginRepository.findByProviderAndProviderId("google",
                        googleId);
                isRegistered = socialLoginOpt.isPresent();
            }

            Map<String, Object> response = new HashMap<>();

            if (isRegistered) {
                // 이미 가입된 사용자인 경우 토큰 생성
                String jwt = jwtUtils.generateTokenFromUsername(email,
                        Duration.ofMillis(jwtUtils.getJwtExpirationMs()));

                response.put("isRegistered", true);
                response.put("accessToken", jwt);
            } else {
                // 가입되지 않은 사용자인 경우
                response.put("isRegistered", false);
                response.put("email", email);
                response.put("name", name != null ? name : email.split("@")[0]);
                response.put("googleId", googleId);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing Google login: " + e.getMessage());
        }
    }
}

class GoogleLoginRequest {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}