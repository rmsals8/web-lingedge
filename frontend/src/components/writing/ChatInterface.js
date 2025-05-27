import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '../../utils/pdfGenerator';
import { useTranslation } from 'react-i18next';
import '../../ChatInterface.css';

// 지원되는 언어 목록
const SUPPORTED_LANGUAGES = [
  { code: 'English', name: 'English', nativeName: '영어 (English)' },
  { code: 'Korean', name: 'Korean', nativeName: '한국어 (Korean)' },
  { code: 'Japanese', name: 'Japanese', nativeName: '일본어 (日本語)' },
  { code: 'Chinese', name: 'Chinese', nativeName: '중국어 (中文)' },
  { code: 'Spanish', name: 'Spanish', nativeName: '스페인어 (Español)' },
  { code: 'French', name: 'French', nativeName: '프랑스어 (Français)' },
  { code: 'German', name: 'German', nativeName: '독일어 (Deutsch)' },
  { code: 'Arabic', name: 'Arabic', nativeName: '아랍어 (العربية)' }
];

const ChatInterface = ({ updateUserData }) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showPdfLimitModal, setShowPdfLimitModal] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 브라우저 언어에 기반한 기본 번역 언어 설정
  const getUserPreferredLanguage = () => {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // 브라우저 언어와 일치하는 지원 언어 찾기
    const matchingLang = SUPPORTED_LANGUAGES.find(lang => 
      lang.code.toLowerCase() === langCode || 
      lang.name.toLowerCase() === langCode
    );
    
    return matchingLang ? matchingLang.code : 'Korean'; // 기본값으로 한국어
  };
  
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    learningLanguage: 'English',
    translationLanguage: getUserPreferredLanguage(),
    conversationLength: 'short'
  });
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  // 기본 성우 목록 (백엔드 연결 실패 시 사용)
  const defaultVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  const [voices, setVoices] = useState(defaultVoices);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isSavingPDF, setIsSavingPDF] = useState(false);
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const [vocabularyItems, setVocabularyItems] = useState([]);

  const MAX_TOPIC_LENGTH = 50;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchUserInfo();
      fetchAvailableVoices();
    }
  }, [user, loading, navigate]);

  // 어휘 목록을 파싱하는 함수
  useEffect(() => {
    if (response && response.vocabulary) {
      parseVocabulary(response.vocabulary);
    }
  }, [response]);

  // 어휘 목록을 파싱하는 함수
  const parseVocabulary = (vocabularyText) => {
    if (!vocabularyText) {
      setVocabularyItems([]);
      return;
    }

    const lines = vocabularyText.split('\n');
    const parsedItems = [];

    lines.forEach(line => {
      // 일반적인 포맷: "1. word | pronunciation | meaning"
      const pipeMatch = line.match(/(\d+)\.\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)/);
      if (pipeMatch) {
        // 발음과 의미가 같은 경우 처리
        const pronunciation = pipeMatch[3].trim();
        let meaning = pipeMatch[4].trim();
        
        // 발음과 의미가 같은 경우, 비어 있는 것으로 표시
        if (pronunciation === meaning) {
          meaning = ""; // 의미를 비워서 중복 방지
        }
        
        parsedItems.push({
          index: pipeMatch[1],
          word: pipeMatch[2].trim(),
          pronunciation: pronunciation,
          meaning: meaning
        });
        return;
      }

      // 다른 포맷도 처리 (필요시)
      const simpleMatch = line.match(/(\d+)\.\s*(.*?)\s*[-:]\s*(.*)/);
      if (simpleMatch) {
        parsedItems.push({
          index: simpleMatch[1],
          word: simpleMatch[2].trim(),
          pronunciation: '',
          meaning: simpleMatch[3].trim()
        });
      }
    });

    setVocabularyItems(parsedItems);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchAvailableVoices = async () => {
    try {
      const response = await api.get('/api/tts/voices');
      if (response.data && Array.isArray(response.data.voices) && response.data.voices.length > 0) {
        setVoices(response.data.voices);
      }
    } catch (error) {
      console.error('Error fetching available voices:', error);
      // 오류 발생 시 기본 성우 목록 사용 (이미 상태 초기값으로 설정됨)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'topic') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value.slice(0, MAX_TOPIC_LENGTH)
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await api.post('/bot/chat', formData);
      const responseData = result.data;
      
      if (!responseData.learningLanguage) {
        responseData.learningLanguage = formData.learningLanguage;
      }
      
      setResponse(responseData);
      if (updateUserData) {
        updateUserData();
      }
      fetchUserInfo();
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 403) {
        navigate('/login');
      } else {
        setResponse({ error: t('chat.fetchError') });
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const generateAudio = async () => {
    if (!response || !response.conversation) {
      alert(t('chat.generateFirst'));
      return;
    }
    setIsGeneratingAudio(true);
    try {
      // 선택한 성우 정보 추가
      const audioResponse = await api.post('/api/tts/generate', 
        { 
          text: response.conversation,
          voice: selectedVoice  // 선택한 성우 정보 전달
        },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([audioResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'conversation.mp3');
      document.body.appendChild(link);
      link.click();
      link.remove();
      fetchUserInfo();
    } catch (error) {
      console.error('Error generating audio:', error);
      alert(t('chat.audioError'));
    }
    setIsGeneratingAudio(false);
  };

  const handleGeneratePDF = async () => {
    if (!response) {
      alert(t('chat.generateFirst'));
      return;
    }
    
    setIsGeneratingPDF(true);
    
    try {
      const pdfData = {
        ...response,
        learningLanguage: response.learningLanguage || formData.learningLanguage,
        translationLanguage: response.translationLanguage || formData.translationLanguage
      };
      
      if (pdfData.vocabulary) {
        console.log("PDF 생성에 사용될 어휘 데이터:", pdfData.vocabulary);
        console.log("학습 언어:", pdfData.learningLanguage);
        console.log("번역 언어:", pdfData.translationLanguage);
      }
      
      const pdfResponse = await api.post('/api/pdf/generate', 
        pdfData,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'language_learning_session.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      fetchUserInfo();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('chat.pdfError'));
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // PDF 저장 버튼 클릭 핸들러
  const handleSavePDF = async () => {
    if (!response) {
      alert(t('chat.generateFirst'));
      return;
    }
    try {
      setIsSavingPDF(true);
      const pdfData = {
        ...response,
        learningLanguage: response.learningLanguage || formData.learningLanguage,
        translationLanguage: response.translationLanguage || formData.translationLanguage
      };
      
      const result = await api.post('/api/pdf/save', pdfData);
      
      // 서버 응답에 따라 다른 메시지 표시
      if (result.data.limitReached) {
        setShowPdfLimitModal(true);
      } else if (result.data.status === 'success') {
        alert(result.data.message || 'PDF가 저장되었습니다.');
      } else if (result.data.status === 'warning') {
        alert(result.data.message || '최대 저장 개수를 초과하여 오래된 파일이 삭제되었습니다.');
      } else {
        alert(t('chat.pdfSaveError') || 'PDF 저장 중 오류가 발생했습니다.');
      }
      
      fetchUserInfo();
    } catch (error) {
      console.error('Error saving PDF:', error);
      if (error.response && error.response.data && error.response.data.limitReached) {
        setShowPdfLimitModal(true);
      } else {
        alert(t('chat.pdfSaveError'));
      }
    } finally {
      setIsSavingPDF(false);
    }
  };

  const handleSaveAudio = async () => {
    if (!response || !response.conversation) {
      alert(t('chat.generateFirst') || '먼저 대화를 생성해주세요.');
      return;
    }
    try {
      setIsSavingAudio(true);
      const audioData = {
        text: response.conversation,
        voice: selectedVoice
      };
      
      const result = await api.post('/api/tts/save', audioData);
      
      // 한도 초과 확인
      if (result.data.limitReached) {
        setShowLimitModal(true);
      } else if (result.data.status === 'success') {
        alert(result.data.message || '오디오가 저장되었습니다.');
      } else {
        alert(t('chat.audioSaveError') || '오디오 저장 중 오류가 발생했습니다.');
      }
      
      fetchUserInfo();
    } catch (error) {
      console.error('Error saving audio:', error);
      if (error.response && error.response.data && error.response.data.limitReached) {
        setShowLimitModal(true);
      } else {
        alert(t('chat.audioSaveError') || '오디오 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSavingAudio(false);
    }
  };

  // 작업 중인지 확인하는 함수
  const isProcessing = () => {
    return isLoading || isGeneratingPDF || isGeneratingAudio || isSavingPDF || isSavingAudio;
  };

  if (loading) {
    return <div className="loader">{t('common.loading')}</div>;
  }

  if (!user) {
    return <div className="error-message">{t('common.loginRequired')}</div>;
  }

  // 단어장 테이블 스타일 (인라인 스타일 제거 - CSS로 이동)
  const tableContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    margin: '15px 0',
    overflow: 'auto'
  };

  const tableStyle = {
    width: 'auto', // auto로 변경하여 콘텐츠에 맞게 조정
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    margin: '0 auto'
  };

  const thStyle = {
    padding: '12px 15px',
    backgroundColor: '#f5f7fa',
    color: '#333',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'center', // 헤더 중앙 정렬
    borderBottom: '1px solid #e0e0e0'
  };

  const tdStyle = {
    padding: '12px 15px',
    textAlign: 'center', // 셀 내용 중앙 정렬
    borderBottom: '1px solid #e0e0e0'
  };

  const wordCellStyle = {
    ...tdStyle,
    fontWeight: '600',
    color: '#3498db'
  };

  return (
    <div className="chat-interface">
      <h1>{t('common.title')}</h1>
      {userInfo && (
        <div className="user-info-container">
          <div className="user-info">
            <p className="usage-info">
              <span className="usage-label">{t('chat.dailyUsage')}:</span> 
              <span className="usage-value">{userInfo.dailyUsageCount}/{userInfo.isPremium ? '100' : '3'}</span>
            </p>
            <p className="user-type">
              {userInfo.isPremium ? (
                <span className="premium-badge">{t('chat.premiumUser')}</span>
              ) : (
                <span className="free-badge">{t('chat.freeUser')}</span>
              )}
            </p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">{t('chat.topic')}: ({formData.topic.length}/{MAX_TOPIC_LENGTH})</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            required
            placeholder={t('chat.topicPlaceholder')}
            maxLength={MAX_TOPIC_LENGTH}
            disabled={isProcessing()}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">{t('chat.level')}</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              disabled={isProcessing()}
            >
              <option value="beginner">{t('chat.beginner')}</option>
              <option value="intermediate">{t('chat.intermediate')}</option>
              <option value="advanced">{t('chat.advanced')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="learningLanguage">{t('chat.learningLanguage')}</label>
            <select
              id="learningLanguage"
              name="learningLanguage"
              value={formData.learningLanguage}
              onChange={handleInputChange}
              className="language-select"
              disabled={isProcessing()}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {t(`languages.${lang.name.toLowerCase()}`) || lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="translationLanguage">{t('chat.translationLanguage')}</label>
            <select
              id="translationLanguage"
              name="translationLanguage"
              value={formData.translationLanguage}
              onChange={handleInputChange}
              className="language-select"
              disabled={isProcessing()}
            >
              {/* 현재 UI 언어를 먼저 표시 */}
              {SUPPORTED_LANGUAGES
                .sort((a, b) => {
                  // 현재 UI 언어와 일치하는 언어를 맨 위로
                  const currentUiLang = i18n.language.split('-')[0];
                  if (a.code.toLowerCase() === currentUiLang) return -1;
                  if (b.code.toLowerCase() === currentUiLang) return 1;
                  return 0;
                })
                .map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {t(`languages.${lang.name.toLowerCase()}`) || lang.nativeName}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="conversationLength">{t('chat.conversationLength')}</label>
            <select
              id="conversationLength"
              name="conversationLength"
              value={formData.conversationLength}
              onChange={handleInputChange}
              disabled={isProcessing()}
            >
              <option value="short">{t('chat.short')}</option>
              <option value="medium">{t('chat.medium')}</option>
              <option value="long">{t('chat.long')}</option>
            </select>
          </div>
        </div>
        
        {/* 성우 선택 드롭다운 추가 */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="voice">{t('chat.voice')}</label>
            <select
              id="voice"
              name="voice"
              value={selectedVoice}
              onChange={handleVoiceChange}
              className="voice-select"
              disabled={isProcessing()}
            >
              {voices.map(voice => (
                <option key={voice} value={voice}>
                  {voice === 'alloy' && (t('voices.alloy') || 'Alloy - 중립적인 음성')}
                  {voice === 'echo' && (t('voices.echo') || 'Echo - 깊고 차분한 음성')}
                  {voice === 'fable' && (t('voices.fable') || 'Fable - 부드럽고 따뜻한 음성')}
                  {voice === 'onyx' && (t('voices.onyx') || 'Onyx - 강하고 권위있는 음성')}
                  {voice === 'nova' && (t('voices.nova') || 'Nova - 명확하고 전문적인 음성')}
                  {voice === 'shimmer' && (t('voices.shimmer') || 'Shimmer - 밝고 활기찬 음성')}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="button-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isProcessing() || (userInfo && userInfo.dailyUsageCount >= (userInfo.isPremium ? 100 : 3))}
          >
            {isLoading ? (
              <div className="loading-spinner-container">
                <div className="spinner-small"></div>
                <span>{t('common.generating')}</span>
              </div>
            ) : (
              t('chat.generateChat')
            )}
          </button>
        </div>
      </form>
      {response && (
        <div className="response-container">
          <h2>{t('chat.generatedContent')}:</h2>
          <div className="response-section">
            <h3>{t('chat.conversation')}:</h3>
            <p>{response.conversation}</p>
          </div>
          <div className="response-section">
            <h3>{t('chat.translation')}:</h3>
            <p>{response.translation}</p>
          </div>
          <div className="response-section">
            <h3>{t('chat.vocabulary')}:</h3>
            
            {/* 인라인 스타일을 사용한 테이블 */}
            {vocabularyItems.length > 0 ? (
              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{t('script.no') || 'No.'}</th>
                      <th style={thStyle}>{t('script.word') || '단어'}</th>
                      <th style={thStyle}>{t('script.pronunciation') || '발음'}</th>
                      <th style={thStyle}>{t('script.meaning') || '의미'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vocabularyItems.map((item, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{item.index}</td>
                        <td style={wordCellStyle}>{item.word}</td>
                        <td style={tdStyle}>{item.pronunciation}</td>
                        <td style={tdStyle}>{item.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>{response.vocabulary}</p>
            )}
          </div>
          
          {/* 다운로드 및 저장 버튼 그룹 */}
          <div className="action-buttons">
            <div className="action-group">
              <h4>{t('chat.downloadOptions') || '다운로드 옵션'}</h4>
              <div className="button-row">
                <button 
                  type="button" 
                  onClick={handleGeneratePDF}
                  className="btn btn-primary"
                  disabled={isProcessing() || !response || (userInfo && userInfo.dailyUsageCount >= (userInfo.isPremium ? 100 : 3))}
                >
                  {isGeneratingPDF ? (
                    <div className="loading-spinner-container">
                      <div className="spinner-small"></div>
                      <span>{t('common.generating') || '생성 중...'}</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-file-pdf"></i>
                      {t('chat.downloadPDF') || 'PDF 다운로드'}
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={generateAudio}
                  className="btn btn-primary"
                  disabled={isProcessing() || !response || (userInfo && userInfo.dailyUsageCount >= (userInfo.isPremium ? 100 : 3))}
                >
                  {isGeneratingAudio ? (
                    <div className="loading-spinner-container">
                      <div className="spinner-small"></div>
                      <span>{t('common.generating') || '생성 중...'}</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-file-audio"></i>
                      {t('chat.downloadAudio') || '오디오 다운로드'}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="action-group">
              <h4>{t('chat.saveToMyFiles') || '내 파일에 저장'}</h4>
              <div className="button-row">
                <button 
                  type="button" 
                  onClick={handleSavePDF}
                  className="btn btn-secondary"
                  disabled={isProcessing() || !response}
                >
                  {isSavingPDF ? (
                    <div className="loading-spinner-container">
                      <div className="spinner-small"></div>
                      <span>{t('chat.saving') || '저장 중...'}</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {t('chat.savePDFToProfile') || '내 파일에 PDF 저장'}
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveAudio}
                  className="btn btn-secondary"
                  disabled={isProcessing() || !response}
                >
                  {isSavingAudio ? (
                    <div className="loading-spinner-container">
                      <div className="spinner-small"></div>
                      <span>{t('chat.saving') || '저장 중...'}</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {t('chat.saveAudioToProfile') || '내 파일에 오디오 저장'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 오디오 저장 한도 초과 모달 - 인라인 스타일 제거 */}
      {showLimitModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowLimitModal(false)}>×</button>
            <div className="limit-modal-content">
              <h3>{t('modal.storageLimit.title') || '저장 한도 초과'}</h3>
              <p>{t('modal.storageLimit.message1') || '오디오 파일은 최대 2개까지만 저장할 수 있습니다.'}</p>
              <p>{t('modal.storageLimit.message2') || '새로운 파일을 저장하려면 프로필에서 기존 파일을 삭제해주세요.'}</p>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowLimitModal(false);
                    navigate('/profile');
                  }}
                >
                  {t('modal.storageLimit.manageFiles') || '파일 관리하러 가기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF 저장 한도 초과 모달 - 인라인 스타일 제거 */}
      {showPdfLimitModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPdfLimitModal(false)}>×</button>
            <div className="limit-modal-content">
              <h3>{t('modal.storageLimit.title') || '저장 한도 초과'}</h3>
              <p>{t('modal.pdfStorageLimit.message1') || 'PDF 파일은 최대 2개까지만 저장할 수 있습니다.'}</p>
              <p>{t('modal.pdfStorageLimit.message2') || '새로운 파일을 저장하려면 프로필에서 기존 파일을 삭제해주세요.'}</p>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowPdfLimitModal(false);
                    navigate('/profile');
                  }}
                >
                  {t('modal.storageLimit.manageFiles') || '파일 관리하러 가기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;