"use client";

import { Button } from "@/components/ui/button";
import { useCreateAccessCode } from "@/hooks/access/useCreateAccessCode";

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

  return (
    <div className="rounded-2xl border border-foreground/10 bg-background p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Mã truy cập</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Admin tạo mã (mặc định 5 phút) để user dùng đăng ký.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:max-w-55">
          <label htmlFor="ttl" className="text-sm font-medium">
            TTL (phút)
          </label>
          <input
            id="ttl"
            name="ttl"
            type="number"
            min={1}
            max={60}
            value={ttlMinutes}
            onChange={(e) => setTtlMinutes(Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
          />
        </div>

        <Button onClick={onCreate} disabled={!canSubmit} className="h-11">
          {submitting ? "Đang tạo..." : "Tạo mã"}
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-3">
          <div className="text-sm">
            <div>
              <span className="font-medium">Code:</span> {result.code}
            </div>
            <div className="mt-1 text-foreground/70">
              Hết hạn lúc: {formatDateTime(result.expiresAt)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
