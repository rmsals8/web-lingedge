import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import inquiryService from '../../services/inquiryService';
import '../../styles/inquiry.css';

/**
 * 문의 작성 폼 컴포넌트
 */
const InquiryForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 문의 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await inquiryService.createInquiry({
        title,
        content,
        isPrivate
      });
      navigate('/inquiries');
    } catch (err) {
      setError('문의 등록 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inquiry-form-container">
      <h2>문의 작성</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="inquiry-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문의 제목을 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의 내용을 자세히 입력하세요"
            rows={10}
            required
          />
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="isPrivate">비밀글로 등록</label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/inquiries')}
            className="btn-secondary"
          >
            취소
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? '제출 중...' : '문의 제출'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;