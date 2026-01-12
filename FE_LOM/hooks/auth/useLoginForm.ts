"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/config/axios";
import { login } from "@/services/auth.service";

type UseLoginFormOptions = {
  initialEmail?: string;
  initialPassword?: string;
};

export function useLoginForm(options: UseLoginFormOptions = {}) {
  const router = useRouter();
  const [email, setEmail] = useState(options.initialEmail ?? "admin@local");
  const [password, setPassword] = useState(options.initialPassword ?? "123123");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((v) => !v);
  }, []);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);
      setSubmitting(true);

      try {
        await login(email, password);
        // Set a flag cookie on frontend domain so middleware can detect login
        document.cookie = "auth=1; path=/; max-age=86400; SameSite=Lax";
        // Redirect immediately without showing success message
        router.push("/");
      } catch (err: unknown) {
        setError(getApiErrorMessage(err));
        setSubmitting(false);
      }
    },
    [email, password, router]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    submitting,
    error,
    success,
    canSubmit,
    onSubmit,
  };
}
