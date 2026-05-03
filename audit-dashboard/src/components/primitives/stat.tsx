import { ReactNode } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Trend = "up" | "down" | "flat";

// v0.5: Stat composes its own metric ramp here (size + font-bold + lumen-tnum).
// The type-* references parallel text-metric-{sm,md,lg,xl} but Stat keeps
// its own scale to support intermediate sizes (sm=25, lg=39) that have no
// semantic preset. Review for consolidation in a later pass.
const VALUE_SIZE: Record<Size, string> = {
  xs:   "text-[var(--type-20)]",
  sm:   "text-[var(--type-25)]",
  md:   "text-[var(--type-31)]",
  lg:   "text-[var(--type-39)]",
  xl:   "text-[var(--type-49)]",
  hero: "text-[var(--type-72)] md:text-[var(--type-76)]",
};

/**
 * Stat — Warp signature primitive.
 *
 * Big bold numeric in tabular monospace + small mono unit + optional delta
 * pill with trend arrow and a hairline-bordered shape so the meaning never
 * lives only in colour (Apple HIG).
 *
 * Sizes: xs / sm / md (default) / lg / xl / hero (marketing)
 */
export function Stat({
  label,
  value,
  unit,
  delta,
  trend,
  size = "md",
  spark,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: Trend;
  size?: Size;
  spark?: ReactNode;
}) {
  const trendStyles: Record<Trend, string> = {
    up:   "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
    down: "bg-[var(--status-danger-bg)]  text-[var(--status-danger-fg)]",
    flat: "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-fg)]",
  };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="lumen-eyebrow">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={[
            VALUE_SIZE[size],
            "font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)]",
            "lumen-tnum text-[var(--text-primary)]",
          ].join(" ")}
        >
          {value}
        </span>
        {unit && (
          /* v0.5: arbitrary-value type — review for semantic preset (mono regular at 13) */
          <span className="lumen-mono text-[var(--type-13)] text-[var(--text-tertiary)]">
            {unit}
          </span>
        )}
      </div>
      {(delta || spark) && (
        <div className="flex items-center gap-3 mt-0.5">
          {delta && trend && (
            /* v0.5: arbitrary-value type — review for semantic preset (type-11 delta pill) */
            <span
              className={[
                "inline-flex items-center gap-1 px-1.5 h-[18px] rounded-[var(--radius-full)]",
                "text-[var(--type-11)] font-medium tracking-[var(--tracking-tight)]",
                "lumen-tnum",
                trendStyles[trend],
              ].join(" ")}
            >
              <span aria-hidden className="text-[10px] leading-none">
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

export function StatGrid({
  children,
  cols = 4,
  divided,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  divided?: boolean;
}) {
  const colClass =
    cols === 2 ? "sm:grid-cols-2" :
    cols === 3 ? "sm:grid-cols-3" :
                 "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div
      className={[
        "grid grid-cols-1 gap-x-8 gap-y-6",
        colClass,
        divided ? "lumen-stat-grid-divided" : "",
      ].join(" ")}
    >
      {children}
      {divided && (
        <style>{`
          @media (min-width: 640px) {
            .lumen-stat-grid-divided > * + * {
              border-left: 1px solid var(--border-hairline);
              padding-left: 32px;
            }
            .lumen-stat-grid-divided > *:first-child {
              padding-left: 0;
            }
          }
        `}</style>
      )}
    </div>
  );
}

/**
 * Sparkline — minimal area chart, monoline. Ships alongside Stat for
 * "metric + trend" patterns.
 */
export function Sparkline({
  data,
  width = 88,
  height = 26,
  tone = "accent",
}: {
  data: number[];
  width?: number;
  height?: number;
  tone?: "accent" | "neutral" | "success" | "danger";
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  const fill = `0,${height} ${points} ${width},${height}`;
  const stroke =
    tone === "accent"  ? "var(--lumen-accent-5)" :
    tone === "success" ? "var(--lumen-accent-6)" :
    tone === "danger"  ? "var(--lumen-red-5)"     :
                         "var(--text-tertiary)";
  return (
    <svg width={width} height={height} aria-hidden className="shrink-0">
      <polygon points={fill} fill={stroke} opacity="0.12" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
