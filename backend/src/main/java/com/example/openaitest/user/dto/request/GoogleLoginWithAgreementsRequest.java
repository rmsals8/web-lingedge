package com.example.openaitest.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 구글 로그인 시 약관 동의 정보를 함께 전달하기 위한 DTO 클래스
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleLoginWithAgreementsRequest {
    private String token;
    private AgreementRequestDto agreement;
    private String googleId; // 추가
    private String name; // 추가
}