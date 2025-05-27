package com.example.openaitest.user.repository;

import com.example.openaitest.user.model.Password;
import com.example.openaitest.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {
    List<Password> findByUser(User user);

    Optional<Password> findTopByUserOrderByCreatedAtDesc(User user);
}