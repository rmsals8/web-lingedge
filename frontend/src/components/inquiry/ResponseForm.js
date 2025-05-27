// src/components/inquiry/ResponseForm.js
import React, { useState, useContext } from 'react';
import inquiryService from '../../services/inquiryService';
import adminService from '../../services/adminService'; // 관리자 서비스 추가
import { AuthContext } from '../../context/AuthContext'; // AuthContext 추가

const ResponseForm = ({ inquiryId, onResponseSubmitted }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { isAdmin } = useContext(AuthContext); // AuthContext에서 isAdmin 가져오기

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("handleSubmit 함수 호출됨!");
    
    if (!content.trim()) {
      console.log("내용이 비어 있어 제출하지 않음");
      return;
    }

    console.log("답변 제출 시작:", { inquiryId, content });
    setIsSubmitting(true);
    setError('');
    
    try {
      let response;
      
      // 관리자 여부에 따라 다른 서비스 사용
      if (isAdmin()) {
        console.log("관리자 서비스 사용하여 API 호출");
        response = await adminService.createResponse(inquiryId, content);
      } else {
        console.log("일반 서비스 사용하여 API 호출");
        response = await inquiryService.createResponse(inquiryId, content);
      }
      
      console.log("API 응답:", response);
      setContent('');
      onResponseSubmitted(response);
    } catch (err) {
      console.error("답변 등록 오류:", err);
      setError('답변 등록 중 오류가 발생했습니다: ' + (err.response?.data || err.message));
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
          onChange={(e) => {
            console.log("텍스트 영역 변경됨:", e.target.value);
            setContent(e.target.value);
          }}
          placeholder="답변을 작성하세요..."
          rows={6}
          required
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !content.trim()}
          onClick={(e) => {
            console.log("제출 버튼 클릭됨");
            // 여기서는 e.preventDefault()를 호출하지 않음 - 폼 제출을 막지 않기 위해
          }}
        >
          {isSubmitting ? '제출 중...' : '답변 등록'}
        </button>
      </form>
      
      
    </div>
  );
};

export default ResponseForm;