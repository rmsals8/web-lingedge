import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../WritingExercise.css';

const WritingExerciseGenerator = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fileId: '',
    title: '',
    difficulty: 'medium',
    exerciseCount: 5
  });
  
  // 버튼별 로딩 상태 관리
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchUserFiles();
  }, []);
  
  const fetchUserFiles = async () => {
    try {
      // 여기를 수정: 모든 PDF가 아닌 대화 PDF만 요청
      const response = await api.get('/api/files', { 
        params: { fileType: 'CONVERSATION_PDF' } 
      });
      setFiles(response.data);
    } catch (err) {
      setError(t('writing.fetchFilesError') || '파일 목록을 불러오는데 실패했습니다.');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await api.post('/api/writing-exercises/generate', formData);
      
      if (response.data && response.data.status === 'success') {
        navigate('/writing-exercises');
      } else {
        setError(response.data.message || t('writing.generationError') || '영작 연습 생성 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('writing.generationError') || '영작 연습 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setIsCanceling(true);
    navigate('/writing-exercises');
  };
  
  // 로딩 스피너 컴포넌트
  const LoadingSpinner = () => (
    <div className="spinner-small"></div>
  );
  
  return (
    <div className="writing-exercise-generator">
      <h1>{t('writing.createExercise') || '영작 연습 생성'}</h1>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fileId">{t('writing.selectFile') || '대화 PDF 선택'}</label>
          <select
            id="fileId"
            name="fileId"
            value={formData.fileId}
            onChange={handleInputChange}
            required
            disabled={isLoading || isSubmitting || isCanceling}
          >
            <option value="">{t('writing.selectPlaceholder') || '파일을 선택하세요'}</option>
            {files.map(file => (
              <option key={file.id} value={file.id}>{file.fileName}</option>
            ))}
          </select>
          <p className="help-text">{t('writing.selectFileHelp') || '영작 연습을 생성할 대화 PDF를 선택하세요.'}</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">{t('writing.title') || '제목'}</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder={t('writing.titlePlaceholder') || '영작 연습의 제목'}
            disabled={isLoading || isSubmitting || isCanceling}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="difficulty">{t('writing.difficulty') || '난이도'}</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            disabled={isLoading || isSubmitting || isCanceling}
          >
            <option value="easy">{t('writing.easy') || '쉬움'}</option>
            <option value="medium">{t('writing.medium') || '중간'}</option>
            <option value="hard">{t('writing.hard') || '어려움'}</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="exerciseCount">{t('writing.exerciseCount') || '문제 수'}</label>
          <input
            type="number"
            id="exerciseCount"
            name="exerciseCount"
            min="1"
            max="10"
            value={formData.exerciseCount}
            onChange={handleInputChange}
            disabled={isLoading || isSubmitting || isCanceling}
          />
          <p className="help-text">{t('writing.exerciseCountHelp') || '생성할 영작 문제의 개수 (1-10)'}</p>
        </div>
        
        <div className="button-group">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isLoading || isSubmitting || isCanceling}
          >
            {isCanceling ? (
              <div className="button-content-with-spinner">
                <LoadingSpinner />
                <span>{t('common.loading') || '로딩 중...'}</span>
              </div>
            ) : (
              t('common.cancel') || '취소'
            )}
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || isSubmitting || isCanceling}
          >
            {isSubmitting ? (
              <div className="button-content-with-spinner">
                <LoadingSpinner />
                <span>{t('common.generating') || '생성 중...'}</span>
              </div>
            ) : (
              t('writing.createButton') || '영작 연습 생성'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritingExerciseGenerator;