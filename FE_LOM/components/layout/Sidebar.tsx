"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/packages", label: "Gói" },
  { href: "/notifications", label: "Thông báo" },
  { href: "/access-codes", label: "Mã truy cập" },
  { href: "/registered-users", label: "User đã đăng ký" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-foreground/10 bg-background p-3">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "block rounded-xl px-3 py-2 text-sm transition-colors " +
                (active
                  ? "bg-foreground/5 text-foreground"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
