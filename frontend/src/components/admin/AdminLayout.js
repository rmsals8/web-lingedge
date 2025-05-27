import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaTicketAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import '../../styles/admin.css';

/**
 * 관리자 페이지 레이아웃 컴포넌트
 * @param {Object} props 컴포넌트 속성
 * @param {ReactNode} props.children 자식 컴포넌트
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <FaTachometerAlt />
          <span>LingEdge Admin</span>
        </div>
        <ul className="admin-menu">
          <li className="admin-menu-item">
            <Link 
              to="/admin/dashboard" 
              className={`admin-menu-link ${path === '/admin/dashboard' ? 'active' : ''}`}
            >
              <FaChartLine /> 대시보드
            </Link>
          </li>
          <li className="admin-menu-item">
            <Link 
              to="/admin/inquiries" 
              className={`admin-menu-link ${path.includes('/admin/inquiries') ? 'active' : ''}`}
            >
              <FaTicketAlt /> 문의 관리
            </Link>
          </li>
          <li className="admin-menu-item">
            <Link to="/" className="admin-menu-link">
              <FaSignOutAlt /> 사용자 페이지로
            </Link>
          </li>
        </ul>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;