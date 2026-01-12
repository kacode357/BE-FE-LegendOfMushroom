import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KaKernel Admin - LOM Dashboard",
  description: "Admin Dashboard for KaKernel LOM",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${nunito.variable} antialiased`}
        style={{ fontFamily: "var(--font-nunito), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
