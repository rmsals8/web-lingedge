package com.example.openaitest.quiz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "quiz_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Quiz quiz;

    @Column(nullable = false)
    private String questionText;

    @Column(nullable = false)
    private String questionType; // "MULTIPLE_CHOICE" 또는 "SHORT_ANSWER"

    @Column(columnDefinition = "TEXT")
    private String options; // JSON 형태로 선택지 저장 (객관식인 경우)

    @Column
    private String correctAnswer;

    @Column
    private Integer orderIndex; // 문제 순서

    // 이 부분을 추가하여 관련 답변도 자동으로 삭제되도록 설정
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAnswer> answers = new ArrayList<>();
}