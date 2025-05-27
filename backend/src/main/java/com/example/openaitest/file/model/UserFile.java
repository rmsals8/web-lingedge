
package com.example.openaitest.file.model;

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
@Table(name = "user_files")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String s3Key;

    @Column(nullable = false)
    private String fileType; // "CONVERSATION_PDF", "WRITING_PDF", "QUIZ_PDF" 등으로 명확하게 구분

    @Column(nullable = false)
    private Long fileSize;

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