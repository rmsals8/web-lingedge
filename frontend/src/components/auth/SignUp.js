import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc';
import '../../SignUp.css';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: 약관 동의, 2: 회원가입 양식
  const [agreementData, setAgreementData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validations, setValidations] = useState({
    username: { valid: false, message: '' },
    email: { valid: false, message: '', checked: false, checking: false },
    password: { valid: false, message: '' },
    confirmPassword: { valid: false, message: '' }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [pageChanging, setPageChanging] = useState(false); // 페이지 전환 로딩 상태 추가

  // 약관 동의 데이터를 URL 상태에서 가져오기
  useEffect(() => {
    // location.state에서 agreements 데이터가 있는지 확인
    if (location.state && location.state.agreements) {
      setAgreementData(location.state.agreements);
      setStep(2); // 회원가입 양식 단계로 설정
    }
  }, [location.state]);

  // 이메일 중복 확인
  const checkEmailAvailability = async () => {
    if (!formData.email || !validations.email.valid) return;
    
    try {
      setValidations(prev => ({
        ...prev,
        email: {
          ...prev.email,
          checking: true
        }
      }));
      
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/check-email?email=${formData.email}`);
      console.log('Email check response:', response.data);
      
      setValidations(prev => ({
        ...prev,
        email: {
          valid: true,
          message: t('signup.emailAvailable'),
          checked: true,
          checking: false
        }
      }));
    } catch (error) {
      console.error('Email check error:', error);
      setValidations(prev => ({
        ...prev,
        email: {
          valid: false,
          message: error.response?.data || t('signup.emailInUse'),
          checked: true,
          checking: false
        }
      }));
    }
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력값에 따른 유효성 검사
    validateField(name, value);
  };

  // 필드별 유효성 검사
  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        const isUsernameValid = /^[a-zA-Z0-9가-힣]{3,20}$/.test(value);
        setValidations(prev => ({
          ...prev,
          username: {
            valid: isUsernameValid,
            message: isUsernameValid ? t('signup.usernameValid') : t('signup.usernameInvalid')
          }
        }));
        break;
        
      case 'email':
        const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        setValidations(prev => ({
          ...prev,
          email: {
            ...prev.email,
            valid: isEmailValid,
            message: isEmailValid ? t('signup.emailCheckNeeded') : t('signup.emailInvalid'),
            checked: false
          }
        }));
        break;
        
      case 'password':
        const hasLowerCase = /[a-z]/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isLongEnough = value.length >= 8;
        const isPasswordValid = hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
        
        setValidations(prev => ({
          ...prev,
          password: {
            valid: isPasswordValid,
            message: isPasswordValid ? t('signup.passwordValid') : t('signup.passwordInvalid')
          }
        }));
        
        // confirmPassword 검증 업데이트
        if (formData.confirmPassword) {
          setValidations(prev => ({
            ...prev,
            confirmPassword: {
              valid: value === formData.confirmPassword,
              message: value === formData.confirmPassword ? t('signup.passwordMatch') : t('signup.passwordMismatch')
            }
          }));
        }
        break;
        
      case 'confirmPassword':
        setValidations(prev => ({
          ...prev,
          confirmPassword: {
            valid: formData.password === value,
            message: formData.password === value ? t('signup.passwordMatch') : t('signup.passwordMismatch')
          }
        }));
        break;
        
      default:
        break;
    }
  };

  // 회원가입 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // 로딩 시작
    
    // 모든 필드 유효성 검사
    if (!validations.username.valid || 
        !validations.email.valid || 
        !validations.email.checked || 
        !validations.password.valid || 
        !validations.confirmPassword.valid) {
      setError(t('signup.fillAllFields'));
      setIsLoading(false); // 로딩 종료
      return;
    }
    
    try {
      console.log('Submitting registration with data:', {
        registerRequest: {
          username: formData.username,
          email: formData.email,
          password: formData.password
        },
        agreement: agreementData
      });
      
      // 회원가입 및 약관 동의 정보 함께 전송
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/register-with-agreements`, {
        registerRequest: {
          username: formData.username,
          email: formData.email,
          password: formData.password
        },
        agreement: agreementData
      });
      
      console.log('Registration successful:', response.data);
      
      // 성공 메시지 표시
      setSuccess(true);
      
      // 3초 후 이메일 인증 페이지로 이동
      setTimeout(() => {
        if (response.data && response.data.verificationToken) {
          navigate(`/verify-email?email=${formData.email}&verificationToken=${response.data.verificationToken}`);
        } else {
          navigate(`/verify-email?email=${formData.email}`);
        }
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data || t('signup.registrationError'));
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 약관 동의 단계로 돌아가기
  const handleBackToAgreements = () => {
    setPageChanging(true); // 페이지 전환 로딩 표시
    
    // 부드러운 전환을 위한 타이머 추가
    setTimeout(() => {
      navigate('/agreements');
      setPageChanging(false); // 로딩 종료
    }, 500);
  };

  // 로딩 화면 렌더링
  if (pageChanging) {
    return (
      <div className="page-loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // 회원가입 폼 단계 렌더링 (성공 메시지 포함)
  return (
    <div className="signup-container">
      <div className="signup-card">
        {success ? (
          <div className="success-message">
            <h2>{t('signup.success')}</h2>
            <p>{t('signup.redirectingToVerification')}</p>
            <div className="redirect-spinner"></div>
          </div>
        ) : (
          <>
            <h2>{t('common.signup')}</h2>
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t('signup.usernamePlaceholder')}
                  required
                  className={`input-field ${validations.username.valid ? 'valid' : formData.username ? 'invalid' : ''}`}
                />
                {formData.username && <p className={`validation-message ${validations.username.valid ? 'valid' : 'invalid'}`}>
                  {validations.username.message}
                </p>}
              </div>

              <div className="form-group">
                <div className="email-input-container">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('login.emailPlaceholder')}
                    required
                    className={`input-field ${validations.email.valid && validations.email.checked ? 'valid' : (formData.email && !validations.email.valid) ? 'invalid' : ''}`}
                  />
                  <button 
                    type="button" 
                    onClick={checkEmailAvailability}
                    className={`check-email-button ${validations.email.checked && validations.email.valid ? 'confirmed' : ''}`}
                    disabled={!formData.email || !validations.email.valid || validations.email.checking || (validations.email.checked && validations.email.valid)}
                  >
                    {validations.email.checking 
                      ? t('agreements.checking')
                      : (validations.email.checked && validations.email.valid) 
                        ? t('agreements.checked')
                        : t('agreements.check')}
                  </button>
                </div>
                {formData.email && <p className={`validation-message ${
                  validations.email.checked
                    ? (validations.email.valid ? 'valid' : 'invalid')
                    : (validations.email.valid ? '' : 'invalid')
                }`}>
                  {validations.email.message}
                </p>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('login.passwordPlaceholder')}
                  required
                  className={`input-field ${validations.password.valid ? 'valid' : formData.password ? 'invalid' : ''}`}
                />
                {formData.password && <div className="password-requirements">
                  <p className={formData.password.length >= 8 ? 'valid' : 'invalid'}>
                    {formData.password.length >= 8 ? t('signup.password.lengthValid') : t('signup.password.length')}
                  </p>
                  <p className={/[a-z]/.test(formData.password) ? 'valid' : 'invalid'}>
                    {/[a-z]/.test(formData.password) ? t('signup.password.lowercaseValid') : t('signup.password.lowercase')}
                  </p>
                  <p className={/[A-Z]/.test(formData.password) ? 'valid' : 'invalid'}>
                    {/[A-Z]/.test(formData.password) ? t('signup.password.uppercaseValid') : t('signup.password.uppercase')}
                  </p>
                  <p className={/\d/.test(formData.password) ? 'valid' : 'invalid'}>
                    {/\d/.test(formData.password) ? t('signup.password.numberValid') : t('signup.password.number')}
                  </p>
                  <p className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : 'invalid'}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? t('signup.password.specialValid') : t('signup.password.special')}
                  </p>
                </div>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                  required
                  className={`input-field ${validations.confirmPassword.valid ? 'valid' : formData.confirmPassword ? 'invalid' : ''}`}
                />
                {formData.confirmPassword && <p className={`validation-message ${validations.confirmPassword.valid ? 'valid' : 'invalid'}`}>
                  {validations.confirmPassword.message}
                </p>}
              </div>

              {error && <p className="error-message">{error}</p>}
              
              <button 
                type="submit" 
                className="signup-button"
                disabled={
                  isLoading ||
                  !formData.username || 
                  !formData.email || 
                  !formData.password || 
                  !formData.confirmPassword ||
                  !validations.username.valid || 
                  !validations.password.valid || 
                  !validations.confirmPassword.valid ||
                  (!validations.email.checked || !validations.email.valid)
                }
              >
                {isLoading ? (
                  <div className="button-spinner-container">
                    <div className="button-spinner"></div>
                    <span>{t('common.loading')}</span>
                  </div>
                ) : t('common.signup')}
              </button>
            </form>
            
            <div className="additional-links">
              <p className="login-link">
                {t('signup.alreadyHaveAccount')} <Link to="/login">{t('signup.loginHere')}</Link>
              </p>
              <button 
                className="back-button" 
                onClick={handleBackToAgreements}
              >
                {t('signup.backToAgreements')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;