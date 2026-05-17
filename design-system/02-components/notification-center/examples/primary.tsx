// Lumen NotificationCenter — Web React example.
// Popover-anchored inbox. Bell trigger in the Navbar.

// lumen-allow-file: layout-width
// Lumen library example — component-specific layout widths (modal, drawer, card, etc.). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
"use client";

import { Bell, AlertOctagon, AlertTriangle, Info, Sparkles } from "lucide-react";
import { ReactNode } from "react";

export type NotificationItem = {
  id: string;
  source: string;
  title: ReactNode;
  body?: ReactNode;
  time: string;
  read: boolean;
  severity?: "info" | "warning" | "danger" | "accent";
  action?: ReactNode;
};

export function NotificationCenter({
  items,
  unreadCount,
  filter = "all",
  onFilterChange,
  onItemClick,
  onMarkAllRead,
}: {
  items: NotificationItem[];
  unreadCount?: number;
  filter?: "all" | "unread" | "mentions" | "system";
  onFilterChange?: (filter: "all" | "unread" | "mentions" | "system") => void;
  onItemClick?: (id: string) => void;
  onMarkAllRead?: () => void;
}) {
  const u = unreadCount ?? items.filter((i) => !i.read).length;
  const filters: Array<{ id: "all" | "unread" | "mentions" | "system"; label: string }> = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "mentions", label: "Mentions" },
    { id: "system", label: "System" },
  ];

  return (
    <div
      role="region"
      aria-label={`Notifications, ${u} unread`}
      className={[
        "w-[420px] max-w-[calc(100vw-2rem)]",
        "rounded-[var(--radius-popover)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-popover)] shadow-[var(--shadow-popover)]",
        "flex flex-col max-h-[80vh]",
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-3 p-[var(--space-inset-lg)] border-b border-[var(--color-border-hairline)]">
        <div className="flex items-center gap-2">
          <Bell aria-hidden size={14} className="text-[var(--color-text-tertiary)]" />
          <span className="text-[var(--type-label-md)] font-medium text-[var(--color-text-primary)]">Notifications</span>
          {u > 0 && (
            <span className="lumen-tnum rounded-[var(--radius-pill)] bg-[var(--color-action-selected-bg)] px-2 text-[var(--type-micro)] text-[var(--color-text-accent)]">{u}</span>
          )}
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-[var(--type-body-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline-offset-2 hover:underline"
        >
          Mark all as read
        </button>
      </header>

      <div className="flex gap-1 px-[var(--space-inset-md)] py-2 border-b border-[var(--color-border-hairline)] overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={filter === f.id}
            onClick={() => onFilterChange?.(f.id)}
            className={[
              "shrink-0 rounded-[var(--radius-pill)] px-2 py-1 text-[var(--type-body-sm)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              filter === f.id
                ? "bg-[var(--color-action-selected-bg)] text-[var(--color-text-accent)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul role="list" className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <li className="flex flex-col items-center justify-center py-12 text-[var(--color-text-tertiary)] text-[var(--type-body-sm)]">
            <Sparkles aria-hidden size={20} className="mb-2 text-[var(--color-text-accent)]" />
            You're all caught up.
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="border-b border-[var(--color-border-hairline)] last:border-b-0">
              <button
                type="button"
                onClick={() => onItemClick?.(item.id)}
                aria-current={!item.read || undefined}
                className={[
                  "w-full text-left flex items-start gap-[var(--space-inline-sm)]",
                  "px-[var(--space-inset-lg)] py-[var(--space-stack-sm)]",
                  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
                  "hover:bg-[var(--color-action-ghost-bg-hover)]",
                  "transition-colors duration-[var(--motion-duration-fast)]",
                ].join(" ")}
              >
                <SeverityGlyph severity={item.severity} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[var(--type-micro)] text-[var(--color-text-tertiary)] uppercase tracking-wider">{item.source}</span>
                    <span className="lumen-tnum text-[var(--type-micro)] text-[var(--color-text-tertiary)]">{item.time}</span>
                  </span>
                  <span className={[
                    "block text-[var(--type-label-md)] truncate",
                    item.read ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)] font-medium",
                  ].join(" ")}>
                    {item.title}
                  </span>
                  {item.body && (
                    <span className="block text-[var(--type-body-sm)] text-[var(--color-text-tertiary)] truncate mt-0.5">
                      {item.body}
                    </span>
                  )}
                  {item.action && <span className="block mt-1">{item.action}</span>}
                </span>
                {!item.read && (
                  <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--color-accent-500)]" />
                )}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function SeverityGlyph({ severity }: { severity?: NotificationItem["severity"] }) {
  if (!severity) return null;
  const cls = "shrink-0 mt-1";
  if (severity === "danger") return <AlertOctagon size={14} aria-hidden className={[cls, "text-[var(--color-text-error)]"].join(" ")} />;
  if (severity === "warning") return <AlertTriangle size={14} aria-hidden className={[cls, "text-[var(--color-text-warning)]"].join(" ")} />;
  if (severity === "accent") return <Sparkles size={14} aria-hidden className={[cls, "text-[var(--color-text-accent)]"].join(" ")} />;
  return <Info size={14} aria-hidden className={[cls, "text-[var(--color-text-tertiary)]"].join(" ")} />;
}
