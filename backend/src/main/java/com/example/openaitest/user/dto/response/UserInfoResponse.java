package com.example.openaitest.user.dto.response;

import java.time.LocalDate;

public class UserInfoResponse {
    private Long id;
    private String username;
    private String email;
    private Boolean isPremium;
    private Integer dailyUsageCount;
    private String subscriptionStatus;
    private LocalDate subscriptionEndDate;
    private Integer loginType; // 추가된 필드

    public UserInfoResponse(Long id, String username, String email, Boolean isPremium,
            Integer dailyUsageCount, String subscriptionStatus,
            LocalDate subscriptionEndDate, Integer loginType) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.isPremium = isPremium;
        this.dailyUsageCount = dailyUsageCount;
        this.subscriptionStatus = subscriptionStatus;
        this.subscriptionEndDate = subscriptionEndDate;
        this.loginType = loginType; // 생성자에 추가
    }

    // 기존 생성자도 유지 (하위 호환성 위해)
    public UserInfoResponse(Long id, String username, String email, Boolean isPremium,
            Integer dailyUsageCount, String subscriptionStatus,
            LocalDate subscriptionEndDate) {
        this(id, username, email, isPremium, dailyUsageCount, subscriptionStatus, subscriptionEndDate, null);
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public Integer getDailyUsageCount() {
        return dailyUsageCount;
    }

    public String getSubscriptionStatus() {
        return subscriptionStatus;
    }

    public LocalDate getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public Integer getLoginType() {
        return loginType;
    } // 추가된 getter

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    public void setDailyUsageCount(Integer dailyUsageCount) {
        this.dailyUsageCount = dailyUsageCount;
    }

    public void setSubscriptionStatus(String subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }

    public void setSubscriptionEndDate(LocalDate subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public void setLoginType(Integer loginType) {
        this.loginType = loginType;
    } // 추가된 setter
}