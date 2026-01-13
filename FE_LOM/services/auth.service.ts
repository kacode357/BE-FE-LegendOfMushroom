import { axiosClient } from "@/config/axios";
import { AUTH_TOKEN_KEY } from "@/constants/auth";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { LoginPayload } from "@/types/auth/payload/login.payload";
import type { LoginResponse } from "@/types/auth/response/login.response";
import type { LogoutResponse } from "@/types/auth/response/logout.response";

export { AUTH_TOKEN_KEY };

export async function login(email: string, password: string): Promise<LoginResponse> {
  const payload: LoginPayload = { email, password };
  const response = await axiosClient.post<ApiSuccessResponse<LoginResponse>>(
    "/api/auth/login",
    payload
  );
  const data = response.data.data;
  
  // Lưu token vào localStorage
  if (data.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  }
  
  return data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await axiosClient.post<ApiSuccessResponse<LogoutResponse>>(
    "/api/auth/logout"
  );
  
  // Xóa token khỏi localStorage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  
  return response.data.data;
}
