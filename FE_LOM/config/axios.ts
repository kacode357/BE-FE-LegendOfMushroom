import axios from "axios";

import { AUTH_TOKEN_KEY } from "@/constants/auth";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getMessageFromErrorPayload(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const message = payload.message;
  return typeof message === "string" && message.trim() ? message : null;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    const message = getMessageFromErrorPayload(data);
    if (message) return message;

    if (!error.response) {
      return "Không thể kết nối tới server.";
    }
  }

  return "Đã có lỗi xảy ra.";
}
