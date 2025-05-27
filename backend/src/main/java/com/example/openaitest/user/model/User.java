package com.example.openaitest.user.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.context.annotation.Primary;

import com.example.openaitest.auth.model.RefreshToken;
import com.example.openaitest.auth.model.SocialLogin;
import com.example.openaitest.inquiry.model.Log;

@Primary
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private LocalDateTime verificationTokenExpiry;

    @Column(name = "email_notifications", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean emailNotifications = false;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "사용자명은 필수입니다")
    @Pattern(regexp = "^[a-zA-Z0-9가-힣]{3,20}$", message = "사용자명은 3-20자의 영문자, 숫자, 한글만 포함할 수 있습니다")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "login_type", nullable = false)
    private Integer loginType = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiry")
    private LocalDateTime resetPasswordTokenExpiry;

    @Column(name = "force_password_change")
    private Boolean forcePasswordChange = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // CascadeType.ALL 설정 추가 또는 확인
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserUsage userUsage;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Subscription subscription;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserSettings userSettings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Password> passwords = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialLogin> socialLogins = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    // 로그는 사용자 삭제 시 함께 삭제되도록 설정
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Log> logs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // getter와 setter 메서드들
    public Boolean getForcePasswordChange() {
        return forcePasswordChange != null ? forcePasswordChange : false;
    }

    public void setForcePasswordChange(Boolean forcePasswordChange) {
        this.forcePasswordChange = forcePasswordChange;
    }

    public boolean isPremium() {
        return subscription != null && subscription.getIsPremium() != null ? subscription.getIsPremium() : false;
    }

    public void setPremium(boolean premium) {
        if (subscription == null) {
            Subscription newSubscription = new Subscription();
            newSubscription.setUser(this);
            newSubscription.setIsPremium(premium);
            this.subscription = newSubscription;
        } else {
            subscription.setIsPremium(premium);
        }
    }
}