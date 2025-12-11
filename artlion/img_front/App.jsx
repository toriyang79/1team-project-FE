import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ImageListPage from './pages/ImageListPage';
// import ImageListPageDummy from './pages/ImageListPageDummy';
import ImageDetailPage from './pages/ImageDetailPage';
import ImageUploadPage from './pages/ImageUploadPage';
import RandomFeedPage from './pages/RandomFeedPage';
import TopImagesPage from './pages/TopImagesPage';
import TournamentBattlePage from './pages/TournamentBattlePage';
import TournamentRankingPage from './pages/TournamentRankingPage';
import NotFoundPage from './pages/NotFoundPage';

// 공용 네브/풋터
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
// 인증 컨텍스트
import { useAuth } from '../src/contexts/AuthContext';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      console.warn('localStorage access denied');
    }
  }, [theme]);

  const handleToggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  const handleSearch = (query) => {
    // 검색어를 쿼리스트링으로 전달 (필요 시 리스트 페이지에서 사용)
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    navigate(`/${params}`);
  };
  const handleUploadClick = () => navigate('/images/upload');

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen w-full font-display flex flex-col">
      <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-0 md:py-5 flex justify-center w-full">
        <div className="w-full max-w-6xl flex flex-col flex-1">
          <Navbar
            theme={theme}
            onToggleTheme={handleToggleTheme}
            isAuthenticated={isAuthenticated}
            userNickname={user?.nickname}
            onLogout={handleLogout}
            onSearch={handleSearch}
            onUploadClick={handleUploadClick}
          />

          <main className="flex-1 py-6">
            <Routes>
              {/* <Route path="/" element={<ImageListPageDummy />} /> */}
              <Route path="/" element={<ImageListPage />} />
              <Route path="/:id" element={<ImageDetailPage />} />
              <Route path="/upload" element={<ImageUploadPage />} />
              <Route path="/random" element={<RandomFeedPage />} />
              <Route path="/top" element={<TopImagesPage />} />
              <Route path="/tournament/battle" element={<TournamentBattlePage />} />
              <Route path="/tournament/ranking" element={<TournamentRankingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
