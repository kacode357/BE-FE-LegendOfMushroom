import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-forest/20 blur-3xl animate-levitate" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-magic-purple/10 blur-2xl" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-forest flex items-center justify-center shadow-xl overflow-hidden glow-green animate-pulse-glow">
              <Image
                src="/logo.jpg"
                alt="KaKernel"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-extrabold text-2xl text-foreground">
              Ka<span className="text-gradient-forest">Kernel</span>
            </span>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
}
