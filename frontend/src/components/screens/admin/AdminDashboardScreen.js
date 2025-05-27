import React from 'react';
import AdminLayout from '../../admin/AdminLayout';
import Dashboard from '../../admin/Dashboard';

/**
 * 관리자 대시보드 스크린 컴포넌트
 */
const AdminDashboardScreen = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminDashboardScreen;