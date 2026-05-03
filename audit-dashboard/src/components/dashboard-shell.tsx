import Link from "next/link";
import { TabNav } from "./tab-nav";
import { ThemeToggle } from "./theme-toggle";
import { MoodSwitcher } from "./mood-switcher";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col">
      <header
        className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border-subtle)] bg-[var(--surface-overlay)] backdrop-blur"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/foundations"
              className="flex items-center gap-2 text-[var(--text-primary)]"
            >
              <LumenMark />
              <span className="text-[var(--type-16)] font-semibold tracking-[var(--tracking-tight)]">
                Lumen
              </span>
              <span className="hidden sm:inline text-[var(--type-12)] uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
                Audit Dashboard
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <MoodSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <TabNav />
      </header>
      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-[var(--border-subtle)] mt-12">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-6 text-[var(--type-13)] text-[var(--text-tertiary)]">
          <span>Lumen — Warp&apos;s LLM-first design system</span>
          <span className="dash-mono">v0.0.1 · audit preview</span>
        </div>
      </footer>
    </div>
  );
}

function LumenMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    </svg>
  );
}
