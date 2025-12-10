/**
 * 좋아요 버튼 컴포넌트
 *
 * 하트 아이콘과 좋아요 개수를 표시하는 버튼
 */

import { useState } from 'react';

const LikeButton = ({
  imageId,
  initialLiked = false,
  initialLikeCount = 0,
  onLike,
  disabled = false
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    // 이벤트 전파 중지 (부모 요소 클릭 방지)
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      // 좋아요 상태 토글
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      // 좋아요 수 증가/감소
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

      // 부모 컴포넌트에 전달된 콜백 함수 실행
      if (onLike) {
        await onLike(imageId, newLikedState);
      }
    } catch (error) {
      // 에러 발생 시 원래 상태로 복구
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('좋아요 처리 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-200
        ${isLiked
          ? 'bg-primary/20 text-primary'
          : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark'
        }
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
      `}
    >
      {/* 하트 아이콘 */}
      <span
        className={`material-symbols-outlined text-xl transition-all ${
          isLiked ? 'animate-pulse' : ''
        }`}
        style={{ fontVariationSettings: isLiked ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400" }}
      >
        favorite
      </span>

      {/* 좋아요 수 */}
      <span className="font-medium text-sm">
        {likeCount}
      </span>
    </button>
  );
};

export default LikeButton;
