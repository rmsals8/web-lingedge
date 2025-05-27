import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaDownload, FaArrowLeft } from 'react-icons/fa';
import '../../Quiz.css';

const QuizDetail = () => {
  const { quizId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // 퀴즈 상세 정보 불러오기
    const fetchQuizDetails = async () => {
      try {
        const response = await api.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (err) {
        setError(t('quiz.fetchDetailError') || '퀴즈 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizDetails();
  }, [quizId, t]);
  
// QuizDetail.js에서
const handleDownloadPdf = async () => {
  try {
    // axios 또는 fetch 사용
    const response = await api.get(`/api/quizzes/${quizId}/pdf`, {
      responseType: 'blob' // 중요! 바이너리 데이터를 받기 위해
    });
    
    // Blob 생성 및 다운로드 링크 만들기
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `quiz-${quizId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    console.error("다운로드 오류:", err);
    setError(t('quiz.downloadError') || 'PDF 다운로드에 실패했습니다.');
  }
};
  
  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="spinner"></div>
        <p>{t('common.loading') || '로딩 중...'}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quiz-error">
        <p>{error}</p>
        <button onClick={() => navigate('/quizzes')} className="back-button">
          <FaArrowLeft /> {t('common.back') || '돌아가기'}
        </button>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="quiz-error">
        <p>{t('quiz.notFound') || '퀴즈를 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/quizzes')} className="back-button">
          <FaArrowLeft /> {t('common.back') || '돌아가기'}
        </button>
      </div>
    );
  }
  
  return (
    <div className="quiz-detail-container">
      <div className="quiz-detail-header">
        <button onClick={() => navigate('/quizzes')} className="back-button">
          <FaArrowLeft /> {t('common.back') || '돌아가기'}
        </button>
        <h1 className="quiz-detail-title">{quiz.title}</h1>
      </div>
      
      <div className="quiz-detail-info">
        <div className="info-row">
          <span className="info-label">{t('quiz.questions') || '문제 수'}:</span>
          <span className="info-value">{quiz.questions.length}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t('quiz.created') || '생성일'}:</span>
          <span className="info-value">{new Date(quiz.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t('quiz.sourceFile') || '원본 파일'}:</span>
          <span className="info-value file-name">{quiz.fileName}</span>
        </div>
      </div>
      
      <div className="quiz-detail-actions">
        <Link to={`/quizzes/${quizId}/take`} className="action-button take">
          <FaPlay /> {t('quiz.takeQuiz') || '퀴즈 풀기'}
        </Link>
        <button onClick={handleDownloadPdf} className="action-button download">
          <FaDownload /> {t('quiz.downloadPdf') || 'PDF 다운로드'}
        </button>
      </div>
      
      <div className="quiz-questions-preview">
        <h2>{t('quiz.questionsPreview') || '문제 미리보기'}</h2>
        
        <div className="question-list">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-number">#{index + 1}</div>
              <div className="question-content">
                <div className="question-text">{question.questionText}</div>
                <div className="question-type">
                  {question.questionType === 'MULTIPLE_CHOICE' 
                    ? t('quiz.multipleChoice') || '객관식' 
                    : t('quiz.shortAnswer') || '주관식'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;