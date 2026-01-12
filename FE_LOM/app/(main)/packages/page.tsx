"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePackages } from "@/hooks/package/usePackages";

type EditState = {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
};

export default function PackagesPage() {
  const { items, loading, error, refresh, create, patch, remove } = usePackages();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [edit, setEdit] = useState<EditState | null>(null);
  const [cardSubmitting, setCardSubmitting] = useState<string | null>(null);

  const canCreate = useMemo(() => name.trim().length > 0 && !submitting, [name, submitting]);

  async function onCreate() {
    if (!canCreate) return;

    setSubmitting(true);
    const ok = await create({
      name: name.trim(),
      description: description.trim() || undefined,
      fileUrl: fileUrl.trim() || undefined,
    });

    if (ok) {
      setName("");
      setDescription("");
      setFileUrl("");
    }

    setSubmitting(false);
  }

  async function onSaveEdit() {
    if (!edit) return;

    setCardSubmitting(edit.id);
    const ok = await patch(edit.id, {
      name: edit.name.trim(),
      description: edit.description.trim() || undefined,
      fileUrl: edit.fileUrl.trim() || undefined,
    });
    if (ok) setEdit(null);
    setCardSubmitting(null);
  }

  async function onDelete(id: string) {
    setCardSubmitting(id);
    await remove(id);
    setCardSubmitting(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Gói</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Tạo và quản lý các gói dành cho người dùng
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {/* Create Form */}
      <div className="rounded-xl border border-foreground/10 bg-card p-5">
        <h2 className="text-lg font-semibold mb-4">Tạo gói mới</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground/80">
              Tên gói <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              placeholder="VD: Gói Premium"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              placeholder="Mô tả ngắn gọn"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80">File URL</label>
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-4">
          <Button onClick={onCreate} disabled={!canCreate} size="sm">
            {submitting ? "Đang tạo..." : "Tạo gói"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Packages Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Danh sách gói ({items.length})
        </h2>

        {loading && items.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            Đang tải...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            Chưa có gói nào
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((pkg) => {
              const isEditing = edit?.id === pkg.id;
              const busy = cardSubmitting === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className="rounded-xl border border-foreground/10 bg-card p-5 hover:border-foreground/20 transition-colors"
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground/70">
                          Tên gói <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={edit.name}
                          onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                          className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm focus:border-ring focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground/70">Mô tả</label>
                        <input
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                          className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm focus:border-ring focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground/70">File URL</label>
                        <input
                          value={edit.fileUrl}
                          onChange={(e) => setEdit({ ...edit, fileUrl: e.target.value })}
                          className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm focus:border-ring focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={onSaveEdit}
                          disabled={busy || edit.name.trim().length === 0}
                          className="flex-1"
                        >
                          {busy ? "Đang lưu..." : "Lưu"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEdit(null)}
                          disabled={busy}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-base">{pkg.name}</h3>
                        </div>
                        <p className="text-xs text-foreground/40 font-mono mb-1.5">
                          ID: {pkg.id}
                        </p>
                        <p className="text-sm text-foreground/60 line-clamp-2">
                          {pkg.description || "Không có mô tả"}
                        </p>
                      </div>

                      {pkg.fileUrl && (
                        <div>
                          <a
                            href={pkg.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary hover:underline underline-offset-2 break-all"
                          >
                            📎 {pkg.fileUrl}
                          </a>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-foreground/5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setEdit({
                              id: pkg.id,
                              name: pkg.name,
                              description: pkg.description ?? "",
                              fileUrl: pkg.fileUrl ?? "",
                            })
                          }
                          disabled={busy}
                          className="flex-1"
                        >
                          ✏️ Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(pkg.id)}
                          disabled={busy}
                        >
                          {busy ? "..." : "🗑️"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
