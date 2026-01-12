"use client";

import { useCallback, useMemo, useState } from "react";

import { getApiErrorMessage } from "@/config/axios";
import { createAccessCode } from "@/services/access.service";
import type { CreateAccessCodeResponse } from "@/types/access/response/createCode.response";

export function useCreateAccessCode() {
  const [ttlMinutes, setTtlMinutes] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateAccessCodeResponse | null>(null);

  const canSubmit = useMemo(() => {
    return !submitting && Number.isFinite(ttlMinutes) && ttlMinutes >= 1 && ttlMinutes <= 60;
  }, [submitting, ttlMinutes]);

  const onCreate = useCallback(async () => {
    setError(null);
    setSubmitting(true);

    try {
      const data = await createAccessCode(ttlMinutes);
      setResult(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [ttlMinutes]);

  return {
    ttlMinutes,
    setTtlMinutes,
    submitting,
    error,
    result,
    canSubmit,
    onCreate,
  };
}
