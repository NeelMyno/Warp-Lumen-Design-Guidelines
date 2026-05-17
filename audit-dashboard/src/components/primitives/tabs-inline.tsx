"use client";
// lumen-allow-file: off-grid-micro
// Audit dashboard demo — sub-grid micro pixels (10-22px) used for demo affordances. The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.

import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

/**
 * Lumen InlineTabs — Radix-backed shadcn Tabs wrapped to keep Lumen's
 * `items` prop API. Two variants:
 * - `underline` (default): bottom-bordered tab strip
 * - `pill`: filled active pill, used in toolbars
 */

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
  const [active, setActive] = useState(defaultId ?? items[0]?.id ?? "");
  const heightCls = size === "sm" ? "h-8" : "h-control-cozy";

  function select(id: string) {
    setActive(id);
    onChange?.(id);
  }

  return (
    <ShadcnTabs value={active} onValueChange={select} className="gap-0">
      <TabsList
        className={cn(
          /* v0.12.4 — pill variant gets `overflow-hidden` so the active tab's
             `bg-[var(--surface-raised)]` square corners clip cleanly to the
             parent's rounded-lg track. Same v0.12.1 corner-clip pattern from
             ADR 0021 (where Card padding="none" gained overflow-hidden) but
             at the smaller-control scale: the active pill child has its own
             rounded-md, smaller than the parent's rounded-lg, so without the
             clip the child's bg pokes a square nub past the parent's curved
             corner — visible at the bottom-left of the active tab on user
             screenshot 2026-05-06 of /foundations "Inline tabs · pill". */
          variant === "pill"
            ? "inline-flex p-1 rounded-[var(--radius-lg)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] w-fit overflow-hidden"
            : "flex items-center gap-1 border-b border-[var(--border-hairline)] bg-transparent rounded-none p-0 w-full justify-start",
          heightCls,
          "h-auto",
        )}
      >
        {items.map((it) => (
          <TabsTrigger
            key={it.id}
            value={it.id}
            className={cn(
              "group/tab",
              variant === "pill"
                ? "rounded-[var(--radius-md)] data-[state=active]:bg-[var(--surface-raised)] data-[state=active]:text-[color:var(--text-primary)] data-[state=active]:shadow-[var(--shadow-xs)] text-[color:var(--text-tertiary)]"
                : "relative rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold data-[state=active]:text-[color:var(--text-primary)] text-[color:var(--text-tertiary)] data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-px data-[state=active]:after:h-[1.5px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-[var(--text-primary)]",
              heightCls,
            )}
          >
            <span className="inline-flex items-center gap-[var(--space-1_5)]">
              {it.label}
              {it.badge !== undefined && (
                /* v0.11.15 — badge now renders as a discrete mini-pill (was inline
                   text in tertiary color, which read as "Active 12" rather than
                   "Active [12]"). Inactive tabs get a quiet neutral-pill chip; the
                   active tab pops the badge to text-primary on canvas for the strongest
                   contrast pair. Composition matches the BottomNav badge rule + the
                   sidebar count-pill rule already used elsewhere in nav.tsx. */
                <span
                  className={cn(
                    "min-w-[18px] h-[18px] inline-flex items-center justify-center px-[var(--space-1)]",
                    "rounded-[var(--radius-full)] text-[length:var(--type-11)] lumen-mono lumen-tnum font-medium",
                    "bg-[var(--pill-neutral-bg)] text-[color:var(--text-tertiary)] border border-[var(--pill-neutral-border)]",
                    "group-data-[state=active]/tab:bg-[var(--surface-canvas)] group-data-[state=active]/tab:text-[color:var(--text-primary)] group-data-[state=active]/tab:border-[var(--border-default)]",
                  )}
                >
                  {it.badge}
                </span>
              )}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </ShadcnTabs>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return <TabsContent value={id}>{children}</TabsContent>;
}
