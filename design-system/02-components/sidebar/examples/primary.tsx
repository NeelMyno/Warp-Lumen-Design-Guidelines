// Lumen Sidebar — Web React example. Expanded + rail modes.
// Rail mode MUST pair every item with a Tooltip (omitted from this static
// example for brevity — wire via the Tooltip primitive).

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

type Mode = "expanded" | "rail" | "auto";

export function Sidebar({
  mode = "expanded",
  brand,
  items,
  footer,
  onModeChange,
}: {
  mode?: Mode;
  brand: ReactNode;
  items: ReactNode;
  footer?: ReactNode;
  onModeChange?: (mode: Mode) => void;
}) {
  const collapsed = mode === "rail";
  return (
    <nav
      aria-label="Sidebar"
      data-mode={mode}
      className={[
        "h-full shrink-0 flex flex-col",
        "border-r border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-page)]",
        collapsed ? "w-14" : "w-60",
        "transition-[width] duration-[var(--motion-duration-base)]",
      ].join(" ")}
      style={{ transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)" }}
    >
      <header className="flex items-center justify-between gap-2 px-3 h-12 border-b border-[var(--color-border-hairline)]">
        <span className={[collapsed ? "sr-only" : "flex items-center gap-2", "text-[var(--type-label-md)]"].join(" ")}>{brand}</span>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => onModeChange?.(collapsed ? "expanded" : "rail")}
          className={[
            "inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-md)]",
            "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        >
          {collapsed ? <ChevronRight size={14} aria-hidden /> : <ChevronLeft size={14} aria-hidden />}
        </button>
      </header>
      <ul role="list" className="flex-1 overflow-y-auto py-2">
        {items}
      </ul>
      {footer && (
        <footer className="border-t border-[var(--color-border-hairline)] p-2">
          {footer}
        </footer>
      )}
    </nav>
  );
}

export function SidebarItem({
  icon,
  label,
  href,
  active = false,
  onClick,
  collapsed = false,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  const Tag = href ? "a" : "button";
  return (
    <li>
      <Tag
        href={href}
        onClick={onClick}
        aria-label={collapsed ? label : undefined}
        aria-current={active ? "page" : undefined}
        className={[
          "relative flex items-center gap-3 h-9 mx-2 px-2 rounded-[var(--radius-control-md)]",
          "text-[var(--type-label-md)]",
          active
            ? "bg-[var(--color-action-selected-bg)] text-[var(--color-text-accent)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
          "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
          "transition-colors duration-[var(--motion-duration-fast)]",
        ].join(" ")}
      >
        {active && (
          <span aria-hidden className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-[var(--color-text-accent)]" />
        )}
        <span className={["shrink-0 w-4 h-4 inline-flex items-center justify-center", active ? "" : "text-[var(--color-text-tertiary)]"].join(" ")}>
          {icon}
        </span>
        {!collapsed && <span className="truncate">{label}</span>}
      </Tag>
    </li>
  );
}

export function SidebarLabel({ children, collapsed }: { children: ReactNode; collapsed?: boolean }) {
  if (collapsed) return <li aria-hidden className="my-2 mx-3 h-px bg-[var(--color-border-hairline)]" />;
  return (
    <li className="px-4 pt-3 pb-1 text-[var(--type-micro)] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium">
      {children}
    </li>
  );
}
