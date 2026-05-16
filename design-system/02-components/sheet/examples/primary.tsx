// Lumen Sheet — Web React example.
// Mobile-flavor bottom-anchored modal. iOS-flavor drag handle.
// Wraps Radix Dialog for focus trap + aria-modal + Escape.

"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";

type Detents = "large" | "medium-large" | "full";

const HEIGHT: Record<Detents, string> = {
  large:           "h-[70vh]",
  "medium-large":  "h-[90vh]", // start at larger detent; consumer can swap via drag (not implemented in this static example)
  full:            "h-screen",
};

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  detents = "large",
  handle = true,
  title,
  description,
  footer,
  padding = "default",
  children,
}: {
  detents?: Detents;
  handle?: boolean;
  title?: string;
  description?: ReactNode;
  footer?: ReactNode;
  padding?: "default" | "none";
  children: ReactNode;
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
          "fixed inset-x-0 bottom-0 z-[var(--z-modal,50)] flex flex-col",
          HEIGHT[detents],
          "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]",
          "rounded-t-[var(--radius-card-hero)] border-t border-[var(--color-border-hairline)]",
          "shadow-[var(--shadow-modal)]",
          "pb-[max(env(safe-area-inset-bottom),0px)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "duration-[var(--motion-duration-slow)] motion-reduce:animate-none",
        ].join(" ")}
      >
        {handle && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Drag to resize"
            className="mx-auto mt-2 mb-3 h-1.5 w-9 rounded-full bg-[var(--color-alpha-paper-24)] cursor-grab active:cursor-grabbing"
          />
        )}
        {(title || description) && (
          <header className={[padding === "default" ? "px-[var(--space-inset-xl)]" : "px-0", "pb-[var(--space-inset-md)]"].join(" ")}>
            {title && (
              <DialogPrimitive.Title className="text-[var(--type-heading-h3)] font-medium tracking-tight">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="mt-1 text-[var(--type-body-md)] text-[var(--color-text-secondary)]">
                {description}
              </DialogPrimitive.Description>
            )}
          </header>
        )}
        <div className={[
          "flex-1 overflow-y-auto",
          padding === "default" ? "px-[var(--space-inset-xl)]" : "px-0",
        ].join(" ")}>
          {children}
        </div>
        {footer && (
          <footer className="shrink-0 border-t border-[var(--color-border-hairline)] px-[var(--space-inset-xl)] py-[var(--space-inset-lg)]">
            {footer}
          </footer>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
