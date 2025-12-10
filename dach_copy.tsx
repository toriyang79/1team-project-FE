// diff --git a/c:\Users\lqizh\Desktop\like_lion_python\lion_python\like-lion-python-group-project\team_2_project\2_team_pro_1_kijin_gpt_front_\2_new_team_project-FE\artlion/src/pages/Dashboard.tsx b/c:\Users\lqizh\Desktop\like_lion_python\lion_python\like-lion-python-group-project\team_2_project\2_team_pro_1_kijin_gpt_front_\2_new_team_project-FE\artlion/src/pages/Dashboard.tsx
// deleted file mode 100644
// --- a/c:\Users\lqizh\Desktop\like_lion_python\lion_python\like-lion-python-group-project\team_2_project\2_team_pro_1_kijin_gpt_front_\2_new_team_project-FE\artlion/src/pages/Dashboard.tsx
// +++ /dev/null
// @@ -1,255 +0,0 @@
// -import React, { useState, useEffect } from 'react';
// -import { Link, useNavigate } from 'react-router-dom';
// -import { useAuth } from '../contexts/AuthContext';
// -import Navbar from '../components/Navbar';
// -import Footer from '../components/Footer';
// -import { usePlayer } from '../../music_front_v3/src/context/PlayerContext';
// -import { listTracks, type Track } from '../../music_front_v3/src/api/tracks';
// -import { buildCoverUrl } from '../../music_front_v3/src/utils/media';
// -
// -const Dashboard: React.FC = () => {
// -  const { user, isAuthenticated, logout } = useAuth();
// -  const navigate = useNavigate();
// -  const [theme, setTheme] = useState<'light' | 'dark'>('light');
// -  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'music' | 'video'>('all');
// -  const [tracks, setTracks] = useState<Track[]>([]);
// -  const [popularImages, setPopularImages] = useState<{ id: string; title: string; url?: string }[]>([]);
// -  const [popularVideos, setPopularVideos] = useState<{ id: string; title: string; thumb?: string }[]>([]);
// -  const { play } = usePlayer();
// -
// -  // 샘플 인기 이미지/비디오 (랜덤 셔플)
// -  const imageSamples = React.useMemo(
// -    () =>
// -      [
// -        { id: 'img1', title: '우주의 바다', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'img2', title: '사이버네틱 숲', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'img3', title: '스팀펑크 도시', url: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'img4', title: '꿈꾸는 초상', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'img5', title: '네온 거리', url: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80' },
// -      ].sort(() => 0.5 - Math.random()),
// -    []
// -  );
// -
// -  const videoSamples = React.useMemo(
// -    () =>
// -      [
// -        { id: 'vid1', title: 'AI 쇼릴', thumb: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'vid2', title: '모션 그래픽', thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'vid3', title: '퓨처리스틱', thumb: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'vid4', title: '시네마틱 룩', thumb: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80' },
// -        { id: 'vid5', title: '테크 브랜딩', thumb: 'https://images.unsplash.com/photo-1508387024700-9fe5c0b6d09c?auto=format&fit=crop&w=800&q=80' },
// -      ].sort(() => 0.5 - Math.random()),
// -    []
// -  );
// -
// -  useEffect(() => {
// -    // 기본 진입은 라이트 테마로 강제
// -    document.documentElement.classList.remove('dark');
// -    localStorage.setItem('theme', 'light');
// -    setTheme('light');
// -
// -    // 트랙 데이터 불러오기
// -    listTracks()
// -      .then((res) => setTracks(res.data.slice(0, 8))) // 최대 8개만 표시
// -      .catch((err) => console.error("Failed to fetch tracks", err));
// -  }, []);
// -
// -  const toggleTheme = () => {
// -    const newTheme = theme === 'light' ? 'dark' : 'light';
// -    setTheme(newTheme);
// -    localStorage.setItem('theme', newTheme);
// -    if (newTheme === 'dark') {
// -      document.documentElement.classList.add('dark');
// -    } else {
// -      document.documentElement.classList.remove('dark');
// -    }
// -  };
// -
// -  const handleLogout = async () => {
// -    try {
// -      await logout();
// -      navigate('/login');
// -    } catch (error) {
// -      console.error('Logout failed:', error);
// -    }
// -  };
// -
// -  const filterContent = (filter: 'all' | 'image' | 'music' | 'video') => {
// -    setActiveFilter(filter);
// -  };
// -
// -  return (
// -    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-black text-text-light dark:text-text-dark">
// -      <div className="layout-container flex h-full grow flex-col">
// -        <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-0 md:py-5">
// -          <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
// -            <Navbar
// -              theme={theme}
// -              onToggleTheme={toggleTheme}
// -              isAuthenticated={isAuthenticated}
// -              userNickname={user?.nickname}
// -              onLogout={handleLogout}
// -              onSearch={(query) => console.log('Search:', query)}
// -              onUploadClick={() => navigate('/music/upload')} // Redirect to music upload for now
// -            />
// -
// -            <div className="@container">
// -              <div className="@[480px]:p-4">
// -                <div className="flex flex-col gap-6 px-4 lg:flex-row lg:items-center py-10 md:py-16">
// -                  <div className="flex flex-col gap-6 sm:gap-8 lg:justify-center flex-1 items-start">
// -                    <div className="flex flex-col gap-4 text-left">
// -                      <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl text-text-light dark:text-text-dark">
// -                        Artlion과 함께하는 AI 창작의 세계
// -                      </h1>
// -                      <h2 className="text-base font-normal leading-normal sm:text-lg text-text-muted dark:text-muted-dark">
// -                        인공지능이 만든 놀라운 이미지, 음악, 비디오를 발견하고 공유하세요.
// -                      </h2>
// -                    </div>
// -                    {!isAuthenticated && (
// -                      <Link
// -                        to="/register"
// -                        className="flex self-start min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-7 bg-primary text-text-light text-base font-bold shadow-sm hover:opacity-95 transition-opacity"
// -                      >
// -                        <span>지금 시작하기</span>
// -                      </Link>
// -                    )}
// -                  </div>
// -                  <div
// -                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl sm:aspect-video lg:w-2/5"
// -                    style={{
// -                      backgroundImage:
// -                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV_loKHEruo1grAotPyRuJ5KJLXj2wdBiyb_kVhQzcYAAqvNMebhZIcUE7IFlaCMz82yRIwukwBGr3uQrjPDjBsi9RE0tkUlBTdHxhcrXAwykoahhH2jCJucCLp-6lQnRAut2AHbzAQclcEMSbfjDdbfw74TUM-RWb7q0kWdvOvoTzL3JRND3JSqsj70xLQvDUwJgcxc3JaEzy8sVUiKokpaOhIcUTmT2tehrSe6RcyzgBvgp42kxuBxfdaN5FG9f4xGmo33AAEvUK")',
// -                    }}
// -                  />
// -                </div>
// -              </div>
// -            </div>
// -
// -            <div className="flex gap-3 p-4 flex-wrap">
// -              <button
// -                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${activeFilter === 'all'
// -                  ? 'bg-primary text-background-dark font-bold'
// -                  : 'bg-surface-light dark:bg-surface-dark hover:bg-black/5 dark:hover:bg-white/5'
// -                  }`}
// -                onClick={() => filterContent('all')}
// -              >
// -                <p className="text-sm">전체</p>
// -              </button>
// -              <button
// -                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${activeFilter === 'image'
// -                  ? 'bg-primary text-background-dark font-bold'
// -                  : 'bg-surface-light dark:bg-surface-dark hover:bg-black/5 dark:hover:bg-white/5'
// -                  }`}
// -                onClick={() => filterContent('image')}
// -              >
// -                <p className="text-sm">이미지</p>
// -              </button>
// -              <button
// -                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${activeFilter === 'music'
// -                  ? 'bg-primary text-background-dark font-bold'
// -                  : 'bg-surface-light dark:bg-surface-dark hover:bg-black/5 dark:hover:bg-white/5'
// -                  }`}
// -                onClick={() => filterContent('music')}
// -              >
// -                <p className="text-sm">음악</p>
// -              </button>
// -              <button
// -                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${activeFilter === 'video'
// -                  ? 'bg-primary text-background-dark font-bold'
// -                  : 'bg-surface-light dark:bg-surface-dark hover:bg-black/5 dark:hover:bg-white/5'
// -                  }`}
// -                onClick={() => filterContent('video')}
// -              >
// -                <p className="text-sm">비디오</p>
// -              </button>
// -            </div>
// -
// -            {(activeFilter === 'all' || activeFilter === 'image') && (
// -              <div className="content-section">
// -                <div className="flex justify-between items-center px-4 pb-3 pt-8">
// -                  <h2 className="text-2xl font-bold">인기 이미지</h2>
// -                  <button className="text-sm font-bold text-primary hover:underline">모두 보기</button>
// -                </div>
// -                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-[3/4]"></div>
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-[3/4]"></div>
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-[3/4]"></div>
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-[3/4]"></div>
// -                </div>
// -              </div>
// -            )}
// -
// -            {(activeFilter === 'all' || activeFilter === 'music') && (
// -              <div className="content-section">
// -                <div className="flex justify-between items-center px-4 pb-3 pt-8">
// -                  <h2 className="text-2xl font-bold">인기 음악</h2>
// -                  <Link to="/music" className="text-sm font-bold text-primary hover:underline">모두 보기</Link>
// -                </div>
// -                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
// -                  {tracks.length === 0 ? (
// -                    // Loading Skeletons
// -                    Array.from({ length: 4 }).map((_, idx) => (
// -                      <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-square animate-pulse"></div>
// -                    ))
// -                  ) : (
// -                    tracks.map((track) => (
// -                      <Link
// -                        key={track.id}
// -                        to={`/music/tracks/${track.id}`}
// -                        className="bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 transition-transform group"
// -                      >
// -                        <div className="aspect-square bg-surface-dark/10 relative">
// -                          {track.cover_url ? (
// -                            <img
// -                              src={buildCoverUrl(track.id)}
// -                              alt={track.title}
// -                              className="w-full h-full object-cover"
// -                            />
// -                          ) : (
// -                            <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
// -                          )}
// -                          <button
// -                            onClick={(e) => {
// -                              e.preventDefault();
// -                              e.stopPropagation();
// -                              play(track, tracks);
// -                            }}
// -                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-none"
// -                          >
// -                            <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
// -                          </button>
// -                        </div>
// -                        <div className="p-3 flex flex-col gap-1">
// -                          <p className="font-bold line-clamp-1">{track.title}</p>
// -                          <p className="text-xs text-muted-light line-clamp-1">{track.ai_provider} · {track.ai_model}</p>
// -                        </div>
// -                      </Link>
// -                    ))
// -                  )}
// -                </div>
// -              </div>
// -            )}
// -
// -            {(activeFilter === 'all' || activeFilter === 'video') && (
// -              <div className="content-section">
// -                <div className="flex justify-between items-center px-4 pb-3 pt-8">
// -                  <h2 className="text-2xl font-bold">인기 비디오</h2>
// -                  <Link to="/video" className="text-sm font-bold text-primary hover:underline">모두 보기</Link>
// -                </div>
// -                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-video"></div>
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-video"></div>
// -                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-video"></div>
// -                </div>
// -              </div>
// -            )}
// -          </div>
// -        </div>
// -
// -        <Footer />
// -      </div>
// -    </div>
// -  );
// -};
// -
// -export default Dashboard;
