package com.example.openaitest.auth.repository;

import com.example.openaitest.auth.model.SocialLogin;
import com.example.openaitest.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialLoginRepository extends JpaRepository<SocialLogin, Long> {
    List<SocialLogin> findByUser(User user);

    Optional<SocialLogin> findByUserAndProvider(User user, String provider);

    Optional<SocialLogin> findByProviderAndProviderId(String provider, String providerId);
}