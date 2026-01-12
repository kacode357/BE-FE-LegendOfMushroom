"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/notification/useNotifications";
import type { PackageDto } from "@/types/package/response/package.response";

type Props = {
  pkg: PackageDto;
  onClose: () => void;
};

export function NotificationModal({ pkg, onClose }: Props) {
  const { items, loading, error, refresh, create } = useNotifications(pkg.id);

  const notification = items.length > 0 ? items[0] : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load existing notification data
  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setContent(notification.content || "");
    }
  }, [notification]);

  const canSubmit = useMemo(() => title.trim().length > 0 && !submitting, [title, submitting]);

  async function onSave() {
    if (!canSubmit) return;

    setSubmitting(true);
    const ok = await create({
      title: title.trim(),
      content: content.trim() || "",
    });

    setSubmitting(false);
    if (ok) {
      // Optionally close modal after save
      // onClose();
    }
  }

  function parseContentLines(content: string): string[] {
    if (!content) return [];
    return content.split(".").map(line => line.trim()).filter(line => line.length > 0);
  }

  function formatContentForEdit(content: string): string {
    const lines = parseContentLines(content);
    return lines.join(".\n") + (lines.length > 0 ? "." : "");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-foreground/10 bg-background p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Thông báo: {pkg.name}
            </h2>
            <p className="mt-1 text-sm text-foreground/70">
              Mỗi gói chỉ có 1 thông báo. Dùng dấu "." để phân cách các dòng.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {loading ? (
          <div className="mt-4 text-center text-sm text-foreground/70">Đang tải...</div>
        ) : (
          <>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Tiêu đề</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
                  placeholder="VD: Thông báo quan trọng"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Nội dung <span className="text-foreground/50">(mỗi câu kết thúc bằng dấu ".")</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="mt-1.5 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                  placeholder="VD: Câu đầu tiên. Câu thứ hai. Câu thứ ba."
                />
                <p className="mt-1 text-xs text-foreground/50">
                  Mỗi câu kết thúc bằng "." sẽ được hiển thị trên 1 dòng riêng
                </p>
              </div>

              {/* Preview */}
              {content && (
                <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4">
                  <p className="mb-2 text-xs font-medium text-foreground/70">Xem trước:</p>
                  <ul className="space-y-1.5 text-sm">
                    {parseContentLines(content).map((line, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-foreground/50">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button onClick={onSave} disabled={!canSubmit}>
                {submitting ? "Đang lưu..." : notification ? "Cập nhật" : "Tạo thông báo"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
