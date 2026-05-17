/**
 * @lumen/tag — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Removable label sibling to Badge. Same --pill-{tone}-* contract. When
 * onRemove is set, an inline X renders with aria-label="Remove {label}".
 */
import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "neutral" | "success" | "warning" | "danger" | "info" | "accent";
type Size = "sm" | "md";

const STYLES: Record<Status, string> = {
  neutral: "bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)] border border-[var(--pill-neutral-border)]",
  success: "bg-[var(--pill-success-bg)] text-[var(--pill-success-fg)] border border-[var(--pill-success-border)]",
  warning: "bg-[var(--pill-warn-bg)] text-[var(--pill-warn-fg)] border border-[var(--pill-warn-border)]",
  danger: "bg-[var(--pill-danger-bg)] text-[var(--pill-danger-fg)] border border-[var(--pill-danger-border)]",
  info: "bg-[var(--pill-info-bg)] text-[var(--pill-info-fg)] border border-[var(--pill-info-border)]",
  accent: "bg-[var(--pill-accent-bg)] text-[var(--pill-accent-fg)] border border-[var(--pill-accent-border)]",
};

const SIZE: Record<Size, string> = {
  sm: "h-5 pl-2 pr-1 text-[length:var(--type-11)] gap-1 rounded-[var(--radius-full)]",
  md: "h-6 pl-2.5 pr-1.5 text-[length:var(--type-12)] gap-[var(--space-1_5)] rounded-[var(--radius-full)]",
};

const REMOVE_SIZE: Record<Size, string> = {
  sm: "size-3",
  md: "size-3.5",
};

export type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  status?: Status;
  size?: Size;
  leadingIcon?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
};

export function Tag({
  status = "neutral",
  size = "sm",
  className,
  children,
  leadingIcon,
  onRemove,
  removeLabel,
  ...props
}: TagProps) {
  const label = typeof children === "string" ? children : "tag";
  return (
    <span
      data-slot="tag"
      data-status={status}
      className={cn(
        "inline-flex items-center font-medium tracking-[var(--tracking-tight)] whitespace-nowrap align-middle",
        SIZE[size],
        STYLES[status],
        onRemove ? "" : "pr-2",
        className,
      )}
      {...props}
    >
      {leadingIcon && (
        <span aria-hidden className="opacity-80 shrink-0">
          {leadingIcon}
        </span>
      )}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${label}`}
          className={cn(
            "ml-0.5 rounded-[var(--radius-full)] p-0.5 opacity-70 hover:opacity-100 hover:bg-[var(--surface-sunken)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
          )}
        >
          <X className={cn(REMOVE_SIZE[size], "shrink-0")} aria-hidden />
        </button>
      )}
    </span>
  );
}
