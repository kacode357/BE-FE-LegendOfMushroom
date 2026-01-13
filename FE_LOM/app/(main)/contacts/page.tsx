"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/config/axios";
import {
  listContacts,
  getContactStats,
  updateContact,
  deleteContact,
  replyContact,
} from "@/services/contact.service";
import type { ContactDto, ContactStatus } from "@/types/contact/response/contact.response";
import type { ContactStatsResponse } from "@/types/contact/response/contactStats.response";
import {
  MessageSquare,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
  User,
  Calendar,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Send,
  MessageCircle,
} from "lucide-react";

const STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", icon: <Clock className="w-4 h-4" /> },
  processing: { label: "Đang xử lý", color: "bg-blue-500/20 text-blue-500 border-blue-500/30", icon: <RefreshCw className="w-4 h-4" /> },
  resolved: { label: "Đã giải quyết", color: "bg-green-500/20 text-green-500 border-green-500/30", icon: <CheckCircle className="w-4 h-4" /> },
  closed: { label: "Đã đóng", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: <XCircle className="w-4 h-4" /> },
};

const STATUS_OPTIONS: ContactStatus[] = ["pending", "processing", "resolved", "closed"];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactDto[]>([]);
  const [stats, setStats] = useState<ContactStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ContactStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const [contactsData, statsData] = await Promise.all([
        listContacts({ status: filterStatus === "all" ? undefined : filterStatus }),
        getContactStats(),
      ]);
      setContacts(contactsData.items);
      setStats(statsData);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStatusChange(id: string, newStatus: ContactStatus) {
    setUpdatingId(id);
    setError(null);

    try {
      await updateContact(id, { status: newStatus });
      await loadData();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa yêu cầu hỗ trợ này?")) return;

    setDeletingId(id);
    setError(null);

    try {
      await deleteContact(id);
      await loadData();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) return;
    
    setReplyingId(id);
    setError(null);

    try {
      await replyContact(id, replyText.trim());
      setReplyText("");
      await loadData();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setReplyingId(null);
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
          <div className="p-3 rounded-xl bg-gradient-forest shadow-lg glow-green">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yêu cầu hỗ trợ</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý các yêu cầu liên hệ từ người dùng
            </p>
          </div>
        </div>

        <Button
          onClick={loadData}
          disabled={loading}
          className="bg-gradient-forest hover:opacity-90 text-white rounded-xl px-4 py-2 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div
            onClick={() => setFilterStatus("all")}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover-lift ${
              filterStatus === "all"
                ? "bg-gradient-forest text-white border-transparent"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-80">Tổng cộng</div>
          </div>
          {STATUS_OPTIONS.map((status) => {
            const config = STATUS_CONFIG[status];
            const count = stats[status];
            const isActive = filterStatus === status;
            return (
              <div
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover-lift ${
                  isActive
                    ? "bg-gradient-forest text-white border-transparent"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!isActive && config.icon}
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <div className="text-sm opacity-80">{config.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Contacts List */}
      {loading && contacts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Không có yêu cầu hỗ trợ nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => {
            const config = STATUS_CONFIG[contact.status];
            const isExpanded = expandedId === contact.id;
            const isUpdating = updatingId === contact.id;
            const isDeleting = deletingId === contact.id;

            return (
              <div
                key={contact.id}
                className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30"
              >
                {/* Header Row */}
                <div
                  className="p-4 cursor-pointer flex items-center justify-between gap-4"
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{contact.subject}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {contact.name}
                      </span>
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                    {/* Message */}
                    <div>
                      <label className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <FileText className="w-3 h-3" />
                        Nội dung
                      </label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                        {contact.message}
                      </div>
                    </div>

                    {/* Admin Note */}
                    {contact.adminNote && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                          Ghi chú admin
                        </label>
                        <div className="p-3 bg-primary/10 rounded-lg text-sm">
                          {contact.adminNote}
                        </div>
                      </div>
                    )}

                    {/* Admin Reply Section */}
                    <div className="space-y-3">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Phản hồi cho người dùng
                      </label>
                      
                      {/* Existing Reply */}
                      {contact.adminReply && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="text-sm whitespace-pre-wrap text-foreground">
                            {contact.adminReply}
                          </div>
                          {contact.repliedAt && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Đã phản hồi: {formatDate(contact.repliedAt)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reply Input */}
                      <div className="flex gap-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={contact.adminReply ? "Cập nhật phản hồi..." : "Nhập phản hồi cho người dùng..."}
                          className="flex-1 min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                        />
                        <Button
                          onClick={() => handleReply(contact.id)}
                          disabled={!replyText.trim() || replyingId === contact.id}
                          className="self-end"
                        >
                          {replyingId === contact.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span className="ml-2">Gửi</span>
                        </Button>
                      </div>
                    </div>

                    {/* Handled Info */}
                    {contact.handledBy && (
                      <div className="text-xs text-muted-foreground">
                        Xử lý bởi: {contact.handledBy}
                        {contact.handledAt && ` • ${formatDate(contact.handledAt)}`}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground mr-2">Cập nhật trạng thái:</span>
                      {STATUS_OPTIONS.map((status) => {
                        const statusConfig = STATUS_CONFIG[status];
                        const isCurrent = contact.status === status;
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(contact.id, status)}
                            disabled={isCurrent || isUpdating}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                              isCurrent
                                ? `${statusConfig.color} opacity-100`
                                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isUpdating && !isCurrent ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              statusConfig.icon
                            )}
                            {statusConfig.label}
                          </button>
                        );
                      })}

                      <div className="flex-1" />

                      <button
                        onClick={() => handleDelete(contact.id)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all flex items-center gap-1.5"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
