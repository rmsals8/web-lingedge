import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // JWT 토큰에서 이메일 추출을 시도
      try {
        const decodedToken = jwtDecode(token);
        // JWT 토큰에 이메일 정보가 있을 경우 헤더에 추가
        if (decodedToken.email) {
          config.headers['X-User-Email'] = decodedToken.email;
        }
      } catch (error) {
        console.error('Error decoding token in interceptor:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 오류 발생 시 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // 로그인 페이지로 리다이렉트하지 않고 에러만 반환
      console.error('Authentication error: Token expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default api;