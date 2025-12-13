import axios from 'axios';

// 패 내 변수명 충돌을 피하기 위해 API_VIDEO_BASE_URL 사용 (이미지 API용)
// 프로덕션: 직접 백엔드 API 호출, 개발: vite proxy 사용
const getBaseURL = () => {
  const env = import.meta?.env || {};

  // Vite 환경변수(VITE_*) 활용
  if (env.VITE_IMG_MEDIA_BASE_URL) {
    return env.VITE_IMG_MEDIA_BASE_URL;
  }
  if (env.VITE_IMG_API_BASE_URL) {
    return env.VITE_IMG_API_BASE_URL;
  }

  // CRA 스타일 환경변수도 허용
  if (env.REACT_APP_IMG_MEDIA_BASE_URL) {
    return env.REACT_APP_IMG_MEDIA_BASE_URL;
  }
  if (env.REACT_APP_IMG_API_BASE_URL) {
    return env.REACT_APP_IMG_API_BASE_URL;
  }

  // 프로덕션 환경 감지 (localhost / 127.0.0.1 이외)
  const isProduction =
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1');

  if (isProduction) {
    // 프로덕션: 백엔드 API 직접 호출(HTTPS 기본값으로 혼합 콘텐츠 방지)
    return 'https://www.imagelion.p-e.kr/api-image/v1';
  } else {
    // 개발: vite proxy 사용
    return '/img-api';
  }
};

const API_VIDEO_BASE_URL = getBaseURL();

// 디버깅: baseURL 확인
console.log('[img_front axios] baseURL:', API_VIDEO_BASE_URL);
console.log('[img_front axios] hostname:', window.location.hostname);

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
        // music_front와 동일한 키 사용: 'access_token'
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('[axios] 토큰 추가됨');
        } else {
          console.warn('[axios] access_token이 없습니다');
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
    console.error('API Error:', error?.response ?? error);
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            // music_front와 동일한 키 사용: 'access_token'
            localStorage.removeItem('access_token');
          }
        } catch (err) {
          console.warn('localStorage 초기화 오류:', err?.message);
        }
        // 로그인 페이지로 리다이렉트하지 않고 에러만 반환
        // window.location.href = '/login';
      }
      if (status === 403) {
        console.error('접근 권한이 없습니다.');
      }
      if (status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다.');
      }
      if (status >= 500) {
        console.error('서버 오류가 발생했습니다.');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
