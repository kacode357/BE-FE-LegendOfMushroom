import type { ReactNode } from "react";
import { MainHeader } from "@/components/layout/MainHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="md:w-64 md:shrink-0">
            <Sidebar />
          </div>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}
