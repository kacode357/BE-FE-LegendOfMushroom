import { axiosClient } from "@/config/axios";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { CreatePackagePayload } from "@/types/package/payload/createPackage.payload";
import type { UpdatePackagePayload } from "@/types/package/payload/updatePackage.payload";
import type { PackageDto } from "@/types/package/response/package.response";
import type { ListPackagesResponse } from "@/types/package/response/listPackages.response";

// Admin list - includes hidden packages
export async function listPackages(): Promise<ListPackagesResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<ListPackagesResponse>>("/api/packages/admin");
  return response.data.data;
}

export async function createPackage(payload: CreatePackagePayload): Promise<PackageDto> {
  const response = await axiosClient.post<ApiSuccessResponse<PackageDto>>("/api/packages", payload);
  return response.data.data;
}

export async function updatePackage(id: string, payload: UpdatePackagePayload): Promise<PackageDto> {
  const response = await axiosClient.patch<ApiSuccessResponse<PackageDto>>(`/api/packages/${id}`, payload);
  return response.data.data;
}

export async function deletePackage(id: string): Promise<{ id: string }> {
  const response = await axiosClient.delete<ApiSuccessResponse<{ id: string }>>(`/api/packages/${id}`);
  return response.data.data;
}
