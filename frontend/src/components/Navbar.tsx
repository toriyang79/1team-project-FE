import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isAuthenticated: boolean;
  userNickname?: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  isAuthenticated,
  userNickname,
  onLogout
}) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-300 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
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
          <h2 className="text-xl font-bold">Artlion</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-9">
          <button className="text-sm font-medium hover:text-primary transition-colors">
            이미지
          </button>
          <button className="text-sm font-medium hover:text-primary transition-colors">
            음악
          </button>
          <button className="text-sm font-medium hover:text-primary transition-colors">
            비디오
          </button>
        </nav>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <button
          onClick={onToggleTheme}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          <span className="text-2xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
        <div className="flex gap-2">
          {isAuthenticated && userNickname ? (
            <>
              <span className="flex items-center text-sm font-medium px-4">
                👋 {userNickname}님
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
    </header>
  );
};

export default Navbar;
