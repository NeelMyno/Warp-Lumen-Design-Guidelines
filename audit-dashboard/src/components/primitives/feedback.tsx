"use client";

import { ReactNode, useState } from "react";
import { Info, AlertTriangle, AlertOctagon, CheckCircle2, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Alert as ShadcnAlert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { X, Check } from "./icon";

/* ─────────────────────────  ALERT BANNER (page-level)  ─────────────────────────
 * Wrapped over the canonical shadcn Alert. Lumen API preserved:
 *   <Alert tone="warn" title="…">{children}</Alert>
 * Maps `tone` → shadcn Alert variant, supplies the right icon, supports
 * dismiss button. Shadcn Alert provides the role="alert" + grid layout.
 */
type AlertTone = "info" | "warn" | "danger" | "success" | "neutral";

const TONE_TO_VARIANT: Record<AlertTone, "info" | "warning" | "destructive" | "success" | "default"> = {
  info: "info", warn: "warning", danger: "destructive", success: "success", neutral: "default",
};

const ToneIcon: Record<AlertTone, React.ComponentType<{ className?: string }>> = {
  info:    Info,
  warn:    AlertTriangle,
  danger:  AlertOctagon,
  success: CheckCircle2,
  neutral: Info,
};

export function Alert({
  tone = "info",
  title,
  children,
  onDismiss,
}: {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  onDismiss?: () => void;
}) {
  const Icon = ToneIcon[tone];
  return (
    <ShadcnAlert variant={TONE_TO_VARIANT[tone]} className={cn(onDismiss && "pr-10 relative")}>
      <Icon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 opacity-60 hover:opacity-100 transition-opacity"
        >
          <XIcon className="size-3.5" aria-hidden />
        </button>
      )}
    </ShadcnAlert>
  );
}

/* v0.11.3 — switched to --pill-{tone}-* mode-aware tokens for AAA contrast
   in both modes. PageBanner reads from this map; the icon color uses
   currentColor so it inherits the fg automatically. */
const ALERT_STYLES: Record<AlertTone, { bg: string; fg: string; border: string }> = {
  info:    { bg: "var(--pill-info-bg)",    fg: "var(--pill-info-fg)",    border: "var(--pill-info-border)" },
  warn:    { bg: "var(--pill-warn-bg)",    fg: "var(--pill-warn-fg)",    border: "var(--pill-warn-border)" },
  danger:  { bg: "var(--pill-danger-bg)",  fg: "var(--pill-danger-fg)",  border: "var(--pill-danger-border)" },
  success: { bg: "var(--pill-success-bg)", fg: "var(--pill-success-fg)", border: "var(--pill-success-border)" },
  neutral: { bg: "var(--pill-neutral-bg)", fg: "var(--pill-neutral-fg)", border: "var(--pill-neutral-border)" },
};
function AlertIcon({ tone }: { tone: AlertTone }) {
  const Icon = ToneIcon[tone];
  return <Icon className="size-4" />;
}

/* ─────────────────────────  PAGE BANNER  ───────────────────────── */
export function PageBanner({
  tone = "info",
  children,
  action,
  onDismiss,
}: {
  tone?: AlertTone;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
}) {
  const s = ALERT_STYLES[tone];
  return (
    <div
      className="rounded-[var(--radius-md)] border px-4 h-12 flex items-center gap-3"
      style={{ background: s.bg, borderColor: s.border, color: s.fg }}
    >
      <span aria-hidden className="shrink-0">
        <AlertIcon tone={tone} />
      </span>
      <div className="text-[var(--type-13)] flex-1 min-w-0 truncate">{children}</div>
      <div className="flex items-center gap-2 shrink-0">
        {action}
        {onDismiss && (
          <button onClick={onDismiss} aria-label="Dismiss" className="opacity-60 hover:opacity-100" style={{ color: s.fg }}>
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────  TOAST  ───────────────────────── */
export function Toast({
  tone = "neutral",
  title,
  description,
  action,
}: {
  tone?: AlertTone;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void };
}) {
  const s = ALERT_STYLES[tone];
  return (
    <div
      role="status"
      className="min-w-[300px] max-w-[400px] rounded-[var(--radius-md)] border bg-[var(--surface-popover)] shadow-[var(--shadow-popover)] p-3 flex items-start gap-3"
      style={{ borderColor: "var(--border-default)" }}
    >
      <span aria-hidden className="mt-1 shrink-0" style={{ color: s.fg }}>
        <AlertIcon tone={tone} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-heading-h6 text-[var(--text-primary)]">{title}</div>
        {description && <div className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-1">{description}</div>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 h-7 px-2 rounded-[var(--radius-sm)] text-[var(--type-12)] text-[var(--text-accent)] hover:bg-[var(--surface-sunken)] font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────  SNACKBAR (compact toast w/ undo)  ───────────────────────── */
export function Snackbar({ children, action }: { children: ReactNode; action?: { label: string; onClick?: () => void } }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[var(--surface-inverse)] text-[var(--text-inverse)] px-4 py-2 shadow-[var(--shadow-popover)]">
      <span className="text-[var(--type-13)]">{children}</span>
      {action && (
        <button onClick={action.onClick} className="text-[var(--type-12)] uppercase tracking-[var(--tracking-wider)] font-semibold text-[var(--lumen-accent-3)] hover:text-[var(--lumen-accent-2)]">
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────  MODAL (visual)  ───────────────────────── */
export function ModalCard({
  title,
  description,
  children,
  primary,
  secondary,
  size = "md",
  destructive,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  primary?: { label: string; onClick?: () => void };
  secondary?: { label: string; onClick?: () => void };
  size?: "sm" | "md" | "lg";
  destructive?: boolean;
}) {
  const w = size === "sm" ? "w-[400px]" : size === "lg" ? "w-[640px]" : "w-[500px]";
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={["rounded-[var(--radius-xl)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-modal)] overflow-hidden", w].join(" ")}
    >
      <div className="px-5 pt-5 pb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-[var(--type-17)] font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">{title}</div>
          {description && (
            <div className="text-body-xs text-[var(--text-tertiary)] mt-1 leading-[var(--leading-snug)]">{description}</div>
          )}
        </div>
        <button className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--surface-sunken)]" aria-label="Close">
          <X size={14} />
        </button>
      </div>
      {children && <div className="px-5 pb-4 pt-2 text-body-xs text-[var(--text-secondary)]">{children}</div>}
      {(primary || secondary) && (
        <div className="px-5 py-4 border-t border-[var(--border-hairline)] bg-[var(--surface-sunken)]/40 flex items-center justify-end gap-2">
          {secondary && (
            <button
              onClick={secondary.onClick}
              className="h-10 px-4 rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--type-14)] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]"
            >
              {secondary.label}
            </button>
          )}
          {primary && (
            <button
              onClick={primary.onClick}
              className={[
                "h-10 px-4 rounded-[var(--radius-md)] text-[var(--type-14)] font-medium",
                destructive
                  ? "bg-[var(--lumen-red-5)] text-white hover:bg-[var(--lumen-red-6)]"
                  : "bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] hover:bg-[var(--lumen-accent-5)]",
              ].join(" ")}
            >
              {primary.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  CONFIRMATION DIALOG (type-to-confirm)  ───────────────────────── */
export function TypeToConfirm({ phrase = "DELETE" }: { phrase?: string }) {
  const [val, setVal] = useState("");
  const ok = val === phrase;
  return (
    <ModalCard
      title="Delete carrier account"
      description="This permanently removes Acme Carriers Inc and all 412 related shipments. This action cannot be undone."
      primary={{ label: "Delete forever" }}
      secondary={{ label: "Cancel" }}
      destructive
    >
      <div className="flex flex-col gap-2 mt-1">
        <label className="text-[var(--type-12)] text-[var(--text-secondary)]">
          Type <span className="lumen-mono font-semibold text-[var(--text-primary)]">{phrase}</span> to confirm
        </label>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--type-14)] lumen-mono focus:outline-none focus:border-[var(--border-focus)] focus:shadow-[var(--shadow-focus)]"
        />
        <div className={["text-[var(--type-11)] mt-1", ok ? "text-[var(--lumen-accent-7)]" : "text-[var(--text-tertiary)]"].join(" ")}>
          {ok ? "Confirmation phrase matched." : "Phrase must match exactly."}
        </div>
      </div>
    </ModalCard>
  );
}

/* ─────────────────────────  DRAWER / SHEET (right-side)  ───────────────────────── */
export function Drawer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-[380px] rounded-[var(--radius-xl)] bg-[var(--surface-raised)] border border-[var(--border-default)] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[var(--border-hairline)]">
        <span className="text-heading-h6">{title}</span>
        <button aria-label="Close drawer" className="h-7 w-7 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--surface-sunken)]"><X size={14} /></button>
      </div>
      <div className="p-4 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

/* ─────────────────────────  POPOVER  ───────────────────────── */
export function Popover({ children, arrow = true }: { children: ReactNode; arrow?: boolean }) {
  return (
    <div className="relative inline-block">
      <div className="rounded-[var(--radius-md)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] p-3 max-w-[320px]">
        {children}
      </div>
      {arrow && (
        // lumen-lint-allow: off-grid — 6 px tooltip arrow offset from popover edge (sub-grid optical).
        <span className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 bg-[var(--surface-popover)] border-r border-b border-[var(--border-default)]" />
      )}
    </div>
  );
}

/* ─────────────────────────  COOKIE BANNER  ───────────────────────── */
export function CookieBanner() {
  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] p-4 max-w-[480px]">
      <div className="text-heading-h6">We use cookies</div>
      <p className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-1 leading-[var(--leading-snug)]">
        Essential cookies keep this site working. Optional cookies help us understand how it's used.
      </p>
      <div className="flex items-center gap-2 mt-3">
        <button className="h-8 px-3 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-12)] font-medium">Accept all</button>
        <button className="h-8 px-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--type-12)] font-medium">Essential only</button>
        <button className="h-8 px-2 rounded-[var(--radius-md)] text-[var(--type-12)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]">Customize</button>
      </div>
    </div>
  );
}

/* ─────────────────────────  INLINE VALIDATION  ───────────────────────── */
export function ValidationMessage({ tone = "danger", children }: { tone?: AlertTone; children: ReactNode }) {
  const colors: Record<AlertTone, string> = {
    info: "var(--lumen-cream-7)",
    warn: "var(--lumen-amber-7)",
    danger: "var(--lumen-red-7)",
    success: "var(--lumen-accent-7)",
    neutral: "var(--text-tertiary)",
  };
  return (
    <span className="inline-flex items-center gap-[var(--space-1_5)] text-[var(--type-12)]" style={{ color: colors[tone] }}>
      <span aria-hidden style={{ color: colors[tone] }}>
        {tone === "success" ? <Check size={12} /> : tone === "danger" ? "•" : "•"}
      </span>
      {children}
    </span>
  );
}
