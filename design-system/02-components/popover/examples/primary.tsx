// Lumen Popover — Web React example
// Wraps Radix Popover for portaled positioning + focus management.

// lumen-allow-file: layout-width
// Lumen library example — component-specific layout widths (modal, drawer, card, etc.). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
"use client";

import * as PP from "@radix-ui/react-popover";
import { ReactNode } from "react";

type Width = "trigger" | "auto" | "sm" | "md" | "lg";

const WIDTH: Record<Width, string> = {
  trigger: "w-[var(--radix-popover-trigger-width)]",
  auto: "w-auto",
  sm: "w-[240px]",
  md: "w-[320px]",
  lg: "w-[420px]",
};

export const Popover = PP.Root;
export const PopoverTrigger = PP.Trigger;
export const PopoverAnchor = PP.Anchor;

export function PopoverContent({
  children,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  alignOffset = 0,
  width = "auto",
  arrow = false,
  ariaLabel,
}: {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  width?: Width;
  arrow?: boolean;
  ariaLabel?: string;
}) {
  return (
    <PP.Portal>
      <PP.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={8}
        aria-label={ariaLabel}
        className={[
          "z-[var(--z-popover,60)] max-h-[var(--radix-popover-content-available-height)] overflow-auto",
          WIDTH[width],
          "rounded-[var(--radius-popover)] border border-[var(--color-border-hairline)]",
          "bg-[var(--color-surface-popover)] shadow-[var(--shadow-popover)]",
          "p-[var(--space-inset-lg)]",
          "text-[var(--type-body-sm)] text-[var(--color-text-primary)]",
          "outline-none focus-visible:shadow-[var(--shadow-focus)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "duration-[var(--motion-duration-fast)]",
          "motion-reduce:animate-none",
        ].join(" ")}
      >
        {children}
        {arrow && <PP.Arrow className="fill-[var(--color-surface-popover)] stroke-[var(--color-border-hairline)]" width={10} height={5} />}
      </PP.Content>
    </PP.Portal>
  );
}
