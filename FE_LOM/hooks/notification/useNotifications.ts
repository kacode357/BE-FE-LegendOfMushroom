"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/config/axios";
import {
  createNotification,
  deleteNotification,
  listNotificationsByPackage,
  updateNotification,
} from "@/services/notification.service";
import type { CreateNotificationPayload } from "@/types/notification/payload/createNotification.payload";
import type { UpdateNotificationPayload } from "@/types/notification/payload/updateNotification.payload";
import type { NotificationDto } from "@/types/notification/response/notification.response";

export function useNotifications(packageId: string | null) {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!packageId) {
      setItems([]);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await listNotificationsByPackage(packageId);
      setItems(data.items);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  const create = useCallback(async (payload: Omit<CreateNotificationPayload, "packageId">) => {
    if (!packageId) return false;
    
    setError(null);
    try {
      await createNotification({ ...payload, packageId });
      await refresh();
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    }
  }, [packageId, refresh]);

  const patch = useCallback(async (id: string, payload: UpdateNotificationPayload) => {
    setError(null);
    try {
      await updateNotification(id, payload);
      await refresh();
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteNotification(id);
      await refresh();
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh, create, patch, remove };
}
