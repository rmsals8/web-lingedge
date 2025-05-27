package com.example.openaitest.scheduler;

import com.example.openaitest.user.model.User;
import com.example.openaitest.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DailyUsageResetScheduler {

    @Autowired
    private UserService userService;

    @Scheduled(cron = "0 0 0 * * ?", zone = "Asia/Seoul")
    // @Scheduled(cron = "0 * * * * ?", zone = "Asia/Seoul")
    public void resetDailyUsage() {
        System.out.println("일일 사용량 초기화 스케줄러 실행: " + LocalDateTime.now());
        List<User> users = userService.getAllUsers();
        System.out.println("초기화할 사용자 수: " + users.size());
        for (User user : users) {
            userService.resetDailyUsageCount(user);
        }
        System.out.println("일일 사용량 초기화 완료");
    }
}