import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // 토큰 만료 체크
        if (decodedToken.exp * 1000 > Date.now()) {
          // 역할 정보 추출
          let roles = [];
          
          // 역할 정보가 있을 경우 추출
          if (decodedToken.roles) {
            roles = decodedToken.roles;
          } else if (decodedToken.authorities) {
            // Spring Security가 authorities 형태로 제공하는 경우
            roles = decodedToken.authorities.map(auth => auth.authority);
          }
          
          // 사용자 정보에 역할 추가
          setUser({
            ...decodedToken,
            roles: roles
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    
    // 역할 정보 추출
    let roles = [];
    
    // 역할 정보가 있을 경우 추출
    if (decodedToken.roles) {
      roles = decodedToken.roles;
    } else if (decodedToken.authorities) {
      // Spring Security가 authorities 형태로 제공하는 경우
      roles = decodedToken.authorities.map(auth => auth.authority);
    }
    
    // 사용자 정보에 역할 추가
    setUser({
      ...decodedToken,
      roles: roles
    });
    
    // 토큰 출력 (디버깅용)
    console.log('Decoded token:', decodedToken);
    console.log('Extracted roles:', roles);
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await api.delete('/api/auth/logout');
    } catch (error) {
      console.error('로그아웃 서버 요청 실패:', error);
    } finally {
      // 로컬 스토리지 토큰 제거
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      
      // 확실한 상태 업데이트 강제
      window.location.href = '/'; // 홈페이지로 리다이렉트하여 앱 전체 리로드
    }
  };

  // 관리자 권한 확인 헬퍼 함수 - Spring Security의 ROLE_ 접두사 처리 로직 추가
  const isAdmin = () => {
    if (!user || !user.roles) return false;
    
    // ROLE_ADMIN 또는 ADMIN 권한 모두 체크 (Spring Security 호환성)
    return user.roles.includes('ROLE_ADMIN') || 
           user.roles.includes('ADMIN');
  };
  
  // 디버깅을 위한 로깅
  if (user) {
    console.log('현재 사용자:', user);
    console.log('사용자 역할:', user.roles);
    console.log('관리자 여부:', isAdmin());
  }
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      checkAuthStatus,
      isAdmin // 관리자 권한 확인 함수
    }}>
      {children}
    </AuthContext.Provider>
  );
};