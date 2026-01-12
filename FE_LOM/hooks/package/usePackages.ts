"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/config/axios";
import {
  createPackage,
  deletePackage,
  listPackages,
  updatePackage,
} from "@/services/package.service";
import type { CreatePackagePayload } from "@/types/package/payload/createPackage.payload";
import type { UpdatePackagePayload } from "@/types/package/payload/updatePackage.payload";
import type { PackageDto } from "@/types/package/response/package.response";

export function usePackages() {
  const [items, setItems] = useState<PackageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await listPackages();
      setItems(data.items);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: CreatePackagePayload) => {
    setError(null);
    try {
      await createPackage(payload);
      await refresh();
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    }
  }, [refresh]);

  const patch = useCallback(async (id: string, payload: UpdatePackagePayload) => {
    setError(null);
    try {
      await updatePackage(id, payload);
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
      await deletePackage(id);
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
