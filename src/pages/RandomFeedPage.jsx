/**
 * 랜덤 피드 페이지 (더미 데이터)
 *
 * 랜덤하게 이미지를 보여주는 페이지
 */

import { useState } from 'react';
import ImageCard from '../components/ImageCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

// 더미 이미지 풀 (여기서 랜덤하게 선택)
const imagePools = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1686904423955-b2b48c6b123f?w=400',
    prompt: 'A beautiful sunset over the mountains',
    model_name: 'DALL-E 3',
    like_count: 42,
    is_tournament_opt_in: true,
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400',
    prompt: 'Futuristic city with neon lights',
    model_name: 'Midjourney',
    like_count: 128,
    is_tournament_opt_in: true,
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1707343846606-af9e406d584c?w=400',
    prompt: 'Peaceful zen garden',
    model_name: 'Stable Diffusion',
    like_count: 87,
    is_tournament_opt_in: false,
  },
  {
    id: 4,
    image_url: 'https://images.unsplash.com/photo-1707343845208-19828dc22c0f?w=400',
    prompt: 'Abstract geometric patterns',
    model_name: 'DALL-E 3',
    like_count: 56,
    is_tournament_opt_in: true,
  },
  {
    id: 5,
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    prompt: 'Majestic dragon flying',
    model_name: 'Midjourney',
    like_count: 234,
    is_tournament_opt_in: true,
  },
  {
    id: 6,
    image_url: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400',
    prompt: 'Cozy reading nook',
    model_name: 'Stable Diffusion',
    like_count: 91,
    is_tournament_opt_in: false,
  },
  {
    id: 7,
    image_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7f7e7d?w=400',
    prompt: 'Underwater coral reef scene',
    model_name: 'DALL-E 3',
    like_count: 145,
    is_tournament_opt_in: true,
  },
  {
    id: 8,
    image_url: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=400',
    prompt: 'Space station orbiting Earth',
    model_name: 'Midjourney',
    like_count: 178,
    is_tournament_opt_in: true,
  },
];

// 랜덤하게 이미지 선택 함수
const getRandomImages = (count = 20) => {
  const shuffled = [...imagePools].sort(() => Math.random() - 0.5);
  // 더 많은 이미지를 보여주기 위해 반복
  const result = [];
  for (let i = 0; i < count; i++) {
    const image = shuffled[i % shuffled.length];
    result.push({ ...image, id: `${image.id}-${i}` }); // 고유 ID 생성
  }
  return result;
};

const RandomFeedPage = () => {
  const [images, setImages] = useState(getRandomImages(20));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 새로고침 핸들러
  const handleRefresh = () => {
    setIsRefreshing(true);

    // 애니메이션 효과를 위한 딜레이
    setTimeout(() => {
      setImages(getRandomImages(20));
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              랜덤 피드
            </h1>
            <Button
              variant="primary"
              size="medium"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <span className="flex items-center gap-2">
                <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                새로고침
              </span>
            </Button>
          </div>
          <p className="text-muted-light dark:text-muted-dark">
            매번 다른 이미지를 발견해보세요
          </p>
          <div className="mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 더미 데이터 모드
            </p>
          </div>
        </div>

        {/* 로딩 상태 */}
        {isRefreshing ? (
          <div className="py-20">
            <LoadingSpinner size="large" text="새로운 이미지를 불러오는 중..." />
          </div>
        ) : (
          <>
            {/* 이미지 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>

            {/* 더 보기 버튼 */}
            <div className="mt-8 text-center">
              <Button
                variant="secondary"
                size="large"
                onClick={handleRefresh}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined">autorenew</span>
                  다른 이미지 보기
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RandomFeedPage;
