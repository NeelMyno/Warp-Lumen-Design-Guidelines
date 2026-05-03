// Lumen NumberInput — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/number-input.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
  "aria-label"?: string;
};

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
  size = "md",
  disabled,
  name,
  ...rest
}: NumberInputProps) {
  const inputId = useId();
  const atMin = value <= min;
  const atMax = value >= max;

  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  const stepperClass =
    "h-full inline-flex items-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      className="lumen-field"
      data-mono="true"
      data-size={size === "md" ? undefined : size}
      data-disabled={disabled ? "true" : undefined}
      style={{ paddingInline: 0 }}
    >
      <button
        type="button"
        data-interactive
        onClick={dec}
        disabled={disabled || atMin}
        aria-label="Decrement"
        aria-controls={inputId}
        className={cn(stepperClass, "rounded-l-[var(--radius-control-md)]")}
        style={{
          paddingInline: "var(--space-3)",
          color: "var(--color-text-secondary)",
        }}
      >
        <Minus size={12} aria-hidden />
      </button>

      <input
        id={inputId}
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
        onBlur={(e) => {
          const next = Math.min(Math.max(Number(e.target.value), min), max);
          if (Number.isFinite(next)) onChange(next);
        }}
        min={min}
        max={max}
        step={step}
        name={name}
        disabled={disabled}
        className="text-center tabular-nums"
        style={{
          fontVariantNumeric: "tabular-nums lining-nums",
        }}
        {...rest}
      />

      {suffix && (
        <span
          data-slot="addon"
          aria-hidden
          className="text-micro font-mono"
          style={{
            color: "var(--color-text-tertiary)",
            textTransform: "uppercase",
          }}
        >
          {suffix}
        </span>
      )}

      <button
        type="button"
        data-interactive
        onClick={inc}
        disabled={disabled || atMax}
        aria-label="Increment"
        aria-controls={inputId}
        className={cn(stepperClass, "rounded-r-[var(--radius-control-md)]")}
        style={{
          paddingInline: "var(--space-3)",
          color: "var(--color-text-secondary)",
        }}
      >
        <Plus size={12} aria-hidden />
      </button>
    </div>
  );
}
