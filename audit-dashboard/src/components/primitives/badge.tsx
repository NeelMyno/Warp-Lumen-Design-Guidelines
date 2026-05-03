import { ReactNode } from "react";

type Status = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const STYLES: Record<Status, string> = {
  neutral:
    "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
  success:
    "bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-transparent",
  warning:
    "bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)] border border-transparent",
  danger:
    "bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)] border border-transparent",
  info:
    "bg-[var(--status-info-bg)] text-[var(--status-info-fg)] border border-transparent",
  accent:
    "bg-[color-mix(in_oklab,var(--accent-500)_14%,transparent)] text-[var(--text-accent)] border border-transparent",
};

export function Badge({
  status = "neutral",
  children,
  leadingDot,
}: {
  status?: Status;
  children: ReactNode;
  leadingDot?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-[var(--radius-full)]",
        "px-2 py-0.5 text-[var(--type-12)] font-medium",
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
      {children}
    </span>
  );
}
