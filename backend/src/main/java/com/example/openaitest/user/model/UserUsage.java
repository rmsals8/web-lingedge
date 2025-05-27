package com.example.openaitest.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_usages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name = "daily_usage_count")
    private Integer dailyUsageCount = 0;

    @Column(name = "hourly_usage_count")
    private Integer hourlyUsageCount = 0;

    @Column(name = "last_usage_reset")
    private LocalDate lastUsageReset;

    @Column(name = "last_hourly_reset")
    private LocalDateTime lastHourlyReset;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastUsageReset = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and setters with null checks
    public Integer getDailyUsageCount() {
        return dailyUsageCount != null ? dailyUsageCount : 0;
    }

    public Integer getHourlyUsageCount() {
        return hourlyUsageCount != null ? hourlyUsageCount : 0;
    }
}