import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaClock, FaArrowLeft, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import adminService from '../../services/adminService';
import inquiryService from '../../services/inquiryService';
import ResponseForm from './ResponseForm';
import { formatDateTime } from '../../utils/dateUtils';
import { AuthContext } from '../../context/AuthContext';

/**
 * 문의 상세 컴포넌트 - 관리자와 일반 사용자 모두 사용
 */
const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // 모달 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResponseDeleteModal, setShowResponseDeleteModal] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 문의 상세 조회
  useEffect(() => {
    const fetchInquiry = async () => {
      setIsLoading(true);
      try {
        // 관리자인 경우 관리자 API, 일반 사용자인 경우 일반 API 사용
        let data;
        
        if (isAdmin()) {
          console.log("관리자로 접근: 관리자용 API 사용");
          data = await adminService.getInquiryById(id);
        } else {
          console.log("일반 사용자로 접근: 일반 API 사용");
          data = await inquiryService.getInquiryById(id);
        }
        
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
  }, [id, isAdmin]);

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
  
  // 문의 삭제 모달 표시
  const showInquiryDeleteConfirm = () => {
    setShowDeleteModal(true);
  };
  
  // 답변 삭제 모달 표시
  const showResponseDeleteConfirm = (responseId) => {
    setSelectedResponseId(responseId);
    setShowResponseDeleteModal(true);
  };
  
  // 문의 삭제 처리
  const handleDeleteInquiry = async () => {
    setIsDeleting(true);
    try {
      await adminService.deleteInquiry(id);
      alert('문의가 성공적으로 삭제되었습니다.');
      navigate('/admin/inquiries'); // 목록 페이지로 이동
    } catch (err) {
      setError('문의 삭제 중 오류가 발생했습니다.');
      console.error(err);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // 답변 삭제 처리
  const handleDeleteResponse = async () => {
    if (!selectedResponseId) return;
    
    setIsDeleting(true);
    try {
      await adminService.deleteResponse(id, selectedResponseId);
      alert('답변이 성공적으로 삭제되었습니다.');
      
      // 답변 목록 업데이트
      setInquiry({
        ...inquiry,
        responses: inquiry.responses.filter(resp => resp.id !== selectedResponseId)
      });
      
      setShowResponseDeleteModal(false);
    } catch (err) {
      setError('답변 삭제 중 오류가 발생했습니다.');
      console.error(err);
      setShowResponseDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // 문의 데이터가 없는 경우
  if (!inquiry) {
    return <div className="error-message">문의를 찾을 수 없습니다.</div>;
  }

  // 상태 텍스트 가져오기
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '대기 중';
      case 'IN_PROGRESS':
        return '처리 중';
      case 'RESOLVED':
        return '해결됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="inquiry-detail-container">
      {/* 헤더 부분 수정 - 중앙 정렬 스타일 추가 */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '2rem', textAlign: 'center' }}>
        {/* 뒤로가기 버튼은 왼쪽으로 배치 */}
        <button 
          onClick={() => navigate(isAdmin() ? '/admin/inquiries' : '/inquiries')} 
          className="back-button"
          style={{ position: 'absolute', left: 0 }}
        >
          <FaArrowLeft /> 목록으로
        </button>
        
        {/* 타이틀은 중앙에 배치 */}
        <h1 className="admin-title" style={{ margin: '0 auto' }}>문의 상세</h1>
        
        {/* 관리자인 경우 문의 삭제 버튼 오른쪽으로 배치 */}
        {isAdmin() && (
          <button
            className="delete-button danger-button"
            onClick={showInquiryDeleteConfirm}
            title="문의 삭제"
            style={{ position: 'absolute', right: 0 }}
          >
            <FaTrashAlt /> 문의 삭제
          </button>
        )}
      </div>

      {/* 관리자인 경우 상태 변경 컨트롤 표시 */}
      {isAdmin() && (
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
      )}

      {/* 문의 상세 카드 - 중앙 정렬 */}
      <div className="inquiry-detail-card" style={{ margin: '0 auto', maxWidth: '800px' }}>
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
            <span className="inquiry-status">
              상태: {getStatusText(inquiry.status)}
            </span>
            {inquiry.countryName && (
              <span className="inquiry-country">
                위치: {inquiry.countryName}
              </span>
            )}
          </div>
        </div>

        <div className="inquiry-content">
          <h3>문의 내용</h3>
          <div className="content-text">{inquiry.content}</div>
        </div>

        {/* 답변 목록 */}
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
                    {/* 관리자인 경우 답변 삭제 버튼 표시 */}
                    {isAdmin() && (
                      <button 
                        className="delete-response-button"
                        onClick={() => showResponseDeleteConfirm(resp.id)}
                        title="답변 삭제"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                  <div className="response-content">{resp.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 관리자인 경우에만 응답 폼 표시 */}
        {isAdmin() && (
          <ResponseForm 
            inquiryId={inquiry.id}
            onResponseSubmitted={handleResponseSubmitted}
          />
        )}
      </div>
      
      {/* 문의 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>문의 삭제 확인</h3>
            </div>
            <div className="delete-modal-body">
              <p>정말로 이 문의를 삭제하시겠습니까?</p>
              <p>이 작업은 되돌릴 수 없으며, 모든 관련 답변도 함께 삭제됩니다.</p>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                취소
              </button>
              <button 
                className="confirm-delete-button"
                onClick={handleDeleteInquiry}
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 답변 삭제 확인 모달 */}
      {showResponseDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>답변 삭제 확인</h3>
            </div>
            <div className="delete-modal-body">
              <p>정말로 이 답변을 삭제하시겠습니까?</p>
              <p>이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowResponseDeleteModal(false)}
                disabled={isDeleting}
              >
                취소
              </button>
              <button 
                className="confirm-delete-button"
                onClick={handleDeleteResponse}
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryDetail;