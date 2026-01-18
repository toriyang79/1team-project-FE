/**
 * 좋아요 관련 API 함수들
 *
 * 백엔드의 좋아요 API와 통신하는 함수들
 */

import api from './axios';

// ===== 1. 좋아요 추가 =====
export const addLike = async (imageId) => {
  try {
    const response = await api.post(`/images/${imageId}/like`);
    return response.data;
  } catch (error) {
    console.error('좋아요 추가 실패:', error);
    throw error;
  }
};

// ===== 2. 좋아요 취소 =====
export const removeLike = async (imageId) => {
  try {
    const response = await api.delete(`/images/${imageId}/like`);
    return response.data;
  } catch (error) {
    console.error('좋아요 취소 실패:', error);
    throw error;
  }
};

// ===== 3. 좋아요 상태 조회 =====
export const getLikeStatus = async (imageId) => {
  try {
    const response = await api.get(`/images/${imageId}/like/status`);
    return response.data;
  } catch (error) {
    console.error('좋아요 상태 조회 실패:', error);
    throw error;
  }
};
