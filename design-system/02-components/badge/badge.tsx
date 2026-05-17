/**
 * @lumen/badge — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Six health states unified via the --pill-{tone}-{bg|fg|border} token contract
 * (v0.11.3 ADR). All three pill primitives (Badge, Tag, StatusPill) share one
 * contract — change once, repaint all.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type Status = "neutral" | "success" | "warning" | "danger" | "info" | "accent";
type Size = "sm" | "md";

const STYLES: Record<Status, string> = {
  neutral:
    "bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)] border border-[var(--pill-neutral-border)]",
  success:
    "bg-[var(--pill-success-bg)] text-[var(--pill-success-fg)] border border-[var(--pill-success-border)]",
  warning:
    "bg-[var(--pill-warn-bg)]    text-[var(--pill-warn-fg)]    border border-[var(--pill-warn-border)]",
  danger:
    "bg-[var(--pill-danger-bg)]  text-[var(--pill-danger-fg)]  border border-[var(--pill-danger-border)]",
  info:
    "bg-[var(--pill-info-bg)]    text-[var(--pill-info-fg)]    border border-[var(--pill-info-border)]",
  accent:
    "bg-[var(--pill-accent-bg)]  text-[var(--pill-accent-fg)]  border border-[var(--pill-accent-border)]",
};

const SIZE: Record<Size, string> = {
  sm: "h-5 px-[var(--space-1_5)] text-[length:var(--type-11)] gap-1 rounded-[var(--radius-full)]",
  md: "h-6 px-2 text-[length:var(--type-12)] gap-[var(--space-1_5)] rounded-[var(--radius-full)]",
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  status?: Status;
  size?: Size;
  leadingDot?: boolean;
  leadingIcon?: React.ReactNode;
};

export function Badge({
  status = "neutral",
  size = "sm",
  className,
  children,
  leadingDot,
  leadingIcon,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-status={status}
      className={cn(
        "inline-flex items-center font-medium tracking-[var(--tracking-tight)] whitespace-nowrap align-middle",
        SIZE[size],
        STYLES[status],
        className,
      )}
      {...props}
    >
      {leadingDot && (
        <span
          aria-hidden
          className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-current shrink-0"
        />
      )}
      {leadingIcon && (
        <span aria-hidden className="opacity-80">
          {leadingIcon}
        </span>
      )}
      {children}
    </span>
  );
}
