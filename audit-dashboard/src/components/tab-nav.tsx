"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/tabs";

/**
 * v0.4 tab strip — glass pill chips. Active tab gets a lime hairline border
 * and a soft lime-tint background. Hover only nudges color/opacity; no
 * jarring shifts. Mono-cap voice on the active label is reserved for hero
 * eyebrows; tabs stay title-case for natural reading.
 */
export function TabNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Project type" className="overflow-x-auto">
      <ul className="mx-auto flex w-full max-w-[1440px] items-stretch gap-1 px-4 py-2">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (pathname === "/" && tab.slug === "foundations");
          return (
            <li key={tab.slug} className="flex">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-full)]",
                  "text-[var(--type-13)] tracking-[var(--tracking-tight)] whitespace-nowrap",
                  "border transition-[color,background-color,border-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
                  isActive
                    ? "text-[var(--text-primary)] font-semibold bg-[var(--surface-tint-accent)] border-[var(--border-accent)]"
                    : "text-[var(--text-tertiary)] font-medium border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]",
                ].join(" ")}
              >
                {isActive && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--lumen-accent-4)]" />}
                <span>{tab.shortLabel ?? tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
