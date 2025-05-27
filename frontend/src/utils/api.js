import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json;charset=UTF-8'
  }
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 데이터가 객체인 경우 JSON 문자열로 변환하여 한글 인코딩 처리
    if (config.data && typeof config.data === 'object') {
      // 이미 문자열인 경우 다시 JSON.stringify 하지 않음
      if (typeof config.data !== 'string') {
        try {
          // 한글 데이터 확인을 위한 로깅
          console.log('요청 데이터:', config.data);
        } catch (err) {
          console.error('데이터 로깅 오류:', err);
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 응답 오류 로깅
      console.error('API 응답 오류:', error.response.status, error.response.data);
      
      // 401 오류 - 로그인 페이지로 리다이렉트하지 않음
      if (error.response.status === 401) {
        return Promise.reject(error);
      }
      
      // 400 오류 - 서버에서 반환한 오류 메시지 확인
      if (error.response.status === 400) {
        console.error('400 오류 세부 정보:', error.response.data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('응답 없음:', error.request);
    } else {
      // 요청 설정 중 오류 발생
      console.error('요청 오류:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 특수 메서드: 한글 데이터 전송을 위한 URL 인코딩 사용
api.postWithEncoding = (url, data) => {
  const params = new URLSearchParams();
  
  // 객체의 각 속성을 URL 인코딩 파라미터로 변환
  Object.keys(data).forEach(key => {
    params.append(key, data[key]);
  });
  
  return api.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  });
};

// 한글 데이터를 다루는 퀴즈 제출 전용 메서드
api.submitQuizAnswer = (attemptId, data) => {
  // 한글 데이터를 다루기 위한 특별한 처리
  return api.post(`/api/quizzes/attempts/${attemptId}/submit`, data, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Handle-Korean': 'true' // 서버에서 한글 처리를 위한 커스텀 헤더
    },
    transformRequest: [(data) => {
      return JSON.stringify(data);
    }]
  });
};

// 퀴즈 완료 전용 메서드
api.completeQuiz = (attemptId) => {
  return api.post(`/api/quizzes/attempts/${attemptId}/complete`, {}, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
};

export default api;