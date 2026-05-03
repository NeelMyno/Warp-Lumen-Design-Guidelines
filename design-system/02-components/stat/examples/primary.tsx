// Lumen Stat — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/stat.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Warp signature primitive. Big bold numeric in tabular monospace + small mono
// unit + optional delta pill with trend arrow. The arrow uses aria-hidden;
// meaning lives in the delta string. Real-time Stats are wrapped in
// aria-live="polite" by the consumer.

import { HTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl";
type Trend = "up" | "down" | "flat";

// Per the component contract sizeMapping: each size composes a metric preset
// for the value, a data preset for the unit, and a body preset for the delta.
// The metric.* utilities bake font-weight, tracking, and tabular numerics in.
const VALUE_SIZE: Record<Size, string> = {
  sm: "text-metric-sm",
  md: "text-metric-md",
  lg: "text-metric-lg",
  xl: "text-metric-xl",
};

const UNIT_SIZE: Record<Size, string> = {
  sm: "text-[var(--type-data-sm)]",
  md: "text-[var(--type-data-md)]",
  lg: "text-[var(--type-data-md)]",
  xl: "text-[var(--type-data-lg)]",
};

const DELTA_SIZE: Record<Size, string> = {
  sm: "text-[var(--type-body-sm)]",
  md: "text-[var(--type-body-sm)]",
  lg: "text-[var(--type-body-md)]",
  xl: "text-[var(--type-body-md)]",
};

export type StatProps = HTMLAttributes<HTMLDivElement> & {
  /** Eyebrow label, sentence case. */
  label: string;
  /** The number. Always renders in tabular monospace. */
  value: string;
  /** Small mono unit suffix ("%", "lb", "days"). */
  unit?: string;
  /** Change description, e.g. "+12.4% wow", "-3.6%". */
  delta?: string;
  trend?: Trend;
  size?: Size;
  /** Optional sparkline node, rendered next to the delta. */
  spark?: ReactNode;
};

export function Stat({
  label,
  value,
  unit,
  delta,
  trend,
  size = "md",
  spark,
  className,
  ...props
}: StatProps) {
  const trendStyles: Record<Trend, string> = {
    up: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-fg)]",
    down: "bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger-fg)]",
    flat: "bg-[var(--color-status-neutral-bg)] text-[var(--color-status-neutral-fg)]",
  };

  return (
    <div {...props} className={["flex flex-col gap-1.5", className ?? ""].join(" ")}>
      <div className="text-[var(--type-eyebrow-sans)] uppercase tracking-[var(--tracking-wider)] font-semibold text-[var(--color-text-tertiary)]">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={[
            VALUE_SIZE[size],
            "text-[var(--color-text-primary)]",
            // Defensive: metric.* presets already bake these in. Re-stating
            // ensures the example renders correctly even if a consumer hasn't
            // wired the preset yet.
            "[font-variant-numeric:tabular-nums_lining-nums_slashed-zero]",
          ].join(" ")}
        >
          {value}
        </span>
        {unit && (
          <span
            className={[
              "font-[var(--font-mono)]",
              UNIT_SIZE[size],
              "text-[var(--color-text-tertiary)]",
            ].join(" ")}
          >
            {unit}
          </span>
        )}
      </div>
      {(delta || spark) && (
        <div className="flex items-center gap-3 mt-0.5">
          {delta && trend && (
            <span
              className={[
                "inline-flex items-center gap-1 px-1.5 h-4.5 rounded-[var(--radius-pill)]",
                DELTA_SIZE[size],
                "font-medium tracking-[var(--tracking-tight)]",
                "[font-variant-numeric:tabular-nums_lining-nums_slashed-zero]",
                trendStyles[trend],
              ].join(" ")}
            >
              <span aria-hidden className="leading-none">
                {trend === "up" ? "▲" : trend === "down" ? "▼" : "→"}
              </span>
              {delta}
            </span>
          )}
          {spark}
        </div>
      )}
    </div>
  );
}
