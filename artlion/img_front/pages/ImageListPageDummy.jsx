/**
 * 이미지 목록 페이지 (더미 데이터 버전)
 *
 * 백엔드 없이 UI를 테스트하기 위한 임시 페이지
 */

import { useState } from 'react';
import ImageCard from '../components/ImageCard';
import Pagination from '../components/Pagination';
import Button from '../components/Button';

// 더미 이미지 데이터
const dummyImages = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1686904423955-b2b48c6b123f?w=400',
    prompt: 'A beautiful sunset over the mountains with vibrant orange and pink colors painting the sky',
    model_name: 'DALL-E 3',
    like_count: 42,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400',
    prompt: 'Futuristic city with neon lights and flying cars in a cyberpunk style',
    model_name: 'Midjourney',
    like_count: 128,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T11:20:00Z'
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1707343846606-af9e406d584c?w=400',
    prompt: 'Peaceful zen garden with cherry blossoms and a traditional Japanese temple',
    model_name: 'Stable Diffusion',
    like_count: 87,
    is_tournament_opt_in: false,
    created_at: '2024-01-15T12:15:00Z'
  },
  {
    id: 4,
    image_url: 'https://images.unsplash.com/photo-1707343845208-19828dc22c0f?w=400',
    prompt: 'Abstract geometric patterns in vibrant colors with 3D effects',
    model_name: 'DALL-E 3',
    like_count: 56,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T13:45:00Z'
  },
  {
    id: 5,
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    prompt: 'Majestic dragon flying through stormy clouds with lightning in the background',
    model_name: 'Midjourney',
    like_count: 234,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 6,
    image_url: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400',
    prompt: 'Cozy reading nook with warm lighting and comfortable cushions',
    model_name: 'Stable Diffusion',
    like_count: 91,
    is_tournament_opt_in: false,
    created_at: '2024-01-15T15:10:00Z'
  },
  {
    id: 7,
    image_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7f7e7d?w=400',
    prompt: 'Underwater scene with colorful coral reefs and tropical fish',
    model_name: 'DALL-E 3',
    like_count: 145,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T16:25:00Z'
  },
  {
    id: 8,
    image_url: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=400',
    prompt: 'Space station orbiting Earth with astronauts in the background',
    model_name: 'Midjourney',
    like_count: 178,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T17:40:00Z'
  },
  {
    id: 9,
    image_url: 'https://images.unsplash.com/photo-1682687982468-4584ff11f88a?w=400',
    prompt: 'Enchanted forest with glowing mushrooms and fairy lights',
    model_name: 'Stable Diffusion',
    like_count: 203,
    is_tournament_opt_in: false,
    created_at: '2024-01-15T18:15:00Z'
  },
  {
    id: 10,
    image_url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=400',
    prompt: 'Steampunk airship flying over Victorian-era city at dusk',
    model_name: 'DALL-E 3',
    like_count: 167,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T19:30:00Z'
  },
];

const ImageListPageDummy = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tournamentOnly, setTournamentOnly] = useState(false);

  // 필터 적용
  const filteredImages = tournamentOnly
    ? dummyImages.filter(img => img.is_tournament_opt_in)
    : dummyImages;

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 토너먼트 필터 토글
  const handleToggleTournament = () => {
    setTournamentOnly(!tournamentOnly);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            AI 이미지 갤러리
          </h1>
          <p className="text-muted-light dark:text-muted-dark">
            AI로 생성된 멋진 이미지들을 탐색해보세요
          </p>
          <div className="mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 더미 데이터 모드 - 백엔드 연결 시 실제 데이터로 전환됩니다
            </p>
          </div>
        </div>

        {/* 필터 버튼 */}
        <div className="mb-6 flex gap-3 items-center">
          <span className="text-sm text-muted-light dark:text-muted-dark">필터:</span>
          <Button
            variant={tournamentOnly ? 'primary' : 'secondary'}
            size="small"
            onClick={handleToggleTournament}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">military_tech</span>
              토너먼트 참여 이미지만
            </span>
          </Button>
          <span className="text-sm text-muted-light dark:text-muted-dark ml-auto">
            총 {filteredImages.length}개의 이미지
          </span>
        </div>

        {/* 이미지 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {filteredImages.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>

        {/* 페이지네이션 (더미) */}
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ImageListPageDummy;
