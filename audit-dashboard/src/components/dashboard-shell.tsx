import Link from "next/link";
import { TabNav } from "./tab-nav";
import { ThemeToggle } from "./theme-toggle";
import { MoodSwitcher } from "./mood-switcher";
import { CommandPaletteTrigger } from "./command-palette-trigger";
import { LUMEN_VERSION } from "@/lib/version";

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-overlay)] focus:rounded-[var(--radius-md)] focus:bg-[var(--surface-raised)] focus:text-[color:var(--text-primary)] focus:border focus:border-[var(--border-accent)] focus:px-4 focus:py-2 focus:text-label-sm focus:shadow-[var(--shadow-focus)] focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Architectural grid — runs full-canvas, behind everything. */}
      <div
        aria-hidden
        className="lumen-grid-architectural pointer-events-none fixed inset-0 -z-10 opacity-60"
      />

      {/* v0.11.6 — global grain overlay. Subtle SVG fractalNoise (~2% opacity),
          mode-aware blend, sits ABOVE the architectural grid but BELOW the
          sticky header. Adds the "premium scratchy paper" texture every
          high-end dark UI has (Linear, Vercel, Stripe, Arc). */}
      <div aria-hidden className="lumen-grain" />

      {/* Sticky glass nav. Pill row floats inside a hairline-bordered band.
          v0.12.7 — bumped to lumen-glass-strong (ink-a86 / blur 28px) so
          the chrome doesn't ingest the lime-halo bleed from primary CTAs
          (Add to cart, Get rates, New shipment, etc.) that sit just below
          the sticky header on Library / Tool / SaaS / Commerce / Mobile /
          Desktop. Audited 2026-05-18 — lumen-glass (0.62 alpha) was visibly
          tinting the chrome green when scrolled past any --shadow-glow-
          accent-strong button. lumen-glass-strong (0.86 alpha) keeps the
          frosted texture while sealing the chrome from content bleed. */}
      <header className="sticky top-0 z-[var(--z-sticky)]">
        <div className="lumen-glass-strong border-b border-[var(--border-hairline)]">
          <div className="mx-auto flex w-full max-w-max items-center gap-4 px-6 h-16">
            <Link
              href="/foundations"
              className="lumen-mark-link group flex items-center gap-inline-sm text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-md)]"
            >
              <LumenMark />
              <span className="text-heading-h5 transition-colors duration-[var(--motion-fast)] group-hover:text-[color:var(--text-accent)]">
                Lumen
              </span>
              <span className="hidden sm:inline-flex items-center h-5 px-2 rounded-[var(--radius-full)] text-overline border border-[var(--border-accent)] text-[color:var(--text-accent)] normal-case transition-[box-shadow,background-color] duration-[var(--motion-fast)] group-hover:bg-[var(--surface-tint-accent)] group-hover:shadow-[var(--shadow-button-glow-rest)]">
                {LUMEN_VERSION}
              </span>
              {/* v0.11.6 — pulsing dot replaces the "System v0.11 live" caption.
                  The version is already on the pill; the dot is the only signal that needs to pulse. */}
              <span
                className="hidden sm:inline-flex items-center pl-1"
                aria-label="System live"
                title="System live"
              >
                <span className="lumen-dot-pulse" aria-hidden />
              </span>
            </Link>

            {/* v0.11.13 — Spotlight is now functional. Real ⌘K palette over a
                glass shell. See command-palette-trigger.tsx + command-palette.tsx. */}
            <CommandPaletteTrigger />

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
        <div className="mx-auto flex w-full max-w-max flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-10 text-micro text-[color:var(--text-tertiary)]">
          <div className="flex items-center gap-3">
            <LumenMark size={14} />
            <span className="lumen-mono-cap">
              Lumen · Warp design system · obsidian
            </span>
          </div>
          <div className="flex items-center gap-4 lumen-mono-cap">
            <span>{LUMEN_VERSION} · reference implementation</span>
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
 * v0.11.13 — the ring + nucleus pick up an inner glow lift on parent-link hover
 * (`.group:hover` on the wrapping <Link>). Per micro-interactions §5: a logo
 * without a hover state reads as a graphic, not a navigation affordance.
 */
function LumenMark({ size = 18 }: { size?: number }) {
  return (
    <span
      className="lumen-mark relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="lumen-mark-ring absolute inset-0 rounded-[var(--radius-full)] border border-[var(--border-strong)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--easing-standard)]"
      />
      <span
        className="lumen-mark-core absolute inset-[28%] rounded-[var(--radius-full)] bg-[var(--lumen-accent-4)] transition-[box-shadow,transform] duration-[var(--motion-base)] ease-[var(--easing-standard)]"
        style={{ boxShadow: "0 0 8px var(--lumen-lime-a64)" }}
      />
    </span>
  );
}
