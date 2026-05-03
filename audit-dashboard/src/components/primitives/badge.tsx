import { ReactNode } from "react";

type Status = "neutral" | "success" | "warning" | "danger" | "info" | "accent";
type Size = "sm" | "md";

const STYLES: Record<Status, string> = {
  neutral: "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-fg)] border border-[var(--border-hairline)]",
  success: "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
  warning: "bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]",
  danger:  "bg-[var(--status-danger-bg)]  text-[var(--status-danger-fg)]",
  info:    "bg-[var(--status-info-bg)]    text-[var(--status-info-fg)]",
  accent:  "bg-[var(--surface-tint-accent)] text-[var(--text-accent)]",
};

const SIZE: Record<Size, string> = {
  sm: "h-[18px] px-1.5 text-[var(--type-11)] gap-1   rounded-[var(--radius-full)]",
  md: "h-[22px] px-2   text-[var(--type-12)] gap-1.5 rounded-[var(--radius-full)]",
};

export function Badge({
  status = "neutral",
  size = "sm",
  children,
  leadingDot,
  leadingIcon,
}: {
  status?: Status;
  size?: Size;
  children: ReactNode;
  leadingDot?: boolean;
  leadingIcon?: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium tracking-[var(--tracking-tight)] whitespace-nowrap align-middle",
        SIZE[size],
        STYLES[status],
      ].join(" ")}
    >
      {leadingDot && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "currentColor" }}
        />
      )}
      {leadingIcon && <span aria-hidden className="opacity-80">{leadingIcon}</span>}
      {children}
    </span>
  );
}
