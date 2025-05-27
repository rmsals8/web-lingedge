import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import QuizQuestion from './QuizQuestion';
import '../../Quiz.css';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  
  // 퀴즈 정보와 응시 정보 불러오기
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // 1. 퀴즈 정보 불러오기
        const quizResponse = await api.get(`/api/quizzes/${quizId}`);
        setQuiz(quizResponse.data);
        
        // 2. 퀴즈 응시 시작
        const attemptResponse = await api.post(`/api/quizzes/${quizId}/start`);
        setAttempt(attemptResponse.data);
        
        // 답변 상태 초기화
        const initialAnswers = {};
        quizResponse.data.questions.forEach(question => {
          initialAnswers[question.id] = '';
        });
        
        // 로컬 스토리지에서 기존 답변 불러오기
        const savedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
        if (savedAnswers) {
          try {
            const parsedAnswers = JSON.parse(savedAnswers);
            console.log("[초기화] 저장된 답변 불러옴:", parsedAnswers);
            setAnswers({...initialAnswers, ...parsedAnswers});
          } catch (err) {
            console.error("[초기화] 저장된 답변 복원 오류:", err);
            setAnswers(initialAnswers);
          }
        } else {
          setAnswers(initialAnswers);
        }
        
      } catch (err) {
        console.error("[초기화] 퀴즈 초기화 오류:", err);
        setError(t('quiz.startError') || '퀴즈를 시작하는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    initializeQuiz();
  }, [quizId, t]);
  
  // 현재 문제
  const currentQuestion = quiz?.questions[currentQuestionIndex] || null;
  
  // 다음 문제로 이동
  const goToNextQuestion = () => {
    if (currentQuestionIndex >= quiz.questions.length - 1) return;
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setFeedback(null);
  };
  
  // 이전 문제로 이동
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex <= 0) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setFeedback(null);
  };
  
  // 답변 저장
  const handleAnswerChange = (questionId, answer) => {
    console.log(`[답변 변경] 문제 ${questionId} 답변 저장: "${answer}"`);
    
    // 상태 업데이트
    setAnswers(prevAnswers => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: answer
      };
      
      // 로컬 스토리지에 저장
      localStorage.setItem(`quiz_${quizId}_answers`, JSON.stringify(newAnswers));
      
      return newAnswers;
    });
  };
  
  // 퀴즈 완료 - 일괄 채점
  const handleCompleteQuiz = async () => {
    try {
      setSubmitting(true);
      
      // 모든 답변을 배열로 변환하여 일괄 제출
      const answersList = Object.keys(answers).map(questionId => ({
        questionId: parseInt(questionId),
        userAnswer: answers[questionId] || ''
      }));
      
      console.log("모든 답변 일괄 제출:", answersList);
      
      // 벌크 업데이트 API 호출
      await api.post(`/api/quizzes/attempts/${attempt.id}/submit-all`, {
        answers: answersList
      });
      
      // 완료 처리
      await api.post(`/api/quizzes/attempts/${attempt.id}/complete`);
      
      // 결과 저장 (결과 페이지에서 활용)
      localStorage.setItem(`quiz_${quizId}_result_answers`, JSON.stringify({
        attemptId: attempt.id,
        answers: answersList
      }));
      
      // 결과 페이지로 이동
      navigate(`/quizzes/${quizId}/results/${attempt.id}`);
      
    } catch (err) {
      console.error("퀴즈 완료 오류:", err);
      setFeedback({
        type: 'error',
        message: '퀴즈 완료 중 오류가 발생했습니다.'
      });
    } finally {
      setSubmitting(false);
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
  
  if (!quiz || !currentQuestion) {
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
    <div className="take-quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">{quiz.title}</h1>
        <div className="quiz-progress">
          {t('quiz.question') || '문제'} {currentQuestionIndex + 1} / {quiz.questions.length}
        </div>
      </div>
      
      <div className="quiz-progress-bar">
        <div 
          className="quiz-progress-fill" 
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="question-container">
        <QuizQuestion 
          question={currentQuestion}
          answer={answers[currentQuestion.id] || ''}
          onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          disabled={submitting}
        />
      </div>
      
      {feedback && (
        <div className={`feedback-message ${feedback.type}`}>
          {feedback.type === 'success' ? <span>✅</span> : <span>❌</span>}
          <span>{feedback.message}</span>
        </div>
      )}
      
      <div className="quiz-navigation">
        <button 
          onClick={goToPreviousQuestion} 
          className="nav-button prev"
          disabled={currentQuestionIndex === 0 || submitting}
        >
          <FaArrowLeft /> {t('quiz.previous') || '이전'}
        </button>
        
        {/* 중간 공간 */}
        <div className="nav-spacer"></div>
        
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button 
            onClick={goToNextQuestion} 
            className="nav-button next"
            disabled={submitting}
          >
            {t('quiz.next') || '다음'} <FaArrowRight />
          </button>
        ) : (
          <button
            onClick={handleCompleteQuiz}
            className="nav-button complete"
            disabled={submitting}
          >
            {submitting ? (
              <div className="spinner-small"></div>
            ) : (
              <>{t('quiz.finishQuiz') || '퀴즈 완료'}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;