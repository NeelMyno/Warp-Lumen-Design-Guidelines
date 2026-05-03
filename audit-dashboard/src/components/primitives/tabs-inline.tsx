"use client";

import { ReactNode, useId, useState } from "react";

export type TabItem = { id: string; label: string; badge?: string | number };

export function InlineTabs({
  items,
  defaultId,
  onChange,
  size = "md",
  variant = "underline",
}: {
  items: TabItem[];
  defaultId?: string;
  onChange?: (id: string) => void;
  size?: "sm" | "md";
  variant?: "underline" | "pill";
}) {
  const baseId = useId();
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const heightCls = size === "sm" ? "h-8" : "h-9";

  function select(id: string) {
    setActive(id);
    onChange?.(id);
  }

  if (variant === "pill") {
    return (
      <div role="tablist" className="inline-flex p-1 rounded-[var(--radius-lg)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]">
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={isActive}
              id={`${baseId}-${it.id}`}
              onClick={() => select(it.id)}
              className={[
                "inline-flex items-center gap-1.5 px-3 rounded-[var(--radius-md)] text-[var(--type-13)] font-medium tracking-[var(--tracking-tight)]",
                heightCls,
                "transition-[background-color,color,box-shadow] duration-[var(--motion-fast)]",
                isActive
                  ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {it.label}
              {it.badge !== undefined && (
                <span className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-tertiary)]">
                  {it.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" className="flex items-center gap-1 border-b border-[var(--border-hairline)]">
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={isActive}
            id={`${baseId}-${it.id}`}
            onClick={() => select(it.id)}
            className={[
              "relative inline-flex items-center gap-1.5 px-3 -mb-px text-[var(--type-13)] tracking-[var(--tracking-tight)]",
              heightCls,
              "transition-colors duration-[var(--motion-fast)]",
              isActive
                ? "text-[var(--text-primary)] font-semibold"
                : "text-[var(--text-tertiary)] font-medium hover:text-[var(--text-primary)]",
            ].join(" ")}
          >
            {it.label}
            {it.badge !== undefined && (
              <span className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-tertiary)]">
                {it.badge}
              </span>
            )}
            {isActive && (
              <span aria-hidden className="absolute -bottom-0 left-2 right-2 h-[1.5px] rounded-full bg-[var(--text-primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`tabpanel-${id}`}>
      {children}
    </div>
  );
}
