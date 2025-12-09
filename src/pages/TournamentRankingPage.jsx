/**
 * 토너먼트 랭킹 페이지 (더미 데이터)
 *
 * 토너먼트 투표 결과를 기반으로 한 랭킹을 보여주는 페이지
 */

import { useState } from 'react';
import ImageCard from '../components/ImageCard';

// 더미 랭킹 데이터 (승률 기준 정렬)
const rankingData = [
  {
    id: 1,
    rank: 1,
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    prompt: 'Majestic dragon flying through stormy clouds with lightning',
    model_name: 'Midjourney',
    like_count: 456,
    wins: 127,
    losses: 15,
    win_rate: 89.44,
    elo_score: 2145,
  },
  {
    id: 2,
    rank: 2,
    image_url: 'https://images.unsplash.com/photo-1682687982468-4584ff11f88a?w=400',
    prompt: 'Enchanted forest with glowing mushrooms and fairy lights',
    model_name: 'Stable Diffusion',
    like_count: 389,
    wins: 98,
    losses: 23,
    win_rate: 81.00,
    elo_score: 2087,
  },
  {
    id: 3,
    rank: 3,
    image_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400',
    prompt: 'Futuristic city with neon lights and flying cars',
    model_name: 'Midjourney',
    like_count: 342,
    wins: 89,
    losses: 31,
    win_rate: 74.17,
    elo_score: 2021,
  },
  {
    id: 4,
    rank: 4,
    image_url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=400',
    prompt: 'Steampunk airship flying over Victorian-era city',
    model_name: 'DALL-E 3',
    like_count: 298,
    wins: 76,
    losses: 34,
    win_rate: 69.09,
    elo_score: 1978,
  },
  {
    id: 5,
    rank: 5,
    image_url: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=400',
    prompt: 'Space station orbiting Earth with astronauts',
    model_name: 'Midjourney',
    like_count: 267,
    wins: 68,
    losses: 42,
    win_rate: 61.82,
    elo_score: 1932,
  },
  {
    id: 6,
    rank: 6,
    image_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7f7e7d?w=400',
    prompt: 'Underwater scene with colorful coral reefs',
    model_name: 'DALL-E 3',
    like_count: 234,
    wins: 54,
    losses: 46,
    win_rate: 54.00,
    elo_score: 1876,
  },
  {
    id: 7,
    rank: 7,
    image_url: 'https://images.unsplash.com/photo-1686904423955-b2b48c6b123f?w=400',
    prompt: 'Beautiful sunset over the mountains',
    model_name: 'DALL-E 3',
    like_count: 198,
    wins: 45,
    losses: 55,
    win_rate: 45.00,
    elo_score: 1821,
  },
  {
    id: 8,
    rank: 8,
    image_url: 'https://images.unsplash.com/photo-1707343846606-af9e406d584c?w=400',
    prompt: 'Peaceful zen garden with cherry blossoms',
    model_name: 'Stable Diffusion',
    like_count: 176,
    wins: 38,
    losses: 62,
    win_rate: 38.00,
    elo_score: 1765,
  },
  {
    id: 9,
    rank: 9,
    image_url: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400',
    prompt: 'Cozy reading nook with warm lighting',
    model_name: 'Stable Diffusion',
    like_count: 145,
    wins: 29,
    losses: 71,
    win_rate: 29.00,
    elo_score: 1698,
  },
  {
    id: 10,
    rank: 10,
    image_url: 'https://images.unsplash.com/photo-1707343845208-19828dc22c0f?w=400',
    prompt: 'Abstract geometric patterns in vibrant colors',
    model_name: 'DALL-E 3',
    like_count: 132,
    wins: 21,
    losses: 79,
    win_rate: 21.00,
    elo_score: 1623,
  },
];

const TournamentRankingPage = () => {
  const [sortBy, setSortBy] = useState('rank'); // rank, wins, win_rate, elo_score

  // 정렬 로직
  const getSortedRankings = () => {
    const sorted = [...rankingData].sort((a, b) => {
      switch (sortBy) {
        case 'wins':
          return b.wins - a.wins;
        case 'win_rate':
          return b.win_rate - a.win_rate;
        case 'elo_score':
          return b.elo_score - a.elo_score;
        case 'rank':
        default:
          return a.rank - b.rank;
      }
    });
    return sorted;
  };

  const sortedRankings = getSortedRankings();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-5xl text-primary">
              leaderboard
            </span>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              토너먼트 랭킹
            </h1>
          </div>
          <p className="text-muted-light dark:text-muted-dark">
            토너먼트 배틀 결과를 기반으로 한 이미지 랭킹
          </p>
          <div className="mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 더미 데이터 모드
            </p>
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="mb-6 flex gap-3 items-center flex-wrap">
          <span className="text-sm text-muted-light dark:text-muted-dark">정렬:</span>
          <button
            onClick={() => setSortBy('rank')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                sortBy === 'rank'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary/20'
              }
            `}
          >
            랭킹순
          </button>
          <button
            onClick={() => setSortBy('win_rate')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                sortBy === 'win_rate'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary/20'
              }
            `}
          >
            승률순
          </button>
          <button
            onClick={() => setSortBy('wins')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                sortBy === 'wins'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary/20'
              }
            `}
          >
            승수순
          </button>
          <button
            onClick={() => setSortBy('elo_score')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                sortBy === 'elo_score'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary/20'
              }
            `}
          >
            ELO 점수순
          </button>
        </div>

        {/* 랭킹 리스트 */}
        <div className="space-y-4">
          {sortedRankings.map((item, index) => (
            <div
              key={item.id}
              className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              {/* 순위 */}
              <div className="flex-shrink-0">
                <div
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    font-bold text-2xl
                    ${
                      item.rank === 1
                        ? 'bg-yellow-400 text-yellow-900'
                        : item.rank === 2
                        ? 'bg-gray-300 text-gray-900'
                        : item.rank === 3
                        ? 'bg-orange-400 text-orange-900'
                        : 'bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark'
                    }
                  `}
                >
                  {item.rank}
                </div>
              </div>

              {/* 이미지 썸네일 */}
              <div className="flex-shrink-0">
                <img
                  src={item.image_url}
                  alt={item.prompt}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-text-light dark:text-text-dark font-medium mb-1 truncate">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                    {item.model_name}
                  </span>
                  <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark text-sm">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    <span>{item.like_count}</span>
                  </div>
                </div>
              </div>

              {/* 통계 */}
              <div className="flex-shrink-0 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-light dark:text-muted-dark mb-1">승률</p>
                    <p className="text-lg font-bold text-primary">{item.win_rate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-light dark:text-muted-dark mb-1">전적</p>
                    <p className="text-sm text-text-light dark:text-text-dark">
                      {item.wins}승 {item.losses}패
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-light dark:text-muted-dark mb-1">ELO</p>
                    <p className="text-lg font-bold text-text-light dark:text-text-dark">
                      {item.elo_score}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 text-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl">
          <p className="text-muted-light dark:text-muted-dark mb-2">
            💡 토너먼트 배틀에 참여하여 순위에 영향을 주세요
          </p>
          <p className="text-xs text-muted-light dark:text-muted-dark">
            ELO 시스템을 사용하여 공정한 랭킹을 산출합니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default TournamentRankingPage;
