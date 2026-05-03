// Lumen Badge — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/badge.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

import { ReactNode, HTMLAttributes } from "react";

type Status = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
type Size = "sm" | "md";

const STATUS: Record<Status, string> = {
  neutral:
    "bg-[var(--color-status-neutral-bg)] text-[var(--color-status-neutral-fg)] " +
    "border border-[var(--color-border-subtle)]",
  accent:
    "bg-[var(--color-surface-tint-accent)] text-[var(--color-text-accent)]",
  success:
    "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-fg)]",
  warning:
    "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-fg)]",
  danger:
    "bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger-fg)]",
  info:
    "bg-[var(--color-status-info-bg)] text-[var(--color-status-info-fg)]",
};

// Sizes snap to the 4-grid: sm = 20 (5u), md = 24 (6u).
// 6 px x-padding (sm) and 6 px gap (md) are documented sub-grid stops; we
// reach them via the v0.8 space.1_5 token rather than Tailwind's half-step.
const SIZE: Record<Size, string> = {
  sm: "h-5 px-[var(--space-1_5)] text-[var(--type-eyebrow-mono)] gap-1 rounded-[var(--radius-pill)]", // 6 px optical sub-grid
  md: "h-6 px-2 text-[var(--type-micro)] gap-[var(--space-1_5)] rounded-[var(--radius-pill)]",        // 6 px optical sub-grid
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status?: Status;
  size?: Size;
  leadingDot?: boolean;
  leadingIcon?: ReactNode;
  children: ReactNode;
};

export function Badge({
  status = "neutral",
  size = "sm",
  leadingDot,
  leadingIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  // Default: status variants get a leading dot; neutral does not.
  const showDot = leadingDot ?? (status !== "neutral");
  return (
    <span
      {...props}
      className={[
        "inline-flex items-center font-medium align-middle whitespace-nowrap",
        "tracking-[var(--tracking-tight)]",
        SIZE[size],
        STATUS[status],
        className ?? "",
      ].join(" ")}
    >
      {showDot && (
        <span
          aria-hidden
          className="h-[var(--space-1_5)] w-[var(--space-1_5)] rounded-full" // 6 px optical sub-grid
          style={{ background: "currentColor" }}
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
