import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaLock, FaCheck, FaSpinner, FaHourglassHalf, FaFilter } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { formatDateTime } from '../../utils/dateUtils';

/**
 * 관리자용 문의 목록 컴포넌트
 */
const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 문의 목록 조회
  const fetchInquiries = async (page, status) => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllInquiries(page, 10, status);
      setInquiries(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (err) {
      setError('문의 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 목록 조회
  useEffect(() => {
    fetchInquiries(0, statusFilter);
  }, [statusFilter]);

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

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>문의 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return <div className="admin-error-message">{error}</div>;
  }

  return (
    <div className="admin-inquiry-list">
      <h1 className="admin-title">문의 관리</h1>
      
      {/* 필터 */}
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
              <th className="column-small">보기</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">문의 내역이 없습니다.</td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className={inquiry.hasResponse ? 'has-response' : ''}>
                  <td>{inquiry.id}</td>
                  <td>
                    <div className="inquiry-title">
                      {inquiry.title}
                      {inquiry.isPrivate && <FaLock className="private-icon" title="비밀글" />}
                    </div>
                  </td>
                  <td>{inquiry.username}</td>
                  <td>{formatDateTime(inquiry.createdAt)}</td>
                  <td>{getStatusIcon(inquiry.status)}</td>
                  <td>
                    <Link 
                      to={`/admin/inquiries/${inquiry.id}`} 
                      className="view-button"
                      title="상세 보기"
                    >
                      <FaEye />
                    </Link>
                  </td>
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
    </div>
  );
};

export default InquiryList;