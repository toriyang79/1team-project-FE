/**
 * 로딩 스피너 컴포넌트
 *
 * 데이터를 불러오는 동안 표시되는 로딩 애니메이션
 */

const LoadingSpinner = ({ size = 'medium', text = '로딩 중...' }) => {
  // size에 따른 스피너 크기
  const sizeStyles = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* 회전하는 원형 스피너 */}
      <div
        className={`${sizeStyles[size]} border-primary border-t-transparent rounded-full animate-spin`}
      />
      {/* 로딩 텍스트 */}
      {text && (
        <p className="text-sm text-muted-light dark:text-muted-dark">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
