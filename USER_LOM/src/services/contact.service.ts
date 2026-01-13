const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface CreateContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  memberId: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface ContactListResponse {
  items: ContactResponse[];
  total: number;
}

export async function createContact(
  payload: CreateContactPayload,
  token: string
): Promise<ApiResponse<ContactResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gửi yêu cầu thất bại');
  }
  return data;
}

export async function getMyContacts(
  token: string
): Promise<ApiResponse<ContactListResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/contacts/my`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Lấy danh sách yêu cầu thất bại');
  }
  return data;
}
