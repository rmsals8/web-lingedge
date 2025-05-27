package com.example.openaitest.auth.controller;

import com.example.openaitest.auth.dto.request.LoginRequest;
import com.example.openaitest.auth.dto.request.TokenRefreshRequest;
import com.example.openaitest.auth.dto.response.JwtResponse;
import com.example.openaitest.auth.dto.response.TokenRefreshResponse;
import com.example.openaitest.auth.model.RefreshToken;
import com.example.openaitest.auth.service.RefreshTokenService;
import com.example.openaitest.common.security.JwtUtils;
import com.example.openaitest.common.security.UserDetailsImpl;
import com.example.openaitest.inquiry.repository.LogService;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;
import com.example.openaitest.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Value("${JWT_REFRESH_EXPIRATION_MS:1209600000}")
    private int refreshTokenDurationMs;

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        // UserDetailsImpl에서 사용자 정보 가져오기
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 응답에 이메일 포함
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getIsPremium()));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) {
        logger.info("로그아웃 요청");

        try {
            // 현재 인증된 사용자 정보 확인
            String username = "unknown";

            if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
                final UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                username = userDetails.getUsername();
                final Long userId = userDetails.getId(); // final로 선언

                // 1. 데이터베이스에서 리프레시 토큰 삭제
                try {
                    refreshTokenService.deleteByUserId(userId);
                    logger.info("데이터베이스에서 사용자 ID {}의 리프레시 토큰 삭제 성공", userId);
                } catch (Exception e) {
                    logger.error("데이터베이스에서 리프레시 토큰 삭제 실패: {}", e.getMessage());
                }
            }

            // 2. 리프레시 토큰 쿠키 만료
            try {
                Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, null);
                cookie.setMaxAge(0);
                cookie.setPath("/");
                cookie.setHttpOnly(true);

                if (request.isSecure()) {
                    cookie.setSecure(true);
                }

                response.addCookie(cookie);
                logger.info("리프레시 토큰 쿠키 만료 처리 완료");
            } catch (Exception e) {
                logger.error("리프레시 토큰 쿠키 만료 처리 실패: {}", e.getMessage());
            }

            // 3. Spring Security 로그아웃 처리
            try {
                new SecurityContextLogoutHandler().logout(request, response,
                        SecurityContextHolder.getContext().getAuthentication());
                logger.info("Spring Security 로그아웃 처리 완료");
            } catch (Exception e) {
                logger.error("Spring Security 로그아웃 처리 실패: {}", e.getMessage());
            }

            logger.info("로그아웃 성공: 사용자명={}", username);

            // 상태 코드 200 반환
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("로그아웃 처리 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        // 쿠키에서 리프레시 토큰 추출
        String refreshToken = extractRefreshTokenFromCookies(request);

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: 리프레시 토큰이 없습니다.");
        }

        try {
            // 리프레시 토큰 검증 및 새 액세스 토큰 발급
            return refreshTokenService.findByToken(refreshToken)
                    .map(token -> {
                        if (!refreshTokenService.verifyExpiration(token)) {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body("Error: 리프레시 토큰이 만료되었습니다.");
                        }

                        String username = jwtUtils.getUserNameFromJwtToken(token.getRefreshToken());
                        String newAccessToken = jwtUtils.generateTokenFromUsername(
                                username, Duration.ofMillis(jwtUtils.getJwtExpirationMs()));

                        return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken));
                    })
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Error: 리프레시 토큰을 찾을 수 없습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    private String extractRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}