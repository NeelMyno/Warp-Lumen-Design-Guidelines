import Link from "next/link";
import { TabNav } from "./tab-nav";
import { ThemeToggle } from "./theme-toggle";
import { MoodSwitcher } from "./mood-switcher";
import { Search } from "./primitives/icon";

/**
 * v0.4 shell — glass pill nav floats at the top of an obsidian canvas.
 * The canvas wears a subtle architectural grid; the main column hosts the
 * radial lime aurora behind page heroes. Footer carries mono-cap metadata.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col relative">
      {/* a11y: skip-to-content link. Visually hidden until focused. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-overlay)] focus:rounded-[var(--radius-md)] focus:bg-[var(--surface-raised)] focus:text-[var(--text-primary)] focus:border focus:border-[var(--border-accent)] focus:px-4 focus:py-2 focus:text-label-sm focus:shadow-[var(--shadow-focus)] focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Architectural grid — runs full-canvas, behind everything. */}
      <div
        aria-hidden
        className="lumen-grid-architectural pointer-events-none fixed inset-0 -z-10 opacity-60"
      />

      {/* Sticky glass nav. Pill row floats inside a hairline-bordered band. */}
      <header className="sticky top-0 z-[var(--z-sticky)]">
        <div className="lumen-glass border-b border-[var(--border-hairline)]">
          <div className="mx-auto flex w-full max-w-max items-center gap-4 px-6 h-16">
            <Link
              href="/foundations"
              className="flex items-center gap-inline-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-md)]"
            >
              <LumenMark />
              <span className="text-heading-h5">
                Lumen
              </span>
              <span className="hidden sm:inline-flex items-center h-5 px-2 rounded-[var(--radius-full)] text-overline border border-[var(--border-accent)] text-[var(--text-accent)] normal-case">
                v0.11.5
              </span>
              {/* v0.11.5 — pulsing dot replaces the "System v0.11 live" caption.
                  The version is already on the pill; the dot is the only signal that needs to pulse. */}
              <span
                className="hidden sm:inline-flex items-center pl-1"
                aria-label="System live"
                title="System live"
              >
                <span className="lumen-dot-pulse" aria-hidden />
              </span>
            </Link>

            {/* Spotlight — pill, glass, mono caption */}
            <button
              className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto h-10 px-4 rounded-[var(--radius-full)] border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 text-[var(--text-tertiary)] text-body-xs hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label="Open spotlight"
            >
              <Search size={14} />
              <span className="flex-1 text-left">Search Lumen…</span>
              <span className="flex items-center gap-1">
                <kbd className="lumen-kbd">⌘</kbd>
                <kbd className="lumen-kbd">K</kbd>
              </span>
            </button>

            <div className="flex items-center gap-3">
              <MoodSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Tabs row */}
          <div className="border-t border-[var(--border-hairline)]">
            <TabNav />
          </div>
        </div>
      </header>

      <main id="main-content" className="lumen-aurora flex-1 mx-auto w-full max-w-max px-6 py-12 md:py-16">
        {children}
      </main>

      <footer className="mt-16 border-t border-[var(--border-hairline)] bg-[var(--surface-canvas)]">
        <div className="mx-auto flex w-full max-w-max flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-10 text-micro text-[var(--text-tertiary)]">
          <div className="flex items-center gap-3">
            <LumenMark size={14} />
            <span className="lumen-mono-cap">
              Lumen · Warp design system · obsidian-mint
            </span>
          </div>
          <div className="flex items-center gap-4 lumen-mono-cap">
            <span>v0.11.5 · reference implementation</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
            <a className="lumen-link normal-case tracking-normal" href="https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines">
              github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Lumen brand mark — a soft hairline ring around a vivid lime nucleus.
 * The ring picks up an inner glow on hover for a subtle "lit" gesture.
 */
function LumenMark({ size = 18 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="absolute inset-0 rounded-[var(--radius-full)] border border-[var(--border-strong)]"
      />
      <span
        className="absolute inset-[28%] rounded-[var(--radius-full)] bg-[var(--lumen-accent-4)]"
        style={{ boxShadow: "0 0 8px var(--lumen-lime-a64)" }}
      />
    </span>
  );
}
