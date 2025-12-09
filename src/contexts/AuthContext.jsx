/**
 * 인증 상태 관리 Context
 *
 * JWT 토큰 기반 로그인 상태를 전역으로 관리
 */

import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Context 생성
export const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태

  // 컴포넌트 마운트 시 localStorage에서 토큰 확인
  useEffect(() => {
    checkAuth();
  }, []);

  // 인증 상태 확인
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        // JWT 토큰 디코딩
        const decoded = jwtDecode(token);

        // 토큰 만료 확인
        const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)

        if (decoded.exp < currentTime) {
          // 토큰 만료됨
          console.log('토큰이 만료되었습니다.');
          logout();
        } else {
          // 토큰 유효함
          setUser({
            id: decoded.user_id || decoded.sub,
            username: decoded.username || decoded.name,
            email: decoded.email,
          });
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = (token) => {
    try {
      // localStorage에 토큰 저장
      localStorage.setItem('token', token);

      // 토큰 디코딩하여 사용자 정보 추출
      const decoded = jwtDecode(token);

      setUser({
        id: decoded.user_id || decoded.sub,
        username: decoded.username || decoded.name,
        email: decoded.email,
      });
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('로그인 처리 실패:', error);
      return false;
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context에 제공할 값
  const value = {
    user, // 사용자 정보
    isAuthenticated, // 로그인 여부
    isLoading, // 로딩 상태
    login, // 로그인 함수
    logout, // 로그아웃 함수
    checkAuth, // 인증 확인 함수
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
