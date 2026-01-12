"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePackages } from "@/hooks/package/usePackages";
import { Package, Plus, RefreshCw, Sparkles, Edit3, Trash2, Link, FileText } from "lucide-react";

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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-forest flex items-center justify-center shadow-lg glow-green">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Quản lý Gói</h1>
            <p className="text-sm text-muted-foreground">
              Tạo và quản lý các gói dành cho người dùng
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

      {/* Create Form */}
      <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold text-foreground">Tạo gói mới</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Package className="w-4 h-4 text-primary" />
              Tên gói <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              placeholder="VD: Gói Premium"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Mô tả
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              placeholder="Mô tả ngắn gọn"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Link className="w-4 h-4 text-muted-foreground" />
              File URL
            </label>
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-5">
          <Button 
            onClick={onCreate} 
            disabled={!canCreate} 
            variant="forest"
            size="lg"
            className="hover-jelly"
          >
            {submitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Tạo gói
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-fade-in">
          {error}
        </div>
      )}

      {/* Packages Table */}
      <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Danh sách gói
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {items.length}
          </span>
        </div>

        {loading && items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center animate-pulse">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            Đang tải...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            Chưa có gói nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-border bg-accent/30">
                <tr>
                  <th className="px-4 py-3 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Tên gói
                    </div>
                  </th>
                  <th className="px-4 py-3 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Mô tả
                    </div>
                  </th>
                  <th className="px-4 py-3 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-muted-foreground" />
                      File URL
                    </div>
                  </th>
                  <th className="px-4 py-3 font-bold text-foreground text-center w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((pkg, index) => {
                  const isEditing = edit?.id === pkg.id;
                  const busy = cardSubmitting === pkg.id;

                  return (
                    <tr
                      key={pkg.id}
                      className={`border-b border-border last:border-b-0 transition-colors ${
                        isEditing 
                          ? 'bg-primary/10' 
                          : index % 2 === 0 
                            ? 'bg-background hover:bg-accent/30' 
                            : 'bg-accent/10 hover:bg-accent/30'
                      }`}
                    >
                      {isEditing ? (
                        // Edit Mode Row
                        <>
                          <td className="px-4 py-3">
                            <input
                              value={edit.name}
                              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                              className="h-9 w-full rounded-lg border-2 border-primary bg-background px-3 text-sm font-medium outline-none"
                              placeholder="Tên gói"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={edit.description}
                              onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                              className="h-9 w-full rounded-lg border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
                              placeholder="Mô tả"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={edit.fileUrl}
                              onChange={(e) => setEdit({ ...edit, fileUrl: e.target.value })}
                              className="h-9 w-full rounded-lg border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
                              placeholder="https://..."
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="forest"
                                onClick={onSaveEdit}
                                disabled={busy || edit.name.trim().length === 0}
                                className="hover-jelly"
                              >
                                {busy ? "..." : "Lưu"}
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
                          </td>
                        </>
                      ) : (
                        // View Mode Row
                        <>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-forest flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-foreground">{pkg.name}</div>
                                <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                                  {pkg.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground line-clamp-2">
                              {pkg.description || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {pkg.fileUrl ? (
                              <a
                                href={pkg.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline underline-offset-2 max-w-[250px]"
                              >
                                <Link className="w-4 h-4 shrink-0" />
                                <span className="truncate">{pkg.fileUrl}</span>
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
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
                                className="hover-jelly"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(pkg.id)}
                                disabled={busy}
                                className="hover-jelly"
                              >
                                {busy ? "..." : <Trash2 className="w-4 h-4" />}
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
