"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/config/axios";
import {
  createNotification,
  listNotificationsByPackage,
} from "@/services/notification.service";
import { listPackages } from "@/services/package.service";
import type { NotificationDto } from "@/types/notification/response/notification.response";
import type { PackageDto } from "@/types/package/response/package.response";
import { Bell, RefreshCw, Package, Sparkles, FileText, Send, Check } from "lucide-react";

export default function NotificationsPage() {
  const [packages, setPackages] = useState<PackageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPkg, setSelectedPkg] = useState<PackageDto | null>(null);
  const [notification, setNotification] = useState<NotificationDto | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => title.trim().length > 0 && !submitting, [title, submitting]);

  async function loadPackages() {
    setError(null);
    setLoading(true);

    try {
      const pkgData = await listPackages();
      setPackages(pkgData.items);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadNotification(packageId: string) {
    setNotifLoading(true);
    try {
      const data = await listNotificationsByPackage(packageId);
      const notif = data.items.length > 0 ? data.items[0] : null;
      setNotification(notif);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setNotifLoading(false);
    }
  }

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    if (selectedPkg) {
      loadNotification(selectedPkg.id);
    } else {
      setNotification(null);
    }
  }, [selectedPkg]);

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setContent(notification.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [notification]);

  async function onSave() {
    if (!canSubmit || !selectedPkg) return;

    setSubmitting(true);
    setError(null);

    try {
      await createNotification({
        packageId: selectedPkg.id,
        title: title.trim(),
        content: content.trim() || "",
      });
      
      await loadNotification(selectedPkg.id);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg glow-gold">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Quản lý thông báo</h1>
            <p className="text-sm text-muted-foreground">
              Chọn gói để tạo/sửa thông báo (mỗi gói 1 thông báo)
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadPackages} 
          disabled={loading}
          className="hover-jelly"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-fade-in">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Package List */}
        <div className="rounded-2xl border-2 border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Danh sách gói</h2>
            <span className="px-2 py-0.5 rounded-full bg-accent text-xs font-bold">
              {packages.length}
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center animate-pulse">
                <Package className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              Chưa có gói nào
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`
                    w-full rounded-xl border-2 p-4 text-left transition-all hover-lift
                    ${selectedPkg?.id === pkg.id
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-accent/30"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedPkg?.id === pkg.id ? 'bg-gradient-forest' : 'bg-accent'
                    }`}>
                      <Package className={`w-4 h-4 ${selectedPkg?.id === pkg.id ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{pkg.name}</div>
                      {pkg.description && (
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{pkg.description}</div>
                      )}
                    </div>
                    {selectedPkg?.id === pkg.id && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Notification Form */}
        <div className="rounded-2xl border-2 border-border bg-card p-5">
          {!selectedPkg ? (
            <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">Chọn một gói để quản lý thông báo</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold text-foreground">
                  Thông báo: {selectedPkg.name}
                </h2>
              </div>

              {notifLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center animate-pulse">
                    <Bell className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Tiêu đề
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                      placeholder="VD: Thông báo quan trọng"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Nội dung
                      <span className="text-xs text-muted-foreground font-normal">(mỗi câu kết thúc bằng dấu chấm)</span>
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground resize-none"
                      placeholder="VD: Câu đầu tiên. Câu thứ hai. Câu thứ ba."
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Mỗi câu kết thúc bằng dấu chấm sẽ hiển thị trên 1 dòng riêng
                    </p>
                  </div>

                  {/* Preview */}
                  {content && (
                    <div className="rounded-xl border-2 border-accent bg-accent/30 p-4">
                      <p className="mb-3 text-xs font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        Xem trước:
                      </p>
                      <ul className="space-y-2 text-sm">
                        {content
                          .split(".")
                          .map(line => line.trim())
                          .filter(line => line.length > 0)
                          .map((line, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              </span>
                              <span className="text-foreground">{line}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={onSave} 
                      disabled={!canSubmit} 
                      variant="forest"
                      size="lg"
                      className="flex-1 hover-jelly"
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {notification ? "Cập nhật" : "Tạo thông báo"}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedPkg(null)}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
