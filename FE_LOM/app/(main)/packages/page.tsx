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
  const [rowSubmitting, setRowSubmitting] = useState<string | null>(null);

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

    setRowSubmitting(edit.id);
    const ok = await patch(edit.id, {
      name: edit.name.trim(),
      description: edit.description.trim() || undefined,
      fileUrl: edit.fileUrl.trim() || undefined,
    });
    if (ok) setEdit(null);
    setRowSubmitting(null);
  }

  async function onDelete(id: string) {
    setRowSubmitting(id);
    await remove(id);
    setRowSubmitting(null);
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-background p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gói</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Quản lý gói (admin-only cho tạo/sửa/xóa). Danh sách gói là public.
          </p>
        </div>
        <Button variant="outline" className="h-9" onClick={refresh} disabled={loading}>
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      <div className="mt-5 rounded-2xl border border-foreground/10 bg-background p-4">
        <h2 className="text-base font-semibold tracking-tight">Tạo gói</h2>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Tên gói</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
              placeholder="VD: Gói A"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
              placeholder="Mô tả ngắn"
            />
          </div>

          <div>
            <label className="text-sm font-medium">File URL</label>
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-3">
          <Button onClick={onCreate} disabled={!canCreate} className="h-11">
            {submitting ? "Đang tạo..." : "Tạo gói"}
          </Button>
        </div>
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
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Tên</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">File URL</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-foreground/70" colSpan={5}>
                  {loading ? "Đang tải..." : "Chưa có gói nào."}
                </td>
              </tr>
            ) : (
              items.map((pkg) => {
                const isEditing = edit?.id === pkg.id;
                const busy = rowSubmitting === pkg.id;

                return (
                  <tr key={pkg.id} className="border-b border-foreground/10 last:border-b-0">
                    <td className="px-3 py-2 font-mono text-foreground/70">{pkg.id}</td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          value={edit.name}
                          onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                          className="h-10 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
                        />
                      ) : (
                        <div className="font-medium">{pkg.name}</div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                          className="h-10 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
                        />
                      ) : (
                        <div className="text-foreground/70">{pkg.description ?? "-"}</div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          value={edit.fileUrl}
                          onChange={(e) => setEdit({ ...edit, fileUrl: e.target.value })}
                          className="h-10 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
                        />
                      ) : pkg.fileUrl ? (
                        <a
                          className="text-primary underline-offset-4 hover:underline"
                          href={pkg.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {pkg.fileUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={onSaveEdit} disabled={busy || edit.name.trim().length === 0}>
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
                      ) : (
                        <div className="flex gap-2">
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
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(pkg.id)}
                            disabled={busy}
                          >
                            {busy ? "Đang xóa..." : "Xóa"}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
