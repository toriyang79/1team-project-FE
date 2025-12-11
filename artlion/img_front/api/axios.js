import axios from 'axios';

// 팀 내 변수명 충돌을 피하기 위해 API_VIDEO_BASE_URL 사용 (이미지 API용)
// 프로덕션: 직접 백엔드 API 호출, 개발: vite proxy 사용
const getBaseURL = () => {
  // 환경변수가 설정되어 있으면 우선 사용
  if (import.meta.env.VITE_IMG_API_BASE_URL) {
    return import.meta.env.VITE_IMG_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 프로덕션 환경 감지 (localhost가 아니면 프로덕션으로 간주)
  const isProduction = !window.location.hostname.includes('localhost') &&
                       !window.location.hostname.includes('127.0.0.1');

  if (isProduction) {
    // 프로덕션: 백엔드 API 직접 호출
    return 'http://13.125.57.129:8000/api/v1';
  } else {
    // 개발: vite proxy 사용
    return '/img-api';
  }
};

const API_VIDEO_BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: API_VIDEO_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰이 있으면 Authorization 헤더에 추가
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

// 응답 인터셉터: 인증/권한/서버 오류 처리
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
          console.warn('localStorage 초기화 오류:', err?.message);
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
