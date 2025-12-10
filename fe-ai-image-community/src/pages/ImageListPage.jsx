/**
 * 이미지 목록 페이지
 *
 * 백엔드 API로부터 이미지 목록을 불러와 그리드 형태로 표시
 */

import { useState, useEffect } from 'react';
import { getImages } from '../api';
import ImageCard from '../components/ImageCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const ImageListPage = () => {
  // 상태 관리
  const [images, setImages] = useState([]); // 이미지 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [tournamentOnly, setTournamentOnly] = useState(false); // 토너먼트 필터

  const pageSize = 20; // 페이지당 이미지 개수

  // 이미지 목록 불러오기
  const fetchImages = async (page, filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getImages(page, pageSize, filters);

      // 응답 데이터 구조에 따라 처리
      if (response.items) {
        setImages(response.items);
        setTotalPages(Math.ceil(response.total / pageSize));
      } else if (Array.isArray(response)) {
        // 배열로 바로 올 경우
        setImages(response);
        setTotalPages(1);
      } else {
        setImages([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('이미지 목록 불러오기 실패:', err);
      setError('이미지를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 시 이미지 다시 불러오기
  useEffect(() => {
    const filters = {};
    if (tournamentOnly) {
      filters.tournament_only = true;
    }

    fetchImages(currentPage, filters);
  }, [currentPage, tournamentOnly]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 맨 위로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 토너먼트 필터 토글
  const handleToggleTournament = () => {
    setTournamentOnly(!tournamentOnly);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
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
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="py-20">
            <LoadingSpinner size="large" text="이미지를 불러오는 중..." />
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchImages(currentPage)}>
              다시 시도
            </Button>
          </div>
        )}

        {/* 이미지가 없을 때 */}
        {!isLoading && !error && images.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-xl text-muted-light dark:text-muted-dark mb-2">
              아직 이미지가 없습니다
            </p>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              첫 번째 이미지를 업로드해보세요!
            </p>
          </div>
        )}

        {/* 이미지 그리드 */}
        {!isLoading && !error && images.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageListPage;
