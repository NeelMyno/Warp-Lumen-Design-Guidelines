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
            <span className="w-20 text-[var(--type-12)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{r.label}</span>
            <div className="flex-1 h-5 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--surface-sunken)] flex">
              {r.segments.map((s, i) => (
                <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={s.label} />
              ))}
            </div>
            <span className="w-12 text-right lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">{total}</span>
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
          <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--text-primary)" fontFamily="var(--font-sans)">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }} letterSpacing="0.04em">
            {centerLabel.toUpperCase()}
          </text>
        )}
      </svg>
      <ul className="flex flex-col gap-[var(--space-1_5)] text-[var(--type-12)]">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[1px]" style={{ background: s.color ?? CHART_PALETTE[i % CHART_PALETTE.length] }} />
            <span className="text-[var(--text-secondary)]">{s.label}</span>
            <span className="lumen-mono text-[var(--text-tertiary)] ml-auto">{Math.round((s.value / total) * 100)}%</span>
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
      <div className="flex items-center justify-between text-[var(--type-11)] text-[var(--text-tertiary)] lumen-mono">
        <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
      </div>
      {label && <div className="text-[var(--type-11)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{label}</div>}
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

/* ─────────────────────────  TREEMAP  ───────────────────────── */
export function Treemap({ items }: { items: { label: string; value: number; color?: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <div className="grid grid-cols-4 gap-1 h-[160px]">
      {items.map((i, idx) => {
        const span = Math.max(1, Math.round((i.value / total) * 4));
        return (
          <div
            key={idx}
            className="rounded-[var(--radius-xs)] px-2 py-[var(--space-1_5)] flex flex-col justify-end"
            style={{ background: i.color ?? CHART_PALETTE[idx % CHART_PALETTE.length], gridColumn: `span ${span}` }}
          >
            <div className="text-[var(--type-11)] font-semibold text-white tracking-[var(--tracking-tight)] truncate">{i.label}</div>
            <div className="text-[10px] text-white/80 lumen-mono">{Math.round((i.value / total) * 100)}%</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  FUNNEL  ───────────────────────── */
export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map((s) => s.value));
  return (
    <div className="flex flex-col items-center gap-1">
      {steps.map((s, i) => {
        const pct = (s.value / max) * 100;
        const conv = i > 0 ? Math.round((s.value / steps[i - 1].value) * 100) : 100;
        return (
          <div key={s.label} className="w-full flex items-center gap-3">
            <span className="w-32 text-right text-[var(--type-12)] text-[var(--text-secondary)]">{s.label}</span>
            <div className="flex-1 relative">
              <div className="h-7 rounded-[var(--radius-sm)]" style={{ width: `${pct}%`, background: `color-mix(in oklab, var(--lumen-accent-5) ${100 - i * 12}%, var(--surface-sunken))` }} />
              <span className="absolute inset-0 flex items-center px-3 text-[var(--type-12)] font-semibold text-white lumen-tnum">{s.value.toLocaleString()}</span>
            </div>
            <span className="w-12 text-[var(--type-11)] lumen-mono text-[var(--text-tertiary)]">{conv}%</span>
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
      {label && <span className="w-28 text-[var(--type-12)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{label}</span>}
      <div className="relative flex-1 h-5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-[color-mix(in_oklab,var(--lumen-accent-5)_22%,transparent)]" style={{ width: `${pct(target)}%` }} />
        <div className="absolute inset-y-0 left-0 bg-[var(--lumen-accent-5)]" style={{ width: `${pct(value)}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-[var(--text-primary)]" style={{ left: `${pct(target)}%` }} />
      </div>
      <span className="w-20 text-right lumen-mono text-[var(--type-12)] text-[var(--text-secondary)]">{value}/{target}</span>
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
          <span className={["text-[var(--type-11)] lumen-mono", trend.delta >= 0 ? "text-[var(--lumen-accent-7)]" : "text-[var(--lumen-red-7)]"].join(" ")}>
            {trend.delta >= 0 ? "▲" : "▼"} {Math.abs(trend.delta).toFixed(1)}{trend.suffix ?? "%"}
          </span>
        )}
      </div>
      <div className="lumen-tnum text-[var(--type-31)] font-semibold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)] text-[var(--text-primary)]">
        {value}
      </div>
      {spark && <MiniSparkline data={spark} />}
      {hint && <div className="text-[var(--type-11)] text-[var(--text-tertiary)]">{hint}</div>}
    </div>
  );
}

/* ─────────────────────────  COHORT GRID  ───────────────────────── */
export function Cohort() {
  const cohorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const r = rng(42);
  const rows = cohorts.map((c, i) => ({
    label: c,
    cells: Array.from({ length: 6 - i }, (_, j) => Math.max(0, 100 - j * 12 - r() * 10)),
  }));
  return (
    <div className="overflow-auto">
      <table className="text-[var(--type-12)] lumen-mono">
        <thead>
          <tr>
            <th className="px-2 text-left text-[var(--text-tertiary)] uppercase">Cohort</th>
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={i} className="px-2 text-[var(--text-tertiary)] uppercase">M{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="px-2 py-[var(--space-1_5)] text-[var(--text-secondary)]">{r.label}</td>
              {r.cells.map((c, j) => (
                <td key={j} className="px-1 py-1">
                  <span
                    className="block w-9 h-7 rounded-[3px] flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{ background: `color-mix(in oklab, var(--lumen-accent-6) ${Math.round(c)}%, var(--surface-sunken))` }}
                  >
                    {Math.round(c)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────  CHART LEGEND  ───────────────────────── */
export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-3">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-[var(--space-1_5)] text-[var(--type-12)] text-[var(--text-secondary)]">
          <span className="h-2 w-2 rounded-[1px]" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
