package com.example.openaitest.auth.service;

import com.example.openaitest.user.model.Password;
import com.example.openaitest.user.model.Subscription;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserSettings;
import com.example.openaitest.user.model.UserUsage;
import com.example.openaitest.user.repository.PasswordRepository;
import com.example.openaitest.user.repository.UserRepository;
import com.example.openaitest.auth.model.SocialLogin;
import com.example.openaitest.auth.repository.SocialLoginRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;

@Service
public class GoogleAuthService {

    @Value("${GOOGLE_CLIENT_ID}")
    private String clientId;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private SocialLoginRepository socialLoginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User verifyGoogleToken(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;

        @SuppressWarnings("unchecked")
        Map<String, Object> userAttributes = restTemplate.getForObject(userInfoEndpoint, Map.class);

        if (userAttributes != null && userAttributes.get("email") != null) {
            String email = (String) userAttributes.get("email");
            String name = (String) userAttributes.get("name");
            String googleId = (String) userAttributes.get("sub"); // Google's user ID

            // 기존 사용자 이메일로 검색
            Optional<User> existingUserByEmail = userRepository.findByEmail(email);
            if (existingUserByEmail.isPresent()) {
                User user = existingUserByEmail.get();

                // Google 로그인 정보가 없으면 추가
                Optional<SocialLogin> existingSocialLogin = socialLoginRepository.findByUserAndProvider(user, "google");
                if (existingSocialLogin.isEmpty()) {
                    SocialLogin socialLogin = new SocialLogin();
                    socialLogin.setUser(user);
                    socialLogin.setProvider("google");
                    socialLogin.setProviderId(googleId);
                    socialLogin.setAccessToken(accessToken);
                    socialLogin.setTokenExpiresAt(LocalDateTime.now().plusHours(1));
                    socialLoginRepository.save(socialLogin);
                } else {
                    // 기존 소셜 로그인 정보 업데이트
                    SocialLogin socialLogin = existingSocialLogin.get();
                    socialLogin.setAccessToken(accessToken);
                    socialLogin.setTokenExpiresAt(LocalDateTime.now().plusHours(1));
                    socialLoginRepository.save(socialLogin);
                }

                return user;
            } else {
                // 기존 소셜 로그인 ID로 검색
                Optional<SocialLogin> existingSocialLogin = socialLoginRepository.findByProviderAndProviderId("google",
                        googleId);
                if (existingSocialLogin.isPresent()) {
                    return existingSocialLogin.get().getUser();
                } else {
                    // 새 사용자 생성
                    User newUser = new User();
                    newUser.setUsername(name);
                    newUser.setEmail(email);
                    newUser.setLoginType(1); // 소셜 로그인
                    newUser.setRoles(new HashSet<>(Collections.singletonList("USER")));

                    User savedUser = userRepository.save(newUser);

                    // 소셜 로그인 정보 저장
                    SocialLogin socialLogin = new SocialLogin();
                    socialLogin.setUser(savedUser);
                    socialLogin.setProvider("google");
                    socialLogin.setProviderId(googleId);
                    socialLogin.setAccessToken(accessToken);
                    socialLogin.setTokenExpiresAt(LocalDateTime.now().plusHours(1));
                    socialLoginRepository.save(socialLogin);

                    // 사용량 정보 초기화
                    UserUsage userUsage = new UserUsage();
                    userUsage.setUser(savedUser);
                    userUsage.setDailyUsageCount(0);
                    userUsage.setLastUsageReset(LocalDate.now());
                    savedUser.setUserUsage(userUsage);

                    // 구독 정보 초기화
                    Subscription subscription = new Subscription();
                    subscription.setUser(savedUser);
                    subscription.setIsPremium(false);
                    savedUser.setSubscription(subscription);

                    // 사용자 설정 초기화
                    UserSettings userSettings = new UserSettings();
                    userSettings.setUser(savedUser);
                    userSettings.setEmailNotifications(false);
                    savedUser.setUserSettings(userSettings);

                    userRepository.save(savedUser);

                    return savedUser;
                }
            }
        } else {
            throw new IllegalArgumentException("Invalid access token or unable to fetch user info.");
        }
    }

    /**
     * 구글 토큰에서 이메일 정보만 추출하는 메서드
     */
    public String getEmailFromGoogleToken(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;

        @SuppressWarnings("unchecked")
        Map<String, Object> userAttributes = restTemplate.getForObject(userInfoEndpoint, Map.class);

        if (userAttributes != null && userAttributes.get("email") != null) {
            return (String) userAttributes.get("email");
        } else {
            throw new IllegalArgumentException("Invalid access token or unable to fetch email info.");
        }
    }

    /**
     * 구글 토큰에서 사용자 정보를 확인하는 메서드 (회원가입 전 확인용)
     */
    public Map<String, Object> checkGoogleToken(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;

        @SuppressWarnings("unchecked")
        Map<String, Object> userAttributes = restTemplate.getForObject(userInfoEndpoint, Map.class);

        Map<String, Object> result = new HashMap<>();

        if (userAttributes != null) {
            // 기본 정보 추출 (null 체크 수행)
            String email = userAttributes.get("email") != null ? (String) userAttributes.get("email") : null;
            String name = userAttributes.get("name") != null ? (String) userAttributes.get("name") : null;
            String googleId = userAttributes.get("sub") != null ? (String) userAttributes.get("sub") : null;

            // null이 아닌 값만 결과에 추가
            if (email != null)
                result.put("email", email);
            if (name != null)
                result.put("name", name);
            if (googleId != null)
                result.put("googleId", googleId);

            return result;
        } else {
            throw new IllegalArgumentException("Invalid access token or unable to fetch user info.");
        }
    }
}