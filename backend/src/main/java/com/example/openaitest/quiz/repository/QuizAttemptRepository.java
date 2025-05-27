package com.example.openaitest.quiz.repository;

import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.quiz.model.QuizAttempt;
import com.example.openaitest.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserAndQuizOrderByStartedAtDesc(User user, Quiz quiz);

    Optional<QuizAttempt> findTopByUserAndQuizOrderByStartedAtDesc(User user, Quiz quiz);
}