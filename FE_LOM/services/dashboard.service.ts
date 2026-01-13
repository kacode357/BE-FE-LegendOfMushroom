import { axiosClient } from "@/config/axios";
import type { ApiSuccessResponse } from "@/types/api/response";
import type { DashboardStats, RecentActivity } from "@/types/dashboard/response/dashboard.response";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axiosClient.get<ApiSuccessResponse<DashboardStats>>("/api/dashboard/stats");
  return response.data.data;
}

export async function getRecentActivity(): Promise<RecentActivity> {
  const response = await axiosClient.get<ApiSuccessResponse<RecentActivity>>("/api/dashboard/recent");
  return response.data.data;
}
