/**
 * 이미지 상세 페이지 (더미 데이터)
 *
 * 개별 이미지의 상세 정보를 보여주는 페이지
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import Button from '../components/Button';

// 더미 이미지 데이터
const dummyImages = {
  1: {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1686904423955-b2b48c6b123f?w=800',
    prompt: 'A beautiful sunset over the mountains with vibrant orange and pink colors painting the sky',
    model_name: 'DALL-E 3',
    like_count: 42,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T10:30:00Z',
    user: {
      name: 'ArtCreator123',
      avatar: 'https://ui-avatars.com/api/?name=AC&background=eead2b&color=fff',
    },
    metadata: {
      width: 1024,
      height: 1024,
      file_size: '2.3 MB',
      format: 'PNG',
    },
  },
  2: {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800',
    prompt: 'Futuristic city with neon lights and flying cars in a cyberpunk style',
    model_name: 'Midjourney',
    like_count: 128,
    is_tournament_opt_in: true,
    created_at: '2024-01-15T11:20:00Z',
    user: {
      name: 'CyberArtist',
      avatar: 'https://ui-avatars.com/api/?name=CA&background=eead2b&color=fff',
    },
    metadata: {
      width: 1024,
      height: 1024,
      file_size: '3.1 MB',
      format: 'PNG',
    },
  },
  3: {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1707343846606-af9e406d584c?w=800',
    prompt: 'Peaceful zen garden with cherry blossoms and a traditional Japanese temple',
    model_name: 'Stable Diffusion',
    like_count: 87,
    is_tournament_opt_in: false,
    created_at: '2024-01-15T12:15:00Z',
    user: {
      name: 'ZenMaster',
      avatar: 'https://ui-avatars.com/api/?name=ZM&background=eead2b&color=fff',
    },
    metadata: {
      width: 1024,
      height: 1024,
      file_size: '2.8 MB',
      format: 'PNG',
    },
  },
};

const ImageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // 더미 데이터에서 이미지 찾기
  const image = dummyImages[id] || dummyImages[1];

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 프롬프트 복사
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    alert('프롬프트가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button variant="secondary" size="small" onClick={() => navigate(-1)}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              뒤로가기
            </span>
          </Button>
        </div>

        {/* 더미 데이터 경고 */}
        <div className="mb-6 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ 더미 데이터 모드
          </p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 이미지 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden">
            <img
              src={image.image_url}
              alt={image.prompt}
              className="w-full h-auto"
            />
          </div>

          {/* 오른쪽: 정보 */}
          <div className="space-y-6">
            {/* 사용자 정보 */}
            <div className="flex items-center gap-3">
              <img
                src={image.user.avatar}
                alt={image.user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-lg font-bold text-text-light dark:text-text-dark">
                  {image.user.name}
                </p>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  {formatDate(image.created_at)}
                </p>
              </div>
            </div>

            {/* 좋아요 버튼 */}
            <div className="flex items-center gap-4">
              <LikeButton
                imageId={image.id}
                initialLikeCount={image.like_count}
                initialIsLiked={isLiked}
              />
              <span className="text-muted-light dark:text-muted-dark">
                {image.like_count} 좋아요
              </span>
            </div>

            {/* 프롬프트 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                  프롬프트
                </h3>
                <Button variant="secondary" size="small" onClick={handleCopyPrompt}>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    복사
                  </span>
                </Button>
              </div>
              <p className="text-text-light dark:text-text-dark leading-relaxed">
                {image.prompt}
              </p>
            </div>

            {/* AI 모델 정보 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">
                생성 정보
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-light dark:text-muted-dark">AI 모델</span>
                  <span className="text-primary font-medium">{image.model_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-light dark:text-muted-dark">토너먼트 참여</span>
                  <span className="text-text-light dark:text-text-dark">
                    {image.is_tournament_opt_in ? '✅ 참여 중' : '❌ 미참여'}
                  </span>
                </div>
              </div>
            </div>

            {/* 이미지 메타데이터 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">
                이미지 정보
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">해상도</p>
                  <p className="text-text-light dark:text-text-dark font-medium">
                    {image.metadata.width} × {image.metadata.height}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">파일 크기</p>
                  <p className="text-text-light dark:text-text-dark font-medium">
                    {image.metadata.file_size}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">포맷</p>
                  <p className="text-text-light dark:text-text-dark font-medium">
                    {image.metadata.format}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">ID</p>
                  <p className="text-text-light dark:text-text-dark font-medium">
                    #{image.id}
                  </p>
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-3">
              <Button variant="primary" size="medium" className="flex-1">
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">download</span>
                  다운로드
                </span>
              </Button>
              <Button variant="secondary" size="medium" className="flex-1">
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">share</span>
                  공유
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailPage;
