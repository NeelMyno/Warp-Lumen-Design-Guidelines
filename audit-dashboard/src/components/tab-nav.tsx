"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/tabs";

export function TabNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Project type" className="overflow-x-auto">
      <ul className="mx-auto flex w-full max-w-[1400px] items-stretch gap-0.5 px-4">
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
                  "relative inline-flex items-center gap-2 px-3.5 py-2.5",
                  "text-[var(--type-13)] tracking-[var(--tracking-tight)]",
                  "transition-[color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
                  isActive
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-tertiary)] font-medium hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                <span className="whitespace-nowrap">{tab.shortLabel ?? tab.label}</span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -bottom-px left-3 right-3 h-[1.5px] bg-[var(--text-primary)] rounded-full"
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
