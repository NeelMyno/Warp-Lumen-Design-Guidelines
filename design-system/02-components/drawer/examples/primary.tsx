// Lumen Drawer — Web React example. Wraps Radix Dialog so we inherit focus trap +
// aria-modal + Escape-to-close, then re-skins to a side-anchored panel.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

type Side = "top" | "right" | "bottom" | "left";
type Size = "sm" | "md" | "lg" | "full";

const SIDE: Record<Side, string> = {
  right:  "inset-y-0 right-0 h-full data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left:   "inset-y-0 left-0 h-full data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  top:    "inset-x-0 top-0 w-full data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom: "inset-x-0 bottom-0 w-full data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
};

const SIZE_SIDE: Record<Side, Record<Size, string>> = {
  right:  { sm: "w-[400px]", md: "w-[520px]", lg: "w-[720px]", full: "w-screen" },
  left:   { sm: "w-[400px]", md: "w-[520px]", lg: "w-[720px]", full: "w-screen" },
  top:    { sm: "h-[240px]", md: "h-[360px]", lg: "h-[520px]", full: "h-screen" },
  bottom: { sm: "h-[240px]", md: "h-[360px]", lg: "h-[520px]", full: "h-screen" },
};

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({
  side = "right",
  size = "md",
  title,
  description,
  footer,
  children,
  dismissible = true,
}: {
  side?: Side;
  size?: Size;
  title?: string;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  dismissible?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={[
          "fixed inset-0 z-[var(--z-modal,50)]",
          "bg-[var(--color-surface-scrim)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "duration-[var(--motion-duration-slow)] motion-reduce:animate-none",
        ].join(" ")}
      />
      <DialogPrimitive.Content
        className={[
          "fixed z-[var(--z-modal,50)] flex flex-col",
          "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]",
          "border-[var(--color-border-hairline)]",
          side === "right" ? "border-l" : side === "left" ? "border-r" : side === "top" ? "border-b" : "border-t",
          "shadow-[var(--shadow-modal)]",
          SIDE[side],
          SIZE_SIDE[side][size],
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "duration-[var(--motion-duration-slow)] motion-reduce:animate-none",
        ].join(" ")}
      >
        <header className="flex items-start justify-between gap-4 px-[var(--space-inset-xl)] pt-[var(--space-inset-xl)] pb-[var(--space-inset-lg)]">
          <div className="flex-1 min-w-0">
            {title && (
              <DialogPrimitive.Title className="text-[var(--type-heading-h3)] text-[var(--color-text-primary)] font-medium tracking-tight truncate">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="mt-2 text-[var(--type-body-md)] text-[var(--color-text-secondary)]">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {dismissible && (
            <DrawerClose
              aria-label="Close drawer"
              className={[
                "shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-sm)]",
                "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
                "hover:bg-[var(--color-action-ghost-bg-hover)]",
                "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              ].join(" ")}
            >
              <X size={14} aria-hidden />
            </DrawerClose>
          )}
        </header>
        <div className="flex-1 overflow-auto px-[var(--space-inset-xl)] pb-[var(--space-inset-xl)]">
          {children}
        </div>
        {footer && (
          <footer className="shrink-0 border-t border-[var(--color-border-hairline)] px-[var(--space-inset-xl)] py-[var(--space-inset-lg)] flex items-center justify-end gap-2">
            {footer}
          </footer>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
