package com.example.openaitest.quiz.repository;

import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserOrderByCreatedAtDesc(User user);

    List<Quiz> findByExpireAtBefore(LocalDateTime dateTime);
}