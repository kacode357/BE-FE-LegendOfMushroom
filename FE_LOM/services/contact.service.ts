import { axiosClient } from "@/config/axios";

import type { ApiSuccessResponse } from "@/types/api/response";
import type { ContactDto } from "@/types/contact/response/contact.response";
import type { ListContactsResponse } from "@/types/contact/response/listContacts.response";
import type { ContactStatsResponse } from "@/types/contact/response/contactStats.response";
import type { UpdateContactPayload } from "@/types/contact/payload/updateContact.payload";

export async function listContacts(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ListContactsResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<ListContactsResponse>>("/api/contacts", {
    params,
  });
  return response.data.data;
}

export async function getContactStats(): Promise<ContactStatsResponse> {
  const response = await axiosClient.get<ApiSuccessResponse<ContactStatsResponse>>("/api/contacts/stats");
  return response.data.data;
}

export async function getContactById(id: string): Promise<ContactDto> {
  const response = await axiosClient.get<ApiSuccessResponse<ContactDto>>(`/api/contacts/${id}`);
  return response.data.data;
}

export async function updateContact(id: string, payload: UpdateContactPayload): Promise<ContactDto> {
  const response = await axiosClient.patch<ApiSuccessResponse<ContactDto>>(`/api/contacts/${id}`, payload);
  return response.data.data;
}

export async function deleteContact(id: string): Promise<{ id: string }> {
  const response = await axiosClient.delete<ApiSuccessResponse<{ id: string }>>(`/api/contacts/${id}`);
  return response.data.data;
}

export async function replyContact(id: string, adminReply: string): Promise<ContactDto> {
  const response = await axiosClient.post<ApiSuccessResponse<ContactDto>>(`/api/contacts/${id}/reply`, {
    adminReply,
  });
  return response.data.data;
}
