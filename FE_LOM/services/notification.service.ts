import { axiosClient } from "@/config/axios";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { CreateNotificationPayload } from "@/types/notification/payload/createNotification.payload";
import type { UpdateNotificationPayload } from "@/types/notification/payload/updateNotification.payload";
import type { NotificationDto } from "@/types/notification/response/notification.response";
import type { ListNotificationsResponse } from "@/types/notification/response/listNotifications.response";

export async function listNotifications(): Promise<ListNotificationsResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<ListNotificationsResponse>>("/api/notifications");
  return response.data.data;
}

export async function listNotificationsByPackage(packageId: string): Promise<ListNotificationsResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<ListNotificationsResponse>>(`/api/notifications/package/${packageId}`);
  return response.data.data;
}

export async function createNotification(payload: CreateNotificationPayload): Promise<NotificationDto> {
  const response = await axiosClient.post<ApiSuccessResponse<NotificationDto>>("/api/notifications", payload);
  return response.data.data;
}

export async function updateNotification(id: string, payload: UpdateNotificationPayload): Promise<NotificationDto> {
  const response = await axiosClient.patch<ApiSuccessResponse<NotificationDto>>(`/api/notifications/${id}`, payload);
  return response.data.data;
}

export async function deleteNotification(id: string): Promise<{ id: string }> {
  const response = await axiosClient.delete<ApiSuccessResponse<{ id: string }>>(`/api/notifications/${id}`);
  return response.data.data;
}
