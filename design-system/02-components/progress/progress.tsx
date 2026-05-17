"use client";

/**
 * @lumen/progress — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * ProgressBar — built on Radix Progress with a tone re-tint via the shadcn
 * progress-indicator slot. ProgressRing — custom SVG (no Radix equivalent);
 * Lumen-signature for hero KPI tiles.
 */
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const TONE_STROKE: Record<Tone, string> = {
  accent: "var(--color-accent)",
  success: "var(--lumen-accent-6)",
  warning: "var(--lumen-amber-5)",
  danger: "var(--lumen-red-5)",
  neutral: "var(--text-tertiary)",
};

export function ProgressBar({
  value,
  max = 100,
  tone = "accent",
  label,
  showValue,
  size = "md",
  className,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === "sm" ? "h-1" : size === "lg" ? "h-2" : "h-[var(--space-1_5)]";
  return (
    <div data-slot="progress-bar" className={cn("flex flex-col gap-[var(--space-1_5)]", className)}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && (
            <span className="text-[length:var(--type-13)] text-[color:var(--text-secondary)]">{label}</span>
          )}
          {showValue && (
            <span className="lumen-mono lumen-tnum text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(h, "relative w-full overflow-hidden rounded-full bg-[var(--surface-sunken)]")}
        value={pct}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn("h-full w-full flex-1 transition-all")}
          style={{
            transform: `translateX(-${100 - pct}%)`,
            background: TONE_STROKE[tone],
          }}
        />
      </ProgressPrimitive.Root>
      <span aria-hidden className="sr-only">{`${Math.round(pct)}% ${tone}`}</span>
    </div>
  );
}

export function ProgressRing({
  value,
  max = 100,
  size = 56,
  stroke = 4,
  tone = "accent",
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  tone?: Tone;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div
      data-slot="progress-ring"
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={label ?? `${Math.round(pct)}%`} role="img">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TONE_STROKE[tone]}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 280ms cubic-bezier(0.2,0,0,1)",
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[length:var(--type-22)] font-bold tracking-[var(--tracking-tighter)] leading-none lumen-tnum text-[color:var(--text-primary)]">
        {Math.round(pct)}
        <span className="text-[color:var(--text-tertiary)] text-[length:var(--type-11)] font-medium ml-[1px] -mb-[2px]">%</span>
      </span>
    </div>
  );
}
