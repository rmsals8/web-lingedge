import React, { useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import '../../FindCredentials.css';

const FindCredentials = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력
  const [actionType, setActionType] = useState(''); // 'username' 또는 'password'
  const [username, setUsername] = useState(''); // 찾은 사용자명 저장

  const handleSendVerificationCode = async (type) => {
    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    setActionType(type);
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/users/send-verification-for-credential', { email });
      setMessage(response.data);
      setStep(2); // 인증코드 입력 단계로 이동
    } catch (error) {
      setMessage(error.response?.data || '인증번호 발송 중 오류가 발생했습니다.');
    }
    
    setIsLoading(false);
  };

  const handleVerifyForUsername = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/users/verify-for-username', { 
        email, 
        code: verificationCode 
      });
      
      setUsername(response.data.username);
      setMessage(`회원님의 아이디는 ${response.data.username} 입니다.`);
      setStep(3); // 결과 표시 단계
    } catch (error) {
      setMessage(error.response?.data || '아이디 찾기 중 오류가 발생했습니다.');
    }
    
    setIsLoading(false);
  };

  const handleVerifyForPasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/users/verify-for-password-reset', { 
        email, 
        code: verificationCode 
      });
      
      setMessage(response.data);
      setStep(3); // 결과 표시 단계
    } catch (error) {
      setMessage(error.response?.data || '비밀번호 재설정 중 오류가 발생했습니다.');
    }
    
    setIsLoading(false);
  };

  const renderStep1 = () => (
    <>
      <div className="input-container">
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
          required
          className="input-field"
        />
      </div>
      
      {message && <p className="message">{message}</p>}
      
      <div className="button-group">
        {/* <button 
          onClick={() => handleSendVerificationCode('username')} 
          disabled={isLoading}
          className="credential-button find-button"
        >
          <FaUser className="button-icon" />
          {isLoading ? '처리 중...' : '아이디 찾기'}
        </button> */}
        <button 
          onClick={() => handleSendVerificationCode('password')} 
          disabled={isLoading}
          className="credential-button reset-button"
        >
          <FaLock className="button-icon" />
          {isLoading ? '처리 중...' : '비밀번호 재설정'}
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="verification-info">
        <p><strong>{email}</strong>로 인증번호가 발송되었습니다.</p>
        <p>이메일을 확인하고 인증번호를 입력해주세요.</p>
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증번호 6자리 입력"
          maxLength={6}
          required
          className="verification-input"
        />
      </div>
      
      {message && <p className="message">{message}</p>}
      
      <button 
        onClick={actionType === 'username' ? handleVerifyForUsername : handleVerifyForPasswordReset} 
        disabled={isLoading || verificationCode.length !== 6}
        className="verify-button"
      >
        {isLoading ? '처리 중...' : '인증하기'}
      </button>
      
      <button 
        onClick={() => setStep(1)} 
        className="back-button"
      >
        뒤로 가기
      </button>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="result-container">
        {actionType === 'username' && username ? (
          <>
            <FaUser className="result-icon" />
            <p className="result-message">회원님의 아이디는 <strong>{username}</strong> 입니다.</p>
          </>
        ) : (
          <>
            <FaEnvelope className="result-icon" />
            <p className="result-message">{message}</p>
          </>
        )}
      </div>
      
      <div className="button-group">
        <Link to="/login" className="login-link-button">
          로그인하기
        </Link>
        <button 
          onClick={() => {
            setStep(1);
            setVerificationCode('');
            setMessage('');
          }} 
          className="reset-button"
        >
          다시 찾기
        </button>
      </div>
    </>
  );

  return (
    <div className="find-credentials-container">
      <div className="find-credentials-card">
        <h2>
          {step === 1 ? '비밀번호 찾기' : 
           step === 2 ? (actionType === 'username' ? '아이디 찾기' : '비밀번호 재설정') : 
                        (actionType === 'username' ? '아이디 찾기 결과' : '비밀번호 재설정 결과')}
        </h2>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <div className="additional-links">
          <p>
            계정이 기억나셨나요? <Link to="/login">로그인하기</Link>
          </p>
          <p>
            계정이 없으신가요? <Link to="/signup">회원가입하기</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FindCredentials;