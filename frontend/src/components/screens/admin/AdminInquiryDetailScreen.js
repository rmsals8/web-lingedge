// src/screens/admin/AdminInquiryDetailScreen.js
import React from 'react';
import AdminLayout from '../../admin/AdminLayout';
import InquiryDetail from '../../admin/InquiryDetail';

/**
 * 관리자 문의 상세 스크린 컴포넌트
 */
const AdminInquiryDetailScreen = () => {
  return (
    <AdminLayout>
      <InquiryDetail />
    </AdminLayout>
  );
};

export default AdminInquiryDetailScreen;