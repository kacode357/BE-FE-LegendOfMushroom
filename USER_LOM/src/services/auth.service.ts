const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface MemberUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: MemberUser;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

class AuthService {
  private tokenKey = 'member_token';
  private userKey = 'member_user';

  async register(payload: RegisterPayload): Promise<ApiResponse<MemberUser>> {
    const response = await fetch(`${API_BASE_URL}/api/members/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');
    return data;
  }

  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/api/members/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');
    
    // Save token and user
    this.setToken(data.data.token);
    this.setUser(data.data.user);
    
    return data;
  }

  async verifyEmail(token: string): Promise<ApiResponse<MemberUser>> {
    const response = await fetch(`${API_BASE_URL}/api/members/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Xác thực thất bại');
    return data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/api/members/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gửi yêu cầu thất bại');
    return data;
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/api/members/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Đặt lại mật khẩu thất bại');
    return data;
  }

  async resendVerification(email: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/api/members/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gửi lại email thất bại');
    return data;
  }

  async getProfile(): Promise<ApiResponse<MemberUser>> {
    const token = this.getToken();
    if (!token) throw new Error('Chưa đăng nhập');

    const response = await fetch(`${API_BASE_URL}/api/members/profile`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      throw new Error(data.message || 'Lấy thông tin thất bại');
    }
    return data;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user: MemberUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): MemberUser | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}

export const authService = new AuthService();
