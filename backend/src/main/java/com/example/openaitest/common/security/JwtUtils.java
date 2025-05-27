package com.example.openaitest.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.openaitest.user.model.User;
import com.example.openaitest.user.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${JWT_SECRET}")
    private String jwtSecret;

    @Value("${JWT_EXPIRATION_MS}")
    private int jwtExpirationMs;

    @Value("${JWT_REFRESH_EXPIRATION_MS:1209600000}") // 기본값 14일
    private int jwtRefreshExpirationMs;

    @Autowired
    private UserRepository userRepository;

    private Key key;

    private final static String HEADER_AUTHORIZATION = "Authorization";
    private final static String TOKEN_PREFIX = "Bearer ";

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        // 사용자 역할 정보를 클레임에 추가
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("email", userPrincipal.getEmail())
                .claim("roles", roles) // 역할 정보 추가
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateTokenFromEmail(String email, Duration expiredAt) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(email) // 여기서 email을 subject로 설정
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expiredAt.toMillis()))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    // 이 메소드도 이메일을 반환하도록 수정
    public String getEmailFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String generateTokenFromUsername(String username, Duration expiredAt) {
        Date now = new Date();

        // 사용자 조회 시도
        try {
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // 역할 정보 가져오기
                List<String> roles = new ArrayList<>(user.getRoles());

                return Jwts.builder()
                        .setSubject(username)
                        .claim("email", username)
                        .claim("roles", roles) // 역할 정보 추가
                        .setIssuedAt(now)
                        .setExpiration(new Date(now.getTime() + expiredAt.toMillis()))
                        .signWith(key, SignatureAlgorithm.HS512)
                        .compact();
            }
        } catch (Exception e) {
            System.err.println("Error getting user roles for token: " + e.getMessage());
        }

        // 사용자를 찾지 못하면 기본 토큰 생성
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expiredAt.toMillis()))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException
                | IllegalArgumentException e) {
            return false;
        }
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(HEADER_AUTHORIZATION);
        if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }

    public Authentication getAuthentication(String token) {
        String email = getEmailFromJwtToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
    }

    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    public int getJwtRefreshExpirationMs() {
        return jwtRefreshExpirationMs;
    }
}