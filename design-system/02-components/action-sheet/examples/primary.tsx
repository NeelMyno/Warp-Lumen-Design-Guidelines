// Lumen ActionSheet — Web React example.
// Bottom-anchored modal with a fixed action list + mandatory Cancel.

"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export type ActionItem = {
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

export const ActionSheet = DialogPrimitive.Root;
export const ActionSheetTrigger = DialogPrimitive.Trigger;

export function ActionSheetContent({
  title,
  actions,
  cancelLabel = "Cancel",
  onClose,
}: {
  title?: ReactNode;
  actions: ActionItem[];
  cancelLabel?: string;
  onClose?: () => void;
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
        aria-label={typeof title === "string" ? title : undefined}
        className={[
          "fixed inset-x-2 bottom-[max(env(safe-area-inset-bottom),8px)] z-[var(--z-modal,50)]",
          "flex flex-col gap-2",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "duration-[var(--motion-duration-slow)] motion-reduce:animate-none",
        ].join(" ")}
      >
        <ul
          role="list"
          className="rounded-[var(--radius-card-hero)] overflow-hidden border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-modal)]"
        >
          {title && (
            <li className="px-[var(--space-inset-lg)] py-[var(--space-stack-sm)] text-center text-[var(--type-label-sm)] text-[var(--color-text-tertiary)] border-b border-[var(--color-border-hairline)]">
              {title}
            </li>
          )}
          {actions.map((action, i) => (
            <li key={i} className={i < actions.length - 1 ? "border-b border-[var(--color-border-hairline)]" : ""}>
              <button
                type="button"
                disabled={action.disabled}
                onClick={action.onSelect}
                aria-label={action.danger ? `${action.label}, destructive action` : undefined}
                className={[
                  "flex h-14 w-full items-center justify-center gap-2 px-[var(--space-inset-lg)]",
                  "text-[var(--type-label-lg)] font-medium",
                  action.danger
                    ? "text-[var(--color-text-error)] hover:bg-[var(--color-action-danger-soft-bg-hover)]"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
                  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:shadow-[var(--shadow-focus)]",
                  "disabled:opacity-40 disabled:pointer-events-none",
                  "transition-colors duration-[var(--motion-duration-fast)]",
                ].join(" ")}
              >
                {action.icon && <span aria-hidden>{action.icon}</span>}
                {action.label}
              </button>
            </li>
          ))}
        </ul>
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            onClick={onClose}
            className={[
              "h-14 w-full rounded-[var(--radius-card-hero)]",
              "border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-modal)]",
              "text-[var(--type-label-lg)] font-medium text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-action-ghost-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              "transition-colors duration-[var(--motion-duration-fast)]",
            ].join(" ")}
          >
            {cancelLabel}
          </button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
