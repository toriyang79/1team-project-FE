import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImages } from '../api';
import ImageCard from '../components/ImageCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const ImageListPage = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tournamentOnly, setTournamentOnly] = useState(false);

  const pageSize = 20;

  const fetchImages = async (page, filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getImages(page, pageSize, filters);

      if (response.items) {
        setImages(response.items);
        setTotalPages(Math.ceil((response.total || response.items.length) / pageSize));
      } else if (Array.isArray(response)) {
        setImages(response);
        setTotalPages(1);
      } else {
        setImages([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('이미지 목록 조회 중 오류:', err);
      setError('이미지를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filters = tournamentOnly ? { tournament_only: true } : {};
    fetchImages(currentPage, filters);
  }, [currentPage, tournamentOnly]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTournament = () => {
    setTournamentOnly(!tournamentOnly);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            AI 이미지 갤러리
          </h1>
          <p className="text-muted-light dark:text-muted-dark">
            AI로 생성된 멋진 이미지들을 탐색해보세요
          </p>

          <div className="mt-4 mb-6 flex flex-wrap gap-3 justify-center">
            <Link to="/images/top">
              <Button variant="primary" size="small">상위 이미지</Button>
            </Link>
            <Link to="/images/tournament/battle">
              <Button variant="primary" size="small">토너먼트 배틀</Button>
            </Link>
            <Link to="/images/tournament/ranking">
              <Button variant="primary" size="small">토너먼트 랭킹</Button>
            </Link>
          </div>
        </div>

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

        {isLoading && (
          <div className="py-20">
            <LoadingSpinner size="large" text="이미지를 불러오는 중..." />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchImages(currentPage)}>
              다시 시도
            </Button>
          </div>
        )}

        {!isLoading && !error && images.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-xl text-muted-light dark:text-muted-dark mb-2">
              표시할 이미지가 없습니다
            </p>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              필터를 변경하거나 새로고침 해주세요.
            </p>
          </div>
        )}

        {!isLoading && !error && images.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>

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
