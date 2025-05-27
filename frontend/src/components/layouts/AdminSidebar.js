// src/components/layouts/AdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();
  
  // 활성 메뉴 항목 확인
  const isActive = (path) => {
    return location.pathname === path ? 'active-menu-item' : '';
  };

  return (
    <div className="admin-sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className={`sidebar-menu-item ${isActive('/admin')}`}>
            <Link to="/admin">
              <i className="icon-dashboard"></i>
              <span>대시보드</span>
            </Link>
          </li>
          
          <li className={`sidebar-menu-item ${isActive('/admin/users')}`}>
            <Link to="/admin/users">
              <i className="icon-users"></i>
              <span>사용자 관리</span>
            </Link>
          </li>
          
          {/* 새로운 모니터링 대시보드 메뉴 항목 추가 */}
          <li className={`sidebar-menu-item ${isActive('/admin/monitoring')}`}>
            <Link to="/admin/monitoring">
              <i className="icon-monitor"></i>
              <span>시스템 모니터링</span>
            </Link>
          </li>
          
          <li className="sidebar-divider"></li>
          
          <li className={`sidebar-menu-item ${isActive('/admin/settings')}`}>
            <Link to="/admin/settings">
              <i className="icon-settings"></i>
              <span>설정</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;