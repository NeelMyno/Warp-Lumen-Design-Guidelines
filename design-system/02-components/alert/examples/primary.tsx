// Lumen Alert — Web React example.
// Inline, persistent, region-scoped status block. Four tones, each with a paired glyph.

"use client";

import { AlertOctagon, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger";

const TONE: Record<Tone, { icon: typeof Info; bg: string; fg: string; border: string }> = {
  info:    { icon: Info,          bg: "bg-[var(--color-status-info-bg)]",    fg: "text-[var(--color-status-info-fg)]",    border: "border-[var(--color-status-info-border)]" },
  success: { icon: CheckCircle,   bg: "bg-[var(--color-status-success-bg)]", fg: "text-[var(--color-status-success-fg)]", border: "border-[var(--color-status-success-border)]" },
  warning: { icon: AlertTriangle, bg: "bg-[var(--color-status-warning-bg)]", fg: "text-[var(--color-status-warning-fg)]", border: "border-[var(--color-status-warning-border)]" },
  danger:  { icon: AlertOctagon,  bg: "bg-[var(--color-status-danger-bg)]",  fg: "text-[var(--color-status-danger-fg)]",  border: "border-[var(--color-status-danger-border)]" },
};

export type AlertProps = {
  tone?: Tone;
  title?: string;
  description: ReactNode;
  icon?: ReactNode | null;
  action?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  compact?: boolean;
  live?: "off" | "polite" | "assertive";
};

export function Alert({
  tone = "info",
  title,
  description,
  icon,
  action,
  dismissible,
  onDismiss,
  compact,
  live,
}: AlertProps) {
  const t = TONE[tone];
  const Icon = t.icon;
  const role = tone === "danger" ? "alert" : "status";
  const ariaLive = live ?? (tone === "danger" ? "assertive" : "polite");
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={[
        "flex items-start gap-[var(--space-inline-md)]",
        compact ? "p-[var(--space-inset-md)]" : "p-[var(--space-inset-lg)]",
        "rounded-[var(--radius-card-default)] border",
        t.bg,
        t.border,
      ].join(" ")}
    >
      {icon !== null && (
        <span className={["shrink-0 mt-[2px]", t.fg].join(" ")}>
          {icon ?? <Icon size={compact ? 14 : 16} aria-hidden />}
        </span>
      )}
      <div className="min-w-0 flex-1 flex flex-col gap-[var(--space-stack-xs)]">
        {title && (
          <p className={["font-medium leading-snug", "text-[var(--color-text-primary)]", compact ? "text-[var(--type-label-md)]" : "text-[var(--type-heading-h4)]"].join(" ")}>
            {title}
          </p>
        )}
        <div className={["text-[var(--color-text-secondary)]", compact ? "text-[var(--type-body-sm)]" : "text-[var(--type-body-md)]"].join(" ")}>
          {description}
        </div>
        {action && <div className="mt-[var(--space-stack-xs)]">{action}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label={`Dismiss ${tone} alert${title ? `: ${title}` : ""}`}
          onClick={onDismiss}
          className={[
            "shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-control-sm)]",
            "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--color-action-ghost-bg-hover)]",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
            "focus-visible:shadow-[var(--shadow-focus)]",
            "transition-colors duration-[var(--motion-duration-fast)]",
          ].join(" ")}
        >
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  );
}
