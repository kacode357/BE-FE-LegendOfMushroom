"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Bell,
  KeyRound,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/packages", label: "Gói", icon: Package },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/access-codes", label: "Mã truy cập", icon: KeyRound },
  { href: "/registered-users", label: "User đã đăng ký", icon: Users },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl bg-gradient-forest text-primary-foreground shadow-lg hover-jelly"
    >
      <Menu className="w-5 h-5" />
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-forest flex items-center justify-center shadow-lg overflow-hidden glow-green">
            <Image
              src="/logo.jpg"
              alt="KaKernel"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-lg text-foreground animate-fade-in">
              Ka<span className="text-gradient-forest">Kernel</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`
                group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold
                transition-all duration-200 hover-lift
                ${collapsed ? "justify-center" : ""}
                ${
                  active
                    ? "bg-gradient-forest text-primary-foreground shadow-md glow-green"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  active ? "" : "group-hover:scale-110"
                }`}
              />
              {!collapsed && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle - Desktop only */}
      {!isMobile && (
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold
              text-foreground/70 hover:bg-accent hover:text-foreground transition-all duration-200 hover-lift"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Thu gọn</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && <MobileMenuButton />}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-40
          flex flex-col
          sidebar-gradient border-r border-sidebar-border
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `${mobileOpen ? "translate-x-0" : "-translate-x-full"} w-64`
            : `${collapsed ? "w-[72px]" : "w-64"}`
          }
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
