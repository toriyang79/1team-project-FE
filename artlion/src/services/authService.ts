import api from './api';

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  role: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  nickname: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

class AuthService {
  private persistAuth(responseData: any) {
    const tokens = responseData?.tokens || {};
    const access =
      tokens.access ||
      responseData?.access ||
      responseData?.access_token ||
      null;
    const refresh =
      tokens.refresh ||
      responseData?.refresh ||
      responseData?.refresh_token ||
      null;
    const user = responseData?.user || null;

    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    if (user) localStorage.setItem('user', JSON.stringify(user));

    return user;
  }

  /**
   * 로그인
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const payload = {
      ...credentials,
      nickname: credentials.email, // 일부 백엔드 호환용
    };
    const response = await api.post<AuthResponse>('/auth/login/', payload);

    this.persistAuth(response.data);

    return response.data;
  }

  /**
   * 회원가입
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/', data);

    this.persistAuth(response.data);

    return response.data;
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 로컬 스토리지 정리
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me/');

    // 사용자 정보 업데이트
    localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
  }

  /**
   * 로컬 스토리지에서 사용자 정보 가져오기
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * 토큰 가져오기
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export default new AuthService();
