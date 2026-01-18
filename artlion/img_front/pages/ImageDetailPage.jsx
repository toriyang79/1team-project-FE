/**
 * 이미지 상세 페이지
 *
 * 개별 이미지의 상세 정보를 보여주는 페이지
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getImageById } from '../api/imageAPI';
import { getImageUrl } from '../utils/imageUrl';
import LikeButton from '../components/LikeButton';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

// 날짜 포맷 유틸리티 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

const ImageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이미지 데이터 불러오기
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getImageById(id);
        setImage(data);
      } catch (err) {
        console.error('이미지 조회 실패:', err);
        setError(err.response?.data?.detail || err.message || '이미지를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchImage();
    }
  }, [id]);

  // 프롬프트 복사 핸들러
  const handleCopyPrompt = () => {
    if (image?.prompt) {
      navigator.clipboard.writeText(image.prompt).then(
        () => {
          alert('프롬프트가 복사되었습니다!');
        },
        (err) => {
          console.error('복사 실패:', err);
          alert('복사에 실패했습니다. 다시 시도해주세요.');
        }
      );
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <LoadingSpinner size="large" text="이미지를 불러오는 중..." />
      </div>
    );
  }

  // 에러
  if (error || !image) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-muted-light dark:text-muted-dark mb-4 block">
            error_outline
          </span>
          <p className="text-text-light dark:text-text-dark text-xl mb-4">
            {error || '이미지를 찾을 수 없습니다.'}
          </p>
          <Button variant="primary" size="medium" onClick={() => navigate(-1)}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              뒤로가기
            </span>
          </Button>
        </div>
      </div>
    );
  }

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

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 이미지 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden">
            <img
              src={getImageUrl(image.image_url)}
              alt={image.prompt}
              className="w-full h-auto"
            />
          </div>

          {/* 오른쪽: 정보 */}
          <div className="space-y-6">
            {/* 사용자 정보 (현재는 user_id만 있음) */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {image.user_id}
              </div>
              <div>
                <p className="text-lg font-bold text-text-light dark:text-text-dark">
                  User #{image.user_id}
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
                initialIsLiked={false}
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
                {image.prompt || '프롬프트 정보가 없습니다.'}
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
                <div className="flex justify-between">
                  <span className="text-muted-light dark:text-muted-dark">토너먼트 승수</span>
                  <span className="text-text-light dark:text-text-dark">
                    {image.tournament_win_count}승
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
                  <p className="text-sm text-muted-light dark:text-muted-dark">이미지 ID</p>
                  <p className="text-text-light dark:text-text-dark font-medium">
                    #{image.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">활성 상태</p>
                  <p className="text-text-light dark:text-text-dark font-medium">
                    {image.is_active ? '✅ 활성' : '❌ 비활성'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">생성일</p>
                  <p className="text-text-light dark:text-text-dark font-medium text-sm">
                    {formatDate(image.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">수정일</p>
                  <p className="text-text-light dark:text-text-dark font-medium text-sm">
                    {formatDate(image.updated_at)}
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
