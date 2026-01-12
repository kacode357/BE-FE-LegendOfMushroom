"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/config/axios";
import { listRegisteredUsers } from "@/services/access.service";
import type { RegisteredAccessItem } from "@/types/access/response/listUsers.response";

export function useRegisteredUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<RegisteredAccessItem[]>([]);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await listRegisteredUsers();
      setItems(data.items);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}
