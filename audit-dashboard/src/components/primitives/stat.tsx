import { ReactNode } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Trend = "up" | "down" | "flat";
/**
 * Polarity — which trend direction is "good" for THIS metric.
 *
 *   "good-up"   → up = success (green pill + green spark), down = danger.
 *                  Use for: revenue, conversion, on-time %, NPS, anything
 *                  where higher is better.
 *   "good-down" → down = success, up = danger. Use for: cost, error rate,
 *                  churn, latency — anything where lower is better.
 *   "neutral"   → both directions render in neutral grey. Use for: counts
 *                  that don't carry good/bad valence (active sessions, etc.).
 *
 * Why this matters: pre-v0.11.12, Stat hard-coded "down = danger". An "Avg
 * cost / pallet ▼ -3.6%" rendered a RED trend pill (bad) but its sparkline
 * was set to success-green (good) — a visible contradiction the user reads
 * as sloppy. Polarity unifies the two so the pill, the spark, and the
 * caller's mental model agree.
 */
type Polarity = "good-up" | "good-down" | "neutral";

type SparkTone = "accent" | "neutral" | "success" | "danger";

// v0.5: Stat composes its own metric ramp here (size + font-bold + lumen-tnum).
// The type-* references parallel text-metric-{sm,md,lg,xl} but Stat keeps
// its own scale to support intermediate sizes (sm=25, lg=39) that have no
// semantic preset. Review for consolidation in a later pass.
const VALUE_SIZE: Record<Size, string> = {
  xs:   "text-[length:var(--type-20)]",
  sm:   "text-[length:var(--type-25)]",
  md:   "text-[length:var(--type-31)]",
  lg:   "text-[length:var(--type-39)]",
  xl:   "text-[length:var(--type-49)]",
  hero: "text-[length:var(--type-72)] md:text-[length:var(--type-76)]",
};

/** Map (trend × polarity) to a single semantic tone — drives both pill and spark. */
function deriveTone(trend: Trend | undefined, polarity: Polarity): "success" | "danger" | "neutral" {
  if (!trend || trend === "flat") return "neutral";
  if (polarity === "neutral") return "neutral";
  const matchesGood =
    (trend === "up"   && polarity === "good-up") ||
    (trend === "down" && polarity === "good-down");
  return matchesGood ? "success" : "danger";
}

const PILL_BY_TONE: Record<"success" | "danger" | "neutral", string> = {
  success: "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
  danger:  "bg-[var(--status-danger-bg)]  text-[var(--status-danger-fg)]",
  neutral: "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-fg)]",
};

const SPARK_BY_TONE: Record<"success" | "danger" | "neutral", SparkTone> = {
  success: "success",
  danger:  "danger",
  neutral: "neutral",
};

/**
 * Stat — Warp signature primitive.
 *
 * Big bold numeric in tabular monospace + small mono unit + optional delta
 * pill with trend arrow and a hairline-bordered shape so the meaning never
 * lives only in colour (Apple HIG).
 *
 * Sizes: xs / sm / md (default) / lg / xl / hero (marketing).
 *
 * Two ways to attach a sparkline:
 *   1. `sparkData={[…]}` — Stat owns the Sparkline, derives tone from
 *      polarity+trend, and adds the live endpoint pulse. Use this.
 *   2. `spark={<Sparkline … />}` — legacy escape hatch for custom content
 *      (heatmap, scatter, anything non-line). Stat won't touch its colour.
 */
export function Stat({
  label,
  value,
  unit,
  delta,
  trend,
  size = "md",
  spark,
  sparkData,
  polarity = "good-up",
  pulse,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: Trend;
  size?: Size;
  spark?: ReactNode;
  sparkData?: number[];
  polarity?: Polarity;
  /** Override endpoint pulse on the auto-built sparkline. Default: true when sparkData is provided. */
  pulse?: boolean;
}) {
  const tone = deriveTone(trend, polarity);
  const showPulse = pulse ?? Boolean(sparkData);
  const renderedSpark =
    spark ??
    (sparkData ? (
      <Sparkline data={sparkData} tone={SPARK_BY_TONE[tone]} pulse={showPulse} />
    ) : null);

  return (
    <div className="flex flex-col gap-[var(--space-1_5)]">
      <div className="lumen-eyebrow">{label}</div>
      <div className="flex items-baseline gap-[var(--space-1_5)]">
        <span
          className={[
            VALUE_SIZE[size],
            "font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)]",
            "lumen-tnum text-[color:var(--text-primary)]",
          ].join(" ")}
        >
          {value}
        </span>
        {unit && (
          /* v0.5: arbitrary-value type — review for semantic preset (mono regular at 13) */
          <span className="lumen-mono text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
            {unit}
          </span>
        )}
      </div>
      {(delta || renderedSpark) && (
        <div className="flex items-center gap-3 mt-1">
          {delta && trend && (
            /* v0.5: arbitrary-value type — review for semantic preset (type-11 delta pill) */
            <span
              className={[
                "inline-flex items-center gap-1 px-[var(--space-1_5)] h-[18px] rounded-[var(--radius-full)]",
                "text-[length:var(--type-11)] font-medium tracking-[var(--tracking-tight)]",
                "lumen-tnum whitespace-nowrap",
                PILL_BY_TONE[tone],
              ].join(" ")}
            >
              <span aria-hidden className="text-[10px] leading-none">
                {trend === "up" ? "▲" : trend === "down" ? "▼" : "→"}
              </span>
              {delta}
            </span>
          )}
          {renderedSpark}
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
 *
 * v0.11.12 — `pulse` adds a soft breathing dot on the last data point so
 * the chart reads as live telemetry, not a snapshot. Honors
 * prefers-reduced-motion (the dot stays but stops pulsing).
 */
export function Sparkline({
  data,
  width = 88,
  height = 26,
  tone = "accent",
  pulse = false,
}: {
  data: number[];
  width?: number;
  height?: number;
  tone?: "accent" | "neutral" | "success" | "danger";
  pulse?: boolean;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const lastX = (data.length - 1) * step;
  const lastY = height - ((data[data.length - 1] - min) / range) * height;
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
    <svg width={width} height={height} aria-hidden className="shrink-0 overflow-visible">
      <polygon points={fill} fill={stroke} opacity="0.12" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {pulse && (
        <g>
          <circle cx={lastX} cy={lastY} r="3" fill={stroke} opacity="0.25" className="lumen-spark-pulse" />
          <circle cx={lastX} cy={lastY} r="1.6" fill={stroke} />
        </g>
      )}
    </svg>
  );
}
