package com.example.openaitest.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.openaitest.user.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByVerificationToken(String token);

    List<User> findAllByEmail(String email);

    // 사용자 삭제 메서드 (트랜잭션과 함께 사용)
    @Transactional
    void deleteById(Long id);

    @Transactional
    void deleteByEmail(String email);

    // 이메일이 인증되지 않은 사용자 일괄 삭제 (예: 스케줄러로 주기적 정리)
    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE u.emailVerified = false AND u.verificationTokenExpiry < CURRENT_TIMESTAMP")
    int deleteExpiredUnverifiedUsers();
}