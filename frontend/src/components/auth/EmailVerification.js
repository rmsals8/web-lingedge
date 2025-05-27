import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import '../../EmailVerification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // API 호출 상태 추적
  const apiCallMadeRef = useRef(false);
  const tokenRef = useRef(null);
  
  // 컴포넌트 초기화 시 한 번만 실행
  useEffect(() => {
    // URL 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('verificationToken');
    const emailParam = queryParams.get('email');
    
    // 토큰 저장
    tokenRef.current = token;
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    // 인증 코드 요청 여부 결정
    if (token) {
      // sessionStorage 확인
      const hasRequested = sessionStorage.getItem(`verification_requested_${token}`);
      
      if (!hasRequested && !apiCallMadeRef.current) {
        console.log("처음으로 인증 코드 요청:", token);
        apiCallMadeRef.current = true;
        sessionStorage.setItem(`verification_requested_${token}`, 'true');
        fetchVerificationCode(token);
      } else {
        console.log("인증 코드 이미 요청됨, 중복 요청 방지:", token);
      }
    } else if (emailParam) {
      setMessage(`${emailParam} 주소로 발송된 인증번호를 입력해주세요.`);
    } else {
      setMessage('유효하지 않은 접근입니다. 회원가입을 다시 진행해주세요.');
    }
  }, [location.search]); // location.search 의존성 추가

  const fetchVerificationCode = async (token) => {
    // 이미 API 호출 중이면 중복 호출 방지
    if (loading) return;
    
    setLoading(true);
    try {
      console.log("인증 코드 요청 시작:", token);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/verification-code?verificationToken=${token}`);
      console.log("인증 코드 요청 응답:", response.data);
      setMessage(response.data);
    } catch (error) {
      console.error("인증 코드 요청 오류:", error);
      setMessage(error.response?.data || '인증 코드를 가져오는 중 오류가 발생했습니다.');
      // 오류 발생 시 sessionStorage에서 요청 상태 제거하여 재시도 가능하게 함
      if (tokenRef.current) {
        sessionStorage.removeItem(`verification_requested_${tokenRef.current}`);
      }
      apiCallMadeRef.current = false;
    }
    setLoading(false);
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/verify-email`, {
        email,
        code: verificationCode
      });
      
      setMessage(response.data);
      setSuccess(true);
      
      // Start countdown for redirect
      setCountdown(3);
    } catch (error) {
      setMessage(error.response?.data || '이메일 인증 중 오류가 발생했습니다.');
    }
    
    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (cooldown > 0 || isResending || !email) return;
    
    setIsResending(true);
    
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/resend-verification`, { email });
      
      // 성공 메시지 표시
      setMessage('인증번호가 재발송되었습니다. 이메일을 확인해주세요.');
      
      // 쿨다운 타이머 시작 (60초)
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setMessage(error.response?.data || '인증번호 재발송 중 오류가 발생했습니다.');
    }
    
    setIsResending(false);
  };

  // Handle countdown for redirect
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown <= 0) {
      navigate('/login');
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        {success ? (
          <div className="success-container">
            <FaCheckCircle className="success-icon" />
            <h2>인증 완료!</h2>
            <p>{message}</p>
            <p className="redirect-message">{countdown}초 후 로그인 페이지로 이동합니다...</p>
          </div>
        ) : (
          <>
            <h2 className="verification-title">
              <FaEnvelope className="envelope-icon" /> 이메일 인증
            </h2>
            <p className="verification-message">{message}</p>
            
            {email && (
              <form onSubmit={handleVerifyEmail} className="verification-form">
                <div className="form-group">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="인증번호 6자리 입력"
                    required
                    maxLength={6}
                    className="verification-input"
                  />
                </div>
                <button 
                  type="submit" 
                  className="verification-button"
                  disabled={loading}
                >
                  {loading ? '처리 중...' : '인증하기'}
                </button>
              </form>
            )}
            
            <div className="verification-footer">
              <p>인증번호를 받지 못하셨나요?</p>
              <button 
                onClick={handleResendVerification} 
                className="resend-button"
                disabled={cooldown > 0 || isResending || !email}
              >
                {cooldown > 0 
                  ? `재발송 (${cooldown}초 후 가능)` 
                  : (isResending ? '발송 중...' : '인증번호 재발송')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;