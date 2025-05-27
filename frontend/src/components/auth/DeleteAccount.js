import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import '../../DeleteAccount.css';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/me');
        setUserData(response.data);
        console.log("사용자 정보 로드됨:", response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('사용자 정보를 불러올 수 없습니다.');
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 확인 텍스트 검증
    if (confirmText !== '계정삭제확인') {
      setError('확인 텍스트가 올바르지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 일반 로그인/소셜 로그인 구분
      const isSocialUser = userData?.loginType === 1;
      console.log("소셜 로그인 사용자:", isSocialUser);
      console.log("로그인 타입:", userData?.loginType);
      
      // API 호출 방식을 소셜 로그인에 따라 다르게 처리
      if (isSocialUser) {
        // 소셜 로그인 사용자는 isSocialLogin 플래그만 전송
        await api({
          method: 'delete',
          url: '/api/users/delete-account',
          data: { isSocialLogin: true }
        });
      } else {
        // 일반 로그인 사용자는 비밀번호 포함
        await api({
          method: 'delete',
          url: '/api/users/delete-account',
          data: { password }
        });
      }
      
      // 로그아웃 처리
      logout();
      
      // 홈페이지로 리다이렉트
      navigate('/', { 
        state: { message: '계정이 성공적으로 삭제되었습니다.' } 
      });
    } catch (error) {
      console.error('계정 삭제 오류:', error);
      setError(error.response?.data || '계정 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingUserData) {
    return (
      <div className="delete-account-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>사용자 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  // 소셜 로그인 사용자 여부 확인
  const isSocialUser = userData?.loginType === 1;
  console.log("렌더링 시 소셜 로그인 확인:", isSocialUser);

  return (
    <div className="delete-account-container">
      <div className="delete-account-card">
        <div className="card-header">
          <button 
            onClick={() => navigate('/profile')} 
            className="back-button"
          >
            <FaArrowLeft /> 프로필로 돌아가기
          </button>
          <h2>계정 삭제</h2>
        </div>
        
        <div className="warning-box">
          <FaExclamationTriangle className="warning-icon" />
          <div className="warning-text">
            <h3>경고: 이 작업은 되돌릴 수 없습니다</h3>
            <p>계정을 삭제하면 다음과 같은 데이터가 영구적으로 제거됩니다:</p>
            <ul>
              <li>모든 개인 정보</li>
              <li>학습 기록 및 진행 상황</li>
              <li>구독 정보</li>
            </ul>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="delete-account-form">
          {/* 소셜 로그인 사용자가 아닐 때만 비밀번호 입력 필드 표시 */}
          {!isSocialUser && (
            <div className="form-group">
              <label htmlFor="password">현재 비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                required={!isSocialUser}
                className="form-input"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="confirmText">
              계정을 삭제하려면 아래에 <strong>"계정삭제확인"</strong>을 입력하세요
            </label>
            <input
              type="text"
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="계정삭제확인"
              required
              className="form-input"
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="button-group">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="cancel-button"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || (!isSocialUser && !password) || confirmText !== '계정삭제확인'}
              className="delete-button"
            >
              {isLoading ? '처리 중...' : '계정 삭제'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;