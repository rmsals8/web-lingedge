import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaClock, FaArrowLeft } from 'react-icons/fa';
import adminService from '../../services/adminService';
import ResponseForm from './ResponseForm';
import { formatDateTime } from '../../utils/dateUtils';

/**
 * 관리자용 문의 상세 컴포넌트
 */
const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // 문의 상세 조회
  useEffect(() => {
    const fetchInquiry = async () => {
      setIsLoading(true);
      try {
        const data = await adminService.getInquiryById(id);
        setInquiry(data);
        setStatus(data.status);
      } catch (err) {
        setError('문의 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  // 상태 변경 핸들러
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // 상태 저장 핸들러
  const handleSaveStatus = async () => {
    if (status === inquiry.status) return;

    setIsSaving(true);
    try {
      const updatedInquiry = await adminService.updateInquiryStatus(id, status);
      setInquiry(updatedInquiry);
      alert('상태가 변경되었습니다.');
    } catch (err) {
      setError('상태 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // 답변 등록 완료 처리
  const handleResponseSubmitted = (response) => {
    setInquiry({
      ...inquiry,
      responses: [...inquiry.responses, response]
    });
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>문의 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return <div className="admin-error-message">{error}</div>;
  }

  // 문의 데이터가 없는 경우
  if (!inquiry) {
    return <div className="admin-error-message">문의를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="admin-inquiry-detail">
      <div className="admin-page-header">
        <button
          className="back-button"
          onClick={() => navigate('/admin/inquiries')}
        >
          <FaArrowLeft /> 목록으로
        </button>
        <h1 className="admin-title">문의 상세</h1>
      </div>

      {/* 상태 변경 컨트롤 */}
      <div className="inquiry-status-control">
        <label htmlFor="status">상태:</label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="PENDING">대기 중</option>
          <option value="IN_PROGRESS">처리 중</option>
          <option value="RESOLVED">해결됨</option>
        </select>
        <button
          className="status-button"
          onClick={handleSaveStatus}
          disabled={isSaving || status === inquiry.status}
        >
          {isSaving ? '저장 중...' : '상태 변경'}
        </button>
      </div>

      {/* 문의 상세 카드 */}
      <div className="inquiry-detail-card">
        <div className="inquiry-header">
          <h2 className="inquiry-title">
            {inquiry.title}
            {inquiry.isPrivate && <FaLock className="private-icon" title="비밀글" />}
          </h2>
          <div className="inquiry-meta">
            <span>
              <FaUser /> {inquiry.username}
            </span>
            <span>
              <FaClock /> {formatDateTime(inquiry.createdAt)}
            </span>
            {inquiry.countryName && (
              <span>
                국가: {inquiry.countryName}
              </span>
            )}
          </div>
        </div>

        <div className="inquiry-content">
          <h3>문의 내용</h3>
          <div className="content-text">{inquiry.content}</div>
        </div>

        {inquiry.responses && inquiry.responses.length > 0 && (
          <div className="responses-section">
            <h3>답변 내역</h3>
            <div className="responses-list">
              {inquiry.responses.map((resp) => (
                <div key={resp.id} className="response-item">
                  <div className="response-header">
                    <span className="admin-name">{resp.adminName}</span>
                    <span className="response-date">
                      {formatDateTime(resp.createdAt)}
                    </span>
                  </div>
                  <div className="response-content">{resp.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 답변 작성 폼 */}
      <ResponseForm
        inquiryId={inquiry.id}
        onResponseSubmitted={handleResponseSubmitted}
      />
    </div>
  );
};

export default InquiryDetail;