"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/config/axios";
import { logout } from "@/services/auth.service";

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
