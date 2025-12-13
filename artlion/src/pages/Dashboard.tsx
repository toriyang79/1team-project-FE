import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePlayer } from '../../music_front_v3/src/context/PlayerContext';
import { listTracks, type Track } from '../../music_front_v3/src/api/tracks';
import { buildCoverUrl } from '../../music_front_v3/src/utils/media';

type ImageItem = { id: string; title: string; url?: string };
type VideoItem = { id: string; title: string; thumb?: string };

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'music' | 'video'>('all');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [popularImages, setPopularImages] = useState<ImageItem[]>([]);
  const [popularVideos, setPopularVideos] = useState<VideoItem[]>([]);
  const { play } = usePlayer();
  const isLocalhost = typeof window !== 'undefined' && window.location.origin.includes('localhost');
  const imageApiBase = (import.meta.env.VITE_IMG_API_BASE_URL || import.meta.env.REACT_APP_IMG_API_BASE_URL || '').trim()
    || (isLocalhost ? '/img-api' : 'https://www.imagelion.p-e.kr/api-image');
  const rawVideoBase = (import.meta.env.VITE_VIDEO_API_URL || '').trim();
  // env가 있으면 그대로(뒤 슬래시 제거) 사용, 없을 때만 기본값(/api 포함)으로 fallback
  const videoApiBase = rawVideoBase ? rawVideoBase.replace(/\/+$/, '') : (isLocalhost ? '/video-api' : 'https://shorts-artlion.duckdns.org/api');
  const buildVideoUrl = (path: string) => `${videoApiBase.replace(/\/$/, '')}${path}`;

  const imageSamples = useMemo<ImageItem[]>(
    () =>
      [
        { id: 'img1', title: 'AI Forest', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
        { id: 'img2', title: 'City Glow', url: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80' },
        { id: 'img3', title: 'Portrait', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
        { id: 'img4', title: 'Sunset Coast', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' },
      ].sort(() => 0.5 - Math.random()),
    []
  );

  const videoSamples = useMemo<VideoItem[]>(
    () =>
      [
        { id: 'vid1', title: 'AI Journey', thumb: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
        { id: 'vid2', title: 'Night Drive', thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
        { id: 'vid3', title: 'Future City', thumb: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80' },
        { id: 'vid4', title: 'Sea Breeze', thumb: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80' },
      ].sort(() => 0.5 - Math.random()),
    []
  );

  useEffect(() => {
    // 기본 테마는 라이트로 시작
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setTheme('light');

    // 음악 트랙
    listTracks()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTracks(data.slice(0, 4));
      })
      .catch((err) => {
        console.error('Failed to fetch tracks', err);
        setTracks([]);
      });

    // 인기 이미지
    fetch(`${imageApiBase.replace(/\/$/, '')}/images/feed/top-24h?limit=4`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const items = Array.isArray((data as any)?.items) ? (data as any).items : Array.isArray(data) ? data : [];
        setPopularImages(
          items.slice(0, 4).map((it: any) => ({
            id: String(it.id ?? crypto.randomUUID()),
            title: it.title ?? it.prompt ?? 'Untitled',
            url: it.image_url ?? it.url ?? it.cover_url,
          }))
        );
      })
      .catch(() => setPopularImages(imageSamples.slice(0, 4)));

    // 인기 비디오
    fetch(buildVideoUrl('/videos/?limit=4'))
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const items = Array.isArray((data as any)?.items) ? (data as any).items : Array.isArray(data) ? data : [];
        setPopularVideos(
          items.slice(0, 4).map((it: any) => ({
            id: String(it.id ?? crypto.randomUUID()),
            title: it.title ?? 'Untitled',
            thumb: it.thumbnail_url ?? it.cover_url ?? it.url,
          }))
        );
      })
      .catch(() => setPopularVideos(videoSamples.slice(0, 4)));
  }, [imageSamples, videoSamples]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  const renderPopularImages = () => {
    const list = popularImages.length ? popularImages : imageSamples.slice(0, 4);
    return (
      <div className="content-section">
        <div className="flex justify-between items-center px-4 pb-3 pt-8">
          <h2 className="text-2xl font-bold">인기 이미지</h2>
          <Link to="/image" className="text-sm font-bold text-primary hover:underline">모두 보기</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {list.map((img) => (
            <div key={img.id} className="bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden aspect-[3/4]">
              {img.url ? (
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-surface-dark/20" />
              )}
              <div className="p-2 text-sm font-semibold line-clamp-2">{img.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPopularVideos = () => {
    const list = popularVideos.length ? popularVideos : videoSamples.slice(0, 4);
    return (
      <div className="content-section">
        <div className="flex justify-between items-center px-4 pb-3 pt-8">
          <h2 className="text-2xl font-bold">인기 비디오</h2>
          <Link to="/video" className="text-sm font-bold text-primary hover:underline">모두 보기</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {list.map((vid) => (
            <div key={vid.id} className="bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden aspect-video">
              {vid.thumb ? (
                <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-surface-dark/20" />
              )}
              <div className="p-2 text-sm font-semibold line-clamp-2">{vid.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-black text-text-light dark:text-text-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-0 md:py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
            <Navbar
              theme={theme}
              onToggleTheme={toggleTheme}
              isAuthenticated={isAuthenticated}
              userNickname={user?.nickname}
              onLogout={handleLogout}
              onSearch={(query) => console.log('Search:', query)}
              onUploadClick={() => navigate('/music/upload')}
            />

            <div className="@container">
              <div className="@[480px]:p-4">
                <div className="flex flex-col gap-6 px-4 lg:flex-row lg:items-center py-10 md:py-16">
                  <div className="flex flex-col gap-6 sm:gap-8 lg:justify-center flex-1 items-start">
                    <div className="flex flex-col gap-4 text-left">
                      <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl text-text-light dark:text-text-dark">
                        Artlion과 함께하는 AI 창작의 세계
                      </h1>
                      <h2 className="text-base font-normal leading-normal sm:text-lg text-text-muted dark:text-muted-dark">
                        마음에 드는 트랙을 재생하고, 큐에 담고, 다운로드까지 한 번에. 로그인 없이도 상세 페이지로 이동할 수 있습니다.
                      </h2>
                    </div>
                    {!isAuthenticated && (
                      <Link
                        to="/register"
                        className="flex self-start min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-7 bg-primary text-text-light text-base font-bold shadow-sm hover:opacity-95 transition-opacity"
                      >
                        <span>지금 시작하기</span>
                      </Link>
                    )}
                  </div>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl sm:aspect-video lg:w-2/5"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV_loKHEruo1grAotPyRuJ5KJLXj2wdBiyb_kVhQzcYAAqvNMebhZIcUE7IFlaCMz82yRIwukwBGr3uQrjPDjBsi9RE0tkUlBTdHxhcrXAwykoahhH2jCJucCLp-6lQnRAut2AHbzAQclcEMSbfjDdbfw74TUM-RWb7q0kWdvOvoTzL3JRND3JSqsj70xLQvDUwJgcxc3JaEzy8sVUiKokpaOhIcUTmT2tehrSe6RcyzgBvgp42kxuBxfdaN5FG9f4xGmo33AAEvUK")',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 flex-wrap">
              {(['all', 'image', 'music', 'video'] as const).map((key) => (
                <button
                  key={key}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors ${activeFilter === key
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-surface-light dark:bg-surface-dark hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  onClick={() => filterContent(key)}
                >
                  <p className="text-sm">
                    {key === 'all' ? '전체' : key === 'image' ? '이미지' : key === 'music' ? '음악' : '비디오'}
                  </p>
                </button>
              ))}
            </div>

            {(activeFilter === 'all' || activeFilter === 'image') && renderPopularImages()}

            {(activeFilter === 'all' || activeFilter === 'music') && (
              <div className="content-section">
                <div className="flex justify-between items-center px-4 pb-3 pt-8">
                  <h2 className="text-2xl font-bold">인기 음악</h2>
                  <Link to="/music" className="text-sm font-bold text-primary hover:underline">모두 보기</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  {tracks.length === 0
                    ? Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-lg aspect-square animate-pulse" />
                    ))
                    : tracks.map((track) => (
                      <Link
                        key={track.id}
                        to={`/music/tracks/${track.id}`}
                        className="bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 transition-transform group"
                      >
                        <div className="aspect-square bg-surface-dark/10 relative">
                          {track.cover_url ? (
                            <img
                              src={buildCoverUrl(track.id)}
                              alt={track.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              play(track, tracks);
                            }}
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-none"
                          >
                            <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                          </button>
                        </div>
                        <div className="p-3 flex flex-col gap-1">
                          <p className="font-bold line-clamp-1">{track.title}</p>
                          <p className="text-xs text-muted-light line-clamp-1">{track.ai_provider} · {track.ai_model}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'video') && renderPopularVideos()}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
