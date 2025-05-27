package com.example.openaitest.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.openaitest.user.model.User;
import com.example.openaitest.user.model.UserAgreement;

@Repository
public interface UserAgreementRepository extends JpaRepository<UserAgreement, Long> {
    Optional<UserAgreement> findByUser(User user);
}
