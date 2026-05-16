// Lumen Slider — Web React example.
// Thumb position rendered via inline style.left per AGENTS.md hard rule 12.

"use client";

import { KeyboardEvent, PointerEvent, useRef } from "react";

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  valueFormatter,
  size = "md",
  tone = "accent",
  disabled,
  ariaLabel,
}: {
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueFormatter?: (v: number) => string;
  size?: "sm" | "md";
  tone?: "accent" | "neutral" | "danger";
  disabled?: boolean;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = ((value - min) / (max - min)) * 100;
  const trackH = size === "sm" ? "h-1" : "h-1.5";
  const thumbSize = size === "sm" ? 12 : 16;
  const fillBg = tone === "accent" ? "bg-[var(--color-accent-500)]" : tone === "danger" ? "bg-[var(--color-status-danger-500)]" : "bg-[var(--color-text-primary)]";

  const setFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onValueChange(Math.min(max, Math.max(min, stepped)));
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = value;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next += step;
    else if (e.key === "PageDown") next -= step * 10;
    else if (e.key === "PageUp") next += step * 10;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else return;
    e.preventDefault();
    onValueChange(Math.min(max, Math.max(min, next)));
  };

  return (
    <div className="flex items-center gap-3" aria-disabled={disabled || undefined}>
      <div
        ref={trackRef}
        className={[
          "relative flex-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-sunken)]",
          trackH,
          disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
        ].join(" ")}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setFromPointer(e);
        }}
        onPointerMove={(e) => e.buttons > 0 && setFromPointer(e)}
      >
        <span
          aria-hidden
          className={["absolute left-0 top-0 bottom-0 rounded-[var(--radius-pill)]", fillBg].join(" ")}
          style={{ width: `${pct}%` }}
        />
        <span
          role="slider"
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={valueFormatter?.(value)}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={onKey}
          className={[
            "absolute top-1/2 rounded-full bg-[var(--color-surface-raised)] border-2 border-[var(--color-border-accent)]",
            "shadow-[var(--shadow-elevation-sm)]",
            "outline-none focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
          style={{
            // Position math via inline style.left per AGENTS.md hard rule 12.
            left: `calc(${pct}% - ${thumbSize / 2}px)`,
            top: "50%",
            transform: "translateY(-50%)",
            width: thumbSize,
            height: thumbSize,
            transition: "left var(--motion-duration-fast, 150ms) cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      </div>
      {showValue && (
        <span className="lumen-tnum text-[var(--type-label-sm)] text-[var(--color-text-secondary)] min-w-8 text-right">
          {valueFormatter ? valueFormatter(value) : value}
        </span>
      )}
    </div>
  );
}
