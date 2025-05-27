package com.example.openaitest.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.openaitest.quiz.model.QuizAnswer;
import com.example.openaitest.quiz.model.QuizAttempt;
import com.example.openaitest.quiz.model.QuizQuestion;

import java.util.List;

@Repository
public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {
    List<QuizAnswer> findByAttempt(QuizAttempt attempt);

    void deleteByQuestion(QuizQuestion question);
}