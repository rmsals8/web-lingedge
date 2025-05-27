import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaCheck, FaSpinner, FaHourglassHalf } from 'react-icons/fa';
import { formatDateTime } from '../../utils/dateUtils';

/**
 * 문의 목록 항목 컴포넌트
 * @param {Object} props
 * @param {Object} props.inquiry 문의 데이터
 */
const InquiryItem = ({ inquiry }) => {
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

  return (
    <tr className={inquiry.hasResponse ? 'has-response' : ''}>
      <td>{inquiry.id}</td>
      <td>
        <Link to={`/inquiries/${inquiry.id}`} className="inquiry-title">
          {inquiry.title}
          {inquiry.isPrivate && <FaLock className="private-icon" title="비밀글" />}
        </Link>
      </td>
      <td>{inquiry.username}</td>
      <td>{formatDateTime(inquiry.createdAt)}</td>
      <td>{getStatusIcon(inquiry.status)}</td>
    </tr>
  );
};

export default InquiryItem;