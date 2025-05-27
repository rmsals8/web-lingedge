import React from 'react';
import AdminLayout from '../../admin/AdminLayout';
import InquiryList from '../../admin/InquiryList';

/**
 * 관리자 문의 목록 스크린 컴포넌트
 */
const AdminInquiryListScreen = () => {
  return (
    <AdminLayout>
      <InquiryList />
    </AdminLayout>
  );
};

export default AdminInquiryListScreen;