import React, { useState, useContext } from 'react';
import inquiryService from '../../services/inquiryService';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';

const ResponseForm = ({ inquiryId, onResponseSubmitted }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { isAdmin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      let response;
      
      // 관리자 여부에 따라 다른 서비스 사용
      if (isAdmin()) {
        response = await adminService.createResponse(inquiryId, content);
      } else {
        response = await inquiryService.createResponse(inquiryId, content);
      }
      
      setContent('');
      onResponseSubmitted(response);
    } catch (err) {
      setError('답변 등록 중 오류가 발생했습니다.');
      console.error('답변 등록 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="response-form">
      <h3>답변 작성</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답변을 작성하세요..."
          rows={6}
          required
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? '제출 중...' : '답변 등록'}
        </button>
      </form>
    </div>
  );
};

export default ResponseForm;