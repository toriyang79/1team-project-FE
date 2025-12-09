/**
 * 인기 이미지 페이지
 *
 * 최근 24시간 인기 이미지를 보여주는 페이지
 */

import { useState, useEffect } from 'react';
import { getTopImages } from '../api/imageAPI';
import ImageCard from '../components/ImageCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TopImagesPage = () => {
  const [topImages, setTopImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 인기 이미지 로딩
  useEffect(() => {
    const loadTopImages = async () => {
      try {
        const data = await getTopImages(10);
        setTopImages(data);
      } catch (error) {
        console.error('인기 이미지 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopImages();
  }, []);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <LoadingSpinner size="large" text="인기 이미지를 불러오는 중..." />
      </div>
    );
  }

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
