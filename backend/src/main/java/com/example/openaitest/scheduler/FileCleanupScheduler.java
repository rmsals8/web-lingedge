package com.example.openaitest.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.openaitest.file.service.UserFileService;

import java.time.LocalDateTime;

@Component
@EnableScheduling
public class FileCleanupScheduler {
    @Autowired
    private UserFileService userFileService;

    // 매일 자정 실행
    @Scheduled(cron = "0 0 0 * * ?", zone = "Asia/Seoul")
    public void cleanupExpiredFiles() {
        System.out.println("만료된 파일 정리 스케줄러 실행: " + LocalDateTime.now());
        userFileService.cleanExpiredFiles();
        System.out.println("만료된 파일 정리 완료");
    }
}