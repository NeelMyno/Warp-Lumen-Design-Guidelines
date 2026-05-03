"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/tabs";

export function TabNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Project type"
      className="border-t border-[var(--border-subtle)] overflow-x-auto"
    >
      <ul className="mx-auto flex w-full max-w-[1440px] items-center gap-1 px-4">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href ||
            (pathname === "/" && tab.slug === "foundations");
          return (
            <li key={tab.slug}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative inline-flex items-center gap-2 px-3 py-3 text-[var(--type-14)]",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  "transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-md",
                  isActive ? "text-[var(--text-primary)] font-medium" : "font-normal",
                ].join(" ")}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -bottom-px left-2 right-2 h-[2px] bg-[var(--text-primary)] rounded-full"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
