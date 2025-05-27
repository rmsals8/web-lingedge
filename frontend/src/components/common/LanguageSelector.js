// src/components/LanguageSelector.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../LanguageSelector.css';

function LanguageSelector() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    
    // 언어 설정을 localStorage에 저장하여 다음에 방문했을 때도 적용됩니다
    localStorage.setItem('language', language);
  };

  // 언어 이름을 해당 언어로 표시하는 객체
  const languageNames = {
    en: 'English',
    ko: '한국어',
    ar: 'العربية',
    id: 'Bahasa Indonesia',
    ms: 'Bahasa Melayu',
    th: 'ภาษาไทย',
    es: 'Español',
    'pt-BR': 'Português (Brasil)'
  };

  return (
    <div className="language-selector">
      <select 
        value={i18n.language} 
        onChange={changeLanguage}
        className="language-dropdown"
      >
        <option value="en">{languageNames.en}</option>
        <option value="ko">{languageNames.ko}</option>
        <option value="ar">{languageNames.ar}</option>
        <option value="id">{languageNames.id}</option>
        <option value="ms">{languageNames.ms}</option>
        <option value="th">{languageNames.th}</option>
        <option value="es">{languageNames.es}</option>
        <option value="pt-BR">{languageNames['pt-BR']}</option>
      </select>
    </div>
  );
}

export default LanguageSelector;