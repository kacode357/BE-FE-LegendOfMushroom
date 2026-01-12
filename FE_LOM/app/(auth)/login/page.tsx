"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
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
    <main className="glass-card rounded-2xl p-8 shadow-xl animate-fade-in">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-gold animate-pulse" />
          <span className="text-sm font-semibold text-gold">Admin Portal</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Đăng nhập</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nhập email và mật khẩu để tiếp tục.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border-2 border-border bg-background/50 px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-foreground">
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
              className="h-12 w-full rounded-xl border-2 border-border bg-background/50 px-4 pr-12 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              onClick={toggleShowPassword}
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {success}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={!canSubmit}
          variant="forest"
          size="lg"
          className="h-12 w-full hover-jelly"
        >
          {submitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Đang đăng nhập...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Đăng nhập
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
