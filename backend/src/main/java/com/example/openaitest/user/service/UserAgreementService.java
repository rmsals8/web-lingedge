package com.example.openaitest.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.openaitest.user.dto.request.AgreementRequestDto;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserAgreement;
import com.example.openaitest.user.repository.UserAgreementRepository;

import jakarta.transaction.Transactional;

@Service
public class UserAgreementService {

    @Autowired
    private UserAgreementRepository userAgreementRepository;

    @Transactional
    public UserAgreement saveUserAgreement(User user, AgreementRequestDto agreementRequest) {
        UserAgreement agreement = UserAgreement.builder()
                .user(user)
                .termsOfUse(agreementRequest.getTermsOfUse())
                .privacyPolicy(agreementRequest.getPrivacyPolicy())
                .marketingAgree(agreementRequest.getMarketingAgree())
                .build();

        return userAgreementRepository.save(agreement);
    }

    public UserAgreement getUserAgreements(User user) {
        return userAgreementRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("사용자의 약관 동의 정보를 찾을 수 없습니다."));
    }
}