package com.example.openaitest.inquiry.repository;

import com.example.openaitest.inquiry.model.Log;
import com.example.openaitest.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findByUser(User user);

    List<Log> findByActionType(String actionType);

    List<Log> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Log> findByUserAndActionType(User user, String actionType);

    // 접속 통계를 위한 추가 메서드
    @Query("SELECT COUNT(DISTINCT l.ipAddress) FROM Log l WHERE l.accessDate = :date AND l.actionType = 'PAGE_VIEW'")
    Long countUniqueVisitorsByDate(LocalDate date);

    @Query("SELECT l.countryName, COUNT(DISTINCT l.ipAddress) FROM Log l WHERE l.accessDate BETWEEN :startDate AND :endDate GROUP BY l.countryName")
    List<Object[]> countVisitorsByCountry(LocalDate startDate, LocalDate endDate);

    @Query("SELECT l.accessDate, COUNT(DISTINCT l.ipAddress) FROM Log l WHERE l.accessDate BETWEEN :startDate AND :endDate GROUP BY l.accessDate ORDER BY l.accessDate")
    List<Object[]> countDailyVisitors(LocalDate startDate, LocalDate endDate);
}