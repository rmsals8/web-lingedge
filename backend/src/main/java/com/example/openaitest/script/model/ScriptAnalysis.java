// src/main/java/com/example/openaitest/model/ScriptAnalysis.java
package com.example.openaitest.script.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.openaitest.user.model.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "script_analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScriptAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originalScript;

    @Column(nullable = false)
    private String detectedLanguage;

    @Column(nullable = false)
    private String translationLanguage;

    @Column(nullable = false)
    private String audioS3Key;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String analysisJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expire_at")
    private LocalDateTime expireAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        expireAt = createdAt.plusDays(30); // 30일 후 만료
    }
}