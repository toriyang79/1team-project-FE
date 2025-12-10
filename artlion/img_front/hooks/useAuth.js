/**
 * useAuth 커스텀 훅
 *
 * AuthContext를 쉽게 사용하기 위한 훅
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
