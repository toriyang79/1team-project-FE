/**
 * Axios ê¸°ë³¸ ì„¤ì •
 */

import axios from 'axios';

// Vite í™˜ê²½ ë³€ìˆ˜ ì‚¬ìš© (VITE_*), ê¸°ë³¸ì€ /img-api í”„ë¡ì‹œ
const api = axios.create({
  baseURL:
    import.meta.env.VITE_IMG_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    '/img-api',
  timeout: 10000, // 10ì´ˆ íƒ€ìž„ì•„ì›ƒ
  headers: {
    'Content-Type': 'application/json',
  },
});

// ìš”ì²­ ì¸í„°ì…‰í„°: JWT í† í°ì´ ìžˆìœ¼ë©´ Authorization í—¤ë” ì¶”ê°€
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
      console.warn('localStorage ì ‘ê·¼ ì˜¤ë¥˜:', error?.message);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ì‘ë‹µ ì¸í„°ì…‰í„°: ì—ëŸ¬ ê³µí†µ ì²˜ë¦¬
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
          console.warn('localStorage ì‚­ì œ ì˜¤ë¥˜:', err?.message);
        }
        window.location.href = '/login';
      }
      if (status === 403) {
        alert('ì ‘ê·¼ ê¶Œí•œì´ ì—†ìŠµë‹ˆë‹¤.');
      }
      if (status === 404) {
        console.error('ìš”ì²­í•œ ë¦¬ì†ŒìŠ¤ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.');
      }
      if (status >= 500) {
        alert('ì„œë²„ ì˜¤ë¥˜ê°€ ë°œìƒí–ˆìŠµë‹ˆë‹¤. ìž ì‹œ í›„ ë‹¤ì‹œ ì‹œë„í•´ì£¼ì„¸ìš”.');
      }
    }
    return Promise.reject(error);
  },
);

export default api;

