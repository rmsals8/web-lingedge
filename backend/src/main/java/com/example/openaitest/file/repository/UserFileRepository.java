package com.example.openaitest.file.repository;

import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserFileRepository extends JpaRepository<UserFile, Long> {
    List<UserFile> findByUserAndFileTypeOrderByCreatedAtDesc(User user, String fileType);

    List<UserFile> findByUserOrderByCreatedAtDesc(User user);

    List<UserFile> findByExpireAtBefore(LocalDateTime dateTime);

    long countByUserAndFileType(User user, String fileType);

    Optional<UserFile> findById(Long id);
}