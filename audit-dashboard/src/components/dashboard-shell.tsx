import Link from "next/link";
import { TabNav } from "./tab-nav";
import { ThemeToggle } from "./theme-toggle";
import { MoodSwitcher } from "./mood-switcher";
import { Search } from "./primitives/icon";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col">
      <header
        className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border-hairline)] bg-[var(--surface-glass)] backdrop-blur-xl backdrop-saturate-150"
        style={{ WebkitBackdropFilter: "blur(20px) saturate(150%)" }}
      >
        {/* Top row: brand + spotlight + actions */}
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-6 px-6 h-16">
          <Link
            href="/foundations"
            className="flex items-center gap-2 text-[var(--text-primary)]"
          >
            <LumenMark />
            <span className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)]">
              Lumen
            </span>
            <span className="hidden sm:inline-flex items-center h-5 px-1.5 rounded-full text-[var(--type-11)] font-medium bg-[var(--surface-tint-accent)] text-[var(--lumen-accent-7)] tracking-[var(--tracking-wide)]">
              v0.3
            </span>
          </Link>

          {/* Spotlight / command palette hint */}
          <button
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 text-[var(--text-tertiary)] text-[var(--type-13)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-colors"
            aria-label="Open spotlight"
          >
            <Search size={14} />
            <span className="flex-1 text-left">Search Lumen…</span>
            <span className="flex items-center gap-0.5">
              <kbd className="lumen-kbd">⌘</kbd>
              <kbd className="lumen-kbd">K</kbd>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <MoodSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Tabs row */}
        <div className="border-t border-[var(--border-hairline)]">
          <TabNav />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 py-12 md:py-16">
        {children}
      </main>

      <footer className="mt-16 border-t border-[var(--border-hairline)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-8 text-[var(--type-12)] text-[var(--text-tertiary)]">
          <div className="flex items-center gap-4">
            <LumenMark size={14} />
            <span>
              Lumen — Warp&apos;s LLM-first design system.
              <span className="hidden md:inline"> Quiet Industrial mood, 8pt soft grid.</span>
            </span>
          </div>
          <div className="flex items-center gap-4 lumen-mono">
            <span>v0.3.0 · audit preview</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
            <a className="lumen-link" href="https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines">
              github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LumenMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-[var(--text-primary)]"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <circle cx="12" cy="12" r="3.4" fill="var(--lumen-accent-4)" />
    </svg>
  );
}
