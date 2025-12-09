/**
 * 메인 App 컴포넌트
 *
 * React Router로 페이지 라우팅 설정
 */

import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ImageListPageDummy from './pages/ImageListPageDummy';
import ImageDetailPage from './pages/ImageDetailPage';
import ImageUploadPage from './pages/ImageUploadPage';
import RandomFeedPage from './pages/RandomFeedPage';
import TopImagesPage from './pages/TopImagesPage';
import TournamentBattlePage from './pages/TournamentBattlePage';
import TournamentRankingPage from './pages/TournamentRankingPage';
import NotFoundPage from './pages/NotFoundPage';
import Button from './components/Button';

function App() {
  const location = useLocation();

  // 현재 경로 확인 함수
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* 네비게이션 바 */}
      <nav className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-surface-light dark:border-surface-dark/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 items-center flex-wrap">
            <span className="text-sm font-medium text-muted-light dark:text-muted-dark mr-2">
              페이지:
            </span>
            <Link to="/">
              <Button
                variant={isActive('/') ? 'primary' : 'secondary'}
                size="small"
              >
                이미지 목록
              </Button>
            </Link>
            <Link to="/random">
              <Button
                variant={isActive('/random') ? 'primary' : 'secondary'}
                size="small"
              >
                랜덤 피드
              </Button>
            </Link>
            <Link to="/top">
              <Button
                variant={isActive('/top') ? 'primary' : 'secondary'}
                size="small"
              >
                인기 Top 10
              </Button>
            </Link>
            <Link to="/tournament/battle">
              <Button
                variant={isActive('/tournament/battle') ? 'primary' : 'secondary'}
                size="small"
              >
                토너먼트 배틀
              </Button>
            </Link>
            <Link to="/tournament/ranking">
              <Button
                variant={isActive('/tournament/ranking') ? 'primary' : 'secondary'}
                size="small"
              >
                토너먼트 랭킹
              </Button>
            </Link>
            <div className="ml-auto">
              <Link to="/upload">
                <Button
                  variant={isActive('/upload') ? 'primary' : 'secondary'}
                  size="small"
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">add</span>
                    업로드
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 페이지 라우팅 */}
      <Routes>
        <Route path="/" element={<ImageListPageDummy />} />
        <Route path="/images/:id" element={<ImageDetailPage />} />
        <Route path="/upload" element={<ImageUploadPage />} />
        <Route path="/random" element={<RandomFeedPage />} />
        <Route path="/top" element={<TopImagesPage />} />
        <Route path="/tournament/battle" element={<TournamentBattlePage />} />
        <Route path="/tournament/ranking" element={<TournamentRankingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
