"use client";

/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { useRegisteredUsers } from "@/hooks/access/useRegisteredUsers";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function RegisteredUsersPage() {
  const { items, loading, error, refresh } = useRegisteredUsers();

  return (
    <div className="rounded-2xl border border-foreground/10 bg-background p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">User đã đăng ký</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Danh sách các code đã được bind (admin-only).
          </p>
        </div>
        <Button variant="outline" className="h-9" onClick={refresh} disabled={loading}>
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-xl border border-foreground/10">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="border-b border-foreground/10 bg-foreground/5">
            <tr>
              <th className="px-3 py-2 font-medium">Avatar</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">UID</th>
              <th className="px-3 py-2 font-medium">Server</th>
              <th className="px-3 py-2 font-medium">Gói</th>
              <th className="px-3 py-2 font-medium">Code</th>
              <th className="px-3 py-2 font-medium">Used at</th>
              <th className="px-3 py-2 font-medium">Last access</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-foreground/70" colSpan={8}>
                  {loading ? "Đang tải..." : "Chưa có user nào đăng ký."}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.code} className="border-b border-foreground/10 last:border-b-0">
                  <td className="px-3 py-2">
                    <img
                      src={item.user?.avatarUrl}
                      alt={item.user?.name}
                      className="h-9 w-9 rounded-full border border-foreground/10 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </td>
                  <td className="px-3 py-2 font-medium">{item.user?.name}</td>
                  <td className="px-3 py-2">{item.user?.uid}</td>
                  <td className="px-3 py-2">{item.user?.server}</td>
                  <td className="px-3 py-2">{item.package?.name ?? "-"}</td>
                  <td className="px-3 py-2 font-mono">{item.code}</td>
                  <td className="px-3 py-2 text-foreground/70">{formatDateTime(item.usedAt)}</td>
                  <td className="px-3 py-2 text-foreground/70">
                    {item.lastAccessAt ? formatDateTime(item.lastAccessAt) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
