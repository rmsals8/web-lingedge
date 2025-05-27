// src/components/ScriptTranslator.js 수정

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import '../../ScriptTranslator.css';

const ScriptTranslator = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [script, setScript] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState('Korean');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 최대 글자수 제한
  const MAX_CHARS = 2000;
  
  // 지원되는 번역 언어 목록
  const supportedLanguages = [
    { value: 'Korean', label: t('languages.korean') }, 
    { value: 'English', label: t('languages.english') },
    { value: 'Japanese', label: t('languages.japanese') },
    { value: 'Chinese', label: t('languages.chinese') },
    { value: 'Spanish', label: t('languages.spanish') },
    { value: 'French', label: t('languages.french') },
    { value: 'German', label: t('languages.german') }
  ];
  
  // 스크립트 내용 변경 핸들러
  const handleScriptChange = (e) => {
    const newValue = e.target.value;
    // 최대 글자수 제한 적용
    if (newValue.length <= MAX_CHARS) {
      setScript(newValue);
    }
  };
  
  // 남은 글자수 계산
  const remainingChars = MAX_CHARS - script.length;
  
  // 스크립트 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!script.trim()) {
      setError(t('script.emptyScriptError'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/script/translate', {
        script,
        translationLanguage
      });
      
      // 성공 시 결과 페이지로 이동
      navigate(`/script/result/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || t('script.translationError'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="script-translator-container">
      <h1 className="script-translator-title">{t('script.title')}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="script-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="script">
            {t('script.enterScript')}  
            <span className={`char-counter ${remainingChars < 100 ? 'warning' : ''}`}>
               {remainingChars} / {MAX_CHARS}
            </span>
          </label>
          <textarea
            id="script"
            className="script-textarea"
            value={script}
            onChange={handleScriptChange}
            placeholder={t('script.scriptPlaceholder')}
            rows={10}
            maxLength={MAX_CHARS}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="translationLanguage">{t('script.translationLanguage')}</label>
          <select
            id="translationLanguage"
            className="language-select"
            value={translationLanguage}
            onChange={(e) => setTranslationLanguage(e.target.value)}
          >
            {supportedLanguages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/')}
          >
            {t('common.cancel')}
          </button>
          
          <button
            type="submit"
            className="translate-button"
            disabled={loading || script.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {t('common.processing')}
              </>
            ) : (
              t('script.translate')
            )}
          </button>
        </div>
      </form>
      
      <div className="info-section">
        <h3>{t('script.howItWorks')}</h3>
        <ul>
          <li>{t('script.feature1')}</li>
          <li>{t('script.feature2')}</li>
          <li>{t('script.feature3')}</li>
          <li>{t('script.feature4')}</li>
          <li>{t('script.feature5')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ScriptTranslator;