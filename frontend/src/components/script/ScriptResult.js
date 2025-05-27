import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaVolumeUp, FaArrowLeft, FaSave, FaCheck } from 'react-icons/fa';
import '../../ScriptResult.css';

const ScriptResult = () => {
  const { scriptId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false); // 저장 한도 모달 상태
  
  // 결과 데이터 로딩
  useEffect(() => {
    const fetchScriptResult = async () => {
      try {
        const response = await api.get(`/api/script/${scriptId}`);
        setResult(response.data);
        
        // 오디오 데이터 로드
        const audioBlob = await fetchAudio(scriptId);
        if (audioBlob) {
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioObj = new Audio(audioUrl);
          audioObj.addEventListener('ended', () => setIsPlaying(false));
          setAudio(audioObj);
        }
      } catch (err) {
        setError(err.response?.data?.message || t('script.fetchResultError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchScriptResult();
    
    // 컴포넌트 언마운트 시 오디오 정리
    return () => {
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
    };
  }, [scriptId, t]);
  
  // 오디오 데이터 가져오기
  const fetchAudio = async (id) => {
    try {
      console.log(`오디오 요청 URL: ${process.env.REACT_APP_API_URL}/api/script/audio/${id}`);
      
      const response = await api.get(`/api/script/audio/${id}`, {
        responseType: 'blob'
      });
      
      console.log('오디오 응답 상태:', response.status);
      console.log('오디오 응답 크기:', response.data.size);
      
      return new Blob([response.data], { type: 'audio/mpeg' });
    } catch (err) {
      console.error('Error fetching audio:', err);
      return null;
    }
  };
  
  // PDF 다운로드 처리
  const handleDownloadPdf = async () => {
    try {
      const response = await api.get(`/api/script/download/${scriptId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `script_analysis_${scriptId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(t('script.downloadError'));
    }
  };
  
  // 오디오 다운로드 처리
  const handleDownloadAudio = async () => {
    if (!audio) return;
    
    try {
      const response = await api.get(`/api/script/audio/${scriptId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `script_audio_${scriptId}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(t('script.audioDownloadError'));
    }
  };
  
  // 스크립트 저장 처리
  const handleSaveScript = async () => {
    setSaving(true);
    setSaveError(null);
    
    try {
      const response = await api.post(`/api/script/save/${scriptId}`);
      
      if (response.data.status === "success") {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // 3초 후 성공 표시 제거
      } else if (response.data.status === "warning") {
        // 기존 파일이 삭제되고 저장됨
        alert(response.data.message);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else if (response.data.limitReached) {
        // 저장 한도 초과 시 모달 표시
        setShowLimitModal(true);
      } else {
        setSaveError(response.data.message || t('script.saveError'));
      }
    } catch (err) {
      // 백엔드에서 한도 초과 응답을 보낸 경우
      if (err.response && err.response.data && err.response.data.limitReached) {
        setShowLimitModal(true);
      } else {
        setSaveError(err.response?.data?.message || t('script.saveError'));
      }
    } finally {
      setSaving(false);
    }
  };
  
  // 오디오 재생/일시정지 처리
  const toggleAudio = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };
  
  // 파일 저장 제한 모달 닫기
  const handleCloseModal = () => {
    setShowLimitModal(false);
  };
  
  if (loading) {
    return (
      <div className="script-result-loading">
        <div className="spinner-large"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="script-result-error">
        <p>{error}</p>
        <button onClick={() => navigate('/script')} className="back-button">
          <FaArrowLeft /> {t('common.back')}
        </button>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="script-result-error">
        <p>{t('script.resultNotFound')}</p>
        <button onClick={() => navigate('/script')} className="back-button">
          <FaArrowLeft /> {t('common.back')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="script-result-container">
      <div className="script-result-header">
        <button onClick={() => navigate('/script')} className="back-button">
          <FaArrowLeft /> {t('common.back')}
        </button>
        <h1 className="script-result-title">{t('script.analysisResult')}</h1>
      </div>
      
      <div className="script-info">
        <div className="language-info">
          <p>
            <strong>{t('script.detectedLanguage')}:</strong> {result.detectedScriptLanguage}
          </p>
          <p>
            <strong>{t('script.translationLanguage')}:</strong> {result.translationLanguage}
          </p>
        </div>
        
        <div className="script-actions">
          <button 
            onClick={toggleAudio} 
            className={`action-button audio ${isPlaying ? 'playing' : ''}`}
            disabled={!audio}
          >
            <FaVolumeUp /> {isPlaying ? t('script.pauseAudio') : t('script.playAudio')}
          </button>
          
          <button 
            onClick={handleDownloadPdf} 
            className="action-button download"
          >
            <FaDownload /> {t('script.downloadPdf')}
          </button>
          
          {audio && (
            <button 
              onClick={handleDownloadAudio} 
              className="action-button download-audio"
            >
              <FaDownload /> {t('script.downloadAudio')}
            </button>
          )}
          
          <button 
            onClick={handleSaveScript} 
            className={`action-button save ${saveSuccess ? 'success' : ''}`}
            disabled={saving || saveSuccess}
          >
            {saving ? (
              <span className="spinner-small"></span>
            ) : saveSuccess ? (
              <FaCheck />
            ) : (
              <FaSave />
            )}
            {saveSuccess ? t('script.saved') : t('script.saveToProfile')}
          </button>
        </div>
        
        {saveError && (
          <div className="save-error">
            <p>{saveError}</p>
          </div>
        )}
      </div>
      
      {/* 저장 한도 모달 */}
      {showLimitModal && (
        <div className="modal-backdrop" onClick={() => setShowLimitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLimitModal(false)}>×</button>
            <div className="limit-modal-content">
              <h3>저장 한도 초과</h3>
              <p>오디오 파일은 최대 2개까지만 저장할 수 있습니다.</p>
              <p>새로운 파일을 저장하려면 프로필에서 기존 파일을 삭제해주세요.</p>
              <div className="modal-actions">
                <button onClick={() => setShowLimitModal(false)}>확인</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="paragraphs-container">
        {result.paragraphs.map((paragraph, index) => (
          <div key={index} className="paragraph-card">
            <h3 className="paragraph-title">{t('script.paragraph')} {index + 1}</h3>
            
            <div className="paragraph-section">
              <h4>{t('script.original')}</h4>
              <p className="paragraph-content original">{paragraph.originalText}</p>
            </div>
            
            <div className="paragraph-section">
              <h4>{t('script.translation')}</h4>
              <p className="paragraph-content translation">{paragraph.translation}</p>
            </div>
            
            <div className="paragraph-section">
              <h4>{t('script.summary')}</h4>
              <p className="paragraph-content summary">{paragraph.summary}</p>
            </div>
            
            <div className="paragraph-section">
              <h4>{t('script.vocabulary')}</h4>
              
              {paragraph.vocabulary && paragraph.vocabulary.length > 0 ? (
                <div className="vocabulary-table">
                  <div className="vocab-header">
                    <div>{t('script.word')}</div>
                    <div>{t('script.meaning')}</div>
                    <div>{t('script.pronunciation')}</div>
                    <div>{t('script.example')}</div>
                  </div>
                  
                  {paragraph.vocabulary.map((vocab, vIndex) => (
                    <div key={vIndex} className="vocab-row">
                      <div className="vocab-word">{vocab.word}</div>
                      <div>{vocab.meaning}</div>
                      <div>{vocab.pronunciation}</div>
                      <div>{vocab.example}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">{t('script.noVocabulary')}</p>
              )}
            </div>
            
            <div className="paragraph-section qa-section">
              <div className="qa-column">
                <h4>{t('script.expectedQuestions')}</h4>
                {paragraph.expectedQuestions && paragraph.expectedQuestions.length > 0 ? (
                  <ol className="qa-list">
                    {paragraph.expectedQuestions.map((question, qIndex) => (
                      <li key={qIndex}>{question}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="no-data">{t('script.noQuestions')}</p>
                )}
              </div>
              
              <div className="qa-column">
                <h4>{t('script.expectedAnswers')}</h4>
                {paragraph.expectedAnswers && paragraph.expectedAnswers.length > 0 ? (
                  <ol className="qa-list">
                    {paragraph.expectedAnswers.map((answer, aIndex) => (
                      <li key={aIndex}>{answer}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="no-data">{t('script.noAnswers')}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptResult;