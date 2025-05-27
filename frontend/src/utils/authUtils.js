// utils/authUtils.js
/**
 * 현재 사용자가 관리자인지 확인
 * @param {Object} user 사용자 객체
 * @returns {boolean} 관리자 여부
 */
export const isAdmin = (user) => {
    if (!user) return false;
    
    // JWT의 roles 배열에서 ADMIN 역할 확인
    return user.roles && user.roles.includes('ADMIN');
  };
  
  /**
   * 로컬 스토리지에서 JWT 토큰 가져오기
   * @returns {string|null} 토큰 또는 null
   */
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  /**
   * 사용자 인증 상태 확인
   * @returns {boolean} 인증 여부
   */
  export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
  };
  
  /**
   * 접근 권한 확인
   * @param {Object} user 사용자 객체
   * @param {string} requiredRole 필요한 역할
   * @returns {boolean} 권한 있음 여부
   */
  export const hasPermission = (user, requiredRole) => {
    if (!user || !user.roles) return false;
    
    if (requiredRole === 'ADMIN') {
      return user.roles.includes('ADMIN');
    }
    
    return true; // 일반 사용자 권한
  };