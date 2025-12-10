/**
 * Protected Route 컴포넌트
 *
 * 로그인이 필요한 페이지를 보호하는 라우트
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중이면 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="인증 확인 중..." />
      </div>
    );
  }

  // 로그인하지 않았으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 로그인했으면 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
