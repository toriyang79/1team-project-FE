import axios from 'axios';

// 베이스 URL: 환경 변수 우선, 없으면 음악 프록시(/music-api)
const API_BASE_URL = import.meta.env.VITE_MUSIC_API_BASE_URL || '/music-api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터: 로컬스토리지 토큰을 Authorization 헤더로 추가
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn('토큰 로드 실패:', errMsg);
  }
  return config;
});

// 공통 에러 로깅
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('API Error:', error?.response ?? error);
    return Promise.reject(error);
  },
);
