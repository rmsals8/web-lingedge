import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import '../../Quiz.css';

const QuizGenerator = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [numMultipleChoice, setNumMultipleChoice] = useState(5);
  const [numShortAnswer, setNumShortAnswer] = useState(3);
  
  // PDF 파일 목록 불러오기
  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        // 대화 PDF 파일만 가져오도록 수정
        const response = await api.get('/api/files', { 
          params: { fileType: 'CONVERSATION_PDF' } 
        });
        setUserFiles(response.data);
      } catch (err) {
        setError(t('quiz.fetchFilesError') || 'PDF 파일 목록을 불러오는데 실패했습니다.');
      }
    };
    
    fetchUserFiles();
  }, [t]);
  
  const handleFileSelect = (e) => {
    const fileId = e.target.value;
    setSelectedFileId(fileId);
    
    if (fileId) {
      // 선택한 파일에 따라 기본 퀴즈 제목 설정
      const selectedFile = userFiles.find(file => file.id.toString() === fileId);
      if (selectedFile) {
        // 파일명에서 ".pdf" 제거 후 "퀴즈" 추가
        const baseName = selectedFile.fileName.replace(/\.pdf$/i, '');
        setQuizTitle(`${baseName} 퀴즈`);
      }
    } else {
      // 파일 선택 해제 시 제목 초기화
      setQuizTitle('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFileId) {
      setError(t('quiz.selectFileError') || 'PDF 파일을 선택해주세요.');
      return;
    }
    
    if (!quizTitle.trim()) {
      setError(t('quiz.titleRequiredError') || '퀴즈 제목을 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/quizzes/generate', {
        fileId: parseInt(selectedFileId),
        title: quizTitle,
        numMultipleChoice: numMultipleChoice,
        numShortAnswer: numShortAnswer
      });
      
      // 생성된 퀴즈의 상세 페이지로 이동
      navigate(`/quizzes/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data || 
        t('quiz.generateError') || 
        '퀴즈 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="quiz-generator-container">
      <h1 className="quiz-title">{t('quiz.createTitle') || '퀴즈 생성'}</h1>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label htmlFor="fileSelect">{t('quiz.selectPdf') || 'PDF 파일 선택'}</label>
          {userFiles.length === 0 ? (
            <div className="no-files-message">
              <p>{t('quiz.noFiles') || 'PDF 파일이 없습니다. 먼저 PDF 파일을 업로드해주세요.'}</p>
            </div>
          ) : (
            <select
              id="fileSelect"
              className="file-select"
              value={selectedFileId}
              onChange={handleFileSelect}
              required
            >
              <option value="">{t('quiz.selectOption') || '파일을 선택하세요'}</option>
              {userFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.fileName} ({new Date(file.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="quizTitle">{t('quiz.title') || '퀴즈 제목'}</label>
          <input
            type="text"
            id="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder={t('quiz.titlePlaceholder') || '퀴즈 제목을 입력하세요'}
            required
          />
        </div>
        
        <div className="form-group question-settings">
          <div className="question-type-setting">
            <label htmlFor="multipleChoice">
              {t('quiz.multipleChoice') || '객관식 문제 개수'}
            </label>
            <input
              type="number"
              id="multipleChoice"
              min="1"
              max="15"
              value={numMultipleChoice}
              onChange={(e) => setNumMultipleChoice(parseInt(e.target.value) || 5)}
            />
          </div>
          
          <div className="question-type-setting">
            <label htmlFor="shortAnswer">
              {t('quiz.shortAnswer') || '주관식 문제 개수'}
            </label>
            <input
              type="number"
              id="shortAnswer"
              min="1"
              max="10"
              value={numShortAnswer}
              onChange={(e) => setNumShortAnswer(parseInt(e.target.value) || 3)}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="generate-button"
            disabled={loading || !selectedFileId}
          >
            {loading ? (
              <div className="spinner-small"></div>
            ) : (
              t('quiz.generate') || '퀴즈 생성하기'
            )}
          </button>
        </div>
      </form>
      
      <div className="generator-info">
        <h3>{t('quiz.howItWorks') || '작동 방식'}</h3>
        <p>
          {t('quiz.generatorExplanation') || 
           '선택한 PDF 파일의 내용을 분석하여 객관식 및 주관식 문제를 자동으로 생성합니다. ' +
           '생성된 퀴즈는 온라인에서 풀거나 PDF로 다운로드할 수 있습니다.'}
        </p>
      </div>
    </div>
  );
};

export default QuizGenerator;