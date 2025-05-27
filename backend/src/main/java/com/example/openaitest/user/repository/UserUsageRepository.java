package com.example.openaitest.user.repository;

import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserUsage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserUsageRepository extends JpaRepository<UserUsage, Long> {
    Optional<UserUsage> findByUser(User user);
}