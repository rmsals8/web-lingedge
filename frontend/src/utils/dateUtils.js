// utils/dateUtils.js
/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param {Date} date 변환할 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  /**
   * 날짜를 YYYY-MM-DD HH:MM:SS 형식으로 포맷팅
   * @param {Date} date 변환할 날짜
   * @returns {string} 포맷팅된 날짜 및 시간 문자열
   */
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  /**
   * 오늘 기준으로 N일 전 날짜 계산
   * @param {number} days 이전 일수
   * @returns {Date} N일 전 날짜
   */
  export const getDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };
  
  /**
   * 두 날짜 사이의 일수 차이 계산
   * @param {Date} date1 첫 번째 날짜
   * @param {Date} date2 두 번째 날짜
   * @returns {number} 일수 차이
   */
  export const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };