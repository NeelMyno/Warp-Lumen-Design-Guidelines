"use client";

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
  const heightCls = size === "sm" ? "h-8" : "h-9";

  function select(id: string) {
    setActive(id);
    onChange?.(id);
  }

  return (
    <ShadcnTabs value={active} onValueChange={select} className="gap-0">
      <TabsList
        className={cn(
          variant === "pill"
            ? "inline-flex p-1 rounded-[var(--radius-lg)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] w-fit"
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
              variant === "pill"
                ? "rounded-[var(--radius-md)] data-[state=active]:bg-[var(--surface-raised)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-[var(--shadow-xs)] text-[var(--text-tertiary)]"
                : "relative rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold data-[state=active]:text-[var(--text-primary)] text-[var(--text-tertiary)] data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-px data-[state=active]:after:h-[1.5px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-[var(--text-primary)]",
              heightCls,
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {it.label}
              {it.badge !== undefined && (
                <span className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-tertiary)]">
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
