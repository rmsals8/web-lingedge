// src/components/SignUpMethodSelector.js 수정
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import '../../SignUpMethodSelector.css';

const SignUpMethodSelector = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 구글 로그인 핸들러
const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        setError('');
        
        // 구글 로그인 시도
        const response = await api.post('/api/users/google-login-check', {
          token: codeResponse.access_token
        });
        
        console.log('Google login check response:', response.data);
        
        // 응답 분석: isRegistered 필드 확인 (타입 안전하게 처리)
        const isRegistered = response.data.isRegistered === true;
        
        if (isRegistered) {
          // 이미 가입된 계정이면 토큰 저장 후 홈으로 이동
          if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            navigate('/');
          } else {
            // 토큰이 없는 경우 오류 처리
            setError('로그인 토큰을 받지 못했습니다.');
          }
        } else {
          // 가입되지 않은 계정이면 약관 동의 페이지로 이동
          navigate('/agreements', { 
            state: { 
              googleToken: codeResponse.access_token,
              email: response.data.email,
              name: response.data.name,
              googleId: response.data.googleId
            } 
          });
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError(error.response?.data || t('login.googleLoginFailed'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError(t('login.googleLoginFailed'));
    }
  });

  // 일반 회원가입으로 이동
  const handleRegularSignUp = () => {
    navigate('/agreements');
  };

  return (
    <div className="signup-method-container">
      <div className="signup-method-card">
        <h2>{t('signup.selectMethod')}</h2>
        <p>{t('signup.selectMethodDescription')}</p>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="method-buttons">
          <button 
            className="regular-signup-button"
            onClick={handleRegularSignUp}
            disabled={isLoading}
          >
            {t('signup.regularSignUp')}
          </button>
          
          <button
            className="google-signup-button"
            onClick={() => googleLogin()}
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : (
              <>
                <FcGoogle className="google-icon" />
                {t('signup.googleSignUp')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpMethodSelector;