import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  FaUser, FaEnvelope, FaCrown, FaCalendarAlt, 
  FaKey, FaCreditCard, FaUserMinus 
} from 'react-icons/fa';
import '../../UserProfile.css';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import UserFiles from './UserFiles'; // UserFiles 컴포넌트 임포트

const UserProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // 취소 확인 상태 추가
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUser(response.data);
    } catch (err) {
      setError(t('profile.fetchError') || '사용자 정보를 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users/verify-password', { password: currentPassword });
      navigate('/change-password');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(t('profile.incorrectPassword') || '비밀번호가 일치하지 않습니다.');
      } else {
        setError(t('profile.genericError') || '오류가 발생했습니다.');
      }
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubscription = () => {
    if (user.isPremium) {
      // 구독 취소 전 확인 대화상자 표시
      setShowCancelConfirm(true);
    } else {
      // 구독 페이지로 이동
      navigate('/subscription');
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true); // 로딩 상태 활성화
      await api.post('/api/paypal/cancel');
      // 구독 취소 후 사용자 데이터 새로고침
      fetchUserData();
      setShowCancelConfirm(false); // 확인 대화상자 닫기
    } catch (error) {
      setError(t('profile.subscriptionCancelError') || '구독 취소 중 오류가 발생했습니다.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 구독 취소 확인 취소
  const handleCancelNo = () => {
    setShowCancelConfirm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );

  if (error) return (
    <div className="error-message">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="user-profile-container">
      <h1 className="profile-title">{t('profile.title') || '내 프로필'}</h1>
      {user && (
        <div className="profile-card">
          <div className="profile-header">
            <FaUser className="profile-icon" />
            <h2>{user.username}</h2>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <FaCrown className="info-icon" />
              <p>{user.isPremium ? (t('profile.premiumUser') || '프리미엄 사용자') : (t('profile.freeUser') || '무료 사용자')}</p>
            </div>
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <p>{t('profile.subscriptionStatus') || '구독 상태'}: {user.subscriptionStatus || (t('profile.notSubscribed') || '구독하지 않음')}</p>
            </div>
            {user.subscriptionEndDate && (
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <p>{t('profile.subscriptionExpires') || '구독 만료일'}: {new Date(user.subscriptionEndDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div className="profile-actions">
            <button
              className="profile-button"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              <FaKey /> {t('profile.changePassword') || '비밀번호 변경'}
            </button>
            <button
              className="profile-button"
              onClick={handleSubscription}
            >
              <FaCreditCard /> {user.isPremium ? (t('profile.cancelSubscription') || '구독 취소') : (t('profile.subscribe') || '구독하기')}
            </button>
            <button
              className="profile-button logout-button"
              onClick={handleLogout}
            >
              {t('profile.logout') || '로그아웃'}
            </button>
          </div>
          
          {/* 구독 취소 확인 대화상자 */}
          {showCancelConfirm && (
            <div className="confirm-dialog">
              <div className="confirm-dialog-content">
                <h3>{t('profile.cancelConfirmTitle') || '구독 취소 확인'}</h3>
                <p>{t('profile.cancelConfirmMessage') || '정말로 구독을 취소하시겠습니까? 취소 시 프리미엄 기능을 사용할 수 없게 됩니다.'}</p>
                <div className="confirm-buttons">
                  <button onClick={handleCancelNo} className="cancel-button">
                    {t('common.no') || '아니오'}
                  </button>
                  <button onClick={cancelSubscription} className="confirm-button">
                    {t('common.yes') || '예'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="password-form">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('profile.enterCurrentPassword') || '현재 비밀번호 입력'}
                required
                className="password-input"
              />
              <button type="submit" className="profile-button">{t('profile.verifyAndChange') || '인증 및 변경'}</button>
            </form>
          )}
          
          {/* 내 파일 섹션 */}
          <div className="profile-section">
            <h2>{t('profile.myFiles') || '내 파일'}</h2>
            <UserFiles />
          </div>
          
          {/* 회원 탈퇴 섹션 */}
          <div className="danger-zone">
            <h3>{t('profile.dangerZone') || '위험 구역'}</h3>
            <p>{t('profile.deleteAccountWarning') || '계정을 삭제하면 모든 데이터가 영구적으로 제거되며 복구할 수 없습니다.'}</p>
            <Link to="/delete-account" className="delete-account-button">
              <FaUserMinus /> {t('profile.deleteAccount') || '계정 삭제'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;