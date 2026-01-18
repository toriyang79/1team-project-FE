/**
 * 랜덤 피드 페이지
 *
 * 랜덤하게 이미지를 보여주는 페이지
 */

import { useState, useEffect } from 'react';
import { getRandomFeed } from '../api/imageAPI';
import ImageCard from '../components/ImageCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const RandomFeedPage = () => {
  const [images, setImages] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 랜덤 이미지 로딩
  const loadRandomImages = async () => {
    try {
      const data = await getRandomFeed(20);
      setImages(data);
    } catch (error) {
      console.error('랜덤 이미지 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    loadRandomImages();
  }, []);

  // 새로고침 핸들러
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRandomFeed(20);
      setImages(data);
    } catch (error) {
      console.error('새로고침 실패:', error);
    } finally {
      setIsRefreshing(false);
    }
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
        </div>

        {/* 로딩 상태 */}
        {isLoading || isRefreshing ? (
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
