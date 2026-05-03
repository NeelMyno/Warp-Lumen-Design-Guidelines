// Lumen Toast — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/toast.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Short non-blocking message anchored to a viewport corner. The Region wraps
// in aria-live="polite" for non-error or "assertive" for error. role="status"
// for non-error, role="alert" for error. Hover or focus pauses auto-dismiss.
// Errors do not auto-dismiss (duration=null).

"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  HTMLAttributes,
} from "react";

type Status = "success" | "info" | "warning" | "danger";
type Anchor = "bottom-right" | "bottom-left" | "bottom-center" | "top-right";

const ICON_BG: Record<Status, string> = {
  success: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-fg)]",
  info: "bg-[var(--color-status-info-bg)] text-[var(--color-status-info-fg)]",
  warning: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-fg)]",
  danger: "bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger-fg)]",
};

const DEFAULT_DURATION: Record<Status, number | null> = {
  success: 6000,
  info: 6000,
  warning: 8000,
  danger: null,
};

const ANCHOR_POS: Record<Anchor, string> = {
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
};

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  status?: Status;
  /** Title — past tense for completed ("Booked"); present continuous for ongoing ("Quoting…"). */
  title: string;
  description?: string;
  /** Optional action node (button). Errors should always pair with one. */
  action?: ReactNode;
  /** Auto-dismiss in ms. null = sticky. Defaults: success/info 6000, warning 8000, danger null. */
  duration?: number | null;
  onDismiss?: () => void;
  anchor?: Anchor;
};

export function Toast({
  status = "info",
  title,
  description,
  action,
  duration,
  onDismiss,
  anchor = "bottom-right",
  className,
  ...props
}: ToastProps) {
  const resolvedDuration =
    duration === undefined ? DEFAULT_DURATION[status] : duration;
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (resolvedDuration == null || paused || !onDismiss) return;
    timerRef.current = setTimeout(onDismiss, resolvedDuration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resolvedDuration, paused, onDismiss]);

  const isError = status === "danger";

  return (
    <div
      {...props}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={[
        "w-full min-w-[var(--size-toast-min)] max-w-[var(--size-toast-max)]",
        "rounded-[var(--radius-card-lifted)]",
        "border border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-raised)]",
        "shadow-[var(--shadow-toast)]",
        "p-3 flex items-start gap-3",
        "transition-all duration-[var(--motion-transition-slow)] ease-[var(--motion-easing-decelerate)]",
        "motion-reduce:transition-none",
        "data-[anchor]:fixed",
        ANCHOR_POS[anchor],
        className ?? "",
      ].join(" ")}
      data-anchor={anchor}
    >
      <span
        aria-hidden
        className={[
          "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full shrink-0",
          ICON_BG[status],
        ].join(" ")}
      >
        <StatusIcon status={status} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[var(--type-heading-h6)] font-medium text-[var(--color-text-primary)]">
          {title}
        </div>
        {description && (
          <div className="mt-0.5 text-[var(--type-body-sm)] text-[var(--color-text-secondary)]">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={[
            "shrink-0 -mr-1 -mt-1 h-7 w-7 inline-flex items-center justify-center",
            "rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)]",
            "hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-primary)]",
            "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

/**
 * ToastRegion — wraps a list of Toasts in the live region anchored to a corner.
 * Place once near the root. Manage visible toasts in app state and pass
 * children here.
 */
export function ToastRegion({
  anchor = "bottom-right",
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { anchor?: Anchor }) {
  return (
    <div
      {...props}
      aria-live="polite"
      aria-relevant="additions"
      className={[
        "fixed z-[var(--z-toast,60)] flex flex-col gap-2",
        ANCHOR_POS[anchor],
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ───────── icons (SVG hex exempt from the no-primitives lint) ───────── */

function StatusIcon({ status }: { status: Status }) {
  if (status === "success") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12l4 4 10-10" />
      </svg>
    );
  }
  if (status === "warning" || status === "danger") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 8v5" />
        <circle cx="12" cy="17" r="0.5" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 11v6" />
      <circle cx="12" cy="7" r="0.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}
