package com.example.openaitest.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.quiz.repository.QuizRepository;

import jakarta.transaction.Transactional;

@Component
public class QuizCleanupScheduler {

    @Autowired
    private QuizRepository quizRepository;

    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정에 실행
    @Transactional
    public void cleanupExpiredQuizzes() {
        LocalDateTime now = LocalDateTime.now();
        List<Quiz> expiredQuizzes = quizRepository.findByExpireAtBefore(now);

        if (!expiredQuizzes.isEmpty()) {
            quizRepository.deleteAll(expiredQuizzes);
        }
    }
}