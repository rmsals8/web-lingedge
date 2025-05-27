package com.example.openaitest.chat.controller;

import com.example.openaitest.chat.dto.request.ChatRequest;
import com.example.openaitest.chat.dto.response.ChatResponse;
import com.example.openaitest.chat.service.ChatService;
import com.example.openaitest.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bot")
public class CustomBotController {
    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request, Authentication authentication) {
        try {
            ChatResponse response = chatService.generateChat(request);

            if (authentication != null) {
                String username = authentication.getName();
                userService.incrementUsageCountByUsername(username);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Chat generation error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ChatResponse());
        }
    }

    // GET 메소드는 동일하게 수정
    @GetMapping("/chat")
    public ResponseEntity<String> chatGet(@RequestParam String topic,
            @RequestParam String level,
            @RequestParam String learningLanguage,
            @RequestParam String translationLanguage,
            Authentication authentication) {
        ChatRequest request = new ChatRequest();
        request.setTopic(topic);
        request.setLevel(level);
        request.setLearningLanguage(learningLanguage);
        request.setTranslationLanguage(translationLanguage);

        try {
            ChatResponse response = chatService.generateChat(request);

            // 인증된 사용자인 경우 사용량 증가
            if (authentication != null) {
                String username = authentication.getName();
                userService.incrementUsageCountByUsername(username);
            }

            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}