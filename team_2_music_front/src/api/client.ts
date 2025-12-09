import axios from 'axios';

const userId = import.meta.env.VITE_DEV_USER_ID;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  // VITE_DEV_USER_ID가 없으면 헤더를 넣지 않아 422/401을 방지
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 간단한 로깅용 인터셉터
    console.error('API Error:', error?.response ?? error);
    return Promise.reject(error);
  },
);
