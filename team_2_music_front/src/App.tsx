import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import TrackDetailPage from './pages/TrackDetailPage';
import ProfilePage from './pages/ProfilePage';
import PlayerBar from './components/PlayerBar';

const navLinkClass = 'text-sm font-medium leading-normal hover:text-primary transition-colors';

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-background-light text-text-light min-h-screen font-display pb-28">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-5 flex justify-center">
          <div className="w-full max-w-6xl flex flex-col flex-1">
            <header className="flex items-center justify-between whitespace-nowrap px-4 py-3 border-b border-surface-light/70">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">Artlion</h1>
                </div>
                <nav className="hidden md:flex items-center gap-9">
                  <NavLink to="/" className={navLinkClass}>
                    홈
                  </NavLink>
                  <NavLink to="/upload" className={navLinkClass}>
                    업로드
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass}>
                    프로필
                  </NavLink>
                </nav>
              </div>
              <div className="flex gap-2">
                <NavLink
                  to="/upload"
                  className="flex items-center justify-center rounded-full h-10 px-4 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                >
                  새로 올리기
                </NavLink>
                <button className="flex items-center justify-center rounded-full h-10 px-4 bg-surface-light text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:bg-black/5 transition-colors">
                  로그인
                </button>
              </div>
            </header>

            <main className="flex-1 py-10 md:py-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/tracks/:id" element={<TrackDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>

            <footer className="mt-16 border-t border-solid border-surface-light py-8 px-4 text-center text-muted-light">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm">© 2024 Artlion. All rights reserved.</p>
                <div className="flex gap-6 text-sm">
                  <a className="hover:text-primary transition-colors" href="#">
                    서비스 소개
                  </a>
                  <a className="hover:text-primary transition-colors" href="#">
                    문의하기
                  </a>
                  <a className="hover:text-primary transition-colors" href="#">
                    이용약관
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
      <PlayerBar />
    </BrowserRouter>
  );
};

export default App;
