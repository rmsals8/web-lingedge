package com.example.openaitest.common.security;

import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 로그 추가
        System.out.println("이메일로 사용자 검색: " + email);

        // 직접 데이터베이스에서 이메일로 사용자 조회
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            System.out.println("사용자를 찾을 수 없음: " + email);
            throw new UsernameNotFoundException("User Not Found with email: " + email);
        }

        User user = userOpt.get();
        System.out.println("사용자 찾음: " + user.getUsername() + ", 이메일: " + user.getEmail());

        // 소셜 로그인 사용자(login_type=1)는 이메일 인증 검사 우회
        if (user.getLoginType() != null && user.getLoginType() == 1) {
            // 소셜 로그인 사용자는 이메일이 자동 인증된 것으로 처리
            if (user.getEmailVerified() == null || !user.getEmailVerified()) {
                user.setEmailVerified(true);
                userRepository.save(user);
            }
        } else if (user.getEmailVerified() == null || !user.getEmailVerified()) {
            // 일반 로그인 사용자는 이메일 인증 확인
            System.out.println("이메일 인증되지 않은 사용자: " + email);
            throw new UsernameNotFoundException("Email not verified for user: " + email);
        }

        return UserDetailsImpl.build(user);
    }
}