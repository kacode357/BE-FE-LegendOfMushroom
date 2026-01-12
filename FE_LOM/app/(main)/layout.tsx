"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/layout/MainHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Header */}
      {!isMobile && <MainHeader sidebarCollapsed={sidebarCollapsed} />}

      {/* Main Content */}
      <main
        className={`
          min-h-screen pt-20 pb-6 px-6
          transition-all duration-300 ease-in-out
          ${isMobile ? "ml-0 pt-20" : sidebarCollapsed ? "ml-[72px]" : "ml-64"}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {/* Page Content */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
