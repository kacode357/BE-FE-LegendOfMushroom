"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    submitting,
    error,
    success,
    canSubmit,
    onSubmit,
  } = useLoginForm();

  return (
    <main className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Nhập email và mật khẩu để tiếp tục.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-foreground/30"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 pr-16 text-sm outline-none focus:border-foreground/30"
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              onClick={toggleShowPassword}
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm">
            {success}
          </div>
        ) : null}

        <Button type="submit" disabled={!canSubmit} className="h-11 w-full">
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </main>
  );
}
