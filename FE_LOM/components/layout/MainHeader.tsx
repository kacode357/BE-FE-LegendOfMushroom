"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { LogOut, User } from "lucide-react";

interface MainHeaderProps {
  sidebarCollapsed: boolean;
}

export function MainHeader({ sidebarCollapsed }: MainHeaderProps) {
  const { onLogout, submitting } = useLogout();

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 h-16
        glass border-b border-sidebar-border
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "left-[72px]" : "left-64"}
        md:left-[var(--sidebar-width)]
      `}
      style={{
        "--sidebar-width": sidebarCollapsed ? "72px" : "256px",
      } as React.CSSProperties}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Breadcrumb or Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gradient-forest">
            Admin Dashboard
          </h1>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-accent/50">
            <div className="w-8 h-8 rounded-full bg-gradient-forest flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-foreground">
              Admin
            </span>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            disabled={submitting}
            className="gap-2 text-foreground/70 hover:text-destructive hover:bg-destructive/10 hover-jelly"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
