import type { Metadata } from "next";
import localFont from "next/font/local";
import { DashboardShell } from "@/components/dashboard-shell";
import "./globals.css";

// v0.10 — Satoshi is the sole typeface across the dashboard and design system.
// JetBrains Mono, Source Serif 4, and the Inter Plan-B fallback were retired;
// numeric/code/editorial moments now ride Satoshi's OpenType feature set
// (tnum, lnum, ss01-ss04, case, frac). See design-system/00-foundations/typography.md.
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
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Lumen — Warp Design System Audit",
  description:
    "Visual audit dashboard for Lumen, the Warp design system. v0.12 Premium Psychology · Obsidian — switch project types to review the system end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} h-full antialiased`}
      data-mood="obsidian"
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--surface-canvas)] text-[color:var(--text-primary)] font-sans">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
