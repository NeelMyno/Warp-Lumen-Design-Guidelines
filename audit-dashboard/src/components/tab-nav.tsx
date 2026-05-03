"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/tabs";

export function TabNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Project type" className="overflow-x-auto">
      <ul className="mx-auto flex w-full max-w-[1440px] items-stretch gap-1 px-4">
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
                  "relative inline-flex items-center gap-2 h-12 px-4",
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
                    className="absolute -bottom-px left-4 right-4 h-[1.5px] bg-[var(--text-primary)] rounded-full"
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
