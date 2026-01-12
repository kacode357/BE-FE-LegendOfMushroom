"use client";

import { Button } from "@/components/ui/button";
import { useCreateAccessCode } from "@/hooks/access/useCreateAccessCode";
import { KeyRound, Clock, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function AccessCodesPage() {
  const {
    ttlMinutes,
    setTtlMinutes,
    submitting,
    error,
    result,
    canSubmit,
    onCreate,
  } = useCreateAccessCode();

  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (result?.code) {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg glow-gold">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Mã truy cập</h1>
          <p className="text-sm text-muted-foreground">
            Tạo mã để user dùng đăng ký (mặc định 5 phút)
          </p>
        </div>
      </div>

      {/* Create Form */}
      <div className="rounded-2xl border-2 border-border bg-card p-6 hover-lift">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold text-foreground">Tạo mã mới</h2>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 max-w-xs">
            <label htmlFor="ttl" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Thời gian hiệu lực (phút)
            </label>
            <input
              id="ttl"
              name="ttl"
              type="number"
              min={1}
              max={60}
              value={ttlMinutes}
              onChange={(e) => setTtlMinutes(Number(e.target.value))}
              className="h-12 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button 
            onClick={onCreate} 
            disabled={!canSubmit} 
            variant="cta"
            size="lg"
            className="h-12 hover-jelly"
          >
            {submitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Đang tạo...
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                Tạo mã
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-fade-in">
          {error}
        </div>
      ) : null}

      {/* Result */}
      {result ? (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/10 p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-forest flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-primary">Tạo mã thành công!</span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border-2 border-border">
            <code className="flex-1 text-2xl font-bold tracking-wider text-foreground">
              {result.code}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyCode}
              className="shrink-0 hover-jelly"
            >
              {copied ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Hết hạn lúc: <strong className="text-foreground">{formatDateTime(result.expiresAt)}</strong></span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
