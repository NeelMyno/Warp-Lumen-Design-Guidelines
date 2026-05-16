// Lumen Banner — Web React example.
// Page-level system state strip. Sticks above the page header by default.

"use client";

import { AlertOctagon, AlertTriangle, CheckCircle, Info, Sparkles, FlaskConical, X } from "lucide-react";
import { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger" | "promo" | "sandbox";

const TONE: Record<Tone, { icon: typeof Info; bg: string; fg: string }> = {
  info:    { icon: Info,          bg: "bg-[var(--color-status-info-bg)]",    fg: "text-[var(--color-status-info-fg)]" },
  success: { icon: CheckCircle,   bg: "bg-[var(--color-status-success-bg)]", fg: "text-[var(--color-status-success-fg)]" },
  warning: { icon: AlertTriangle, bg: "bg-[var(--color-status-warning-bg)]", fg: "text-[var(--color-status-warning-fg)]" },
  danger:  { icon: AlertOctagon,  bg: "bg-[var(--color-status-danger-bg)]",  fg: "text-[var(--color-status-danger-fg)]" },
  promo:   { icon: Sparkles,      bg: "bg-[var(--color-surface-tint-accent)]", fg: "text-[var(--color-text-accent)]" },
  sandbox: { icon: FlaskConical,  bg: "[background-image:repeating-linear-gradient(135deg,var(--color-surface-tint-accent)_0_8px,transparent_8px_16px)]", fg: "text-[var(--color-text-primary)]" },
};

export type BannerProps = {
  tone?: Tone;
  message: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  sticky?: boolean;
  compact?: boolean;
};

export function Banner({
  tone = "info",
  message,
  action,
  icon,
  dismissible,
  onDismiss,
  sticky = true,
  compact = true,
}: BannerProps) {
  const t = TONE[tone];
  const Icon = t.icon;
  const role = tone === "danger" ? "alert" : "region";
  return (
    <div
      role={role}
      aria-label={`${tone} banner`}
      className={[
        sticky ? "sticky top-0" : "",
        "z-[var(--z-banner,40)] w-full",
        "border-b border-[var(--color-border-hairline)]",
        compact ? "py-2" : "py-3",
        t.bg,
      ].join(" ")}
    >
      <div className={[
        "mx-auto flex items-center gap-[var(--space-inline-md)]",
        "px-[var(--space-inset-lg)]",
        "max-w-[var(--container-default,1200px)]",
        compact ? "text-[var(--type-body-sm)]" : "text-[var(--type-label-md)]",
      ].join(" ")}>
        <span className={["shrink-0", t.fg].join(" ")}>{icon ?? <Icon size={14} aria-hidden />}</span>
        <span className="min-w-0 flex-1 truncate text-[var(--color-text-primary)]">{message}</span>
        {action && <span className="shrink-0">{action}</span>}
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={onDismiss}
            className={[
              "shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-control-sm)]",
              "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-action-ghost-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
              "focus-visible:shadow-[var(--shadow-focus)]",
            ].join(" ")}
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
