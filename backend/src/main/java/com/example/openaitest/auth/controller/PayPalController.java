// PayPalController.java 파일 생성
package com.example.openaitest.auth.controller;

import com.example.openaitest.user.dto.response.UserInfoResponse;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.SubscriptionRepository;
import com.example.openaitest.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Timer;
import java.util.TimerTask;

@RestController
@RequestMapping("/api/paypal")
public class PayPalController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/create-subscription")
    public ResponseEntity<?> createPayPalSubscription(@RequestBody Map<String, Object> paymentDetails,
            Authentication authentication) {
        try {
            // 현재 인증된 사용자 가져오기
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            // 한 달 후 만료 시간 설정
            LocalDateTime expiryTime = LocalDateTime.now().plusMonths(1);
            LocalDate subscriptionEndDate = expiryTime.toLocalDate();

            // 로그 추가
            System.out.println("========= 구독 생성 =========");
            System.out.println("사용자: " + user.getUsername() + " (" + user.getEmail() + ")");
            System.out.println("현재 시간: " + LocalDateTime.now());
            System.out.println("만료 예정일: " + subscriptionEndDate);
            System.out.println("====================================");

            // 구독 상태 업데이트
            // 프리미엄 상태를 true로 변경
            user = userService.updateSubscriptionStatus(user, "active", subscriptionEndDate);
            user.getSubscription().setIsPremium(true);
            user.setPremium(true);
            subscriptionRepository.save(user.getSubscription());

            // 로그 추가
            System.out.println("PayPal 구독 생성 완료 - 사용자: " + user.getEmail() + " - 만료일: " + subscriptionEndDate);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("구독 생성 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // @PostMapping("/create-subscription")
    // public ResponseEntity<?> createPayPalSubscription(@RequestBody Map<String,
    // Object> paymentDetails,
    // Authentication authentication) {
    // try {
    // // 현재 인증된 사용자 가져오기
    // String email = authentication.getName();
    // User user = userService.findByEmail(email);

    // // 정확히 1분 후 만료시간 설정
    // // LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(1);
    // LocalDateTime expiryTime = LocalDateTime.now().plusMonths(1);
    // LocalDate subscriptionEndDate = expiryTime.toLocalDate();
    // // 로그 추가
    // System.out.println("========= 구독 생성 =========");
    // System.out.println("사용자: " + user.getUsername() + " (" + user.getEmail() +
    // ")");
    // System.out.println("현재 시간: " + LocalDateTime.now());
    // System.out.println("만료 예정일: " + subscriptionEndDate);
    // System.out.println("====================================");
    // // 로그 추가 - 1분 후 만료되도록 설정
    // // System.out.println("========= 테스트용 구독 생성 (1분 만료) =========");
    // // System.out.println("사용자: " + user.getUsername() + " (" + user.getEmail() +
    // ")");
    // // System.out.println("현재 시간: " + LocalDateTime.now());
    // // System.out.println("정확한 만료 시간: " + expiryTime + " (1분 후)");
    // // System.out.println("====================================");

    // // 구독 상태 업데이트
    // // 프리미엄 상태를 true로 변경
    // user = userService.updateSubscriptionStatus(user, "active",
    // subscriptionEndDate);
    // user.getSubscription().setIsPremium(true);
    // user.setPremium(true);
    // subscriptionRepository.save(user.getSubscription());

    // // 로그 추가
    // System.out.println("PayPal 구독 생성 완료 - 사용자: " + user.getEmail() + " - 1분 후 만료
    // 예정");

    // // 1분 후에 만료 처리를 위한 타이머 설정 (메소드 내에서 직접 구현)
    // final Long userId = user.getId(); // 타이머 내에서 사용하기 위해 final로 선언

    // new Timer().schedule(new TimerTask() {
    // @Override
    // public void run() {
    // try {
    // System.out.println("========= 구독 만료 체크 =========");
    // System.out.println("사용자 ID: " + userId);
    // System.out.println("현재 시간: " + LocalDateTime.now());

    // // 사용자 정보 다시 로드
    // User currentUser = userService.findByEmail(email);

    // // 구독 상태가 여전히 active인 경우에만 처리
    // if (currentUser.getSubscription() != null &&
    // "active".equals(currentUser.getSubscription().getSubscriptionStatus())) {
    // // 구독 상태를 expired로 변경
    // currentUser.getSubscription().setSubscriptionStatus("expired");
    // currentUser.getSubscription().setIsPremium(false);
    // currentUser.setPremium(false);
    // subscriptionRepository.save(currentUser.getSubscription());

    // System.out.println("사용자 " + currentUser.getUsername() + "(" +
    // currentUser.getEmail()
    // + ")의 구독이 만료되었습니다.");
    // } else {
    // System.out.println("사용자 " + currentUser.getUsername() + "의 구독은 이미 만료되었거나
    // 취소되었습니다.");
    // }
    // System.out.println("====================================");
    // } catch (Exception e) {
    // System.err.println("구독 만료 체크 오류: " + e.getMessage());
    // e.printStackTrace();
    // }
    // }
    // },
    // // 1분 + 2초 후에 실행 (약간의 버퍼 추가)
    // 62000);

    // return ResponseEntity.ok(user);
    // } catch (Exception e) {
    // System.err.println("구독 생성 오류: " + e.getMessage());
    // e.printStackTrace();
    // return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    // }
    // }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelSubscription(Authentication authentication) {
        try {
            // 현재 인증된 사용자 가져오기
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            if (user.getSubscription() == null || !user.getSubscription().getIsPremium()) {
                return ResponseEntity.badRequest().body("활성화된 구독이 없습니다.");
            }

            // 구독 상태를 'canceled'로 업데이트
            LocalDate cancellationDate = LocalDate.now();
            user = userService.updateSubscriptionStatus(user, "canceled", cancellationDate);

            // 프리미엄 상태를 false로 변경
            user.getSubscription().setIsPremium(false);

            // 로그 추가
            System.out.println("구독 취소 완료 - 사용자: " + user.getEmail() + ", 취소일: " + cancellationDate);

            return ResponseEntity.ok(Map.of(
                    "message", "구독이 성공적으로 취소되었습니다.",
                    "user", new UserInfoResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            false, // isPremium=false
                            user.getUserUsage() != null ? user.getUserUsage().getDailyUsageCount() : 0,
                            "canceled",
                            cancellationDate,
                            user.getLoginType())));
        } catch (Exception e) {
            System.err.println("구독 취소 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("구독 취소 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}