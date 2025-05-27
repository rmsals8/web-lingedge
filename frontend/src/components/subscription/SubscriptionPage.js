import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../SubscriptionPage.css';
import api from '../../utils/api';

const SubscriptionPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('free'); // 기본값을 'free'로 설정
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [userSubscription, setUserSubscription] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 구독 상태 확인 - 새로 추가된 부분
  useEffect(() => {
    // 사용자 정보 및 구독 상태 가져오기
    const checkSubscription = async () => {
      try {
        setInitialLoading(true);
        const response = await api.get('/api/users/me');
        
        // 구독 활성화 여부 확인
        const isPremium = response.data.isPremium === true;
        const hasActiveSubscription = 
          response.data.subscription && 
          (response.data.subscription.status === 'active' || 
           response.data.subscription.isPremium === true);
        
        setIsSubscribed(isPremium || hasActiveSubscription);
        setUserSubscription(response.data.subscription);
        console.log('구독 상태 확인:', isPremium ? '프리미엄' : '무료');
      } catch (err) {
        console.error('사용자 정보 로드 오류:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    checkSubscription();
  }, []);

  // 페이팔 스크립트 로드 - 프로 플랜이 선택된 경우에만 실행 (수정된 부분)
  useEffect(() => {
    // 이미 구독 중이거나 무료 플랜이 선택된 경우 PayPal 스크립트를 로드하지 않음
    if (isSubscribed || selectedPlan === 'free') {
      // 이미 페이팔 버튼이 있다면 컨테이너를 비움
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }
      return;
    }

    // 현재 언어 가져오기
    const currentLanguage = i18n.language;
    // PayPal 지원 언어 맵핑
    const paypalLocale = {
      'en': 'en_US',
      'ko': 'ko_KR',
      'es': 'es_ES',
      'pt-BR': 'pt_BR',
      'ar': 'ar_EG',
      'id': 'id_ID',
      'ms': 'ms_MY',
      'th': 'th_TH'
    };
    
    // 지원하는 언어가 아닌 경우 기본값으로 en_US 사용
    const locale = paypalLocale[currentLanguage] || 'en_US';

    // 프로 플랜이 선택된 경우에만 PayPal 스크립트 로드
    if (!document.querySelector('[data-pp-id]')) {
      const script = document.createElement('script');
     // 샌드박스 환경 (테스트용)
     script.src = `https://www.paypal.com/sdk/js?client-id=Ac88GDN05f4OTyln4S2nINiMP0VfNqvJhTnQXamgIEjmJZSX-KBmH7celo-8lBByDJ3rqszsYfEI9n31&currency=USD&components=buttons&locale=${locale}`;
      
     // 실제 환경으로 전환 시에는 아래 주석을 해제하고 위 코드를 주석 처리
     // script.src = `https://www.paypal.com/sdk/js?client-id=여기에_실제_라이브_클라이언트_ID를_넣으세요&currency=USD&components=buttons&locale=${locale}`;
      script.setAttribute('data-pp-id', 'pp-script');
      script.async = true;
      script.onload = () => initializePayPal();
      document.body.appendChild(script);
    } else {
      // 스크립트가 이미 로드된 경우 초기화만 실행
      initializePayPal();
    }

    return () => {
      // 클린업 함수
      const ppScript = document.querySelector('[data-pp-id="pp-script"]');
      if (ppScript && ppScript.parentNode) {
        ppScript.parentNode.removeChild(ppScript);
      }
    };
  }, [selectedPlan, isSubscribed, i18n.language]);

  const savePayPalSubscription = async (details) => {
    try {
      const response = await api.post('/api/paypal/create-subscription', {
        orderId: details.id,
        payerEmail: details.payer.email_address,
        amount: details.purchase_units[0].amount.value,
        currency: details.purchase_units[0].amount.currency_code,
        status: details.status,
        planType: 'pro', // 선택한 플랜 유형
        paymentDetails: details // 전체 결제 정보도 함께 전송
      });
      
      if (response.data) {
        console.log('구독 정보가 성공적으로 저장되었습니다:', response.data);
        
        // 결제 성공 메시지 표시
        setLoading(false);
        setPaymentStatus(t('pricing.paymentSuccessRedirect', { name: details.payer.name.given_name }));
        
        // 3초 후 프로필 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = '/profile';  // 프로필 페이지로 리다이렉트
        }, 1000);
      }
    } catch (error) {
      console.error('구독 정보 저장 실패:', error);
      setPaymentStatus(t('pricing.subscriptionSaveError'));
      setLoading(false);
    }
  };
  
  const initializePayPal = () => {
    if (window.paypal) {
      // 기존 페이팔 버튼 제거하여 중복 렌더링 방지
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }

      setTimeout(() => {
        // 결제 버튼 렌더링 (프로 플랜인 경우에만)
        if (selectedPlan === 'pro') {
          window.paypal.Buttons({
            // Sandbox 환경 사용
            env: 'sandbox',
            
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal' // 'pay' 대신 'paypal'로 변경하여 더 많은 언어에서 지원되도록 함
            },
            
            createOrder: function(data, actions) {
              // 결제 금액 설정 - 무조건 $5.00 (무료 플랜은 이 코드가 실행되지 않음)
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '5.00',
                    currency_code: 'USD'
                  },
                  description: t('pricing.proPlanDescription')
                }]
              });
            },
            
            onApprove: function(data, actions) {
              setLoading(true);
              setPaymentStatus(t('pricing.processingPayment'));
              
              return actions.order.capture().then(function(details) {
                console.log('결제 완료', details);
                
                // PayPal 주문 ID와 결제 정보를 서버에 전송
                savePayPalSubscription(details);
                
                // 참고: savePayPalSubscription 함수에서 setLoading(false)와 
                // 성공 메시지 표시 및 리다이렉트를 처리하므로 여기서는 제거
              });
            },
            
            onError: function(err) {
              console.error('결제 오류:', err);
              setLoading(false);
              setPaymentStatus(t('pricing.paymentError'));
              
              // 3초 후 메시지 제거
              setTimeout(() => {
                setPaymentStatus('');
              }, 3000);
            }
          }).render('#paypal-button-container');
        }
      }, 1000);
    }
  };

  // 초기 로딩 중 표시
  if (initialLoading) {
    return (
      <div className="subscription-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // 이미 구독 중인 경우 다른 UI 표시 (새로 추가된 부분)
  if (isSubscribed) {
    return (
      <div className="subscription-container">
        <h1>{t('pricing.subscriptionInfo')}</h1>
        <div className="subscription-active-card">
          <div className="subscription-status">
            <div className="status-icon">✓</div>
            <h2>{t('pricing.premiumActive')}</h2>
          </div>
          <p>{t('pricing.alreadySubscribed')}</p>
          
          {userSubscription && (
            <div className="subscription-details">
              <p>
                <strong>{t('pricing.status')}:</strong> {userSubscription.status === 'active' ? t('pricing.active') : userSubscription.status}
              </p>
              {userSubscription.subscriptionEndDate && (
                <p>
                  <strong>{t('profile.subscriptionExpires')}:</strong> {new Date(userSubscription.subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          
        </div>
      </div>
    );
  }

  // 기존 UI는 그대로 유지하되 텍스트만 번역
  return (
    <div className="subscription-container">
      <h1>{t('pricing.title')}</h1>
      
      <div className="plans-container">
        {/* Free Plan - 선택 버튼 제거 */}
        <div 
          className={`plan-card ${selectedPlan === 'free' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('free')}
        >
          <h2>{t('pricing.free')}</h2>
          <div className="price">$0.00<span>/{t('pricing.perMonth')}</span></div>
          <ul className="features">
            <li>✓ {t('pricing.dailyLimit', { count: 1000 })}</li>
            <li>✓ {t('pricing.languages', { count: 3 })}</li>
            <li>✓ {t('pricing.oneTemplate')}</li>
            <li>✓ {t('pricing.limitedVocabulary', { count: 100 })}</li>
            <li>✓ {t('pricing.oneUser')}</li>
          </ul>
          {selectedPlan === 'free' && (
            <div className="plan-selected-text">{t('common.selected')}</div>
          )}
        </div>
        
        {/* Pro Plan */}
        <div 
          className={`plan-card pro ${selectedPlan === 'pro' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="popular-badge">{t('pricing.popular')}</div>
          <h2>{t('pricing.pro')}</h2>
          <div className="price">$5.00<span>/{t('pricing.perMonth')}</span></div>
          <ul className="features">
            <li>✓ {t('pricing.dailyLimit', { count: 50000 })}</li>
            <li>✓ {t('pricing.languages', { count: 15 })}</li>
            <li>✓ {t('pricing.unlimitedTemplates')}</li>
            <li>✓ {t('pricing.unlimitedVocabulary')}</li>
            <li>✓ {t('pricing.fiveUsers')}</li>
            <li>✓ {t('common.prioritySupport')}</li>
            <li>✓ API {t('common.access')}</li>
          </ul>
          <button 
            className={`select-plan-button ${selectedPlan === 'pro' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('pro')}
          >
            {selectedPlan === 'pro' ? t('common.selected') : t('pricing.selectPlan')}
          </button>
        </div>
      </div>
      
      {/* 결제 섹션 - 프로 플랜이 선택된 경우에만 표시 */}
      {selectedPlan === 'pro' && (
        <div className="payment-section">
          <h2>{t('pricing.paymentMethod')}</h2>
          <p className="selected-plan-info">
            {t('pricing.selectedPlan')}: <strong>{t('pricing.pro')}</strong> ($5.00/{t('pricing.perMonth')})
          </p>
          
          {/* 페이팔 버튼 컨테이너 - 중앙 정렬 */}
          <div className="payment-option">
            <h3>{t('pricing.pay')}</h3>
            <p className="payment-description">
              {t('pricing.paymentDescription')}
            </p>
            <div id="paypal-button-container"></div>
          </div>
        </div>
      )}
      
      {/* 로딩 표시 및 상태 메시지 */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>{t('pricing.processingPayment')}</p>
        </div>
      )}
      
      {paymentStatus && (
        <div className="payment-status">
          <p>{paymentStatus}</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;