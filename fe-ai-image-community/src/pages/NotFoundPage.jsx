/**
 * 404 페이지
 *
 * 존재하지 않는 경로 접근 시 표시
 */

import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 아이콘 */}
        <div className="mb-8">
          <span className="material-symbols-outlined text-9xl text-primary">
            error_outline
          </span>
        </div>

        {/* 404 텍스트 */}
        <h1 className="text-6xl font-bold text-text-light dark:text-text-dark mb-4">
          404
        </h1>

        {/* 설명 */}
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-muted-light dark:text-muted-dark mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 다시 확인해주세요.
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">home</span>
              홈으로 가기
            </span>
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => navigate(-1)}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              이전 페이지
            </span>
          </Button>
        </div>

        {/* 추천 링크 */}
        <div className="mt-12 pt-8 border-t border-surface-light dark:border-surface-dark">
          <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
            추천 페이지
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => navigate('/random')}
              className="px-4 py-2 bg-surface-light dark:bg-surface-dark rounded-lg text-sm text-text-light dark:text-text-dark hover:bg-primary/20 transition-colors"
            >
              랜덤 피드
            </button>
            <button
              onClick={() => navigate('/top')}
              className="px-4 py-2 bg-surface-light dark:bg-surface-dark rounded-lg text-sm text-text-light dark:text-text-dark hover:bg-primary/20 transition-colors"
            >
              인기 Top 10
            </button>
            <button
              onClick={() => navigate('/tournament/battle')}
              className="px-4 py-2 bg-surface-light dark:bg-surface-dark rounded-lg text-sm text-text-light dark:text-text-dark hover:bg-primary/20 transition-colors"
            >
              토너먼트 배틀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
