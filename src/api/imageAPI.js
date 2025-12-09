/**
 * 이미지 관련 API 함수들
 *
 * 백엔드의 이미지 API와 통신하는 함수들
 */

import api from './axios';

// ===== 1. 이미지 목록 조회 =====
export const getImages = async (page = 1, size = 20, filters = {}) => {
  try {
    const params = {
      page,
      size,
      ...filters, // user_id, tournament_only 등
    };

    const response = await api.get('/images/', { params });
    return response.data;
  } catch (error) {
    console.error('이미지 목록 조회 실패:', error);
    throw error;
  }
};

// ===== 2. 이미지 상세 조회 =====
export const getImageById = async (imageId) => {
  try {
    const response = await api.get(`/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('이미지 상세 조회 실패:', error);
    throw error;
  }
};

// ===== 3. 이미지 업로드 =====
export const uploadImage = async (formData) => {
  try {
    // multipart/form-data로 전송
    const response = await api.post('/images/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

// ===== 4. 이미지 수정 =====
export const updateImage = async (imageId, data) => {
  try {
    const response = await api.put(`/images/${imageId}`, data);
    return response.data;
  } catch (error) {
    console.error('이미지 수정 실패:', error);
    throw error;
  }
};

// ===== 5. 이미지 삭제 =====
export const deleteImage = async (imageId) => {
  try {
    await api.delete(`/images/${imageId}`);
    return true;
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    throw error;
  }
};

// ===== 6. 랜덤 피드 조회 =====
export const getRandomFeed = async (limit = 20) => {
  try {
    const response = await api.get('/images/feed/random', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('랜덤 피드 조회 실패:', error);
    throw error;
  }
};

// ===== 7. 인기 Top 이미지 조회 (24시간) =====
export const getTopImages = async (limit = 10) => {
  try {
    const response = await api.get('/images/feed/top-24h', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('인기 이미지 조회 실패:', error);
    throw error;
  }
};
