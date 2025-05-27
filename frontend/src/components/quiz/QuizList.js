import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { FaFileAlt, FaPlay, FaDownload, FaPlus } from 'react-icons/fa';
import '../../Quiz.css';

const QuizList = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // 사용자의 퀴즈 목록 불러오기
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes');
        setQuizzes(response.data);
      } catch (err) {
        setError(t('quiz.fetchError') || '퀴즈 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [t]);
  
  // 다운로드 처리 함수 추가
  const handleDownloadPdf = async (quizId) => {
    try {
      const response = await api.get(`/api/quizzes/${quizId}/pdf`, {
        responseType: 'blob'
      });
      
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
      alert(t('quiz.downloadError') || 'PDF 다운로드에 실패했습니다.');
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
      </div>
    );
  }
  
  return (
    <div className="quiz-list-container">
      <h1 className="quiz-title">{t('quiz.myQuizzes') || '내 퀴즈 목록'}</h1>
      
      <div className="quiz-actions">
        <Link to="/quizzes/create" className="create-quiz-button">
          <FaPlus /> {t('quiz.createNew') || '새 퀴즈 만들기'}
        </Link>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="no-quizzes">
          <p>{t('quiz.noQuizzes') || '아직 생성된 퀴즈가 없습니다.'}</p>
          <p>{t('quiz.createQuizPrompt') || 'PDF 파일을 선택하여 새로운 퀴즈를 만들어보세요.'}</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-card-header">
                <FaFileAlt className="quiz-icon" />
                <h3 className="quiz-card-title">{quiz.title}</h3>
              </div>
              
              <div className="quiz-card-info">
                <p>
                  <span className="info-label">{t('quiz.questions') || '문제 수'}:</span> 
                  <span className="info-value">{quiz.questionCount}</span>
                </p>
                <p>
                  <span className="info-label">{t('quiz.created') || '생성일'}:</span> 
                  <span className="info-value">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="info-label">{t('quiz.sourceFile') || '원본 파일'}:</span> 
                  <span className="info-value file-name">{quiz.fileName}</span>
                </p>
              </div>
              
              <div className="quiz-card-actions">
                <Link to={`/quizzes/${quiz.id}`} className="quiz-card-button details">
                  <FaFileAlt /> {t('quiz.details') || '상세정보'}
                </Link>
                <Link to={`/quizzes/${quiz.id}/take`} className="quiz-card-button take">
                  <FaPlay /> {t('quiz.takeQuiz') || '퀴즈 풀기'}
                </Link>
                {/* Link를 버튼으로 변경 */}
                <button 
                  onClick={() => handleDownloadPdf(quiz.id)} 
                  className="quiz-card-button download"
                >
                  <FaDownload /> {t('quiz.download') || '다운로드'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;