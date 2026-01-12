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
    <div className="rounded-2xl border border-foreground/10 bg-background p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Quản lý thông báo</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Chọn gói để tạo/sửa thông báo. Mỗi gói chỉ có 1 thông báo.
          </p>
        </div>
        <Button variant="outline" className="h-9" onClick={loadPackages} disabled={loading}>
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Left: Package List */}
        <div>
          <h2 className="mb-3 text-base font-semibold">Danh sách gói</h2>
          
          {loading ? (
            <div className="text-center text-sm text-foreground/70">Đang tải...</div>
          ) : packages.length === 0 ? (
            <div className="text-center text-sm text-foreground/70">Chưa có gói nào</div>
          ) : (
            <div className="space-y-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={
                    "w-full rounded-lg border p-3 text-left transition-colors " +
                    (selectedPkg?.id === pkg.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-foreground/10 hover:bg-foreground/5")
                  }
                >
                  <div className="font-medium">{pkg.name}</div>
                  {pkg.description && (
                    <div className="mt-1 text-xs text-foreground/70">{pkg.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Notification Form */}
        <div>
          {!selectedPkg ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 text-sm text-foreground/70">
              Chọn một gói để quản lý thông báo
            </div>
          ) : (
            <div>
              <h2 className="mb-3 text-base font-semibold">
                Thông báo: {selectedPkg.name}
              </h2>

              {notifLoading ? (
                <div className="text-center text-sm text-foreground/70">Đang tải...</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
                      placeholder="VD: Thông báo quan trọng"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Nội dung{" "}
                      <span className="text-foreground/50">(mỗi câu kết thúc bằng dấu chấm)</span>
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="mt-1.5 w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                      placeholder="VD: Câu đầu tiên. Câu thứ hai. Câu thứ ba."
                    />
                    <p className="mt-1 text-xs text-foreground/50">
                      Mỗi câu kết thúc bằng dấu chấm sẽ được hiển thị trên 1 dòng riêng
                    </p>
                  </div>

                  {/* Preview */}
                  {content && (
                    <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
                      <p className="mb-2 text-xs font-medium text-foreground/70">Xem trước:</p>
                      <ul className="space-y-1.5 text-sm">
                        {content
                          .split(".")
                          .map(line => line.trim())
                          .filter(line => line.length > 0)
                          .map((line, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-foreground/50">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={onSave} disabled={!canSubmit} className="flex-1">
                      {submitting ? "Đang lưu..." : notification ? "Cập nhật" : "Tạo thông báo"}
                    </Button>
                    <Button
                      variant="outline"
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
