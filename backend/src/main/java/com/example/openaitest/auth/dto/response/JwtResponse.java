package com.example.openaitest.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private Boolean isPremium;

    public JwtResponse(String accessToken) {
        this.token = accessToken;
    }

    public JwtResponse(String accessToken, String username, String email, Boolean isPremium) {
        this.token = accessToken;
        this.username = username;
        this.email = email;
        this.isPremium = isPremium;
    }

    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }
}