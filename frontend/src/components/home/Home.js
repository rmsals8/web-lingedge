import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaComments, FaPenFancy, FaChartLine, FaCheck, FaCrown } from 'react-icons/fa';
import '../../Home.css';
import api from '../../utils/api';

const CharacterSet = ({ type }) => {
  const characterStyles = {
    korean: { skinColor: '#F5D0C5', clothesColor: '#4169E1', hair: '#000000' },
    english: { skinColor: '#F5CBA7', clothesColor: '#2ECC71', hair: '#A0522D' },
    japanese: { skinColor: '#FAE5D3', clothesColor: '#E74C3C', hair: '#000000' },
    chinese: { skinColor: '#FDEBD0', clothesColor: '#F39C12', hair: '#000000' },
    spanish: { skinColor: '#D6EAF8', clothesColor: '#8E44AD', hair: '#8B4513' },
    french: { skinColor: '#FCF3CF', clothesColor: '#3498DB', hair: '#B8860B' },
  };

  const style = characterStyles[type] || characterStyles.korean;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Human Character */}
      <circle cx="70" cy="60" r="40" fill={style.skinColor} /> {/* Head */}
      <rect x="30" y="100" width="80" height="80" fill={style.clothesColor} /> {/* Body */}
      <circle cx="55" cy="55" r="5" fill="#000000" /> {/* Left eye */}
      <circle cx="85" cy="55" r="5" fill="#000000" /> {/* Right eye */}
      <path d="M60 70 Q70 80 80 70" stroke="#000000" strokeWidth="3" fill="none" /> {/* Smile */}
      <path d="M40 40 Q70 20 100 40" stroke={style.hair} strokeWidth="10" fill="none" /> {/* Hair */}

      {/* Robot */}
      <rect x="130" y="80" width="50" height="70" rx="10" fill="#B0E0E6" /> {/* Robot body */}
      <circle cx="145" cy="100" r="5" fill="#4A4A4A" /> {/* Robot left eye */}
      <circle cx="165" cy="100" r="5" fill="#4A4A4A" /> {/* Robot right eye */}
      <rect x="150" y="120" width="10" height="3" fill="#4A4A4A" /> {/* Robot mouth */}
      <line x1="140" y1="150" x2="140" y2="180" stroke="#B0E0E6" strokeWidth="6" /> {/* Robot left leg */}
      <line x1="170" y1="150" x2="170" y2="180" stroke="#B0E0E6" strokeWidth="6" /> {/* Robot right leg */}
    </svg>
  );
};

const LanguageElement = ({ type }) => {
  const elements = {
    korean: ['ㄱ', 'ㄴ', 'ㄷ', 'ㅏ', 'ㅑ', 'ㅓ'],
    english: ['A', 'B', 'C', 'X', 'Y', 'Z'],
    japanese: ['あ', 'い', 'う', '漢', '字'],
    chinese: ['你', '好', '世', '界'],
    spanish: ['¡', 'Ñ', '¿', 'Hola'],
    french: ['ç', 'é', 'è', 'ê', 'ë'],
  };

  return (
    <div className="language-element">
      {elements[type].map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // 구독 상태 체크 추가
  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          setLoadingSubscription(true);
          const response = await api.get('/api/users/me');
          
          // 구독 활성화 여부 확인
          const isPremium = response.data.isPremium === true;
          const hasActiveSubscription = 
            response.data.subscription && 
            (response.data.subscription.status === 'active' || 
             response.data.subscription.isPremium === true);
          
          setIsSubscribed(isPremium || hasActiveSubscription);
          console.log('구독 상태 확인:', isPremium ? '프리미엄' : '무료');
        } catch (err) {
          console.error('사용자 정보 로드 오류:', err);
          setIsSubscribed(false);
        } finally {
          setLoadingSubscription(false);
        }
      } else {
        setIsSubscribed(false);
        setLoadingSubscription(false);
      }
    };

    checkSubscription();
  }, [user]);

  // 업그레이드 버튼 클릭 핸들러
  const handleUpgradeClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/subscription');
    }
  };

  const carouselItems = [
    { type: 'Korean', text: t('home.carouselKorean') },
    { type: 'English', text: t('home.carouselEnglish') },
    { type: 'Japanese', text: t('home.carouselJapanese') },
    { type: 'Chinese', text: t('home.carouselChinese') },
    { type: 'Spanish', text: t('home.carouselSpanish') },
    { type: 'French', text: t('home.carouselFrench') },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="animated-text">{t('home.welcome').replace('LinguaLeap', 'LingEdge')}</h1>
        <p>{t('home.subtitle').replace('LinguaLeap', 'LingEdge')}</p>
        <div className="carousel">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
            >
              <div className={`visual-frame ${index % 2 === 0 ? 'frame-1' : 'frame-2'}`}>
                <CharacterSet type={item.type.toLowerCase()} />
                <LanguageElement type={item.type.toLowerCase()} />
              </div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        {!user && (
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">{t('home.startJourney')}</Link>
            <Link to="/login" className="cta-button secondary">{t('home.continueLearning')}</Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <FaComments className="feature-icon" />
          <h2>{t('home.featureChat')}</h2>
          <p>{t('home.featureChatDesc')}</p>
        </div>
        <div className="feature-card">
          <FaPenFancy className="feature-icon" />
          <h2>{t('home.featureWriting')}</h2>
          <p>{t('home.featureWritingDesc')}</p>
        </div>
        <div className="feature-card">
          <FaChartLine className="feature-icon" />
          <h2>{t('home.featureLearning')}</h2>
          <p>{t('home.featureLearningDesc')}</p>
        </div>
      </div>
      
      {/* 수정된 요금제 섹션 */}
      <div className="pricing-section">
        <h2 className="pricing-title">{t('pricing.title')}</h2>
        <p className="pricing-subtitle">{t('pricing.subtitle')}</p>
        
        <div className="pricing-cards">
          {/* Free 플랜 - 시작하기 버튼 제거 */}
          <div className="pricing-card">
            <h3 className="pricing-card-title">{t('pricing.free')}</h3>
            <div className="pricing-price">
              <span className="price-value">$0.00</span>
              <span className="price-period">{t('pricing.perMonth')}</span>
            </div>
            
            <ul className="pricing-features">
              <li>
                <FaCheck className="feature-check" />
                <span> {t('pricing.dailyLimit', { count: 3 })}</span>
              </li>
              <li>
                <FaCheck className="feature-check" />
                <span>{t('pricing.basicConversation')}</span>
              </li>
              <li>
                <FaCheck className="feature-check" />
                <span>{t('pricing.oneTemplate')}</span>
              </li>
              <li>
                <FaCheck className="feature-check" />
                <span> {t('pricing.limitedVocabulary', { count: 100 })}</span>
              </li>
          
            </ul>
            
            {/* 시작하기 버튼 제거 */}
          </div>
          
          {/* Pro 플랜 */}
          <div className="pricing-card highlighted">
            <div className="popular-tag">{t('pricing.popular')}</div>
            <h3 className="pricing-card-title">{t('pricing.pro')}</h3>
            <div className="pricing-price">
              <span className="price-value">$5.00</span>
              <span className="price-period">{t('pricing.perMonth')}</span>
            </div>
            
            <ul className="pricing-features">
              <li>
                <FaCheck className="feature-check" />
                <span> {t('pricing.dailyLimit', { count: 100 })}</span>
              </li>
              <li>
                <FaCheck className="feature-check" />
                <span>{t('pricing.allConversations')}</span>
              </li>
              <li>
                <FaCheck className="feature-check" />
                <span>{t('pricing.unlimitedTemplates')}</span>
              </li>
              <li>
                <FaCheck className="feature-check" />
                <span>{t('pricing.unlimitedVocabulary')}</span>
              </li>
             
            </ul>

            {/* 구독 상태에 따라 다른 버튼 표시 */}
            {loadingSubscription ? (
              <div className="loading-spinner-small"></div>
            ) : isSubscribed ? (
              <div className="premium-badge">
                <FaCrown className="premium-icon" />
                <span>{t('pricing.premiumUser')}</span>
              </div>
            ) : (
              <button 
                className="pricing-btn highlighted-btn"
                onClick={handleUpgradeClick}
              >
                {t('pricing.upgrade')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;