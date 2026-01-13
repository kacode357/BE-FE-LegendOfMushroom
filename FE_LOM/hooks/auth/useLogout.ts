"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/config/axios";
import { logout } from "@/services/auth.service";
import { AUTH_TOKEN_KEY } from "@/constants/auth";

export function useLogout() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogout = useCallback(async () => {
    setError(null);
    setSubmitting(true);
    let ok = false;

    try {
      await logout();
      // Clear auth flag cookie on frontend domain
      document.cookie = "auth=; path=/; max-age=0";
      // Xóa token khỏi localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      ok = true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
      if (ok) {
        router.push("/login");
      }
    }
  }, [router]);

  return { onLogout, submitting, error };
}
