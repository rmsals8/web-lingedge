package com.example.openaitest.inquiry.repository;

import com.example.openaitest.inquiry.model.Inquiry;
import com.example.openaitest.user.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    Page<Inquiry> findByUser(User user, Pageable pageable);

    // 관리자용 - 모든 문의 조회 (비밀글 포함)
    Page<Inquiry> findAll(Pageable pageable);

    // 일반 사용자용 - 본인 글 + 공개 글만 조회
    @Query("SELECT i FROM Inquiry i WHERE i.isPrivate = false OR i.user = :user")
    Page<Inquiry> findAllVisibleToUser(User user, Pageable pageable);

    // 제목 검색
    Page<Inquiry> findByTitleContaining(String keyword, Pageable pageable);

    // 상태별 조회
    Page<Inquiry> findByStatus(String status, Pageable pageable);

    // 상태별 문의 수 통계
    @Query("SELECT i.status as status, COUNT(i) as count FROM Inquiry i GROUP BY i.status")
    List<Map<String, Object>> countByStatus();

    // 특정 기간 동안의 문의 개수
    @Query("SELECT COUNT(i) FROM Inquiry i WHERE i.createdAt BETWEEN :startDate AND :endDate")
    Long countByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 특정 기간 동안의 상태별 문의 수 통계
    @Query("SELECT i.status as status, COUNT(i) as count FROM Inquiry i WHERE i.createdAt BETWEEN :startDate AND :endDate GROUP BY i.status")
    List<Map<String, Object>> countByStatusAndDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // 일별 문의 수 통계
    @Query("SELECT FUNCTION('DATE', i.createdAt) as date, COUNT(i) as count FROM Inquiry i WHERE i.createdAt BETWEEN :startDate AND :endDate GROUP BY FUNCTION('DATE', i.createdAt) ORDER BY date")
    List<Map<String, Object>> countDailyInquiries(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}