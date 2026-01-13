"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getApiErrorMessage } from "@/config/axios";
import {
  listUsers,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
} from "@/services/user.service";
import type { User } from "@/types/user/response/user.response";
import {
  Shield,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Key,
  Mail,
  User as UserIcon,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out admin users - only show non-admin users
  const displayUsers = useMemo(() => users.filter((u) => u.role !== "admin"), [users]);

  // Create form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Change password state
  const [changePasswordId, setChangePasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await listUsers();
      setUsers(data.items);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate() {
    if (!createEmail.trim() || !createPassword || !createName.trim()) return;

    setCreating(true);
    setError(null);

    try {
      await createUser({
        email: createEmail.trim(),
        password: createPassword,
        name: createName.trim(),
        role: "user",
      });
      setCreateEmail("");
      setCreatePassword("");
      setCreateName("");
      setShowCreateForm(false);
      await loadData();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditRole("");
    setEditIsActive(true);
  }

  async function handleUpdate() {
    if (!editingId || !editName.trim()) return;

    setUpdating(true);
    setError(null);

    try {
      await updateUser(editingId, {
        name: editName.trim(),
        role: editRole,
        isActive: editIsActive,
      });
      cancelEdit();
      await loadData();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  }

  function startChangePassword(userId: string) {
    setChangePasswordId(userId);
    setNewPassword("");
    setShowNewPassword(false);
  }

  function cancelChangePassword() {
    setChangePasswordId(null);
    setNewPassword("");
    setShowNewPassword(false);
  }

  async function handleChangePassword() {
    if (!changePasswordId || !newPassword || newPassword.length < 6) return;

    setChangingPassword(true);
    setError(null);

    try {
      await changeUserPassword(changePasswordId, { newPassword });
      cancelChangePassword();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setChangingPassword(false);
    }
  }

  function openDeleteDialog(user: User) {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;

    setDeletingId(userToDelete.id);
    setError(null);

    try {
      await deleteUser(userToDelete.id);
      closeDeleteDialog();
      await loadData();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Quản lý User</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý tài khoản người dùng hệ thống
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="hover-jelly"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Đang tải..." : "Tải lại"}
          </Button>
          <Button
            variant="forest"
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="hover-jelly"
          >
            <Plus className="w-4 h-4" />
            Thêm User
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <span className="font-semibold text-foreground">{userToDelete?.name}</span>?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deletingId === userToDelete?.id}
            >
              {deletingId === userToDelete?.id ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-2xl border-2 border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold text-foreground">Thêm User mới</h2>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Mail className="w-4 h-4 text-primary" />
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <UserIcon className="w-4 h-4 text-primary" />
                  Tên <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Key className="w-4 h-4 text-primary" />
                  Mật khẩu <span className="text-destructive">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="h-11 w-full rounded-xl border-2 border-border bg-background px-4 pr-10 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="forest"
                  onClick={handleCreate}
                  disabled={creating || !createEmail.trim() || !createPassword || createPassword.length < 6 || !createName.trim()}
                  className="flex-1 hover-jelly"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tạo User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-2xl border-2 border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-foreground">Đổi mật khẩu</h2>
              </div>
              <button
                onClick={cancelChangePassword}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Key className="w-4 h-4 text-primary" />
                  Mật khẩu mới <span className="text-destructive">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border-2 border-border bg-background px-4 pr-10 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={cancelChangePassword}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="forest"
                  onClick={handleChangePassword}
                  disabled={changingPassword || !newPassword || newPassword.length < 6}
                  className="flex-1 hover-jelly"
                >
                  {changingPassword ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      Đổi mật khẩu
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Tổng số User</span>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{displayUsers.length}</div>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Hoạt động</span>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {displayUsers.filter((u) => u.isActive).length}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Vô hiệu hóa</span>
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
              <XCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {displayUsers.filter((u) => !u.isActive).length}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Admin (ẩn)</span>
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {users.filter((u) => u.role === "admin").length}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && displayUsers.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border-2 border-border bg-card p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users List */}
      {!loading && displayUsers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Chưa có user nào</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Thêm user đầu tiên để quản lý hệ thống
          </p>
          <Button variant="forest" onClick={() => setShowCreateForm(true)} className="hover-jelly">
            <Plus className="w-4 h-4" />
            Thêm User
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border-2 border-border bg-card overflow-hidden hover-lift transition-all"
            >
              {editingId === user.id ? (
                /* Edit Mode */
                <div className="p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-foreground">Tên</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-2 h-10 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">Role</label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="mt-2 h-10 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`active-${user.id}`}
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor={`active-${user.id}`} className="text-sm font-medium text-foreground">
                      Tài khoản hoạt động
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={cancelEdit} className="flex-1">
                      <X className="w-4 h-4" />
                      Hủy
                    </Button>
                    <Button
                      variant="forest"
                      onClick={handleUpdate}
                      disabled={updating || !editName.trim()}
                      className="flex-1 hover-jelly"
                    >
                      {updating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Lưu
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        user.isActive
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}
                    >
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground">{user.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "moderator"
                              ? "bg-purple-500/20 text-purple-500"
                              : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.isActive ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                            Vô hiệu
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startChangePassword(user.id)}
                        className="hover:border-amber-500 hover:text-amber-500"
                        title="Đổi mật khẩu"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEdit(user)}
                        className="hover:border-primary hover:text-primary"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(user)}
                        disabled={deletingId === user.id}
                        className="hover:border-destructive hover:text-destructive"
                        title="Xóa"
                      >
                        {deletingId === user.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
