/**
 * 이미지 카드 컴포넌트
 *
 * 이미지 목록에서 사용되는 썸네일 카드
 */

import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const ImageCard = ({ image }) => {
  // 이미지가 없으면 렌더링하지 않음
  if (!image) return null;

  return (
    <Link to={`/images/${image.id}`}>
      <div className="group cursor-pointer">
        {/* 이미지 영역 */}
        <div
          className="bg-cover bg-center rounded-lg aspect-[3/4] relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url(${getImageUrl(image.image_url)})`
          }}
        >
          {/* 하단 텍스트 영역 - 호버 시 위로 이동 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-base font-bold leading-tight line-clamp-2 transform-gpu transition-transform group-hover:-translate-y-1">
              {image.prompt ? image.prompt.substring(0, 60) : 'AI 생성 이미지'}
              {image.prompt && image.prompt.length > 60 ? '...' : ''}
            </p>
          </div>

          {/* 호버 시 표시되는 정보 */}
          <div className="absolute top-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-2 text-white text-sm">
              {/* 좋아요 수 */}
              <span className="material-symbols-outlined text-lg">favorite</span>
              <span>{image.like_count || 0}</span>

              {/* 토너먼트 참여 여부 */}
              {image.is_tournament_opt_in && (
                <>
                  <span className="ml-2">•</span>
                  <span className="material-symbols-outlined text-lg">military_tech</span>
                  <span>토너먼트</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 하단 정보 (선택사항) */}
        {image.model_name && (
          <div className="mt-2 px-2">
            <p className="text-xs text-muted-light dark:text-muted-dark">
              {image.model_name}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ImageCard;
