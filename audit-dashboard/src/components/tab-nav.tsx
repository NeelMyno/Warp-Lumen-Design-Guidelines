"use client";
// lumen-allow-file: on-grid-px
// Audit dashboard demo — inline layout pixels in a self-contained demo (4-pt grid). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/tabs";

/**
 * v0.11.5 tab strip — same glass pill chips, now mobile-correct.
 *
 * Three behaviours: (1) horizontal scroll on overflow, (2) right-edge fade
 * mask reveals there's more behind the cut, (3) scroll-snap snaps each tab
 * to the start so flick-scrolling lands clean. Scrollbar is hidden across
 * all engines. Active tab still gets the lime hairline + tint surface.
 */
export function TabNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Project type"
      className="overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_0%,black_calc(100%-32px),transparent_100%)]"
    >
      <ul className="mx-auto flex w-full max-w-max items-stretch gap-1 px-4 py-2">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (pathname === "/" && tab.slug === "foundations");
          return (
            <li key={tab.slug} className="flex snap-start">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 h-control-cozy px-4 rounded-[var(--radius-full)]",
                  "text-label-sm whitespace-nowrap",
                  "border transition-[color,background-color,border-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
                  "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
                  isActive
                    ? "text-[color:var(--text-primary)] font-semibold bg-[var(--surface-tint-accent)] border-[var(--border-accent)]"
                    : /* v0.11.13 — added bg tint on hover (P2-1). The prior
                         hairline-border-only step was sub-visible against the
                         glass nav; the bg tint makes the affordance register
                         even when the eye isn't on the border. */
                      "text-[color:var(--text-tertiary)] border-transparent hover:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)] hover:border-[var(--border-subtle)]",
                ].join(" ")}
              >
                {isActive && <span aria-hidden className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-[var(--lumen-accent-4)]" />}
                <span>{tab.shortLabel ?? tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
