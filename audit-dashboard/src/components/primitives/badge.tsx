import { ReactNode } from "react";

type Status = "neutral" | "success" | "warning" | "danger" | "info" | "accent";
type Size = "sm" | "md";

/* v0.11.3 — unified the Badge primitive with the Tag/StatusPill color system
   via the --pill-{tone}-* mode-aware tokens (declared in globals.css).
   Previously each badge tone reached for different semantic tokens (some
   --status-*, accent reached for --surface-tint-accent + --text-accent),
   yielding inconsistent contrast across the three pill primitives. Now all
   three (Badge, Tag, StatusPill) share one color contract: a single
   --pill-* change repaints all of them. AAA contrast verified per tone in
   both modes — see globals.css §"PILL TONAL TOKENS". */
const STYLES: Record<Status, string> = {
  neutral: "bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)] border border-[var(--pill-neutral-border)]",
  success: "bg-[var(--pill-success-bg)] text-[var(--pill-success-fg)] border border-[var(--pill-success-border)]",
  warning: "bg-[var(--pill-warn-bg)]    text-[var(--pill-warn-fg)]    border border-[var(--pill-warn-border)]",
  danger:  "bg-[var(--pill-danger-bg)]  text-[var(--pill-danger-fg)]  border border-[var(--pill-danger-border)]",
  info:    "bg-[var(--pill-info-bg)]    text-[var(--pill-info-fg)]    border border-[var(--pill-info-border)]",
  accent:  "bg-[var(--pill-accent-bg)]  text-[var(--pill-accent-fg)]  border border-[var(--pill-accent-border)]",
};

/* Heights snap to 8pt: sm = 20 (2.5u soft), md = 24 (3u). */
/* v0.5: badge sizes use type-11/type-12 — review for semantic preset (badge ramp distinct from overline/micro) */
const SIZE: Record<Size, string> = {
  sm: "h-5 px-[var(--space-1_5)] text-[var(--type-11)] gap-1                 rounded-[var(--radius-full)]",
  md: "h-6 px-2                  text-[var(--type-12)] gap-[var(--space-1_5)] rounded-[var(--radius-full)]",
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
          className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-current shrink-0"
        />
      )}
      {leadingIcon && <span aria-hidden className="opacity-80">{leadingIcon}</span>}
      {children}
    </span>
  );
}
