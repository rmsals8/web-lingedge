package com.example.openaitest.inquiry.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.openaitest.user.model.User;

@Entity
@Table(name = "logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 사용자 (null 가능, 비로그인 사용자)

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "status", nullable = false)
    private String status;

    // UserAccessLog 기능을 위한 추가 필드
    @Column(name = "country_code", length = 2)
    private String countryCode;

    @Column(name = "country_name")
    private String countryName;

    @Column(name = "access_date")
    private LocalDate accessDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        accessDate = LocalDate.now();
    }
}