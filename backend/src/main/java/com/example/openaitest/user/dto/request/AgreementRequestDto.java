package com.example.openaitest.user.dto.request;

import lombok.Data;

@Data
public class AgreementRequestDto {
    private Boolean termsOfUse;
    private Boolean privacyPolicy;
    private Boolean marketingAgree;
}