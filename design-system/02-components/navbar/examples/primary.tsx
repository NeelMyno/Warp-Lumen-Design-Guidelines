// Lumen Navbar — Web React example. Operator variant.

// lumen-allow-file: on-grid-px
// Lumen library example — inline layout pixels in a self-contained demo (4-pt grid). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
"use client";

import { ReactNode } from "react";

type Variant = "marketing" | "operator" | "mobile";

const HEIGHT: Record<Variant, string> = {
  marketing: "h-16",
  operator:  "h-12",
  mobile:    "h-10",
};

export function Navbar({
  variant = "operator",
  brand,
  destinations,
  trailing,
  sticky = true,
  container = "page",
  elevation = "border",
}: {
  variant?: Variant;
  brand: ReactNode;
  destinations?: ReactNode;
  trailing?: ReactNode;
  sticky?: boolean;
  container?: "full" | "page";
  elevation?: "none" | "shadow" | "border";
}) {
  return (
    <>
      {/* Skip link — first focusable inside the nav, visible on focus */}
      <a
        href="#main-content"
        className={[
          "sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-2 focus-visible:top-2",
          "focus-visible:z-[100] focus-visible:rounded-[var(--radius-control-md)] focus-visible:bg-[var(--color-surface-raised)]",
          "focus-visible:px-3 focus-visible:py-2 focus-visible:shadow-[var(--shadow-focus)]",
          "focus-visible:text-[var(--color-text-primary)]",
        ].join(" ")}
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className={[
          sticky ? "sticky top-0 z-[var(--z-nav,30)]" : "",
          "w-full bg-[var(--color-surface-page)]",
          elevation === "border" ? "border-b border-[var(--color-border-hairline)]" : "",
          elevation === "shadow" ? "shadow-[var(--shadow-elevation-sm)]" : "",
          variant === "marketing" ? "[backdrop-filter:blur(20px)_saturate(140%)] bg-[color-mix(in_srgb,var(--color-surface-page)_75%,transparent)]" : "",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center gap-[var(--space-inline-md)]",
            HEIGHT[variant],
            container === "page"
              ? "mx-auto max-w-[var(--container-default,1200px)] px-[var(--space-inset-lg)]"
              : "px-[var(--space-inset-lg)]",
          ].join(" ")}
        >
          <div className="shrink-0 flex items-center">{brand}</div>
          {destinations && <div className="flex-1 hidden md:flex items-center gap-1">{destinations}</div>}
          {trailing && <div className="ml-auto shrink-0 flex items-center gap-1">{trailing}</div>}
        </div>
      </nav>
    </>
  );
}

export function NavItem({
  href,
  children,
  active = false,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "inline-flex items-center px-3 h-8 rounded-[var(--radius-control-md)]",
        "text-[var(--type-label-md)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
        active
          ? "bg-[var(--color-action-selected-bg)] text-[var(--color-text-accent)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
