/**
 * API 함수 통합 내보내기
 *
 * 모든 API 함수를 한 곳에서 import 할 수 있도록 통합
 */

// 이미지 API
export {
  getImages,
  getImageById,
  uploadImage,
  updateImage,
  deleteImage,
  getRandomFeed,
  getTopImages,
} from './imageAPI';

// 좋아요 API
export {
  addLike,
  removeLike,
  getLikeStatus,
} from './likeAPI';

// 토너먼트 API
export {
  getMatch,
  vote,
  getRankings,
} from './tournamentAPI';
