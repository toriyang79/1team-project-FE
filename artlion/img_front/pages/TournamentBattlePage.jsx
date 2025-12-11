/**
 * 토너먼트 배틀 페이지
 *
 * 두 이미지 중 하나를 선택하는 1vs1 대결 페이지
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMatch, vote } from '../api/tournamentAPI';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

// 더미 이미지 풀
const imagePools = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600',
    prompt: 'Majestic dragon flying through stormy clouds with lightning',
    model_name: 'Midjourney',
    like_count: 456,
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1682687982468-4584ff11f88a?w=600',
    prompt: 'Enchanted forest with glowing mushrooms and fairy lights',
    model_name: 'Stable Diffusion',
    like_count: 389,
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=600',
    prompt: 'Futuristic city with neon lights and flying cars',
    model_name: 'Midjourney',
    like_count: 342,
  },
  {
    id: 4,
    image_url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600',
    prompt: 'Steampunk airship flying over Victorian-era city',
    model_name: 'DALL-E 3',
    like_count: 298,
  },
  {
    id: 5,
    image_url: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=600',
    prompt: 'Space station orbiting Earth with astronauts',
    model_name: 'Midjourney',
    like_count: 267,
  },
  {
    id: 6,
    image_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7f7e7d?w=600',
    prompt: 'Underwater scene with colorful coral reefs',
    model_name: 'DALL-E 3',
    like_count: 234,
  },
  {
    id: 7,
    image_url: 'https://images.unsplash.com/photo-1686904423955-b2b48c6b123f?w=600',
    prompt: 'Beautiful sunset over the mountains',
    model_name: 'DALL-E 3',
    like_count: 198,
  },
  {
    id: 8,
    image_url: 'https://images.unsplash.com/photo-1707343846606-af9e406d584c?w=600',
    prompt: 'Peaceful zen garden with cherry blossoms',
    model_name: 'Stable Diffusion',
    like_count: 176,
  },
];

// 랜덤하게 두 이미지 선택 (폴백용)
const getRandomMatch = () => {
  const shuffled = [...imagePools].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
};

const TournamentBattlePage = () => {
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [voteCount, setVoteCount] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSide, setSelectedSide] = useState(null);
  const [useDummyData, setUseDummyData] = useState(false);

  // 매치 로딩
  const loadMatch = async () => {
    try {
      setIsLoading(true);
      const data = await getMatch();

      if (data && data.image1 && data.image2) {
        setMatch([data.image1, data.image2]);
        setUseDummyData(false);
      } else {
        // API 데이터가 없으면 더미 데이터 사용
        setMatch(getRandomMatch());
        setUseDummyData(true);
      }
    } catch (error) {
      console.error('매치 로딩 실패, 더미 데이터 사용:', error);
      setMatch(getRandomMatch());
      setUseDummyData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 매치 로딩
  useEffect(() => {
    loadMatch();
  }, []);

  // 투표 핸들러
  const handleVote = async (winner, loser) => {
    setIsVoting(true);
    setSelectedSide(winner.id === match[0].id ? 'left' : 'right');

    // 투표 카운트 증가 (로컬)
    setVoteCount(voteCount + 1);

    // 애니메이션 효과 후 랭킹 페이지로 이동
    setTimeout(async () => {
      try {
        if (!useDummyData) {
          // 실제 API 호출
          await vote(winner.id, loser.id);
        }
      } catch (error) {
        console.error('투표 처리 중 오류:', error);
      } finally {
        setIsVoting(false);
        setSelectedSide(null);
        // 랭킹 페이지로 이동 (현재 경로 기준 상대 이동)
        navigate('../ranking');
      }
    }, 800);
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <LoadingSpinner size="large" text="매치를 불러오는 중..." />
      </div>
    );
  }

  // 매치가 없는 경우
  if (!match || match.length < 2) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-muted-light dark:text-muted-dark mb-4 block">
            error_outline
          </span>
          <p className="text-text-light dark:text-text-dark text-xl">
            토너먼트 매치를 불러올 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 돌아가기 버튼 */}
        <div className="mb-6">
          <Button variant="secondary" size="small" onClick={() => navigate('/images')}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              돌아가기
            </span>
          </Button>
        </div>

        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="material-symbols-outlined text-5xl text-primary">
              emoji_events
            </span>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              토너먼트 배틀
            </h1>
          </div>
          <p className="text-muted-light dark:text-muted-dark">
            두 이미지 중 더 마음에 드는 이미지를 선택하세요
          </p>
          {useDummyData && (
            <div className="mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ 더미 데이터 모드 - 백엔드 API 미응답
              </p>
            </div>
          )}
        </div>

        {/* 바로가기 버튼 그룹 */}
        <div className="mt-4 mb-8 flex flex-wrap gap-3 justify-center">
          <Link to="/images/top">
            <Button variant="primary" size="small">인기top10</Button>
          </Link>
          <Link to="/images/tournament/battle">
            <Button variant="primary" size="small">토너먼트 배틀</Button>
          </Link>
          <Link to="/images/tournament/ranking">
            <Button variant="primary" size="small">토너먼트 랭킹</Button>
          </Link>
        </div>

        {/* 투표 카운터 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-light dark:bg-surface-dark rounded-full">
            <span className="material-symbols-outlined text-primary">
              how_to_vote
            </span>
            <span className="text-lg font-bold text-text-light dark:text-text-dark">
              {voteCount}
            </span>
            <span className="text-sm text-muted-light dark:text-muted-dark">
              투표 완료
            </span>
          </div>
        </div>

        {/* 배틀 그리드 */}
        <div className="relative grid grid-cols-2 gap-8 max-w-xl mx-auto justify-items-center mb-16">
          {/* 왼쪽 이미지 */}
          <div
            className={`
              relative bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden w-[11rem] md:w-[12rem] group
              transition-all duration-300
              ${selectedSide === 'left' ? 'ring-4 ring-primary scale-105' : ''}
              ${isVoting ? 'pointer-events-none' : ''}
            `}
          >
            {/* 이미지 */}
            <div
              className="aspect-[3/4] relative overflow-hidden max-h-[30vh] md:max-h-[35vh] bg-surface-light dark:bg-surface-dark cursor-pointer"
              onClick={() => handleVote(match[0], match[1])}
              role="button"
              aria-label="왼쪽 이미지 선택"
            >
              <img
                src={match[0].image_url}
                alt={match[0].prompt}
                className="w-full h-full object-contain"
              />
              {/* 호버 시 표시되는 선택 오버레이 (데스크톱) */}
              <div className="absolute inset-0 hidden md:flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined">thumb_up</span>
                  이 이미지 선택
                </div>
              </div>
              {selectedSide === 'left' && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-white px-6 py-3 rounded-full font-bold text-xl">
                    선택됨!
                  </div>
                </div>
              )}
            </div>

            {/* 정보 */}
            <div className="p-4 md:p-5">
              <p className="text-text-light dark:text-text-dark mb-3 line-clamp-2">
                {match[0].prompt}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm px-3 py-1 bg-primary/20 text-primary rounded-full font-medium">
                  {match[0].model_name}
                </span>
                <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark">
                  <span className="material-symbols-outlined text-sm">favorite</span>
                  <span className="text-sm">{match[0].like_count}</span>
                </div>
              </div>

              {/* 투표 버튼 */}
              <Button
                variant="primary"
                size="large"
                onClick={() => handleVote(match[0], match[1])}
                disabled={isVoting}
                className="w-full md:hidden"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">thumb_up</span>
                  이 이미지 선택
                </span>
              </Button>
            </div>
          </div>

          {/* VS 구분선 */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
              VS
            </div>
          </div>

          {/* 오른쪽 이미지 */}
          <div
            className={`
              relative bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden w-[11rem] md:w-[12rem] group
              transition-all duration-300
              ${selectedSide === 'right' ? 'ring-4 ring-primary scale-105' : ''}
              ${isVoting ? 'pointer-events-none' : ''}
            `}
          >
            {/* 이미지 */}
            <div
              className="aspect-[3/4] relative overflow-hidden max-h-[30vh] md:max-h-[35vh] bg-surface-light dark:bg-surface-dark cursor-pointer"
              onClick={() => handleVote(match[1], match[0])}
              role="button"
              aria-label="오른쪽 이미지 선택"
            >
              <img
                src={match[1].image_url}
                alt={match[1].prompt}
                className="w-full h-full object-contain"
              />
              {/* 호버 시 표시되는 선택 오버레이 (데스크톱) */}
              <div className="absolute inset-0 hidden md:flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined">thumb_up</span>
                  이 이미지 선택
                </div>
              </div>
              {selectedSide === 'right' && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-white px-6 py-3 rounded-full font-bold text-xl">
                    선택됨!
                  </div>
                </div>
              )}
            </div>

            {/* 정보 */}
            <div className="p-4 md:p-5">
              <p className="text-text-light dark:text-text-dark mb-3 line-clamp-2">
                {match[1].prompt}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm px-3 py-1 bg-primary/20 text-primary rounded-full font-medium">
                  {match[1].model_name}
                </span>
                <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark">
                  <span className="material-symbols-outlined text-sm">favorite</span>
                  <span className="text-sm">{match[1].like_count}</span>
                </div>
              </div>

              {/* 투표 버튼 */}
              <Button
                variant="primary"
                size="large"
                onClick={() => handleVote(match[1], match[0])}
                disabled={isVoting}
                className="w-full md:hidden"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">thumb_up</span>
                  이 이미지 선택
                </span>
              </Button>
            </div>
          </div>
        </div>

        

        {/* 섹션 간 간격 확보 */}
        <div className="h-8 sm:h-12" aria-hidden="true"></div>

        {/* 하단 안내 */}
        <div className="mt-16 text-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl">
          <p className="text-muted-light dark:text-muted-dark">
            💡 투표 결과는 랭킹에 반영됩니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default TournamentBattlePage;
