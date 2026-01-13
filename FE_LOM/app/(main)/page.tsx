"use client";

import { useEffect, useState, useCallback } from "react";
import { getApiErrorMessage } from "@/config/axios";
import { getDashboardStats, getRecentActivity } from "@/services/dashboard.service";
import type { DashboardStats, RecentActivity } from "@/types/dashboard/response/dashboard.response";
import {
  LayoutDashboard,
  Package,
  Key,
  Users,
  MessageSquare,
  Shield,
  Bell,
  RefreshCw,
  Clock,
  AlertCircle,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, recentData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
      ]);
      setStats(statsData);
      setRecent(recentData);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-forest shadow-lg glow-green">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Tổng quan hệ thống LOM
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="hover-jelly"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !stats && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border-2 border-border bg-card p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {/* Packages */}
          <Link href="/packages" className="group h-full">
            <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift transition-all group-hover:border-primary/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Gói</span>
                <div className="p-2 rounded-lg bg-gradient-forest">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.packages.total}</div>
            </div>
          </Link>

          {/* Access Codes */}
          <Link href="/access-codes" className="group h-full">
            <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift transition-all group-hover:border-primary/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Mã truy cập</span>
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                  <Key className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.accessCodes.total}</div>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-green-500">{stats.accessCodes.active} active</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-blue-500">{stats.accessCodes.used} used</span>
              </div>
            </div>
          </Link>

          {/* Members */}
          <Link href="/registered-users" className="group h-full">
            <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift transition-all group-hover:border-primary/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Thành viên</span>
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.members.total}</div>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-green-500">{stats.members.verified} verified</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-yellow-500">{stats.members.unverified} pending</span>
              </div>
            </div>
          </Link>

          {/* Contacts */}
          <Link href="/contacts" className="group h-full">
            <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift transition-all group-hover:border-primary/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Yêu cầu hỗ trợ</span>
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.contacts.total}</div>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-yellow-500">{stats.contacts.pending} pending</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-green-500">{stats.contacts.resolved} resolved</span>
              </div>
            </div>
          </Link>

          {/* Admins */}
          <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Admin</span>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.admins.total}</div>
          </div>

          {/* Notifications */}
          <Link href="/notifications" className="group h-full">
            <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift transition-all group-hover:border-primary/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Thông báo</span>
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                  <Bell className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.notifications.total}</div>
            </div>
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      {recent && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Contacts */}
          <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/20">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                Yêu cầu hỗ trợ gần đây
              </h3>
            </div>
            <div className="divide-y divide-border">
              {recent.recentContacts.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Chưa có yêu cầu nào
                </div>
              ) : (
                recent.recentContacts.map((contact) => (
                  <div key={contact.id} className="p-4 hover:bg-accent/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{contact.subject}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : contact.status === "processing"
                          ? "bg-blue-500/20 text-blue-500"
                          : contact.status === "resolved"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-gray-500/20 text-gray-500"
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(contact.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
            {recent.recentContacts.length > 0 && (
              <Link
                href="/contacts"
                className="block p-3 text-center text-sm font-medium text-primary hover:bg-accent/30 transition-colors border-t border-border"
              >
                Xem tất cả →
              </Link>
            )}
          </div>

          {/* Recent Members */}
          <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/20">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Thành viên mới
              </h3>
            </div>
            <div className="divide-y divide-border">
              {recent.recentMembers.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Chưa có thành viên nào
                </div>
              ) : (
                recent.recentMembers.map((member) => (
                  <div key={member.id} className="p-4 hover:bg-accent/30 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">
                          {member.email}
                        </span>
                      </div>
                      {member.isVerified ? (
                        <UserCheck className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <UserX className="w-4 h-4 text-yellow-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(member.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
            {recent.recentMembers.length > 0 && (
              <Link
                href="/registered-users"
                className="block p-3 text-center text-sm font-medium text-primary hover:bg-accent/30 transition-colors border-t border-border"
              >
                Xem tất cả →
              </Link>
            )}
          </div>

          {/* Recent Access Codes */}
          <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/20">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Mã truy cập gần đây
              </h3>
            </div>
            <div className="divide-y divide-border">
              {recent.recentAccessCodes.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Chưa có mã nào
                </div>
              ) : (
                recent.recentAccessCodes.map((code) => (
                  <div key={code.id} className="p-4 hover:bg-accent/30 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm font-mono font-medium text-foreground bg-muted px-2 py-0.5 rounded">
                        {code.code}
                      </code>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        code.status === "active"
                          ? "bg-green-500/20 text-green-500"
                          : code.status === "used"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-gray-500/20 text-gray-500"
                      }`}>
                        {code.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(code.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
            {recent.recentAccessCodes.length > 0 && (
              <Link
                href="/access-codes"
                className="block p-3 text-center text-sm font-medium text-primary hover:bg-accent/30 transition-colors border-t border-border"
              >
                Xem tất cả →
              </Link>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
