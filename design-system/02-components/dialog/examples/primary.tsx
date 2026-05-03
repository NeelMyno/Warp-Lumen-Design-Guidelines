// Lumen Dialog — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/dialog.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Modal interrupt for confirmation, focused decision, or short-form input.
// Built on @radix-ui/react-dialog so focus trap, Escape-to-close, and
// background aria-hidden are handled correctly per WCAG 2.1.2 / 2.4.3 / 4.1.2.
//
// For destructive primary actions, set destructive=true to require a typed
// confirmation phrase before the primary button enables.

"use client";

import {
  ReactNode,
  ComponentProps,
  useId,
  useState,
  HTMLAttributes,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  sm: "sm:max-w-[var(--size-dialog-sm)]",
  md: "sm:max-w-[var(--size-dialog-md)]",
  lg: "sm:max-w-[var(--size-dialog-lg)]",
};

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  size?: Size;
};

export function DialogContent({
  size = "md",
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogPrimitive.Overlay
        className={[
          "fixed inset-0 z-[var(--z-modal,50)]",
          "bg-[var(--color-surface-scrim)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "duration-[var(--motion-transition-slow)]",
          "motion-reduce:animate-none",
        ].join(" ")}
      />
      <DialogPrimitive.Content
        {...props}
        className={[
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "z-[var(--z-modal,50)] grid w-full max-w-[calc(100%-2rem)] gap-4",
          "rounded-[var(--radius-card-hero)]",
          "border border-[var(--color-border-default)]",
          "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]",
          "p-6 shadow-[var(--shadow-modal)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-[var(--motion-transition-slow)]",
          "motion-reduce:animate-none",
          SIZE[size],
          className ?? "",
        ].join(" ")}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={["flex flex-col gap-2 text-left", className ?? ""].join(" ")}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className ?? "",
      ].join(" ")}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={[
        "text-[var(--type-heading-h2)] font-semibold tracking-[var(--tracking-tight)]",
        "text-[var(--color-text-primary)]",
        className ?? "",
      ].join(" ")}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={[
        "text-[var(--type-body-md)] text-[var(--color-text-secondary)]",
        className ?? "",
      ].join(" ")}
    />
  );
}

export type DestructiveConfirmProps = {
  /** Phrase the user must type to enable the primary action. */
  phrase: string;
  /** Hint label rendered above the input. */
  label?: string;
  /** Confirmation handler. Only fires once `phrase` matches. */
  onConfirm: () => void;
  /** Label for the primary destructive action. */
  confirmLabel?: string;
  /** Label for the cancel action. */
  cancelLabel?: string;
};

/**
 * DestructiveConfirm — opt-in fragment for the destructive=true variant.
 * Renders a typed-phrase input plus footer with cancel + primary destructive.
 * Compose inside DialogContent.
 */
export function DestructiveConfirm({
  phrase,
  label,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: DestructiveConfirmProps) {
  const [typed, setTyped] = useState("");
  const inputId = useId();
  const enabled = typed.trim() === phrase;

  return (
    <>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-[var(--type-label-lg)] font-medium text-[var(--color-text-secondary)]"
        >
          {label ?? `Type "${phrase}" to confirm.`}
        </label>
        <input
          id={inputId}
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className={[
            "h-10 w-full rounded-[var(--radius-md)] px-3",
            "border border-[var(--color-border-default)] bg-[var(--color-surface-input-rest)]",
            "text-[var(--type-body-md)] text-[var(--color-text-primary)] outline-none",
            "focus-visible:border-[var(--color-border-focus)] focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        />
      </div>
      <DialogFooter>
        <DialogClose
          className={[
            "h-10 px-4 rounded-[var(--radius-control-md)]",
            "bg-transparent text-[var(--color-action-tertiary-fg)]",
            "hover:bg-[var(--color-action-tertiary-bg-hover)]",
            "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        >
          {cancelLabel}
        </DialogClose>
        <button
          type="button"
          disabled={!enabled}
          onClick={enabled ? onConfirm : undefined}
          className={[
            "h-10 px-4 rounded-[var(--radius-control-md)] font-medium",
            "bg-[var(--color-action-danger-bg-rest)] text-[var(--color-action-danger-fg)]",
            "hover:bg-[var(--color-action-danger-bg-hover)]",
            "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          ].join(" ")}
        >
          {confirmLabel}
        </button>
      </DialogFooter>
    </>
  );
}

/** Convenience wrapper that mirrors the component.json prop signature. */
export type LumenDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: Size;
  destructive?: boolean;
  children: ReactNode;
};

export function LumenDialog({
  open,
  onOpenChange,
  size = "md",
  children,
}: LumenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>{children}</DialogContent>
    </Dialog>
  );
}
