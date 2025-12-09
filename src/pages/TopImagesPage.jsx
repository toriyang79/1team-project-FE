/**
 * 인기 이미지 페이지 (더미 데이터)
 *
 * 최근 24시간 인기 이미지를 보여주는 페이지
 */

import { useState } from 'react';
import ImageCard from '../components/ImageCard';

// 더미 인기 이미지 데이터 (좋아요 순 정렬)
const topImages = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    prompt: 'Majestic dragon flying through stormy clouds with lightning',
    model_name: 'Midjourney',
    like_count: 456,
    is_tournament_opt_in: true,
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1682687982468-4584ff11f88a?w=400',
    prompt: 'Enchanted forest with glowing mushrooms and fairy lights',
    model_name: 'Stable Diffusion',
    like_count: 389,
    is_tournament_opt_in: false,
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400',
    prompt: 'Futuristic city with neon lights and flying cars',
    model_name: 'Midjourney',
    like_count: 342,
    is_tournament_opt_in: true,
  },
  {
    id: 4,
    image_url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=400',
    prompt: 'Steampunk airship flying over Victorian-era city',
    model_name: 'DALL-E 3',
    like_count: 298,
    is_tournament_opt_in: true,
  },
  {
    id: 5,
    image_url: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=400',
    prompt: 'Space station orbiting Earth with astronauts',
    model_name: 'Midjourney',
    like_count: 267,
    is_tournament_opt_in: true,
  },
  {
    id: 6,
    image_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7f7e7d?w=400',
    prompt: 'Underwater scene with colorful coral reefs',
    model_name: 'DALL-E 3',
    like_count: 234,
    is_tournament_opt_in: true,
  },
  {
    id: 7,
    image_url: 'https://images.unsplash.com/photo-1686904423955-b2b48c6b123f?w=400',
    prompt: 'Beautiful sunset over the mountains',
    model_name: 'DALL-E 3',
    like_count: 198,
    is_tournament_opt_in: true,
  },
  {
    id: 8,
    image_url: 'https://images.unsplash.com/photo-1707343846606-af9e406d584c?w=400',
    prompt: 'Peaceful zen garden with cherry blossoms',
    model_name: 'Stable Diffusion',
    like_count: 176,
    is_tournament_opt_in: false,
  },
  {
    id: 9,
    image_url: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400',
    prompt: 'Cozy reading nook with warm lighting',
    model_name: 'Stable Diffusion',
    like_count: 145,
    is_tournament_opt_in: false,
  },
  {
    id: 10,
    image_url: 'https://images.unsplash.com/photo-1707343845208-19828dc22c0f?w=400',
    prompt: 'Abstract geometric patterns in vibrant colors',
    model_name: 'DALL-E 3',
    like_count: 132,
    is_tournament_opt_in: true,
  },
];

const TopImagesPage = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-5xl text-primary">
              trending_up
            </span>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              인기 이미지 Top 10
            </h1>
          </div>
          <p className="text-muted-light dark:text-muted-dark">
            최근 24시간 동안 가장 많은 좋아요를 받은 이미지
          </p>
          <div className="mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 더미 데이터 모드
            </p>
          </div>
        </div>

        {/* 인기 이미지 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topImages.map((image, index) => (
            <div key={image.id} className="relative">
              {/* 순위 배지 */}
              <div className="absolute -top-3 -left-3 z-10">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    font-bold text-lg shadow-lg
                    ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-900'
                        : index === 2
                        ? 'bg-orange-400 text-orange-900'
                        : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark'
                    }
                  `}
                >
                  {index + 1}
                </div>
              </div>

              {/* 이미지 카드 */}
              <ImageCard image={image} />

              {/* 좋아요 수 강조 */}
              <div className="mt-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">favorite</span>
                  <span className="text-lg font-bold text-text-light dark:text-text-dark">
                    {image.like_count.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-light dark:text-muted-dark">
                    좋아요
                  </span>
                </div>
                {index < 3 && (
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                    TOP {index + 1}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 text-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl">
          <p className="text-muted-light dark:text-muted-dark">
            💡 매일 자정에 순위가 업데이트됩니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopImagesPage;
