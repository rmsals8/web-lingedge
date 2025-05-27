import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaLock, FaCheck, FaSpinner, FaHourglassHalf, FaFilter, FaTrashAlt, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import inquiryService from '../../services/inquiryService';
import adminService from '../../services/adminService';
import { formatDateTime } from '../../utils/dateUtils';
import { AuthContext } from '../../context/AuthContext';

/**
 * 문의 목록 컴포넌트 - 관리자와 일반 사용자 모두 사용
 */
const InquiryList = () => {
  const { isAdmin } = useContext(AuthContext);
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin/');
  
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // 문의 삭제 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 문의 목록 조회
  const fetchInquiries = async (page, status) => {
    setIsLoading(true);
    try {
      // 관리자 페이지인 경우 관리자 API 사용, 일반 페이지인 경우 일반 API 사용
      let response;
      
      if (isAdminPage && isAdmin()) {
        console.log("관리자 페이지: 관리자용 문의 목록 API 사용");
        response = await adminService.getAllInquiries(page, 10, status);
      } else {
        console.log("일반 페이지: 일반 문의 목록 API 사용");
        response = await inquiryService.getInquiries(page, 10);
      }
      
      setInquiries(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (err) {
      setError('문의 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('문의 목록 조회 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 목록 조회
  useEffect(() => {
    fetchInquiries(0, statusFilter);
  }, [statusFilter, isAdminPage, isAdmin]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    fetchInquiries(newPage, statusFilter);
  };

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // 상태별 아이콘 가져오기
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FaHourglassHalf className="status-icon pending" title="대기 중" />;
      case 'IN_PROGRESS':
        return <FaSpinner className="status-icon in-progress" title="처리 중" />;
      case 'RESOLVED':
        return <FaCheck className="status-icon resolved" title="해결됨" />;
      default:
        return null;
    }
  };
  
  // 문의 삭제 모달 표시
  const showDeleteConfirm = (inquiry, e) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation(); // 이벤트 버블링 방지
    setInquiryToDelete(inquiry);
    setShowDeleteModal(true);
  };
  
  // 문의 삭제 처리
  const handleDeleteInquiry = async () => {
    if (!inquiryToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminService.deleteInquiry(inquiryToDelete.id);
      
      // 목록에서 삭제된 항목 제거
      setInquiries(inquiries.filter(item => item.id !== inquiryToDelete.id));
      
      setShowDeleteModal(false);
      setInquiryToDelete(null);
      alert('문의가 성공적으로 삭제되었습니다.');
    } catch (err) {
      setError('문의 삭제 중 오류가 발생했습니다.');
      console.error(err);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>문의 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="inquiry-list-container">
      <div className="inquiry-list-header">
        <h2>문의 목록</h2>
        {!isAdminPage && (
          <button
            onClick={() => navigate('/inquiries/new')}
            className="btn-primary"
          >
            <FaPlus /> 문의 작성
          </button>
        )}
      </div>
      
      {/* 관리자 페이지인 경우에만 필터 표시 */}
      {isAdminPage && isAdmin() && (
        <div className="filter-container">
          <div className="filter-item">
            <FaFilter />
            <label htmlFor="status-filter">상태:</label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">전체</option>
              <option value="PENDING">대기 중</option>
              <option value="IN_PROGRESS">처리 중</option>
              <option value="RESOLVED">해결됨</option>
            </select>
          </div>
        </div>
      )}
      
      {/* 문의 목록 */}
      <div className="inquiry-table-container">
        <table className="inquiry-table">
          <thead>
            <tr>
              <th className="column-small">번호</th>
              <th>제목</th>
              <th className="column-medium">작성자</th>
              <th className="column-medium">작성일</th>
              <th className="column-small">상태</th>
              {isAdminPage && isAdmin() && (
                <th className="column-small">관리</th>
              )}
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={isAdminPage && isAdmin() ? "6" : "5"} className="no-data">문의 내역이 없습니다.</td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className={inquiry.hasResponse ? 'has-response' : ''}>
                  <td>{inquiry.id}</td>
                  <td>
                    <div className="inquiry-title">
                      <Link to={isAdminPage ? `/admin/inquiries/${inquiry.id}` : `/inquiries/${inquiry.id}`}>
                        {inquiry.title}
                        {inquiry.isPrivate && <FaLock className="private-icon" title="비밀글" />}
                      </Link>
                    </div>
                  </td>
                  <td>{inquiry.username}</td>
                  <td>{formatDateTime(inquiry.createdAt)}</td>
                  <td>{getStatusIcon(inquiry.status)}</td>
                  {isAdminPage && isAdmin() && (
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/admin/inquiries/${inquiry.id}`} 
                          className="view-button"
                          title="상세 보기"
                        >
                          <FaEye />
                        </Link>
                        <button
                          className="delete-button"
                          onClick={(e) => showDeleteConfirm(inquiry, e)}
                          title="삭제"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <div 
            className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
          >
            <span className="page-link">&laquo;</span>
          </div>
          
          {[...Array(totalPages).keys()].map(page => (
            <div
              key={page}
              className={`page-item ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              <span className="page-link">{page + 1}</span>
            </div>
          ))}
          
          <div
            className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
          >
            <span className="page-link">&raquo;</span>
          </div>
        </div>
      )}
      
      {/* 문의 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>문의 삭제 확인</h3>
            </div>
            <div className="delete-modal-body">
              <p>정말로 아래 문의를 삭제하시겠습니까?</p>
              <p className="inquiry-to-delete-title">"{inquiryToDelete?.title}"</p>
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
    </div>
  );
};

export default InquiryList;