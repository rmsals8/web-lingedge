package com.example.openaitest.writing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.user.model.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "writing_exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_file_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserFile userFile; // 영작 연습과 연결된 PDF 파일

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "difficulty")
    private String difficulty; // 난이도 (easy, medium, hard)

    @Column(name = "exercise_count")
    private Integer exerciseCount; // 연습 문제 개수

    @Column(name = "expire_at")
    private LocalDateTime expireAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        expireAt = createdAt.plusDays(30); // 30일 후 만료
    }
}