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
        /* v0.11.16 — delta-pill + sparkline composition rebuilt for cross-column alignment.
           v0.11.17 — same composition, made overflow-safe. See the spark-wrapper note below.

           v0.11.16 rationale (still load-bearing): pre-v0.11.16 the row was `flex items-center
           gap-3 mt-1` and the sparkline trailed directly after the variable-width delta pill
           (gap-3). Across a StatGrid cols={4}, that meant every column's sparkline started at
           a different X position (one pill said "+12.4% wow" — wide; another said "▼ -3.6%" —
           narrow), and the sparklines visually scattered with no shared right-edge or left-edge
           to scan against. The four columns read as four disconnected stats instead of a row
           of comparable KPIs.

           Fix: keep the delta pill at the row's left edge, push the sparkline to the right
           edge via ml-auto on its wrapper. Now the sparkline endpoints sit on a consistent
           grid line — column-edge-aligned across the whole StatGrid — which is the
           Linear/Stripe/Apple-Health convention. When only one of {delta, spark} is present,
           ml-auto degenerates correctly: spark-only goes right (column-edge), delta-only
           goes left (column-start). The visual rhythm holds across every Stat consumer
           system-wide (KpiRow, LanePerf, side panels, foundations data section).

           min-w-0 on the row keeps the row's intrinsic content width from forcing the parent
           grid track wider — required for the fluid-spark fix below to actually engage in
           tight columns (otherwise the row would push its column wider, and StatGrid's
           grid-cols-4 minmax(0,1fr) would then concede). */
        <div className="flex items-center gap-3 mt-1 min-w-0">
          {delta && trend && (
            <span
              className={[
                "inline-flex items-center gap-1 px-[var(--space-1_5)] h-[18px] rounded-[var(--radius-full)]",
                "text-[length:var(--type-11)] font-medium tracking-[var(--tracking-tight)]",
                "lumen-tnum whitespace-nowrap shrink-0",
                PILL_BY_TONE[tone],
              ].join(" ")}
            >
              <span aria-hidden className="text-[10px] leading-none">
                {trend === "up" ? "▲" : trend === "down" ? "▼" : "→"}
              </span>
              {delta}
            </span>
          )}
          {renderedSpark && (
            /* v0.11.17 — fluid spark wrapper.
               Pre-v0.11.17 this wrapper was `ml-auto shrink-0`, locking the SVG at its
               intrinsic 88×26 (the Sparkline default). In a tight column (e.g. SaaS LanePerf,
               where the 1fr column is 760 px and cols 2-4 carry the StatGrid `divided`
               padding-left of 32px, leaving ~122 px content area), pill (~74) + gap-3 (12) +
               spark (88) = 174 demands more horizontal space than the column actually has.
               The row overflowed by ~52 px — invisible for cols 1-3 (the overflow landed
               inside the gap-x-8 + neighbor's padding-left buffer) but visually conspicuous
               for col 4, where the overflow had nowhere to land except past the Card's
               padding-right and into the gap toward the SidePanel.

               The user-reported bug: SEA → DEN sparkline visibly bleeding past the LanePerf
               card's right edge (and partway into the On-time index card). The cause was
               structural, not cosmetic — `shrink-0` ignored the column-width constraint.

               Fix: drop `shrink-0`, add `min-w-0`. The wrapper now flexes between 0 and the
               SVG's preferred width (88 by default), which means:
                 - Wide column (≥ pill+gap+88): wrapper sits at 88, ml-auto absorbs the
                   leftover, spark anchors to column-right-edge — same v0.11.16 visual rhythm.
                 - Tight column (< pill+gap+88): wrapper shrinks to fit the leftover slot,
                   the inner SVG (now viewBox-based — see Sparkline) scales proportionally,
                   anchored right via `xMaxYMid meet`. No overflow, no clipping. The spark
                   visibly compresses but remains readable; the trend line + endpoint pulse
                   stay anchored to the right edge so the grid-line invariant from v0.11.16
                   still holds. */
            <div className="ml-auto min-w-0 flex justify-end">{renderedSpark}</div>
          )}
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
        /* v0.11.17 — divider rebuilt as a pseudo-element in the gap, not a
           border-left + padding-left on cols 2..N.

           Pre-v0.11.17 the divider was `border-left: 1px; padding-left: 32px`
           on every child after the first. The padding-left ate 32 px of
           content area from cols 2..N — so col 1 had 32 px MORE room for its
           inner Stat (eyebrow + value + pill+spark row) than its neighbors.
           When the Stat row's pill+spark exceeded the available content area
           (size="md" with default 88-px spark in the SaaS LanePerf 1fr
           column), col 1 absorbed the overflow gracefully while cols 2..N
           overflowed by an EXTRA 32 px each. That asymmetry was the second
           half of the user-reported v0.11.17 bug — even after fluidising the
           sparkline, cols 1 vs 2..4 rendered sparks at visibly different
           widths because their content areas were different.

           Fix: pull the divider out of box-flow. Each child after the first
           gets a 1-px ::before pseudo-element absolutely positioned at the
           gap-centre (left: -16px is half of gap-x-8). Cols 1..N now share
           the same content area; the fluid spark renders at the same width
           in every column; the v0.11.16 cross-column rhythm is restored
           edge-to-edge.

           The divider visually shifts 16 px left vs pre-v0.11.17 (was at
           col-track-left, now at gap-centre) — closer to standard table-
           rule placement and more semantically honest about being "between"
           columns rather than "starting" the next column. */
        <style>{`
          @media (min-width: 640px) {
            .lumen-stat-grid-divided > * { position: relative; }
            .lumen-stat-grid-divided > * + *::before {
              content: "";
              position: absolute;
              left: -16px;
              top: 0;
              bottom: 0;
              width: 1px;
              background: var(--border-hairline);
              pointer-events: none;
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
 *
 * v0.11.17 — width is now a MAX cap, not a fixed dimension.
 *
 * The component now renders a viewBox-anchored SVG with `width="100%"` and
 * `style={{ maxWidth: width }}`. In a wide-enough container the SVG renders
 * at its preferred `width × height` (88 × 26 by default — no visible change
 * vs pre-v0.11.17). In a column too narrow for the preferred width (e.g.
 * SaaS LanePerf at viewport ≥ lg, where cols 2-4 carry a 32px divider
 * padding-left and the row of pill+gap+spark would otherwise overflow), the
 * SVG scales DOWN proportionally, anchored to the right edge via
 * `preserveAspectRatio="xMaxYMid meet"`. The line geometry compresses
 * uniformly; the endpoint pulse stays a circle (uniform scale) and remains
 * pinned to the right.
 *
 * `vector-effect="non-scaling-stroke"` keeps the polyline's stroke at 1.5px
 * regardless of scale, so a 50%-scaled spark doesn't render with a 0.75px
 * hairline that fights the surrounding chrome.
 *
 * Why `xMaxYMid meet` and not `none`: `none` stretches the line horizontally
 * but turns the pulse circle into an ellipse. Uniform scale keeps the pulse
 * round at the cost of a slightly shorter line in tight columns — the
 * user-perceptible quality (live-telemetry circle) wins over the precise
 * x-axis fidelity (which is decorative for a sparkline anyway). Right-edge
 * anchor preserves the v0.11.16 column-edge-aligned grid line invariant.
 */
export function Sparkline({
  data,
  width = 88,
  height = 26,
  tone = "accent",
  pulse = false,
}: {
  data: number[];
  /** Preferred width in px. Acts as a MAX cap; SVG scales down to fit narrower containers. */
  width?: number;
  height?: number;
  tone?: "accent" | "neutral" | "success" | "danger";
  pulse?: boolean;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  // Geometry is computed in viewBox user-space (0..width × 0..height). The
  // SVG element's CSS width may be smaller via maxWidth + container shrink,
  // but the viewBox stays constant — preserveAspectRatio handles the scale.
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
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMaxYMid meet"
      width="100%"
      height={height}
      aria-hidden
      className="block overflow-visible"
      style={{ maxWidth: width, height }}
    >
      <polygon points={fill} fill={stroke} opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {pulse && (
        <g>
          <circle cx={lastX} cy={lastY} r="3" fill={stroke} opacity="0.25" className="lumen-spark-pulse" />
          <circle cx={lastX} cy={lastY} r="1.6" fill={stroke} />
        </g>
      )}
    </svg>
  );
}
