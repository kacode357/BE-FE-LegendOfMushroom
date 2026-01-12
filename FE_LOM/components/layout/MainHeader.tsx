"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";

export function MainHeader() {
  const { onLogout, submitting } = useLogout();

  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="text-sm font-semibold tracking-tight">LOM</div>
        <Button variant="ghost" onClick={onLogout} disabled={submitting}>
          Logout
        </Button>
      </div>
    </header>
  );
}
