/**
 * Lumen charts — pure SVG, no runtime libraries. Designed for the same
 * disciplined visual register as the rest of the system. All series colors
 * come from the design tokens via CSS variables.
 */

import { ReactNode } from "react";

export const CHART_PALETTE = [
  "var(--lumen-accent-5)",
  "var(--lumen-cream-5)",
  "var(--lumen-amber-5)",
  "var(--lumen-red-4)",
  "var(--lumen-obsidian-5)",
  "var(--lumen-accent-7)",
];

/** Seeded pseudo-random generator (mulberry32). Pure for a given seed. */
function rng(seed: number) {
  let t = seed;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─────────────────────────  COMMON  ───────────────────────── */
function ChartFrame({ width = 360, height = 180, children, label }: { width?: number; height?: number; children: ReactNode; label?: string }) {
  return (
    <div className="w-full">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block" aria-label={label}>
        {children}
      </svg>
    </div>
  );
}

/* ─────────────────────────  LINE CHART  ───────────────────────── */
export function LineChart({
  series,
  labels,
  height = 180,
  area = false,
}: {
  series: { name: string; data: number[] }[];
  labels?: string[];
  height?: number;
  area?: boolean;
}) {
  const w = 360, pad = 16;
  const allVals = series.flatMap((s) => s.data);
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const xs = (i: number, n: number) => pad + (i * (w - pad * 2)) / (n - 1);
  const ys = (v: number) => height - pad - ((v - minV) / (maxV - minV || 1)) * (height - pad * 2);
  return (
    <ChartFrame width={w} height={height} label="Line chart">
      {/* gridlines */}
      {Array.from({ length: 4 }).map((_, i) => {
        const y = pad + ((height - pad * 2) / 3) * i;
        return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--border-hairline)" strokeWidth="1" />;
      })}
      {series.map((s, si) => {
        const path = s.data.map((v, i) => `${i === 0 ? "M" : "L"} ${xs(i, s.data.length)} ${ys(v)}`).join(" ");
        const fill = `${path} L ${xs(s.data.length - 1, s.data.length)} ${height - pad} L ${xs(0, s.data.length)} ${height - pad} Z`;
        return (
          <g key={si}>
            {area && <path d={fill} fill={CHART_PALETTE[si]} opacity="0.10" />}
            <path d={path} fill="none" stroke={CHART_PALETTE[si]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={xs(i, s.data.length)} cy={ys(v)} r="2.2" fill="var(--surface-raised)" stroke={CHART_PALETTE[si]} strokeWidth="1.5" />
            ))}
          </g>
        );
      })}
      {/* x labels */}
      {labels && labels.map((l, i) => (
        <text key={i} x={xs(i, labels.length)} y={height - 2} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}>
          {l}
        </text>
      ))}
    </ChartFrame>
  );
}

/* ─────────────────────────  AREA CHART  ───────────────────────── */
export function AreaChart({ data, labels, height = 180 }: { data: number[]; labels?: string[]; height?: number }) {
  return <LineChart series={[{ name: "Series", data }]} labels={labels} height={height} area />;
}

/* ─────────────────────────  BAR CHART  ───────────────────────── */
export function BarChart({
  data,
  labels,
  height = 180,
  horizontal = false,
}: {
  data: number[];
  labels?: string[];
  height?: number;
  horizontal?: boolean;
}) {
  const w = 360, pad = 18;
  const max = Math.max(...data);
  if (horizontal) {
    return (
      <ChartFrame width={w} height={height} label="Horizontal bar">
        {data.map((v, i) => {
          const y = pad + i * ((height - pad * 2) / data.length);
          const bw = (v / max) * (w - pad * 2 - 60);
          return (
            <g key={i}>
              <text x={6} y={y + 14} fontSize="10" fill="var(--text-secondary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}>{labels?.[i]}</text>
              <rect x={60} y={y + 4} width={bw} height={(height - pad * 2) / data.length - 8} rx="3" fill={CHART_PALETTE[0]} opacity="0.85" />
              <text x={60 + bw + 4} y={y + 14} fontSize="10" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}>{v}</text>
            </g>
          );
        })}
      </ChartFrame>
    );
  }
  const barW = (w - pad * 2) / data.length - 4;
  return (
    <ChartFrame width={w} height={height} label="Bar chart">
      {Array.from({ length: 4 }).map((_, i) => {
        const y = pad + ((height - pad * 2) / 3) * i;
        return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--border-hairline)" strokeWidth="1" />;
      })}
      {data.map((v, i) => {
        const x = pad + i * ((w - pad * 2) / data.length) + 2;
        const bh = (v / max) * (height - pad * 2);
        return (
          <g key={i}>
            <rect x={x} y={height - pad - bh} width={barW} height={bh} rx="3" fill={CHART_PALETTE[0]} />
            {labels && (
              <text x={x + barW / 2} y={height - 4} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}>
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </ChartFrame>
  );
}

/* ─────────────────────────  STACKED BAR  ───────────────────────── */
export function StackedBar({ rows }: { rows: { label: string; segments: { value: number; color: string; label?: string }[] }[] }) {
  return (
    <div className="flex flex-col gap-[var(--space-1_5)]">
      {rows.map((r) => {
        const total = r.segments.reduce((a, b) => a + b.value, 0);
        return (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-20 text-[length:var(--type-12)] text-[color:var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{r.label}</span>
            <div className="flex-1 h-5 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--surface-sunken)] flex">
              {r.segments.map((s, i) => (
                <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={s.label} />
              ))}
            </div>
            <span className="w-12 text-right lumen-mono text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">{total}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  DONUT CHART  ───────────────────────── */
export function DonutChart({
  segments,
  size = 140,
  thickness = 14,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color?: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offsets = segments.reduce<number[]>((arr, s) => {
    const last = arr.length === 0 ? 0 : arr[arr.length - 1] + segments[arr.length - 1].value;
    return [...arr, last];
  }, []);
  return (
    <div className="inline-flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block" aria-label="Donut chart">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * c;
            const offset = (offsets[i] / total) * c;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color ?? CHART_PALETTE[i % CHART_PALETTE.length]}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
          })}
        </g>
        {centerValue && (
          /* v0.11.12 — bumped from 20→24, weight 600→700, tightened tracking.
             The donut IS the metric; the centre value should command the eye,
             not whisper. */
          <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
            {centerValue}
          </text>
        )}
        {centerLabel && (
          /* Tightened y-offset 12→14 so label sits flush under the value
             without crowding it. Eyebrow casing handles emphasis. */
          <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }} letterSpacing="0.04em">
            {centerLabel.toUpperCase()}
          </text>
        )}
      </svg>
      <ul className="flex flex-col gap-[var(--space-1_5)] text-[length:var(--type-12)]">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[1px]" style={{ background: s.color ?? CHART_PALETTE[i % CHART_PALETTE.length] }} />
            <span className="text-[color:var(--text-secondary)]">{s.label}</span>
            <span className="lumen-mono text-[color:var(--text-tertiary)] ml-auto">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────  PIE CHART  ───────────────────────── */
export function PieChart({ segments, size = 140 }: { segments: { label: string; value: number; color?: string }[]; size?: number }) {
  return <DonutChart segments={segments} size={size} thickness={size / 2} />;
}

/* ─────────────────────────  HEATMAP  ───────────────────────── */
export function Heatmap({ rows = 7, cols = 16, label, seed = 7 }: { rows?: number; cols?: number; label?: string; seed?: number }) {
  const r = rng(seed);
  const cells: number[] = Array.from({ length: rows * cols }, () => r());
  return (
    <div className="inline-flex flex-col gap-2">
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cells.map((v, i) => (
          <span
            key={i}
            className="h-[14px] rounded-[2px]"
            style={{ background: `color-mix(in oklab, var(--lumen-accent-6) ${Math.round(v * 100)}%, transparent)` }}
            title={`Value ${(v * 100).toFixed(0)}%`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[length:var(--type-11)] text-[color:var(--text-tertiary)] lumen-mono">
        <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
      </div>
      {label && <div className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{label}</div>}
    </div>
  );
}

/* ─────────────────────────  SPARKLINE  ───────────────────────── */
export function MiniSparkline({ data, color = "var(--lumen-accent-5)", height = 28 }: { data: number[]; color?: string; height?: number }) {
  const w = 120;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(" ");
  const fillPoints = `0,${height} ${points} ${w},${height}`;
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} className="block">
      <polygon points={fillPoints} fill={color} opacity="0.12" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────  SCATTER  ───────────────────────── */
export function Scatter({ points }: { points: { x: number; y: number; size?: number; color?: string }[] }) {
  const w = 360, h = 180, pad = 16;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return (
    <ChartFrame width={w} height={h} label="Scatter plot">
      {Array.from({ length: 4 }).map((_, i) => {
        const y = pad + ((h - pad * 2) / 3) * i;
        return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--border-hairline)" strokeWidth="1" />;
      })}
      {points.map((p, i) => {
        const x = pad + ((p.x - minX) / (maxX - minX || 1)) * (w - pad * 2);
        const y = h - pad - ((p.y - minY) / (maxY - minY || 1)) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={p.size ?? 4} fill={p.color ?? CHART_PALETTE[0]} opacity="0.55" />;
      })}
    </ChartFrame>
  );
}

/* ─────────────────────────  RADAR  ───────────────────────── */
export function Radar({ axes, values }: { axes: string[]; values: number[] }) {
  const size = 200, cx = size / 2, cy = size / 2, r = 80;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [cx + Math.cos(angle) * r * (v / 100), cy + Math.sin(angle) * r * (v / 100)];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
  return (
    <ChartFrame width={size} height={size} label="Radar chart">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          fill="none"
          stroke="var(--border-hairline)"
          points={axes.map((_, i) => {
            const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
            return `${cx + Math.cos(angle) * r * s},${cy + Math.sin(angle) * r * s}`;
          }).join(" ")}
        />
      ))}
      {axes.map((a, i) => {
        const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        const lx = cx + Math.cos(angle) * (r + 14);
        const ly = cy + Math.sin(angle) * (r + 14);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }} alignmentBaseline="middle">
            {a}
          </text>
        );
      })}
      <path d={path} fill={CHART_PALETTE[0]} opacity="0.18" stroke={CHART_PALETTE[0]} strokeWidth="1.5" />
    </ChartFrame>
  );
}

/* ─────────────────────────  TREEMAP  ─────────────────────────
   v0.11.12 — switched tile foreground from `text-white` to a per-tile
   contrast-aware foreground. White on `var(--lumen-accent-5)` (Spring
   Green #00FA8A) renders at ~1.4:1 — a WCAG #9 violation and the exact
   pattern ADR 0018 banned. Tiles backed by spring green now use
   `accent-fg` (#07120D, AAA on the accent); other CHART_PALETTE entries
   are dark enough that white still passes, but we route them through
   the same helper so the rule lives in one place. */
function chartFgFor(bg: string): string {
  // Spring-green-anchored palette stops; anything resolving to those
  // CSS vars must use the dark accent foreground.
  if (bg.includes("--lumen-accent-5") || bg.includes("--lumen-accent-4") || bg.includes("--lumen-accent-3")) {
    return "var(--lumen-accent-fg)";
  }
  return "var(--text-on-dark, #ffffff)";
}

export function Treemap({ items }: { items: { label: string; value: number; color?: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <div className="grid grid-cols-4 gap-1 h-[160px]">
      {items.map((i, idx) => {
        const span = Math.max(1, Math.round((i.value / total) * 4));
        const bg = i.color ?? CHART_PALETTE[idx % CHART_PALETTE.length];
        const fg = chartFgFor(bg);
        return (
          <div
            key={idx}
            className="rounded-[var(--radius-xs)] px-2 py-[var(--space-1_5)] flex flex-col justify-end"
            style={{ background: bg, color: fg, gridColumn: `span ${span}` }}
          >
            <div className="text-[length:var(--type-11)] font-semibold tracking-[var(--tracking-tight)] truncate">{i.label}</div>
            <div className="text-[10px] opacity-80 lumen-mono">{Math.round((i.value / total) * 100)}%</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  FUNNEL  ─────────────────────────
   v0.11.3 — full rebuild. Prior implementation had `text-white` value text
   sitting `absolute inset-0` over the bar, which:
     1. rendered illegible white-on-spring-green at low/zero contrast
        (white on #00FA8A ≈ 1.4:1 — WCAG #9 violation);
     2. spanned the FULL flex-1 area (not just the bar's pct width), so
        the value text floated centered in empty space instead of inside
        the bar;
     3. stacked over the bar's antialiased edge, producing the apparent
        "doubled digit" rendering reported by the user (the AA edge of
        the bar acted like a faux-shadow on the text).

   New layout: the value sits INSIDE the bar (flex inside the bar div, not
   absolute), in dark accent.fg text — 14.7:1 AAA. When the bar is too
   narrow to fit the value text, the value renders to the bar's right in
   the regular text color so it never gets clipped or overlaps. */
export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map((s) => s.value));
  return (
    <div className="flex flex-col items-stretch gap-2 w-full">
      {steps.map((s, i) => {
        const pct = (s.value / max) * 100;
        const conv = i > 0 ? Math.round((s.value / steps[i - 1].value) * 100) : 100;
        return (
          <div key={s.label} className="w-full flex items-center gap-3">
            <span className="w-32 shrink-0 text-right text-[length:var(--type-12)] text-[color:var(--text-secondary)] truncate">
              {s.label}
            </span>
            <div className="flex-1 relative h-7 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] overflow-hidden">
              <div
                className="h-full flex items-center justify-end px-3 rounded-[var(--radius-sm)] text-[length:var(--type-12)] font-semibold lumen-tnum text-[color:var(--lumen-accent-fg)]"
                style={{
                  width: `${Math.max(pct, 12)}%`,
                  background: `color-mix(in oklab, var(--lumen-accent-4) ${100 - i * 14}%, var(--lumen-accent-7))`,
                }}
                aria-label={`${s.value.toLocaleString()} ${s.label}`}
              >
                <span aria-hidden>{s.value.toLocaleString()}</span>
              </div>
            </div>
            <span className="w-12 shrink-0 text-[length:var(--type-11)] lumen-mono text-[color:var(--text-tertiary)] text-right">
              {conv}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  HISTOGRAM  ───────────────────────── */
export function Histogram({ bins }: { bins: number[] }) {
  const w = 360, h = 120, pad = 6;
  const max = Math.max(...bins);
  const bw = (w - pad * 2) / bins.length;
  return (
    <ChartFrame width={w} height={h} label="Histogram">
      {bins.map((v, i) => {
        const x = pad + i * bw;
        const bh = (v / max) * (h - pad * 2);
        return <rect key={i} x={x + 1} y={h - pad - bh} width={bw - 2} height={bh} fill={CHART_PALETTE[1]} opacity="0.85" />;
      })}
    </ChartFrame>
  );
}

/* ─────────────────────────  WATERFALL  ───────────────────────── */
export function Waterfall({ items }: { items: { label: string; delta: number; total?: number; final?: boolean }[] }) {
  const w = 360, h = 180, pad = 16;
  const positions = items.reduce<{ start: number; end: number; label: string; delta: number; total?: number; final?: boolean }[]>((arr, i) => {
    const acc = arr.length === 0 ? 0 : (arr[arr.length - 1].final ? arr[arr.length - 1].start : arr[arr.length - 1].end);
    const start = acc;
    const end = i.final ? i.total ?? acc + i.delta : acc + i.delta;
    return [...arr, { start, end, ...i }];
  }, []);
  const allVals = positions.flatMap((p) => [p.start, p.end]);
  const max = Math.max(...allVals);
  const min = Math.min(0, ...allVals);
  const ys = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const bw = (w - pad * 2) / items.length - 4;
  return (
    <ChartFrame width={w} height={h} label="Waterfall">
      <line x1={pad} y1={ys(0)} x2={w - pad} y2={ys(0)} stroke="var(--border-hairline)" />
      {positions.map((p, i) => {
        const x = pad + i * ((w - pad * 2) / items.length) + 2;
        const y = ys(Math.max(p.start, p.end));
        const height = Math.abs(ys(p.start) - ys(p.end));
        const color = p.final ? "var(--lumen-obsidian-7)" : p.delta >= 0 ? "var(--lumen-accent-5)" : "var(--lumen-red-4)";
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={height || 2} fill={color} rx="2" />
            <text x={x + bw / 2} y={h - 3} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}>
              {p.label}
            </text>
          </g>
        );
      })}
    </ChartFrame>
  );
}

/* ─────────────────────────  BULLET  ───────────────────────── */
export function Bullet({ value, target, max = 100, label }: { value: number; target: number; max?: number; label?: string }) {
  const pct = (v: number) => (v / max) * 100;
  return (
    <div className="flex items-center gap-3">
      {label && <span className="w-28 text-[length:var(--type-12)] text-[color:var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{label}</span>}
      <div className="relative flex-1 h-5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-[color-mix(in_oklab,var(--lumen-accent-5)_22%,transparent)]" style={{ width: `${pct(target)}%` }} />
        <div className="absolute inset-y-0 left-0 bg-[var(--lumen-accent-5)]" style={{ width: `${pct(value)}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-[var(--text-primary)]" style={{ left: `${pct(target)}%` }} />
      </div>
      <span className="w-20 text-right lumen-mono text-[length:var(--type-12)] text-[color:var(--text-secondary)]">{value}/{target}</span>
    </div>
  );
}

/* ─────────────────────────  KPI CARD (rich)  ───────────────────────── */
export function KpiCard({
  label,
  value,
  trend,
  spark,
  hint,
}: {
  label: string;
  value: string;
  trend?: { delta: number; suffix?: string };
  spark?: number[];
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4 flex flex-col gap-3 shadow-[var(--shadow-xs)]">
      <div className="flex items-center justify-between">
        <span className="lumen-eyebrow text-[10px]">{label}</span>
        {trend && (
          <span className={["text-[length:var(--type-11)] lumen-mono", trend.delta >= 0 ? "text-[color:var(--lumen-accent-7)]" : "text-[color:var(--lumen-red-7)]"].join(" ")}>
            {trend.delta >= 0 ? "▲" : "▼"} {Math.abs(trend.delta).toFixed(1)}{trend.suffix ?? "%"}
          </span>
        )}
      </div>
      <div className="lumen-tnum text-[length:var(--type-31)] font-semibold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)] text-[color:var(--text-primary)]">
        {value}
      </div>
      {spark && <MiniSparkline data={spark} />}
      {hint && <div className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">{hint}</div>}
    </div>
  );
}

/* ─────────────────────────  COHORT GRID  ─────────────────────────
   v0.11.12 — cells used `text-white` over a green-fading-to-sunken
   ramp. At high retention (cell value ≥ 70%), the bg is mostly
   `--lumen-accent-6` and white text fails WCAG (~1.4:1). Below ~30%,
   the bg fades into `--surface-sunken` (dark mode → near-black, light
   mode → off-white) where white text breaks again on light theme.
   New rule: when bg leans accent (≥ 50%), use `accent-fg`; below 50%,
   use the system text-primary so the cell respects whichever theme is
   active. Same readability logic across light + dark. */
export function Cohort() {
  const cohorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const r = rng(42);
  const rows = cohorts.map((c, i) => ({
    label: c,
    cells: Array.from({ length: 6 - i }, (_, j) => Math.max(0, 100 - j * 12 - r() * 10)),
  }));
  return (
    <div className="overflow-auto">
      <table className="text-[length:var(--type-12)] lumen-mono">
        <thead>
          <tr>
            <th className="px-2 text-left text-[color:var(--text-tertiary)] uppercase">Cohort</th>
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={i} className="px-2 text-[color:var(--text-tertiary)] uppercase">M{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="px-2 py-[var(--space-1_5)] text-[color:var(--text-secondary)]">{r.label}</td>
              {r.cells.map((c, j) => {
                const pct = Math.round(c);
                const onAccent = pct >= 50;
                return (
                  <td key={j} className="px-1 py-1">
                    <span
                      className="block w-9 h-7 rounded-[3px] flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        background: `color-mix(in oklab, var(--lumen-accent-6) ${pct}%, var(--surface-sunken))`,
                        color: onAccent ? "var(--lumen-accent-fg)" : "var(--text-primary)",
                      }}
                    >
                      {pct}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────  CHART LEGEND  ─────────────────────────
   v0.11.12 — items render as button-shaped surfaces with a hover tint
   so the legend telegraphs "this is interactive" even when filter
   wiring isn't installed. Per peak-end rule: the smallest hover gives
   the dashboard a pulse of life. */
export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1">
      {items.map((i) => (
        <button
          type="button"
          key={i.label}
          className="inline-flex items-center gap-[var(--space-1_5)] text-[length:var(--type-12)] text-[color:var(--text-secondary)] px-2 h-6 rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)]"
        >
          <span className="h-2 w-2 rounded-[1px] shrink-0" style={{ background: i.color }} />
          {i.label}
        </button>
      ))}
    </div>
  );
}
