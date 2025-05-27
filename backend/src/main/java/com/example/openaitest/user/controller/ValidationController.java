package com.example.openaitest.user.controller;

import com.example.openaitest.user.dto.request.RegisterRequestDto;
import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;
import com.example.openaitest.user.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
public class ValidationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // 이메일 중복 확인 API
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 형식입니다.");
        }

        // 이메일로 사용자 조회
        Optional<User> userOpt = userRepository.findByEmail(email);

        // 사용자가 있고, 이메일이 인증된 경우에만 중복으로 간주
        if (userOpt.isPresent() && userOpt.get().getEmailVerified()) {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }
        // 사용자가 있지만 인증되지 않은 경우
        else if (userOpt.isPresent() && !userOpt.get().getEmailVerified()) {
            // 기존 미인증 계정 삭제 (선택 사항)
            userRepository.delete(userOpt.get());
            return ResponseEntity.ok("사용 가능한 이메일입니다.");
        }

        return ResponseEntity.ok("사용 가능한 이메일입니다.");
    }

    // 사용자명 중복 확인 API
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsernameAvailability(@RequestParam String username) {
        // 사용자명 형식 검증
        if (!isValidUsername(username)) {
            return ResponseEntity.badRequest()
                    .body("사용자명은 3-20자의 영문자, 숫자, 한글만 포함할 수 있습니다.");
        }

        // 사용자명 중복 확인
        boolean exists = userService.existsByUsername(username);
        if (exists) {
            return ResponseEntity.badRequest().body("이미 사용 중인 사용자명입니다.");
        }

        return ResponseEntity.ok("사용 가능한 사용자명입니다.");
    }

    // 비밀번호 강도 확인 API
    @PostMapping("/validate-password")
    public ResponseEntity<?> validatePassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");

        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호를 입력해주세요.");
        }

        Map<String, Object> response = new HashMap<>();

        boolean hasLowerCase = Pattern.compile("[a-z]").matcher(password).find();
        boolean hasUpperCase = Pattern.compile("[A-Z]").matcher(password).find();
        boolean hasNumber = Pattern.compile("\\d").matcher(password).find();
        boolean hasSpecialChar = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]").matcher(password).find();
        boolean isLongEnough = password.length() >= 8;

        response.put("valid", hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isLongEnough);
        response.put("hasLowerCase", hasLowerCase);
        response.put("hasUpperCase", hasUpperCase);
        response.put("hasNumber", hasNumber);
        response.put("hasSpecialChar", hasSpecialChar);
        response.put("isLongEnough", isLongEnough);

        if (response.get("valid").equals(Boolean.TRUE)) {
            response.put("message", "강력한 비밀번호입니다.");
        } else {
            response.put("message", "비밀번호는 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
        }

        return ResponseEntity.ok(response);
    }

    // 회원가입 시 모든 유효성 검사 한 번에 수행
    @PostMapping("/validate-registration")
    public ResponseEntity<?> validateRegistration(@RequestBody @Valid RegisterRequestDto registerRequest) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> validations = new HashMap<>();
        boolean isValid = true;

        // 사용자명 유효성 검사
        Map<String, Object> usernameValidation = new HashMap<>();
        if (!isValidUsername(registerRequest.getUsername())) {
            usernameValidation.put("valid", false);
            usernameValidation.put("message", "사용자명은 3-20자의 영문자, 숫자, 한글만 포함할 수 있습니다.");
            isValid = false;
        } else if (userService.existsByUsername(registerRequest.getUsername())) {
            usernameValidation.put("valid", false);
            usernameValidation.put("message", "이미 사용 중인 사용자명입니다.");
            isValid = false;
        } else {
            usernameValidation.put("valid", true);
            usernameValidation.put("message", "사용 가능한 사용자명입니다.");
        }
        validations.put("username", usernameValidation);

        // 이메일 유효성 검사
        Map<String, Object> emailValidation = new HashMap<>();
        if (!isValidEmail(registerRequest.getEmail())) {
            emailValidation.put("valid", false);
            emailValidation.put("message", "유효하지 않은 이메일 형식입니다.");
            isValid = false;
        } else if (userService.existsByEmail(registerRequest.getEmail())) {
            emailValidation.put("valid", false);
            emailValidation.put("message", "이미 사용 중인 이메일입니다.");
            isValid = false;
        } else {
            emailValidation.put("valid", true);
            emailValidation.put("message", "사용 가능한 이메일입니다.");
        }
        validations.put("email", emailValidation);

        // 비밀번호 유효성 검사
        Map<String, Object> passwordValidation = new HashMap<>();
        boolean hasLowerCase = Pattern.compile("[a-z]").matcher(registerRequest.getPassword()).find();
        boolean hasUpperCase = Pattern.compile("[A-Z]").matcher(registerRequest.getPassword()).find();
        boolean hasNumber = Pattern.compile("\\d").matcher(registerRequest.getPassword()).find();
        boolean hasSpecialChar = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]").matcher(registerRequest.getPassword())
                .find();
        boolean isLongEnough = registerRequest.getPassword().length() >= 8;

        boolean isPasswordValid = hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
        passwordValidation.put("valid", isPasswordValid);
        passwordValidation.put("hasLowerCase", hasLowerCase);
        passwordValidation.put("hasUpperCase", hasUpperCase);
        passwordValidation.put("hasNumber", hasNumber);
        passwordValidation.put("hasSpecialChar", hasSpecialChar);
        passwordValidation.put("isLongEnough", isLongEnough);

        if (!isPasswordValid) {
            passwordValidation.put("message", "비밀번호는 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
            isValid = false;
        } else {
            passwordValidation.put("message", "강력한 비밀번호입니다.");
        }
        validations.put("password", passwordValidation);

        response.put("valid", isValid);
        response.put("validations", validations);

        return ResponseEntity.ok(response);
    }

    // 이메일 형식 검증 유틸리티 메소드
    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }

    // 사용자명 형식 검증 유틸리티 메소드
    private boolean isValidUsername(String username) {
        // 사용자명은 3-20자의 영문자, 숫자, 한글만 포함할 수 있음
        String usernameRegex = "^[a-zA-Z0-9가-힣]{3,20}$";
        Pattern pattern = Pattern.compile(usernameRegex);
        return pattern.matcher(username).matches();
    }
}