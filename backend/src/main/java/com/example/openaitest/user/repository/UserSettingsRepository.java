package com.example.openaitest.user.repository;

import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserSettings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser(User user);
}