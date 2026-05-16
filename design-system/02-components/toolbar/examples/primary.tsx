// Lumen Toolbar — Web React example. Wraps Radix Toolbar for roving tabindex.

"use client";

import * as RT from "@radix-ui/react-toolbar";
import { ReactNode } from "react";

export function Toolbar({
  ariaLabel,
  orientation = "horizontal",
  density = "regular",
  elevation = "none",
  children,
}: {
  ariaLabel: string;
  orientation?: "horizontal" | "vertical";
  density?: "compact" | "regular";
  elevation?: "none" | "border" | "card";
  children: ReactNode;
}) {
  return (
    <RT.Root
      orientation={orientation}
      aria-label={ariaLabel}
      className={[
        "flex flex-wrap items-center gap-[var(--space-inline-xs)]",
        orientation === "vertical" ? "flex-col items-stretch" : "",
        density === "compact" ? "h-7" : "h-9",
        elevation === "border" ? "border border-[var(--color-border-hairline)] rounded-[var(--radius-popover)] px-2 bg-[var(--color-surface-raised)]" : "",
        elevation === "card" ? "border border-[var(--color-border-default)] rounded-[var(--radius-popover)] px-2 bg-[var(--color-surface-popover)] shadow-[var(--shadow-popover)]" : "",
      ].join(" ")}
    >
      {children}
    </RT.Root>
  );
}

export function ToolbarButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <RT.Button
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-[var(--radius-control-md)]",
        "text-[var(--type-label-sm)] text-[var(--color-text-secondary)]",
        "hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
      ].join(" ")}
    >
      {children}
    </RT.Button>
  );
}

export function ToolbarToggleGroup({
  type,
  value,
  onValueChange,
  ariaLabel,
  children,
}: {
  type: "single" | "multiple";
  value: string | string[];
  onValueChange: (v: string | string[]) => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  if (type === "single") {
    return (
      <RT.ToggleGroup
        type="single"
        value={value as string}
        onValueChange={(v: string) => onValueChange(v)}
        aria-label={ariaLabel}
        className="inline-flex gap-1"
      >
        {children}
      </RT.ToggleGroup>
    );
  }
  return (
    <RT.ToggleGroup
      type="multiple"
      value={value as string[]}
      onValueChange={(v: string[]) => onValueChange(v)}
      aria-label={ariaLabel}
      className="inline-flex gap-1"
    >
      {children}
    </RT.ToggleGroup>
  );
}

export function ToolbarToggleItem({ value, children, ariaLabel }: { value: string; children: ReactNode; ariaLabel: string }) {
  return (
    <RT.ToggleItem
      value={value}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-[var(--radius-control-md)]",
        "text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
        "data-[state=on]:bg-[var(--color-action-selected-bg)] data-[state=on]:text-[var(--color-text-accent)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
      ].join(" ")}
    >
      {children}
    </RT.ToggleItem>
  );
}

export function ToolbarSeparator() {
  return <RT.Separator className="mx-1 h-5 w-px bg-[var(--color-border-hairline)]" />;
}
