import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import './i18n';
import { FaChevronDown } from 'react-icons/fa';
import { HelmetProvider } from 'react-helmet-async'; // React-Helmet-Async 추가

// 기존 컴포넌트 임포트

import QuizGenerator from './components/quiz/QuizGenerator';
import QuizList from './components/quiz/QuizList';
import QuizDetail from './components/quiz/QuizDetail';
import TakeQuiz from './components/quiz/TakeQuiz';
import QuizResults from './components/quiz/QuizResults';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import GoogleLoginButton from './components/auth/GoogleLoginButton';
import ChatInterface from './components/writing/ChatInterface';
import WritingTemplate from './components/writing/WritingTemplate';
import SubscriptionPage from './components/subscription/SubscriptionPage';
import UserProfile from './components/profile/UserProfile';
import Home from './components/home/Home';
import FindCredentials from './components/auth/FindCredentials';
import ResetPasswordRequest from './components/auth/ResetPasswordRequest';
import ChangePassword from './components/auth/ChangePassword';
import EmailVerification from './components/auth/EmailVerification';
import LanguageSelector from './components/common/LanguageSelector';
import SignUpMethodSelector from './components/auth/SignUpMethodSelector';
import AgreementPage from './components/auth/AgreementPage';
import DeleteAccount from './components/auth/DeleteAccount';
import Monitoring from './components/admin/Monitoring';
// 영작 연습 컴포넌트 임포트
import WritingExerciseList from './components/writing/WritingExerciseList';
import WritingExerciseGenerator from './components/writing/WritingExerciseGenerator';

// 문의 관련 스크린 임포트
import InquiryListScreen from './components/screens/inquiry/InquiryListScreen';
import InquiryCreateScreen from './components/screens/inquiry/InquiryCreateScreen';
import InquiryDetailScreen from './components/screens/inquiry/InquiryDetailScreen';

// 관리자 스크린 임포트
import AdminDashboardScreen from './components/screens/admin/AdminDashboardScreen';
import AdminInquiryListScreen from './components/screens/admin/AdminInquiryListScreen';
import AdminInquiryDetailScreen from './components/screens/admin/AdminInquiryDetailScreen';
import AdminLayout from './components/admin/AdminLayout';
// 스크립트 번역기 컴포넌트 임포트
import ScriptTranslator from './components/script/ScriptTranslator';
import ScriptResult from './components/script/ScriptResult';

import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// 사용자 인증이 필요한 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  const { t } = useTranslation();
  
  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// 관리자 권한이 필요한 라우트 컴포넌트
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = React.useContext(AuthContext);
  const { t } = useTranslation();
  
  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // 관리자 권한 확인
  return isAdmin() ? children : <Navigate to="/" />;
};

function AppContent() {
  const { loading: authLoading, checkAuthStatus, user, logout, isAdmin } = React.useContext(AuthContext);
  const [pageLoading, setPageLoading] = React.useState(false);
  const [writingDropdownOpen, setWritingDropdownOpen] = React.useState(false);
  const [chatDropdownOpen, setChatDropdownOpen] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // 현재 경로에 따라 활성 메뉴 클래스 지정 함수
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  // Writing 드롭다운 토글
  const toggleWritingDropdown = () => {
    setWritingDropdownOpen(!writingDropdownOpen);
    // 채팅 드롭다운이 열려있으면 닫기
    if (chatDropdownOpen) setChatDropdownOpen(false);
  };
  
  // 채팅 드롭다운 토글
  const toggleChatDropdown = () => {
    setChatDropdownOpen(!chatDropdownOpen);
    // writing 드롭다운이 열려있으면 닫기
    if (writingDropdownOpen) setWritingDropdownOpen(false);
  };

  React.useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  React.useEffect(() => {
    setPageLoading(true);
    
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (authLoading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <span className="logo-text">LingEdge</span>
        </Link>
        <div className="nav-links">
          <LanguageSelector />
          {user ? (
            <>
              {/* 대화 드롭다운 메뉴 */}
              <div className="dropdown-container">
                <button 
                  className={`nav-button dropdown-toggle ${isActive('/chat') || isActive('/script') ? 'active' : ''}`} 
                  onClick={toggleChatDropdown}
                >
                  {t('common.chat')} <FaChevronDown />
                </button>
                {chatDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/chat" 
                      className="dropdown-item"
                      onClick={() => setChatDropdownOpen(false)}
                    >
                      {t('chat.title')}
                    </Link>
                    <Link 
                      to="/script" 
                      className="dropdown-item"
                      onClick={() => setChatDropdownOpen(false)}
                    >
                      {t('chat.scriptTranslator')}
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Writing 드롭다운 메뉴 */}
              <div className="dropdown-container">
                <button 
                  className={`nav-button dropdown-toggle ${isActive('/writing') || isActive('/writing-exercises') ? 'active' : ''}`} 
                  onClick={toggleWritingDropdown}
                >
                  {t('common.writing')} <FaChevronDown />
                </button>
                {writingDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/writing" 
                      className="dropdown-item"
                      onClick={() => setWritingDropdownOpen(false)}
                    >
                      {t('writing.handwriting')}
                    </Link>
                    <Link 
                      to="/writing-exercises" 
                      className="dropdown-item"
                      onClick={() => setWritingDropdownOpen(false)}
                    >
                      {t('writing.composition')}
                    </Link>
                  </div>
                )}
              </div>
              
              {/* 퀴즈 메뉴 */}
              <Link to="/quizzes" className={`nav-button ${isActive('/quizzes')}`}>
                {t('common.quizzes')}
              </Link>
              
              <Link to="/inquiries" className={`nav-button ${isActive('/inquiries')}`}>{t('common.inquiry')}</Link>
              <Link to="/profile" className={`nav-button ${isActive('/profile')}`}>{t('common.profile')}</Link>
              
              {/* 관리자 여부에 따라 관리자 버튼 표시 */}
              {isAdmin() && (
                <Link to="/admin/dashboard" className={`nav-button admin-button ${isActive('/admin')}`}>
                  {t('common.admin')}
                </Link>
              )}
              
              <button onClick={logout} className="nav-button logout">{t('common.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-button login ${isActive('/login')}`}>{t('common.login')}</Link>
              <Link to="/signup" className={`nav-button signup ${isActive('/signup')}`}>{t('common.signup')}</Link>
            </>
          )}
        </div>
      </nav>
      
      {pageLoading ? (
        <div className="page-loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="page-container">
          <Routes>
            {/* 기존 라우트 */}
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
            <Route path="/writing" element={<ProtectedRoute><WritingTemplate /></ProtectedRoute>} />
            <Route path="/signup" element={<SignUpMethodSelector />} />
            <Route path="/agreements" element={<AgreementPage />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/google-login" element={<GoogleLoginButton />} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/delete-account" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
            <Route path="/find-credentials" element={<FindCredentials />} />
            <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/verify-email" element={<EmailVerification />} />
            
            {/* 영작 연습 라우트 */}
            <Route path="/writing-exercises" element={<ProtectedRoute><WritingExerciseList /></ProtectedRoute>} />
            <Route path="/writing-exercises/create" element={<ProtectedRoute><WritingExerciseGenerator /></ProtectedRoute>} />
            
            {/* 문의 관련 라우트 */}
            <Route path="/inquiries" element={<ProtectedRoute><InquiryListScreen /></ProtectedRoute>} />
            <Route path="/inquiries/new" element={<ProtectedRoute><InquiryCreateScreen /></ProtectedRoute>} />
            <Route path="/inquiries/:id" element={<ProtectedRoute><InquiryDetailScreen /></ProtectedRoute>} />
            
            {/* 관리자 라우트 - 관리자 권한 체크 적용 */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardScreen /></AdminRoute>} />
            <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiryListScreen /></AdminRoute>} />
            <Route path="/admin/inquiries/:id" element={<AdminRoute><AdminInquiryDetailScreen /></AdminRoute>} />
            <Route path="/admin/monitoring" element={<AdminLayout><Monitoring /></AdminLayout>} />
            
            {/* 퀴즈 관련 라우트 추가 */}
            <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
            <Route path="/quizzes/create" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
            <Route path="/quizzes/:quizId" element={<ProtectedRoute><QuizDetail /></ProtectedRoute>} />
            <Route path="/quizzes/:quizId/take" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
            <Route path="/quizzes/:quizId/results/:attemptId" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
            
            {/* 스크립트 번역기 라우트 추가 */}
            <Route path="/script" element={<ProtectedRoute><ScriptTranslator /></ProtectedRoute>} />
            <Route path="/script/result/:scriptId" element={<ProtectedRoute><ScriptResult /></ProtectedRoute>} />
          </Routes>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <HelmetProvider> {/* HelmetProvider 추가 */}
          <Elements stripe={stripePromise}>
            <Router>
              <AppContent />
            </Router>
          </Elements>
        </HelmetProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;