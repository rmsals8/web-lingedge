package com.example.openaitest.user.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_agreements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAgreement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name = "terms_of_use", nullable = false)
    private Boolean termsOfUse = false;

    @Column(name = "privacy_policy", nullable = false)
    private Boolean privacyPolicy = false;

    @Column(name = "marketing_agree", nullable = false)
    private Boolean marketingAgree = false;

    @Column(name = "agreement_date")
    private LocalDateTime agreementDate;

    @PrePersist
    protected void onCreate() {
        agreementDate = LocalDateTime.now();
    }
}