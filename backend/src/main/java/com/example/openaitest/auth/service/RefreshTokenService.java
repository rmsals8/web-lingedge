package com.example.openaitest.auth.service;

import com.example.openaitest.auth.model.RefreshToken;
import com.example.openaitest.auth.repository.RefreshTokenRepository;
import com.example.openaitest.common.security.JwtUtils;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * 토큰으로 리프레시 토큰 조회
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByRefreshToken(token);
    }

    /**
     * 사용자로 리프레시 토큰 조회
     */
    public Optional<RefreshToken> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return refreshTokenRepository.findByUser(user).stream().findFirst();
    }

    /**
     * 새 리프레시 토큰 생성
     */
    @Transactional
    public RefreshToken createRefreshToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .refreshToken(token)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * 리프레시 토큰 업데이트 (있으면 수정, 없으면 생성)
     */
    @Transactional
    public RefreshToken updateRefreshToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user).stream().findFirst();

        if (existingToken.isPresent()) {
            RefreshToken refreshToken = existingToken.get();
            refreshToken.setRefreshToken(token);
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
            return refreshTokenRepository.save(refreshToken);
        } else {
            return createRefreshToken(userId, token);
        }
    }

    /**
     * 사용자 ID로 리프레시 토큰 삭제
     */
    @Transactional
    public void deleteByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        refreshTokenRepository.deleteByUser(user);
    }

    /**
     * 리프레시 토큰 만료 여부 확인
     */
    public boolean verifyExpiration(RefreshToken token) {
        return jwtUtils.validateJwtToken(token.getRefreshToken());
    }
}