import { axiosClient } from "@/config/axios";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { User, UserListResponse } from "@/types/user/response/user.response";
import type { UserPayload, UpdateUserPayload, ChangePasswordPayload } from "@/types/user/payload/user.payload";

export async function listUsers(): Promise<UserListResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<UserListResponse>>("/api/users");
  return response.data.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await axiosClient.get<ApiSuccessResponse<User>>(`/api/users/${id}`);
  return response.data.data;
}

export async function createUser(payload: UserPayload): Promise<User> {
  const response = await axiosClient.post<ApiSuccessResponse<User>>("/api/users", payload);
  return response.data.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const response = await axiosClient.patch<ApiSuccessResponse<User>>(`/api/users/${id}`, payload);
  return response.data.data;
}

export async function changeUserPassword(id: string, payload: ChangePasswordPayload): Promise<void> {
  await axiosClient.patch(`/api/users/${id}/password`, payload);
}

export async function deleteUser(id: string): Promise<void> {
  await axiosClient.delete(`/api/users/${id}`);
}
