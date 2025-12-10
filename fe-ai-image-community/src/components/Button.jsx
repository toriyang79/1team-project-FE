/**
 * 공통 버튼 컴포넌트
 *
 * Artlion 디자인 스타일을 따르는 재사용 가능한 버튼
 */

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  className = ''
}) => {
  // 버튼 기본 스타일 (커서는 disabled 여부에 따라 결정)
  const baseStyle = 'font-bold leading-normal tracking-[0.015em] rounded-full transition-opacity';

  // variant에 따른 스타일
  const variantStyles = {
    primary: 'bg-primary text-background-dark hover:opacity-90',
    secondary: 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-background-dark'
  };

  // size에 따른 스타일
  const sizeStyles = {
    small: 'h-8 px-4 text-sm',
    medium: 'h-10 px-5 text-sm',
    large: 'h-12 px-6 text-base'
  };

  // disabled 여부에 따른 커서 및 스타일
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  // 모든 스타일 결합
  const buttonClass = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {children}
    </button>
  );
};

export default Button;
