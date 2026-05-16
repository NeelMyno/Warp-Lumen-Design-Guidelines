// Lumen Tag — Web React example. Compact filter / category chip.

"use client";

import { X } from "lucide-react";
import { ReactNode, KeyboardEvent } from "react";

type Tone = "subtle" | "neutral" | "accent" | "info" | "success" | "warning" | "danger";
type Size = "sm" | "md";

const SIZE: Record<Size, string> = {
  sm: "h-[22px] px-2 text-[var(--type-label-sm)]",
  md: "h-7 px-2.5 text-[var(--type-label-md)]",
};

const TONE: Record<Tone, string> = {
  subtle:  "bg-transparent border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]",
  neutral: "bg-[var(--color-surface-sunken)] text-[var(--color-text-primary)]",
  accent:  "bg-[var(--color-surface-tint-accent)] text-[var(--color-text-accent)]",
  info:    "bg-[var(--color-status-info-bg)]    text-[var(--color-status-info-fg)]",
  success: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-fg)]",
  warning: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-fg)]",
  danger:  "bg-[var(--color-status-danger-bg)]  text-[var(--color-status-danger-fg)]",
};

const SELECTED =
  "bg-[var(--color-action-selected-bg)] border border-[var(--color-action-selected-border)] text-[var(--color-action-selected-fg)]";

export type TagProps = {
  label: ReactNode;
  tone?: Tone;
  size?: Size;
  leadingIcon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  selected?: boolean;
  onClick?: () => void;
  asLink?: string;
  className?: string;
};

export function Tag({
  label,
  tone = "subtle",
  size = "sm",
  leadingIcon,
  dismissible,
  onDismiss,
  selected,
  onClick,
  asLink,
  className,
}: TagProps) {
  const interactive = !!(onClick || asLink || selected !== undefined);
  const base = [
    "inline-flex items-center gap-[var(--space-inline-xs)]",
    "rounded-[var(--radius-pill)] max-w-[24ch] truncate",
    SIZE[size],
    selected ? SELECTED : TONE[tone],
    interactive ? "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]" : "",
    onClick ? "cursor-pointer hover:bg-[var(--color-action-ghost-bg-hover)]" : "",
    "transition-colors duration-[var(--motion-duration-fast)]",
    className ?? "",
  ].join(" ");

  const content = (
    <>
      {leadingIcon && <span aria-hidden className="shrink-0">{leadingIcon}</span>}
      <span className="truncate">{label}</span>
      {dismissible && (
        <button
          type="button"
          aria-label={typeof label === "string" ? `Remove ${label}` : "Remove tag"}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className={[
            "shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-[var(--radius-pill)]",
            "hover:bg-[var(--color-action-ghost-bg-hover)]",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
          ].join(" ")}
        >
          <X size={10} aria-hidden />
        </button>
      )}
    </>
  );

  const onKey = (e: KeyboardEvent) => {
    if (dismissible && e.key === "Backspace") {
      onDismiss?.();
    }
  };

  if (asLink) return <a href={asLink} className={base} onKeyDown={onKey}>{content}</a>;
  if (onClick || selected !== undefined) {
    return (
      <button
        type="button"
        role="button"
        aria-pressed={selected}
        onClick={onClick}
        onKeyDown={onKey}
        className={base}
      >
        {content}
      </button>
    );
  }
  return <span className={base} onKeyDown={onKey}>{content}</span>;
}
