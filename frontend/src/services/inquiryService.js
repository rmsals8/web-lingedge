// services/inquiryService.js
import api from '../utils/api';

/**
 * 문의 서비스 - 문의 관련 API 호출
 */
const inquiryService = {

  async createResponse(inquiryId, content) {
    console.log(`응답 생성 API 시작 - inquiryId: ${inquiryId}, content: ${content}`);
    
    try {
      // 올바른 API 경로 확인
      const url = `/api/inquiries/${inquiryId}/responses`;
      console.log("API URL:", url);
      
      // API 호출
      const response = await api.post(url, { content });
      console.log("API 응답 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  },
  /**
   * 문의 목록 조회 (페이징)
   * @param {number} page 페이지 번호 (0부터 시작)
   * @param {number} size 페이지 크기
   * @returns {Promise<Object>} 페이징된 문의 목록
   */
  async getInquiries(page = 0, size = 10) {
    const response = await api.get(`/api/inquiries?page=${page}&size=${size}`);
    return response.data;
  },
  
  /**
   * 문의 상세 조회
   * @param {number} id 문의 ID
   * @returns {Promise<Object>} 문의 상세 정보
   */
  async getInquiryById(id) {
    const response = await api.get(`/api/inquiries/${id}`);
    return response.data;
  },
  
  /**
   * 문의 생성
   * @param {Object} inquiryData 문의 데이터 (title, content, isPrivate)
   * @returns {Promise<Object>} 생성된 문의 정보
   */
  async createInquiry(inquiryData) {
    const response = await api.post('/api/inquiries', inquiryData);
    return response.data;
  },
  
  /**
   * 내 문의 목록 조회
   * @param {number} page 페이지 번호 (0부터 시작)
   * @param {number} size 페이지 크기
   * @returns {Promise<Object>} 페이징된 내 문의 목록
   */
  async getMyInquiries(page = 0, size = 10) {
    const response = await api.get(`/api/inquiries/me?page=${page}&size=${size}`);
    return response.data;
  }
};

export default inquiryService;