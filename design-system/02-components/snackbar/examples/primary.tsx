// Lumen Snackbar — Web React example.
// One at a time. Pause timer on hover/focus. role=status polite by default,
// role=alert assertive for danger tone.

"use client";

import { AlertOctagon, CheckCircle, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

type Tone = "neutral" | "success" | "danger";
type Anchor = "bottom-center" | "bottom-left" | "bottom-right";

const ANCHOR: Record<Anchor, string> = {
  "bottom-center": "left-1/2 -translate-x-1/2 bottom-[max(env(safe-area-inset-bottom),16px)]",
  "bottom-left":   "left-4 bottom-[max(env(safe-area-inset-bottom),16px)]",
  "bottom-right":  "right-4 bottom-[max(env(safe-area-inset-bottom),16px)]",
};

const TONE_ICON: Record<Tone, ReactNode> = {
  neutral: null,
  success: <CheckCircle size={14} aria-hidden className="text-[var(--color-text-accent)]" />,
  danger:  <AlertOctagon size={14} aria-hidden className="text-[var(--color-text-error)]" />,
};

export type SnackbarProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  message: ReactNode;
  action?: ReactNode;
  duration?: number;
  tone?: Tone;
  anchor?: Anchor;
};

export function Snackbar({
  open,
  onOpenChange,
  message,
  action,
  duration = 5000,
  tone = "neutral",
  anchor = "bottom-center",
}: SnackbarProps) {
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(duration);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    if (duration <= 0) return;
    if (paused) return;
    startRef.current = Date.now();
    const t = setTimeout(() => onOpenChange?.(false), remainingRef.current);
    return () => {
      clearTimeout(t);
      if (startRef.current !== null) {
        remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startRef.current));
      }
    };
  }, [open, duration, paused, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      aria-live={tone === "danger" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={[
        "fixed z-[var(--z-toast,90)]",
        "min-w-[280px] max-w-[min(560px,calc(100vw-2rem))]",
        "rounded-[var(--radius-popover)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-raised)] shadow-[var(--shadow-popover)]",
        "px-[var(--space-inset-lg)] py-[var(--space-inset-md)]",
        "flex items-center gap-[var(--space-inline-md)]",
        "animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none",
        ANCHOR[anchor],
      ].join(" ")}
    >
      {TONE_ICON[tone]}
      <span className="flex-1 text-[var(--type-label-md)] text-[var(--color-text-primary)]">{message}</span>
      {action}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onOpenChange?.(false)}
        className={[
          "ml-1 shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-control-md)]",
          "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-action-ghost-bg-hover)]",
          "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
        ].join(" ")}
      >
        <X size={12} aria-hidden />
      </button>
    </div>
  );
}
