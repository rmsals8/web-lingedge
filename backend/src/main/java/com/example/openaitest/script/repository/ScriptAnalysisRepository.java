package com.example.openaitest.script.repository;

import com.example.openaitest.script.model.ScriptAnalysis;
import com.example.openaitest.user.model.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScriptAnalysisRepository extends JpaRepository<ScriptAnalysis, Long> {
    /**
     * 사용자별 스크립트 분석 결과 목록 조회 (생성일 내림차순)
     * 
     * @param user 사용자
     * @return 스크립트 분석 목록
     */
    List<ScriptAnalysis> findByUserOrderByCreatedAtDesc(User user);

    /**
     * 만료 날짜 이전의 스크립트 분석 결과 목록 조회
     * 
     * @param dateTime 기준 날짜/시간
     * @return 만료된 스크립트 분석 목록
     */
    List<ScriptAnalysis> findByExpireAtBefore(LocalDateTime dateTime);

    /**
     * 사용자와 ID로 스크립트 분석 결과 조회
     * 
     * @param id   스크립트 분석 ID
     * @param user 사용자
     * @return 스크립트 분석 결과
     */
    Optional<ScriptAnalysis> findByIdAndUser(Long id, User user);

    /**
     * 사용자별 스크립트 분석 결과 개수 조회
     * 
     * @param user 사용자
     * @return 스크립트 분석 결과 개수
     */
    long countByUser(User user);

    /**
     * 지정된 언어로 번역된 스크립트 분석 결과 목록 조회
     * 
     * @param translationLanguage 번역 언어
     * @return 스크립트 분석 목록
     */
    List<ScriptAnalysis> findByTranslationLanguage(String translationLanguage);

    /**
     * 특정 감지 언어와 번역 언어로 스크립트 분석 결과 목록 조회
     * 
     * @param detectedLanguage    감지된 언어
     * @param translationLanguage 번역 언어
     * @return 스크립트 분석 목록
     */
    List<ScriptAnalysis> findByDetectedLanguageAndTranslationLanguage(
            String detectedLanguage, String translationLanguage);

    /**
     * 원본 스크립트가 특정 텍스트를 포함하는 분석 결과 검색
     * 
     * @param textPattern 검색할 텍스트 패턴
     * @return 스크립트 분석 목록
     */
    @Query("SELECT s FROM ScriptAnalysis s WHERE s.originalScript LIKE %:textPattern%")
    List<ScriptAnalysis> findByOriginalScriptContaining(@Param("textPattern") String textPattern);

    /**
     * 사용자별 최근 n개의 스크립트 분석 결과 조회
     * 
     * @param user  사용자
     * @param limit 조회할 개수
     * @return 스크립트 분석 목록
     */
    @Query("SELECT s FROM ScriptAnalysis s WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    List<ScriptAnalysis> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    /**
     * 특정 기간 내에 생성된 스크립트 분석 결과 목록 조회
     * 
     * @param startDate 시작 날짜/시간
     * @param endDate   종료 날짜/시간
     * @return 스크립트 분석 목록
     */
    @Query("SELECT s FROM ScriptAnalysis s WHERE s.createdAt BETWEEN :startDate AND :endDate")
    List<ScriptAnalysis> findByCreatedAtBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * 오디오 파일이 있는 스크립트 분석 결과 목록 조회
     * 
     * @return 오디오 파일이 있는 스크립트 분석 목록
     */
    @Query("SELECT s FROM ScriptAnalysis s WHERE s.audioS3Key IS NOT NULL")
    List<ScriptAnalysis> findWithAudio();

    /**
     * 특정 사용자의 모든 스크립트 분석 삭제
     * 
     * @param user 사용자
     */
    void deleteByUser(User user);

    /**
     * 특정 날짜 이후에 생성된 스크립트 분석 개수 조회
     * 
     * @param date 기준 날짜/시간
     * @return 생성된 스크립트 분석 개수
     */
    @Query("SELECT COUNT(s) FROM ScriptAnalysis s WHERE s.createdAt > :date")
    long countCreatedAfter(@Param("date") LocalDateTime date);

    /**
     * 가장 많이 사용된 번역 언어 조회
     * 
     * @return 번역 언어와 사용 횟수 (언어, 횟수)
     */
    @Query("SELECT s.translationLanguage, COUNT(s) as count FROM ScriptAnalysis s " +
            "GROUP BY s.translationLanguage ORDER BY count DESC")
    List<Object[]> findMostUsedTranslationLanguages();

    /**
     * 사용자별 스크립트 평균 길이 계산
     * 
     * @param user 사용자
     * @return 평균 길이
     */
    @Query("SELECT AVG(LENGTH(s.originalScript)) FROM ScriptAnalysis s WHERE s.user = :user")
    Double calculateAverageScriptLength(@Param("user") User user);
}