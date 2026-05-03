import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { DashboardShell } from "@/components/dashboard-shell";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Lumen — Warp Design System Audit",
  description:
    "Visual audit dashboard for Lumen, the Warp design system. Switch project types and moods to review the system end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${jetbrains.variable} h-full antialiased`}
      data-mood="quiet-industrial"
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--surface-page)] text-[var(--text-primary)] font-sans">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
