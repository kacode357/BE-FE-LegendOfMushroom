import { axiosClient } from "@/config/axios";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { CreateAccessCodeResponse } from "@/types/access/response/createCode.response";
import type { ListRegisteredUsersResponse } from "@/types/access/response/listUsers.response";

export async function createAccessCode(ttlMinutes = 5): Promise<CreateAccessCodeResponse> {
  const response = await axiosClient.post<ApiSuccessResponse<CreateAccessCodeResponse>>(
    "/api/access/codes",
    { ttlMinutes }
  );

  return response.data.data;
}

export async function listRegisteredUsers(): Promise<ListRegisteredUsersResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<ListRegisteredUsersResponse>>(
    "/api/access/users"
  );

  return response.data.data;
}
