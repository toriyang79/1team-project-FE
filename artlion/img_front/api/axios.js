/**
 * Axios 기본 설정
 */

import axios from 'axios';

// Vite 환경 변수 사용 (VITE_*), 기본은 /img-api 프록시
const api = axios.create({
  baseURL:
    import.meta.env.VITE_IMG_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    '/img-api',
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰이 있으면 Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn('localStorage 접근 오류:', error?.message);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 에러 공통 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.warn('localStorage 삭제 오류:', err?.message);
        }
        window.location.href = '/login';
      }
      if (status === 403) {
        alert('접근 권한이 없습니다.');
      }
      if (status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다.');
      }
      if (status >= 500) {
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
