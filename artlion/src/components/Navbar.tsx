import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isAuthenticated: boolean;
  userNickname?: string;
  onLogout: () => void;
  onSearch?: (query: string) => void;
  onUploadClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  isAuthenticated,
  userNickname,
  onLogout,
  onSearch,
  onUploadClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <header className="relative flex flex-col bg-background-light dark:bg-black border-b border-solid border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold whitespace-nowrap">Artlion</h2>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-text-light dark:text-text-dark">
            <Link to="/image" className="text-sm font-medium hover:text-primary transition-colors">
              이미지
            </Link>
            <Link to="/music" className="text-sm font-medium hover:text-primary transition-colors">
              음악
            </Link>
            <Link to="/video" className="text-sm font-medium hover:text-primary transition-colors">
              비디오
            </Link>
          </nav>
        </div>

        {onSearch && (
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 border-none text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </form>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </button>

            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Upload
              </button>
            )}

            <div className="flex gap-2">
              {isAuthenticated && userNickname ? (
                <>
                  <span className="flex items-center text-sm font-medium px-4">
                    닉네임: {userNickname}
                  </span>
                  <button
                    onClick={onLogout}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold transition-colors"
                  >
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    <span>회원가입</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold transition-colors"
                  >
                    <span>로그인</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 text-text-light dark:text-text-dark"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
          {onSearch && (
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setIsMobileMenuOpen(false);
              }}
              className="relative flex items-center mt-2"
            >
              <div className="absolute left-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 border-none text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </form>
          )}

          <nav className="flex flex-col gap-2 text-text-light dark:text-text-dark">
            <Link
              to="/image"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-lg font-medium hover:text-primary transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              이미지
            </Link>
            <Link
              to="/music"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-lg font-medium hover:text-primary transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              음악
            </Link>
            <Link
              to="/video"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-lg font-medium hover:text-primary transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              비디오
            </Link>
          </nav>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">테마</span>
              <button
                onClick={onToggleTheme}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
              </button>
            </div>

            {onUploadClick && (
              <button
                onClick={() => {
                  onUploadClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center rounded-full h-12 bg-primary text-background-dark text-base font-bold hover:opacity-90 transition-opacity"
              >
                Upload
              </button>
            )}

            {isAuthenticated && userNickname ? (
              <div className="flex flex-col gap-3">
                <span className="font-medium">닉네임: {userNickname}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center rounded-full h-12 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-base font-bold transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center rounded-full h-12 bg-primary text-background-dark text-base font-bold hover:opacity-90 transition-opacity"
                >
                  회원가입
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center rounded-full h-12 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-base font-bold transition-colors"
                >
                  로그인
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
