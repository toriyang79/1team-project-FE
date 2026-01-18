/**
 * 토너먼트 관련 API 함수들
 *
 * 백엔드의 토너먼트 API와 통신하는 함수들
 */

import api from './axios';

// ===== 1. 토너먼트 랜덤 매칭 =====
export const getMatch = async () => {
  try {
    const response = await api.get('/tournaments/match');
    return response.data;
  } catch (error) {
    console.error('토너먼트 매칭 실패:', error);
    throw error;
  }
};

// ===== 2. 토너먼트 투표 =====
export const vote = async (winnerImageId, loserImageId) => {
  try {
    const response = await api.post('/tournaments/vote', {
      winner_image_id: winnerImageId,
      loser_image_id: loserImageId,
    });
    return response.data;
  } catch (error) {
    console.error('토너먼트 투표 실패:', error);
    throw error;
  }
};

// ===== 3. 토너먼트 랭킹 조회 =====
export const getRankings = async (limit = 50) => {
  try {
    const response = await api.get('/tournaments/rankings', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('토너먼트 랭킹 조회 실패:', error);
    throw error;
  }
};
