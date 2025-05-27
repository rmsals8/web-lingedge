package com.example.openaitest.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterWithAgreementDto {
    private RegisterRequestDto registerRequest;
    private AgreementRequestDto agreement;
}