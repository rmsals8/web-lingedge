package com.example.openaitest.common.security;

import com.example.openaitest.user.model.Password;
import com.example.openaitest.user.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private Boolean isPremium;
    private Integer dailyUsageCount;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String password,
            Boolean isPremium, Integer dailyUsageCount,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.isPremium = isPremium;
        this.dailyUsageCount = dailyUsageCount;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());

        // 비밀번호는 Password 엔티티에서 가져오기
        String password = user.getPasswords().isEmpty() ? "" : user.getPasswords().get(0).getPassword();

        // Premium 상태는 Subscription 엔티티에서 가져오기
        Boolean isPremium = user.getSubscription() != null ? user.getSubscription().getIsPremium() : false;

        // 사용량은 UserUsage 엔티티에서 가져오기
        Integer dailyUsageCount = user.getUserUsage() != null ? user.getUserUsage().getDailyUsageCount() : 0;

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                password,
                isPremium,
                dailyUsageCount,
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public Integer getDailyUsageCount() {
        return dailyUsageCount != null ? dailyUsageCount : 0;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}