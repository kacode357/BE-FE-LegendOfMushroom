import { axiosClient } from "@/config/axios";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { LoginPayload } from "@/types/auth/payload/login.payload";
import type { LoginResponse } from "@/types/auth/response/login.response";
import type { LogoutResponse } from "@/types/auth/response/logout.response";

export async function login(email: string, password: string): Promise<LoginResponse> {
  const payload: LoginPayload = { email, password };
  const response = await axiosClient.post<ApiSuccessResponse<LoginResponse>>(
    "/api/auth/login",
    payload
  );
  return response.data.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await axiosClient.post<ApiSuccessResponse<LogoutResponse>>(
    "/api/auth/logout"
  );
  return response.data.data;
}
