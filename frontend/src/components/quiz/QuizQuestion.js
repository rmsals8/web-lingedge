import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../Quiz.css';

const QuizQuestion = ({ question, answer, onAnswerChange, disabled }) => {
  const { t } = useTranslation();
  
  // 항상 최상위 레벨에서 훅 호출 (조건 없이)
  useEffect(() => {
    // 컴포넌트가 마운트되면 실행
    if (question && answer) {
      console.log(`[QuizQuestion] 초기 답변 로드: 문제 ${question.id}, 답변 "${answer}"`);
    }
  }, [question, answer]);
  
  // null 체크는 렌더링 로직에서만 수행
  if (!question) return null;
  
  const isMultipleChoice = question.questionType === 'MULTIPLE_CHOICE';
  
  // 답변 변경 핸들러
  const handleAnswerChange = (value) => {
    console.log(`[QuizQuestion] 답변 입력: 문제 ${question.id}, 답변 "${value}"`);
    onAnswerChange(value);
  };
  
  return (
    <div className="quiz-question">
      <div className="question-text">
        <h3>{question.questionText}</h3>
        <div className="question-type-badge">
          {isMultipleChoice 
            ? t('quiz.multipleChoice') || '객관식' 
            : t('quiz.shortAnswer') || '주관식'}
        </div>
      </div>
      
      {isMultipleChoice ? (
        <div className="answer-choices">
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className={`answer-choice ${answer === option ? 'selected' : ''}`}
              onClick={() => !disabled && handleAnswerChange(option)}
            >
              <input
                type="radio"
                id={`option-${question.id}-${index}`}
                name={`question-${question.id}`}
                value={option}
                checked={answer === option}
                onChange={() => handleAnswerChange(option)}
                disabled={disabled}
              />
              <label 
                htmlFor={`option-${question.id}-${index}`}
                className={answer === option ? 'selected-label' : ''}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="short-answer">
          <textarea
            placeholder={t('quiz.enterAnswer') || '답변을 입력하세요...'}
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;