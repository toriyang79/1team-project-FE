import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'music' | 'video'>('all');

  // 테마 초기화
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filterContent = (filter: 'all' | 'image' | 'music' | 'video') => {
    setActiveFilter(filter);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
            {/* Navigation Bar */}
            <Navbar
              theme={theme}
              onToggleTheme={toggleTheme}
              isAuthenticated={isAuthenticated}
              userNickname={user?.nickname}
              onLogout={handleLogout}
            />

            {/* Hero Section */}
            <div className="@container">
              <div className="@[480px]:p-4">
                <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/b5e3e3a8-2c0c-4e3f-9c6e-9b7a5c7b8e4d.png")'
                  }}>
                  <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[864px]:text-6xl text-white">
                      Artlion과 함께하는 AI 창작의 세계
                    </h1>
                    <h2 className="text-base font-normal leading-normal @[480px]:text-lg text-white">
                      인공지능이 만든 놀라운 이미지, 음악, 비디오를 발견하고 공유하세요.
                    </h2>
                  </div>
                  {!isAuthenticated && (
                    <Link
                      to="/register"
                      className="flex self-start min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-background-dark text-base font-bold hover:opacity-90 transition-opacity"
                    >
                      <span>지금 시작하기</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-3 p-4 flex-wrap">
              <button
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterContent('all')}
              >
                <p className="text-sm">전체</p>
              </button>
              <button
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${
                  activeFilter === 'image'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterContent('image')}
              >
                <p className="text-sm">이미지</p>
              </button>
              <button
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${
                  activeFilter === 'music'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterContent('music')}
              >
                <p className="text-sm">음악</p>
              </button>
              <button
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${
                  activeFilter === 'video'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterContent('video')}
              >
                <p className="text-sm">비디오</p>
              </button>
            </div>

            {/* Content Sections */}
            {(activeFilter === 'all' || activeFilter === 'image') && (
              <div className="content-section">
                <div className="flex justify-between items-center px-4 pb-3 pt-8">
                  <h2 className="text-2xl font-bold">인기 이미지</h2>
                  <button className="text-sm font-bold text-primary hover:underline">모두 보기</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4]"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4]"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4]"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4]"></div>
                </div>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'music') && (
              <div className="content-section">
                <div className="flex justify-between items-center px-4 pb-3 pt-8">
                  <h2 className="text-2xl font-bold">인기 음악</h2>
                  <button className="text-sm font-bold text-primary hover:underline">모두 보기</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"></div>
                </div>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'video') && (
              <div className="content-section">
                <div className="flex justify-between items-center px-4 pb-3 pt-8">
                  <h2 className="text-2xl font-bold">인기 비디오</h2>
                  <button className="text-sm font-bold text-primary hover:underline">모두 보기</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
