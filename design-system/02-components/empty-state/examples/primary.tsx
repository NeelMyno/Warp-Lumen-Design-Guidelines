// Lumen EmptyState — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/empty-state.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Type-led message for empty collections. Two lines max. Lead the action with
// a verb. The icon is decorative (aria-hidden); meaning lives in the headline.
// Region exposes role="region" with aria-labelledby pointing to the headline.

import { ReactNode, useId, HTMLAttributes } from "react";

type Align = "start" | "center";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  headline: string;
  supporting?: string;
  action?: ReactNode;
  /** Decorative icon. Pass a 1.5 px stroke icon, ~56×56. Defaults to a placeholder. */
  icon?: ReactNode;
  align?: Align;
  /** Reduces vertical padding for use inside narrow surfaces. */
  compact?: boolean;
};

export function EmptyState({
  headline,
  supporting,
  action,
  icon = <DefaultIcon />,
  align = "center",
  compact = false,
  className,
  ...props
}: EmptyStateProps) {
  const headlineId = useId();
  const isCenter = align === "center";

  return (
    <section
      {...props}
      role="region"
      aria-labelledby={headlineId}
      className={[
        "flex flex-col rounded-[var(--radius-lg)]",
        "border border-dashed border-[var(--color-border-default)]",
        "bg-[var(--color-surface-raised)]",
        compact ? "px-4 py-6" : "px-6 py-12",
        isCenter ? "items-center text-center" : "items-start text-left",
        className ?? "",
      ].join(" ")}
    >
      {icon && (
        <div aria-hidden className="mb-4">
          {icon}
        </div>
      )}
      <h3
        id={headlineId}
        className="text-[var(--type-heading-h3)] font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-primary)]"
      >
        {headline}
      </h3>
      {supporting && (
        <p
          className={[
            "mt-1.5 text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]",
            "leading-[var(--leading-snug)]",
            isCenter ? "max-w-[42ch]" : "",
          ].join(" ")}
        >
          {supporting}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </section>
  );
}

/** Decorative placeholder icon. Hex colors here are exempt (SVG). */
function DefaultIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect
        x="6"
        y="14"
        width="44"
        height="32"
        rx="4"
        stroke="var(--color-border-default)"
        strokeWidth="1.5"
      />
      <rect x="12" y="22" width="20" height="3" rx="1.5" fill="var(--color-border-default)" />
      <rect x="12" y="29" width="32" height="3" rx="1.5" fill="var(--color-border-subtle)" />
      <rect x="12" y="36" width="14" height="3" rx="1.5" fill="var(--color-border-subtle)" />
    </svg>
  );
}
