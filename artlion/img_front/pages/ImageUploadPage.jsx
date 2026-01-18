/**
 * 이미지 업로드 페이지 (더미)
 *
 * AI 생성 이미지를 업로드하는 페이지
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../api/imageAPI';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const ImageUploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prompt: '',
    model_name: 'DALL-E 3',
    is_tournament_opt_in: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setImageFile(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!imageFile) {
      alert('이미지를 선택해주세요.');
      return;
    }

    if (!formData.prompt.trim()) {
      alert('프롬프트를 입력해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      // FormData 생성
      const uploadFormData = new FormData();
      // 백엔드가 'file' 필드명을 기대할 수 있음 (music API 패턴)
      uploadFormData.append('file', imageFile);
      uploadFormData.append('prompt', formData.prompt);
      uploadFormData.append('model_name', formData.model_name);
      uploadFormData.append('is_tournament_opt_in', formData.is_tournament_opt_in);

      // 백엔드 API 호출
      const response = await uploadImage(uploadFormData);

      alert('이미지가 성공적으로 업로드되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('업로드 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      // 상세한 에러 메시지 표시
      let errorMessage = '이미지 업로드에 실패했습니다.';
      if (error.response) {
        errorMessage += `\n상태: ${error.response.status}`;
        if (error.response.data?.detail) {
          errorMessage += `\n상세: ${error.response.data.detail}`;
        }
      } else if (error.request) {
        errorMessage += '\n서버에 연결할 수 없습니다.';
      }
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 제거
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-5xl text-primary">
              cloud_upload
            </span>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              이미지 업로드
            </h1>
          </div>
          <p className="text-muted-light dark:text-muted-dark">
            AI로 생성한 이미지를 커뮤니티와 공유하세요
          </p>
        </div>

        {/* 업로드 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이미지 업로드 영역 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
            <label className="block text-lg font-bold text-text-light dark:text-text-dark mb-4">
              이미지 <span className="text-red-500">*</span>
            </label>

            {!previewUrl ? (
              // 파일 선택 영역
              <div className="border-2 border-dashed border-muted-light dark:border-muted-dark rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="material-symbols-outlined text-6xl text-muted-light dark:text-muted-dark mb-4 block">
                    add_photo_alternate
                  </span>
                  <p className="text-text-light dark:text-text-dark font-medium mb-2">
                    클릭하여 이미지 선택
                  </p>
                  <p className="text-sm text-muted-light dark:text-muted-dark">
                    PNG, JPG, WebP (최대 10MB)
                  </p>
                </label>
              </div>
            ) : (
              // 이미지 미리보기
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>

          {/* 프롬프트 입력 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
            <label
              htmlFor="prompt"
              className="block text-lg font-bold text-text-light dark:text-text-dark mb-4"
            >
              프롬프트 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleInputChange}
              placeholder="이미지를 생성할 때 사용한 프롬프트를 입력하세요..."
              rows={4}
              className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-muted-light dark:border-muted-dark rounded-lg text-text-light dark:text-text-dark placeholder-muted-light dark:placeholder-muted-dark focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">
              {formData.prompt.length} / 500자
            </p>
          </div>

          {/* AI 모델 선택 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
            <label
              htmlFor="model_name"
              className="block text-lg font-bold text-text-light dark:text-text-dark mb-4"
            >
              AI 모델 <span className="text-red-500">*</span>
            </label>
            <select
              id="model_name"
              name="model_name"
              value={formData.model_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-muted-light dark:border-muted-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="DALL-E 3">DALL-E 3</option>
              <option value="Midjourney">Midjourney</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
              <option value="Leonardo AI">Leonardo AI</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 토너먼트 참여 옵션 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_tournament_opt_in"
                checked={formData.is_tournament_opt_in}
                onChange={handleInputChange}
                className="w-5 h-5 text-primary bg-background-light dark:bg-background-dark border-muted-light dark:border-muted-dark rounded focus:ring-2 focus:ring-primary"
              />
              <div className="flex-1">
                <p className="text-lg font-bold text-text-light dark:text-text-dark">
                  토너먼트에 참여하기
                </p>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  다른 이미지와 경쟁하여 랭킹을 올릴 수 있습니다
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">
                emoji_events
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={() => navigate(-1)}
              disabled={isUploading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="small" />
                  업로드 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">upload</span>
                  업로드
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadPage;
