/**
 * @lumen/stat — v0.13 Phase 2 canonical implementation (preserves v0.11.16/.17 behavior).
 * ----------------------------------------------------------------------------
 * Warp SIGNATURE primitive. Big bold numeric + small mono unit + optional
 * polarity-aware delta pill + optional Sparkline endpoint pulse. StatGrid
 * handles cross-column sparkline alignment (v0.11.16 ml-auto anchor +
 * v0.11.17 fluid spark + gap-centered divider).
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Trend = "up" | "down" | "flat";
type Polarity = "good-up" | "good-down" | "neutral";
type SparkTone = "accent" | "neutral" | "success" | "danger";

const VALUE_SIZE: Record<Size, string> = {
  xs: "text-[length:var(--type-20)]",
  sm: "text-[length:var(--type-25)]",
  md: "text-[length:var(--type-31)]",
  lg: "text-[length:var(--type-39)]",
  xl: "text-[length:var(--type-49)]",
  hero: "text-[length:var(--type-72)] md:text-[length:var(--type-76)]",
};

function deriveTone(trend: Trend | undefined, polarity: Polarity): "success" | "danger" | "neutral" {
  if (!trend || trend === "flat") return "neutral";
  if (polarity === "neutral") return "neutral";
  const matchesGood =
    (trend === "up" && polarity === "good-up") || (trend === "down" && polarity === "good-down");
  return matchesGood ? "success" : "danger";
}

const PILL_BY_TONE: Record<"success" | "danger" | "neutral", string> = {
  success: "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
  danger: "bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)]",
  neutral: "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-fg)]",
};

const SPARK_BY_TONE: Record<"success" | "danger" | "neutral", SparkTone> = {
  success: "success",
  danger: "danger",
  neutral: "neutral",
};

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
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: Trend;
  size?: Size;
  spark?: React.ReactNode;
  sparkData?: number[];
  polarity?: Polarity;
  pulse?: boolean;
  className?: string;
}) {
  const tone = deriveTone(trend, polarity);
  const showPulse = pulse ?? Boolean(sparkData);
  const renderedSpark =
    spark ??
    (sparkData ? <Sparkline data={sparkData} tone={SPARK_BY_TONE[tone]} pulse={showPulse} /> : null);

  return (
    <div data-slot="stat" className={cn("flex flex-col gap-[var(--space-1_5)]", className)}>
      <div className="lumen-eyebrow">{label}</div>
      <div className="flex items-baseline gap-[var(--space-1_5)]">
        <span
          className={cn(
            VALUE_SIZE[size],
            "font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)]",
            "lumen-tnum text-[color:var(--text-primary)]",
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="lumen-mono text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
            {unit}
          </span>
        )}
      </div>
      {(delta || renderedSpark) && (
        <div className="flex items-center gap-3 mt-1 min-w-0">
          {delta && trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-[var(--space-1_5)] h-[18px] rounded-[var(--radius-full)]",
                "text-[length:var(--type-11)] font-medium tracking-[var(--tracking-tight)]",
                "lumen-tnum whitespace-nowrap shrink-0",
                PILL_BY_TONE[tone],
              )}
            >
              <span aria-hidden className="text-[10px] leading-none">
                {trend === "up" ? "▲" : trend === "down" ? "▼" : "→"}
              </span>
              {delta}
            </span>
          )}
          {renderedSpark && (
            <div data-slot="stat-spark-wrapper" className="ml-auto min-w-0 flex justify-end">
              {renderedSpark}
            </div>
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
  className,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  divided?: boolean;
  className?: string;
}) {
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div
      data-slot="stat-grid"
      className={cn("grid grid-cols-1 gap-x-8 gap-y-6", colClass, divided && "lumen-stat-grid-divided", className)}
    >
      {children}
      {divided && (
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
  tone?: SparkTone;
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
    tone === "accent"
      ? "var(--lumen-accent-5)"
      : tone === "success"
        ? "var(--lumen-accent-6)"
        : tone === "danger"
          ? "var(--lumen-red-5)"
          : "var(--text-tertiary)";
  return (
    <svg
      data-slot="sparkline"
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
