import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import api from '../../utils/api';
import '../../Login.css';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 로딩 상태 추가
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true); // 로딩 시작
    
    try {
      const response = await api.post('/api/users/login', formData);
      if (response.data && response.data.accessToken) {
        // 토큰 디코딩하여 로그 출력
        try {
          const decodedToken = jwtDecode(response.data.accessToken);
          console.log('Decoded token:', decodedToken);
          console.log('Token roles:', decodedToken.roles || 'No roles found');
        } catch (err) {
          console.error('Error decoding token after login:', err);
        }
        
        login(response.data.accessToken);
        
        // 지연 추가하여 로딩 효과 보여주기
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setError('Invalid response from server');
        setIsLoggingIn(false); // 로딩 종료
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
      setIsLoggingIn(false); // 로딩 종료
    }
  };

  // axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/google-login`
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setIsLoggingIn(true); // 구글 로그인 로딩 시작
        
        const response = await api.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/google-login-check`, {
          token: codeResponse.access_token
        });
        
        if (response.data.isRegistered) {
          // 이미 가입된 계정은 로그인 처리
          login(response.data.accessToken);
          
          // 지연 추가하여 로딩 효과 보여주기
          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          // 가입되지 않은 계정은 약관 동의 페이지로 이동
          navigate('/agreements', { 
            state: { 
              googleToken: codeResponse.access_token,
              email: response.data.email
            } 
          });
          setIsLoggingIn(false); // 로딩 종료
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError('Google login failed. Please try again.');
        setIsLoggingIn(false); // 로딩 종료
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError('Google login failed. Please try again.');
      setIsLoggingIn(false); // 로딩 종료
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{t('common.login')}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('login.emailPlaceholder') || "Email"}
            required
            disabled={isLoggingIn} // 로딩 중 비활성화
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('login.passwordPlaceholder') || "Password"}
            required
            disabled={isLoggingIn} // 로딩 중 비활성화
          />
          {error && <p className="error-message">{error}</p>}
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoggingIn} // 로딩 중 비활성화
          >
            {isLoggingIn ? (
              <div className="button-loader">
                <div className="spinner-small"></div>
                <span>{t('common.loading')}</span>
              </div>
            ) : t('common.login')}
          </button>
        </form>
        <div className="or-divider">
          <span>{t('login.or') || "OR"}</span>
        </div>
        <div className="google-login-container">
          <button 
            onClick={() => googleLogin()} 
            className="google-login-button"
            disabled={isLoggingIn} // 로딩 중 비활성화
          >
            {isLoggingIn ? (
              <div className="button-loader">
                <div className="spinner-small"></div>
                <span>{t('common.loading')}</span>
              </div>
            ) : (
              <>
                <FcGoogle className="google-icon" />
                {t('login.signInWithGoogle') || "Sign in with Google"}
              </>
            )}
          </button>
        </div>
        <div className="additional-links">
          <Link to="/find-credentials">{t('login.forgotCredentials') || "Forgot username or password?"}</Link>
          <p>
            {t('login.noAccount') || "Don't have an account?"} <Link to="/signup">{t('login.signupHere') || "Sign up here"}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;