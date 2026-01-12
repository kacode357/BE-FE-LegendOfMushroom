import { Package, Bell, KeyRound, Users, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

const STATS = [
  {
    title: "Tổng gói",
    value: "12",
    icon: Package,
    href: "/packages",
    gradient: "bg-gradient-forest",
    glow: "glow-green",
  },
  {
    title: "Mã truy cập",
    value: "48",
    icon: KeyRound,
    href: "/access-codes",
    gradient: "bg-gradient-gold",
    glow: "glow-gold",
  },
  {
    title: "Users đăng ký",
    value: "156",
    icon: Users,
    href: "/registered-users",
    gradient: "bg-gradient-magic",
    glow: "glow-magic",
  },
  {
    title: "Thông báo",
    value: "8",
    icon: Bell,
    href: "/notifications",
    gradient: "bg-gradient-forest",
    glow: "glow-green",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <span className="text-sm font-semibold text-gold">Xin chào Admin!</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            Chào mừng đến <span className="text-gradient-forest">KaKernel</span> Dashboard
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Quản lý Gói, tạo Mã truy cập, gửi Thông báo và xem danh sách User đã đăng ký từ một nơi duy nhất.
          </p>
        </div>
        {/* Decorative particles */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-forest/20 blur-2xl" />
        <div className="absolute bottom-4 right-20 w-16 h-16 rounded-full bg-gold/20 blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl bg-card p-5 border border-border hover-lift"
            >
              {/* Icon with gradient background */}
              <div className={`w-12 h-12 rounded-xl ${stat.gradient} flex items-center justify-center mb-4 ${stat.glow} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-extrabold text-foreground">
                  {stat.value}
                </p>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          Hướng dẫn nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-accent/30 border border-accent">
            <h3 className="font-semibold text-foreground mb-2">1. Tạo Gói</h3>
            <p className="text-sm text-muted-foreground">
              Vào mục Gói để tạo các gói dịch vụ mới cho người dùng.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-accent/30 border border-accent">
            <h3 className="font-semibold text-foreground mb-2">2. Tạo Mã truy cập</h3>
            <p className="text-sm text-muted-foreground">
              Tạo mã truy cập để người dùng có thể kích hoạt gói.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-accent/30 border border-accent">
            <h3 className="font-semibold text-foreground mb-2">3. Gửi Thông báo</h3>
            <p className="text-sm text-muted-foreground">
              Gửi thông báo đến tất cả người dùng về các cập nhật mới.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
