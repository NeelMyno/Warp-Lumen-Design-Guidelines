// Lumen Chart — Web React example. Adapter-agnostic wrapper. Production code
// composes specific Recharts / Visx / ECharts charts using the CHART_PALETTE.

import { ReactNode } from "react";

export const CHART_PALETTE = [
  "var(--color-chart-1, var(--color-accent-500))",
  "var(--color-chart-2, #60A5FA)",
  "var(--color-chart-3, #FBBF24)",
  "var(--color-chart-4, #A78BFA)",
  "var(--color-chart-5, #F472B6)",
  "var(--color-chart-6, #94A3B8)",
  "var(--color-chart-7, #34D399)",
  "var(--color-chart-8, #FB7185)",
];

export function ChartFrame({
  title,
  description,
  ariaLabel,
  ariaSummary,
  legend,
  children,
  height = 220,
}: {
  title?: string;
  description?: ReactNode;
  ariaLabel: string;
  ariaSummary?: string;
  legend?: ReactNode;
  children: ReactNode;
  height?: number;
}) {
  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className="rounded-[var(--radius-card-default,12px)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] p-[var(--space-inset-md)]"
    >
      {(title || description) && (
        <figcaption className="mb-2">
          {title && <h4 className="text-[var(--type-heading-h4)] font-medium text-[var(--color-text-primary)]">{title}</h4>}
          {description && <p className="mt-1 text-[var(--type-body-sm)] text-[var(--color-text-secondary)]">{description}</p>}
          {ariaSummary && <p className="sr-only">{ariaSummary}</p>}
        </figcaption>
      )}
      <div style={{ height }} className="w-full">
        {children}
      </div>
      {legend && (
        <div className="mt-2 flex flex-wrap gap-3 text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
          {legend}
        </div>
      )}
    </figure>
  );
}

export function ChartLegendItem({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="size-2.5 rounded-[2px]" style={{ background: color }} />
      <span>{label}</span>
    </span>
  );
}

/**
 * Example — render a minimal SVG line chart inside the ChartFrame.
 * In production, drop in your favorite adapter; the frame, palette, legend, and tooltip stay.
 */
export function MiniLine({ data, ariaLabel, ariaSummary, color = CHART_PALETTE[0] }: {
  data: number[];
  ariaLabel: string;
  ariaSummary?: string;
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const w = 320;
  const h = 120;
  const pad = 4;
  const xs = data.map((_, i) => pad + (i * (w - 2 * pad)) / Math.max(1, data.length - 1));
  const ys = data.map((v) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - 2 * pad));
  const d = data.map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");
  return (
    <ChartFrame ariaLabel={ariaLabel} ariaSummary={ariaSummary} height={h + 16}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden>
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="2.5" fill={color} />
        ))}
      </svg>
    </ChartFrame>
  );
}
