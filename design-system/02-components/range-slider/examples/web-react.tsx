// Lumen RangeSlider — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/range-slider.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import { type ChangeEvent } from "react";

// One Range = single number; two Ranges = [low, high] tuple.
type SingleProps = {
  mode?: "single";
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
};
type DualProps = {
  mode: "dual";
  value: [number, number];
  onChange: (value: [number, number]) => void;
  ariaLabel?: string;
  ariaLabelHigh?: string;
};

export type RangeSliderProps = (SingleProps | DualProps) & {
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  disabled?: boolean;
  name?: string;
};

const THUMB_TWS =
  "appearance-none bg-transparent pointer-events-auto " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white " +
  "[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--color-border-strong)] " +
  "[&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)] [&::-webkit-slider-thumb]:cursor-grab " +
  "active:[&::-webkit-slider-thumb]:cursor-grabbing " +
  "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[var(--color-border-strong)] " +
  "[&::-moz-range-thumb]:shadow-[var(--shadow-sm)] [&::-moz-range-thumb]:cursor-grab " +
  "focus-visible:[&::-webkit-slider-thumb]:shadow-[var(--shadow-focus)] " +
  "focus-visible:outline-none";

export function RangeSlider(props: RangeSliderProps) {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const fmt = props.format ?? ((n) => `${n}`);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  if (props.mode === "dual") {
    const [low, high] = props.value;
    const onLow = (e: ChangeEvent<HTMLInputElement>) => {
      const v = Math.min(Number(e.target.value), high);
      props.onChange([v, high]);
    };
    const onHigh = (e: ChangeEvent<HTMLInputElement>) => {
      const v = Math.max(Number(e.target.value), low);
      props.onChange([low, v]);
    };
    return (
      <div
        className="w-full"
        aria-disabled={props.disabled || undefined}
        style={{ opacity: props.disabled ? 0.5 : undefined }}
      >
        <div className="relative h-6 flex items-center">
          <div
            className="absolute inset-x-0 h-1 rounded-full"
            style={{ background: "var(--color-surface-sunken)" }}
          />
          <div
            className="absolute h-1 rounded-full"
            style={{
              left: `${pct(low)}%`,
              right: `${100 - pct(high)}%`,
              background: "var(--color-accent-500)",
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={low}
            onChange={onLow}
            disabled={props.disabled}
            aria-label={props.ariaLabel ?? "Minimum"}
            className={`absolute inset-0 w-full ${THUMB_TWS}`}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={high}
            onChange={onHigh}
            disabled={props.disabled}
            aria-label={props.ariaLabelHigh ?? "Maximum"}
            className={`absolute inset-0 w-full ${THUMB_TWS}`}
          />
        </div>
        <div
          className="mt-1 flex justify-between text-overline"
          style={{
            color: "var(--color-text-tertiary)",
          }}
        >
          <span>{fmt(low)}</span>
          <span>{fmt(high)}</span>
        </div>
        {props.name && (
          <input
            type="hidden"
            name={props.name}
            value={`${low},${high}`}
          />
        )}
      </div>
    );
  }

  // single
  const v = props.value;
  return (
    <div
      className="w-full"
      aria-disabled={props.disabled || undefined}
      style={{ opacity: props.disabled ? 0.5 : undefined }}
    >
      <div className="relative h-6 flex items-center">
        <div
          className="absolute inset-x-0 h-1 rounded-full"
          style={{ background: "var(--color-surface-sunken)" }}
        />
        <div
          className="absolute h-1 rounded-full"
          style={{
            left: 0,
            width: `${pct(v)}%`,
            background: "var(--color-accent-500)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          onChange={(e) => props.onChange(Number(e.target.value))}
          disabled={props.disabled}
          aria-label={props.ariaLabel}
          className={`absolute inset-0 w-full ${THUMB_TWS}`}
        />
      </div>
      <div
        className="mt-1 flex justify-between text-overline"
        style={{
          color: "var(--color-text-tertiary)",
        }}
      >
        <span>{fmt(min)}</span>
        <span>{fmt(v)}</span>
        <span>{fmt(max)}</span>
      </div>
      {props.name && (
        <input type="hidden" name={props.name} value={String(v)} />
      )}
    </div>
  );
}
