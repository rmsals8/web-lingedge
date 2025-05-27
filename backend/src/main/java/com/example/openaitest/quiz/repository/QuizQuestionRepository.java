package com.example.openaitest.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.quiz.model.QuizQuestion;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizOrderByOrderIndexAsc(Quiz quiz);

    void deleteByQuiz(Quiz quiz);
}