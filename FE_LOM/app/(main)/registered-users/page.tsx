"use client";

/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { useRegisteredUsers } from "@/hooks/access/useRegisteredUsers";
import { Users, RefreshCw, User, Server, Package, Clock, KeyRound } from "lucide-react";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function RegisteredUsersPage() {
  const { items, loading, error, refresh } = useRegisteredUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-magic flex items-center justify-center shadow-lg glow-magic">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">User đã đăng ký</h1>
            <p className="text-sm text-muted-foreground">
              Danh sách các code đã được bind
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refresh} 
          disabled={loading}
          className="hover-jelly"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50 border border-accent">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">{items.length} users</span>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-fade-in">
          {error}
        </div>
      ) : null}

      {/* Table */}
      <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b-2 border-border bg-accent/30">
              <tr>
                <th className="px-4 py-3 font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Avatar
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-foreground">Name</th>
                <th className="px-4 py-3 font-bold text-foreground">UID</th>
                <th className="px-4 py-3 font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    Server
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gold" />
                    Gói
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                    Code
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Used at
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-foreground">Last access</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-muted-foreground" colSpan={8}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <span>{loading ? "Đang tải..." : "Chưa có user nào đăng ký."}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr 
                    key={item.code} 
                    className={`border-b border-border last:border-b-0 transition-colors hover:bg-accent/30 ${
                      index % 2 === 0 ? 'bg-background' : 'bg-accent/10'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="relative">
                        <img
                          src={item.user?.avatarUrl}
                          alt={item.user?.name}
                          className="h-10 w-10 rounded-full border-2 border-primary/30 object-cover shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-card" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground">{item.user?.name}</td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{item.user?.uid}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-lg bg-accent text-xs font-semibold">
                        {item.user?.server}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-lg bg-gradient-gold text-xs font-bold text-yellow-900">
                        {item.package?.name ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDateTime(item.usedAt)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.lastAccessAt ? formatDateTime(item.lastAccessAt) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
