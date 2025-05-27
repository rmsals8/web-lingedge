import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import '../../AgreementPage.css';

const AgreementPage = ({ onNext }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // location state에서 구글 토큰과 이메일 확인
  const googleToken = location.state?.googleToken;
  const googleEmail = location.state?.email;
  const googleName = location.state?.name;
  const googleId = location.state?.googleId;
  
  const [agreements, setAgreements] = useState({
    allAgreed: false,
    termsOfUse: false,
    privacyPolicy: false,
    marketingAgree: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 구글 소셜 로그인으로 회원가입 처리
  const handleGoogleSignUp = async () => {
    if (!agreements.termsOfUse || !agreements.privacyPolicy) {
      setError(t('agreements.requiredAgreement'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 구글 토큰으로 회원가입 처리
      const response = await api.post('/api/users/google-login-with-agreements', {
        token: googleToken,
        agreement: {
          termsOfUse: agreements.termsOfUse,
          privacyPolicy: agreements.privacyPolicy,
          marketingAgree: agreements.marketingAgree
        },
        googleId: googleId,
        name: googleName
      });
      
      if (response.data && response.data.accessToken) {
        // 로그인 처리 및 홈페이지로 이동
        localStorage.setItem('token', response.data.accessToken);
        navigate('/');
      } else {
        setError(t('login.invalidResponse'));
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setError(error.response?.data || t('login.googleLoginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 약관 동의 상태 변경 핸들러
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'allAgreed') {
      setAgreements({
        allAgreed: checked,
        termsOfUse: checked,
        privacyPolicy: checked,
        marketingAgree: checked
      });
    } else {
      const newAgreements = {
        ...agreements,
        [name]: checked
      };
      
      // 모든 약관이 체크되었는지 확인
      const allChecked = newAgreements.termsOfUse && 
                         newAgreements.privacyPolicy && 
                         newAgreements.marketingAgree;
      
      setAgreements({
        ...newAgreements,
        allAgreed: allChecked
      });
    }
  };

  // 일반 회원가입으로 진행 버튼 클릭 핸들러
  const handleContinue = () => {
    if (!agreements.termsOfUse || !agreements.privacyPolicy) {
      setError(t('agreements.requiredAgreement'));
      return;
    }
    
    // 약관 동의 정보를 전달하며 회원가입 페이지로 이동
    navigate('/register', { 
      state: { 
        agreements 
      }
    });
  };

  // 약관 내용을 단락별로 렌더링하는 함수
  const renderContent = (key) => {
    // content에 returnObjects 옵션을 사용하되, 결과가 배열이 아닐 경우를 대비
    const content = t(`agreements.${key}.content`, { returnObjects: true });
    
    // 배열인 경우
    if (Array.isArray(content)) {
      return content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ));
    }
    
    // 문자열인 경우
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    
    // 객체인 경우 또는 undefined인 경우 빈 프래그먼트 반환
    return <></>;
  };

  return (
    <div className="agreement-container">
      <div className="agreement-card">
        <h2>{t('agreements.title')}</h2>
        
        {/* 구글 이메일 표시 (구글 로그인 경로인 경우) */}
        {googleEmail && (
          <div className="google-email-info">
            <p>{t('agreements.googleEmail')}: {googleEmail}</p>
          </div>
        )}
        
        <div className="all-agreement">
          <label>
            <input
              type="checkbox"
              name="allAgreed"
              checked={agreements.allAgreed}
              onChange={handleAgreementChange}
            />
            {t('agreements.allAgree')}
          </label>
        </div>
        
        <div className="agreement-item">
          <div className="agreement-header">
            <label>
              <input
                type="checkbox"
                name="termsOfUse"
                checked={agreements.termsOfUse}
                onChange={handleAgreementChange}
              />
              {t('agreements.termsOfUse.title')}
            </label>
          </div>
          <div className="agreement-content">
            <h3>{t('agreements.termsOfUse.header')}</h3>
            {renderContent('termsOfUse')}
          </div>
        </div>
        
        <div className="agreement-item">
          <div className="agreement-header">
            <label>
              <input
                type="checkbox"
                name="privacyPolicy"
                checked={agreements.privacyPolicy}
                onChange={handleAgreementChange}
              />
              {t('agreements.privacyPolicy.title')}
            </label>
          </div>
          <div className="agreement-content">
            <h3>{t('agreements.privacyPolicy.header')}</h3>
            {renderContent('privacyPolicy')}
          </div>
        </div>
        
        <div className="agreement-item">
          <div className="agreement-header">
            <label>
              <input
                type="checkbox"
                name="marketingAgree"
                checked={agreements.marketingAgree}
                onChange={handleAgreementChange}
              />
              {t('agreements.marketingAgree.title')}
            </label>
          </div>
          <div className="agreement-content">
            <h3>{t('agreements.marketingAgree.header')}</h3>
            {renderContent('marketingAgree')}
          </div>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="button-group">
          {googleToken ? (
            // 구글 소셜 로그인 사용자인 경우 회원가입 진행 버튼만 표시
            <button
              className="continue-button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('agreements.completeGoogleSignUp')}
            </button>
          ) : (
            // 일반 사용자인 경우 일반 회원가입 버튼만 표시 (구글 로그인 버튼 제거)
            <button
              className="continue-button"
              onClick={handleContinue}
            >
              {t('agreements.continueButton')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementPage;