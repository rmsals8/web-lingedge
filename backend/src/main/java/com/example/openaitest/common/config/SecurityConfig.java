package com.example.openaitest.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.openaitest.common.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // 공개 경로
                        .requestMatchers("/api/users/register", "/api/users/login", "/api/users/google-login",
                                "/api/users/find-username", "/api/users/reset-password",
                                "/api/users/request-reset-password", "/api/users/verify-email",
                                "/api/users/verification-code", "/api/users/resend-verification",
                                "/api/users/send-verification-for-credential",
                                "/api/users/verify-for-username",
                                "/api/users/verify-for-password-reset",
                                "/api/users/check-email", "/api/users/check-username",
                                "/api/users/register-with-agreements", "/api/users/google-login-with-agreements",
                                "/api/users/validate-password", "/api/users/validate-registration",
                                "/api/users/google-login-check", "/api/paypal/**", "/api/pdf/generate",
                                "/api/quizzes/**", "/api/script/**")
                        .permitAll()
                        .requestMatchers("/api/quizzes/**").authenticated()
                        // Swagger/OpenAPI
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/writing-exercises/**").authenticated()
                        // 관리자 전용 API - hasRole 대신 hasAuthority 사용 (더 명확한 권한 체크)
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                        // 문의 관련 API - 인증된 사용자만 접근 가능
                        .requestMatchers("/api/inquiries/**").authenticated()

                        // 사용자 관련 API
                        .requestMatchers("/api/users/me", "/bot/chat", "/api/users/incrementUsage",
                                "/api/users/verify-password", "/api/users/delete-account")
                        .authenticated()

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}