package com.example.openaitest.writing.repository;

import com.example.openaitest.user.model.User;
import com.example.openaitest.writing.model.WritingExercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WritingExerciseRepository extends JpaRepository<WritingExercise, Long> {
    List<WritingExercise> findByUserOrderByCreatedAtDesc(User user);

    List<WritingExercise> findByExpireAtBefore(LocalDateTime dateTime);

    long countByUser(User user);
}