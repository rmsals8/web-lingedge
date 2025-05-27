import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaHome, FaRedo, FaCheck, FaTimes } from 'react-icons/fa';
import '../../Quiz.css';

const QuizResults = () => {
  const { quizId, attemptId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [allQuestionsList, setAllQuestionsList] = useState([]);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 서버에서 결과 가져오기
        const response = await api.get(`/api/quizzes/attempts/${attemptId}`);
        console.log("서버에서 가져온 결과:", response.data);
        
        // 퀴즈 정보 가져오기
        const quizResponse = await api.get(`/api/quizzes/${quizId}`);
        const questionsData = quizResponse.data.questions || [];
        
        // 답변 목록 가져오기 - 이 API가 없는 경우 아래 catch 블록에서 처리됨
        try {
          const answersResponse = await api.get(`/api/quizzes/attempts/${attemptId}/answers`);
          const userAnswersData = answersResponse.data || [];
          setUserAnswers(userAnswersData);
          
          // 모든 문제 및 답변 목록 생성
          const combinedList = questionsData.map(question => {
            // 이 문제에 대한 답변 찾기
            const answer = userAnswersData.find(a => a.questionId === question.id);
            
            return {
              id: question.id,
              questionText: question.questionText,
              questionType: question.questionType,
              correctAnswer: question.correctAnswer,
              userAnswer: answer ? answer.userAnswer : '',
              isCorrect: answer ? answer.isCorrect : false,
              answered: !!answer
            };
          });
          
          setAllQuestionsList(combinedList);
        } catch (err) {
          console.warn("답변 API에서 오류 발생, 로컬 데이터 사용 시도:", err);
          
          // API가 없거나 오류 발생 시 로컬 스토리지에서 답변 데이터 가져오기
          const savedAnswers = localStorage.getItem(`quiz_${quizId}_result_answers`);
          if (savedAnswers) {
            try {
              const localAnswers = JSON.parse(savedAnswers);
              console.log("로컬에 저장된 답변:", localAnswers);
              
              // 모든 문제 및 답변 목록 생성
              const combinedList = questionsData.map(question => {
                // localAnswers가 객체인 경우 ({questionId: answer})
                const userAnswer = localAnswers[question.id] || '';
                
                return {
                  id: question.id,
                  questionText: question.questionText,
                  questionType: question.questionType,
                  correctAnswer: question.correctAnswer,
                  userAnswer: userAnswer,
                  isCorrect: userAnswer === question.correctAnswer,
                  answered: !!userAnswer
                };
              });
              
              setAllQuestionsList(combinedList);
              
              // 사용 후 로컬 스토리지 데이터 삭제
              localStorage.removeItem(`quiz_${quizId}_result_answers`);
            } catch (e) {
              console.error("저장된 답변 파싱 오류:", e);
              
              // 파싱 오류 시 빈 답변으로 목록 생성
              const emptyList = questionsData.map(question => ({
                id: question.id,
                questionText: question.questionText,
                questionType: question.questionType,
                correctAnswer: question.correctAnswer,
                userAnswer: '',
                isCorrect: false,
                answered: false
              }));
              
              setAllQuestionsList(emptyList);
            }
          } else {
            // 로컬 스토리지에도 데이터가 없는 경우
            const emptyList = questionsData.map(question => ({
              id: question.id,
              questionText: question.questionText,
              questionType: question.questionType,
              correctAnswer: question.correctAnswer,
              userAnswer: '',
              isCorrect: false,
              answered: false
            }));
            
            setAllQuestionsList(emptyList);
          }
        }
        
        setResults(response.data);
        setQuestions(questionsData);
        
      } catch (err) {
        console.error("결과 조회 오류:", err);
        setError(t('quiz.resultsError') || '결과를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [attemptId, quizId, t]);
  
  // 로딩 및 오류 상태 처리
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
  
  if (!results) {
    return (
      <div className="quiz-error">
        <p>{t('quiz.resultsNotFound') || '결과를 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/quizzes')} className="back-button">
          <FaArrowLeft /> {t('common.back') || '돌아가기'}
        </button>
      </div>
    );
  }
  
  // 정답 수 계산
  const correctCount = allQuestionsList.filter(item => item.isCorrect).length;
  const totalQuestions = results.totalQuestions || questions.length || 0;
  const incorrectCount = allQuestionsList.filter(item => item.answered && !item.isCorrect).length;
  
  return (
    <div className="quiz-results-container">
      <h1 className="results-title">{t('quiz.resultsTitle') || '퀴즈 결과'}</h1>
      
      <div className="quiz-score-card">
        <h2 className="quiz-name">{results.quizTitle}</h2>
        <div className="score-display">
          <div className="score-number">{results.score !== undefined ? results.score : 0}%</div>
          <div className="score-text">
            {correctCount} / {totalQuestions} {t('quiz.correctAnswers') || '정답'}
          </div>
        </div>
        
        <div className="score-details">
          <div className="score-detail correct">
            <FaCheck />
            <span>{correctCount} {t('quiz.correct') || '정답'}</span>
          </div>
          <div className="score-detail incorrect">
            <FaTimes />
            <span>{incorrectCount} {t('quiz.incorrect') || '오답'}</span>
          </div>
        </div>
      </div>
      
      {/* 답변 요약 테이블 */}
      <div className="answers-summary">
        <h2>{t('quiz.answersSummary') || '답변 요약'}</h2>
        
        <table className="answers-table">
          <thead>
            <tr>
              <th className="table-num">#</th>
              <th className="table-question">문제</th>
              <th className="table-answer">내 답변</th>
              <th className="table-correct-answer">정답</th>
              <th className="table-result">결과</th>
            </tr>
          </thead>
          <tbody>
            {allQuestionsList.map((item, index) => (
              <tr key={index} className={item.isCorrect ? 'correct-row' : 'incorrect-row'}>
                <td className="table-num">{index + 1}</td>
                <td className="table-question">{item.questionText || '문제 없음'}</td>
                <td className="table-answer">{item.userAnswer || '답변 없음'}</td>
                <td className="table-correct-answer">{item.correctAnswer || '정답 없음'}</td>
                <td className="table-result">
                  {item.answered ? (
                    item.isCorrect ? 
                      <span className="result-correct"><FaCheck /> 정답</span> : 
                      <span className="result-incorrect"><FaTimes /> 오답</span>
                  ) : (
                    <span className="result-unanswered">미응답</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="results-actions">
        <Link to="/quizzes" className="action-button home">
          <FaHome /> {t('quiz.backToQuizzes') || '퀴즈 목록으로'}
        </Link>
        <Link to={`/quizzes/${quizId}/take`} className="action-button retry">
          <FaRedo /> {t('quiz.tryAgain') || '다시 시도'}
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;