// Lumen Tooltip — Web React example
// Wraps Radix Tooltip. Portals to document.body. 700 ms hover-intent enter.
//
// Wrap your app in <TooltipProvider> ONCE at the root.

"use client";

import * as RT from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export const TooltipProvider = (props: React.ComponentProps<typeof RT.Provider>) => (
  <RT.Provider delayDuration={700} skipDelayDuration={200} {...props} />
);

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  arrow = true,
  open,
  onOpenChange,
  kbdHint,
}: {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  arrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  kbdHint?: ReactNode;
}) {
  return (
    <RT.Root open={open} onOpenChange={onOpenChange}>
      <RT.Trigger asChild>{children}</RT.Trigger>
      <RT.Portal>
        <RT.Content
          side={side}
          align={align}
          collisionPadding={8}
          sideOffset={6}
          className={[
            "z-[var(--z-tooltip,80)]",
            "rounded-[var(--radius-control-md)] border border-[var(--color-border-hairline)]",
            "bg-[var(--color-surface-popover)] shadow-[var(--shadow-popover)]",
            "px-[var(--space-inset-md)] py-[var(--space-inset-sm)]",
            "text-[var(--type-label-sm)] text-[var(--color-text-primary)]",
            "max-w-[min(20rem,90vw)]",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
            "data-[state=delayed-open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "duration-[var(--motion-duration-fast)]",
            "motion-reduce:animate-none",
          ].join(" ")}
        >
          <span className="inline-flex items-center gap-[var(--space-inline-xs)]">
            <span>{content}</span>
            {kbdHint}
          </span>
          {arrow && <RT.Arrow className="fill-[var(--color-surface-popover)] stroke-[var(--color-border-hairline)]" width={10} height={5} />}
        </RT.Content>
      </RT.Portal>
    </RT.Root>
  );
}
