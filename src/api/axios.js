/**
 * Axios 인스턴스 설정
 *
 * 백엔드 API와 통신하기 위한 기본 설정
 */

import axios from 'axios';

// 기본 API 인스턴스
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('token');

    if (token) {
      // Authorization 헤더에 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 에러 응답 처리
    if (error.response) {
      const { status } = error.response;

      // 401 에러: 인증 실패 (토큰 만료 등)
      if (status === 401) {
        // 토큰 삭제
        localStorage.removeItem('token');
        // 로그인 페이지로 리다이렉트 (나중에 구현)
        window.location.href = '/login';
      }

      // 403 에러: 권한 없음
      if (status === 403) {
        alert('권한이 없습니다.');
      }

      // 404 에러: 리소스 없음
      if (status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다.');
      }

      // 500 에러: 서버 오류
      if (status >= 500) {
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
