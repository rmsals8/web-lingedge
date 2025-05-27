// services/statisticsService.js
import api from '../utils/api';
import { formatDate } from '../utils/dateUtils';

/**
 * 통계 서비스 - 통계 관련 API 호출
 */
const statisticsService = {
  /**
   * 일별 방문자 통계 조회
   * @param {Date|string} startDate 시작 날짜
   * @param {Date|string} endDate 종료 날짜
   * @returns {Promise<Object>} 일별 방문자 통계
   */
  async getDailyVisitors(startDate, endDate) {
    // 날짜가 Date 객체인 경우 문자열로 변환
    const start = startDate instanceof Date ? formatDate(startDate) : startDate;
    const end = endDate instanceof Date ? formatDate(endDate) : endDate;
    
    const url = `/api/admin/statistics/daily-visitors?startDate=${start}&endDate=${end}`;
    console.log('Calling API:', url);
    const response = await api.get(url);
    return response.data;
  },
  
  /**
   * 국가별 방문자 통계 조회
   * @param {Date|string} startDate 시작 날짜
   * @param {Date|string} endDate 종료 날짜
   * @returns {Promise<Object>} 국가별 방문자 통계
   */
  async getVisitorsByCountry(startDate, endDate) {
    // 날짜가 Date 객체인 경우 문자열로 변환
    const start = startDate instanceof Date ? formatDate(startDate) : startDate;
    const end = endDate instanceof Date ? formatDate(endDate) : endDate;
    
    const url = `/api/admin/statistics/visitors-by-country?startDate=${start}&endDate=${end}`;
    console.log('Calling API:', url);
    const response = await api.get(url);
    return response.data;
  },
  
  /**
   * 문의 통계 조회 - 상태별 문의 수
   * @param {Date|string} startDate 시작 날짜
   * @param {Date|string} endDate 종료 날짜
   * @returns {Promise<Object>} 상태별 문의 통계
   */
  async getInquiryStats(startDate, endDate) {
    try {
      // 날짜가 Date 객체인 경우 문자열로 변환
      const start = startDate instanceof Date ? formatDate(startDate) : startDate;
      const end = endDate instanceof Date ? formatDate(endDate) : endDate;
      
      const url = `/api/admin/statistics/inquiry-stats?startDate=${start}&endDate=${end}`;
      console.log('Calling Inquiry Stats API:', url);
      const response = await api.get(url);
      console.log('Inquiry Stats API Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching inquiry stats:', error);
      throw error;
    }
  },
  
  /**
   * 일별 문의 통계 조회
   * @param {Date|string} startDate 시작 날짜
   * @param {Date|string} endDate 종료 날짜
   * @returns {Promise<Object>} 일별 문의 통계
   */
  async getDailyInquiries(startDate, endDate) {
    // 날짜가 Date 객체인 경우 문자열로 변환
    const start = startDate instanceof Date ? formatDate(startDate) : startDate;
    const end = endDate instanceof Date ? formatDate(endDate) : endDate;
    
    const url = `/api/admin/statistics/daily-inquiries?startDate=${start}&endDate=${end}`;
    console.log('Calling API:', url);
    const response = await api.get(url);
    return response.data;
  },
  
  /**
   * 활성 사용자 통계 조회
   * @param {number} days 최근 일수 (기본값: 30)
   * @returns {Promise<Object>} 활성 사용자 통계
   */
  async getActiveUsers(days = 30) {
    const url = `/api/admin/statistics/active-users?days=${days}`;
    console.log('Calling API:', url);
    const response = await api.get(url);
    return response.data;
  }
};

export default statisticsService;