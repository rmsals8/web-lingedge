// src/services/adminService.js
import api from '../utils/api';

/**
 * 관리자 서비스 - 관리자 관련 API 호출
 */
const adminService = {
  /**
   * 모든 문의 목록 조회 (관리자용)
   * @param {number} page 페이지 번호 (0부터 시작)
   * @param {number} size 페이지 크기
   * @param {string} status 필터링할 상태 (선택 사항)
   * @returns {Promise<Object>} 페이징된 문의 목록
   */
  async getAllInquiries(page = 0, size = 10, status = '') {
    try {
      // URL 파라미터 구성
      let url = `/api/admin/inquiries?page=${page}&size=${size}`;
      if (status) {
        url += `&status=${status}`;
      }

      // 디버깅을 위한 로그
      console.log(`Requesting: ${url}`);
      
      const response = await api.get(url);
      
      // 응답 확인
      console.log('Response received:', response.data);
      
      return response.data;
    } catch (error) {
      // 에러 상세 로깅
      console.error('Error fetching inquiries:', error);
      if (error.response) {
        // 서버 응답이 있는 경우
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('No response received:', error.request);
      } else {
        // 요청 설정 중 오류 발생
        console.error('Request error:', error.message);
      }
      throw error;
    }
  },
  
  /**
   * 문의 상세 조회 (관리자용)
   * @param {number} id 문의 ID
   * @returns {Promise<Object>} 문의 상세 정보
   */
  async getInquiryById(id) {
    try {
      const url = `/api/inquiries/${id}`;
      console.log(`Requesting: ${url}`);
      
      const response = await api.get(url);
      console.log('Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching inquiry detail:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },
  
  /**
   * 문의 상태 변경
   * @param {number} id 문의 ID
   * @param {string} status 변경할 상태
   * @returns {Promise<Object>} 업데이트된 문의 정보
   */
  async updateInquiryStatus(id, status) {
    try {
      const url = `/api/admin/inquiries/${id}/status`;
      console.log(`Updating status at: ${url} with status: ${status}`);
      
      const response = await api.put(url, { status });
      console.log('Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },
  
  /**
   * 문의 답변 등록
   * @param {number} inquiryId 문의 ID
   * @param {string} content 답변 내용
   * @returns {Promise<Object>} 생성된 답변 정보
   */
  async createResponse(inquiryId, content) {
    try {
      const url = `/api/admin/inquiries/${inquiryId}/responses`;
      console.log(`Creating response at: ${url} with content:`, content);
      
      const response = await api.post(url, { content });
      console.log('Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating response:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * 문의 삭제 (관리자 전용)
   * @param {number} id 문의 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  async deleteInquiry(id) {
    try {
      const url = `/api/admin/inquiries/${id}`;
      console.log(`Deleting inquiry at: ${url}`);
      
      const response = await api.delete(url);
      console.log('Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },
  
  /**
   * 문의 답변 삭제 (관리자 전용)
   * @param {number} inquiryId 문의 ID
   * @param {number} responseId 답변 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  async deleteResponse(inquiryId, responseId) {
    try {
      const url = `/api/admin/inquiries/${inquiryId}/responses/${responseId}`;
      console.log(`Deleting response at: ${url}`);
      
      const response = await api.delete(url);
      console.log('Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error deleting response:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
};

export default adminService;