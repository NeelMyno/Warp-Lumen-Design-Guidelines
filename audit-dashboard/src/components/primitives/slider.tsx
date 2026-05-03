"use client";

import { useId, useState } from "react";

import { Slider as ShadcnSlider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Lumen Slider — Radix-backed shadcn Slider with Lumen's label + value
 * readout layout.
 */

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value: controlled,
  onChange,
  label,
  unit,
  showValue = true,
  id,
}: {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (n: number) => void;
  label?: string;
  unit?: string;
  showValue?: boolean;
  id?: string;
}) {
  const generated = useId();
  const sliderId = id ?? generated;
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? min);
  const value = isControlled ? controlled! : internal;

  function handle(arr: number[]) {
    const n = arr[0];
    if (!isControlled) setInternal(n);
    onChange?.(n);
  }

  return (
    <div className="flex flex-col gap-2">
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-4">
          {label && (
            <Label htmlFor={sliderId} className="text-label-sm text-[var(--text-secondary)]">
              {label}
            </Label>
          )}
          {showValue && (
            /* v0.5: arbitrary-value type — review for semantic preset (mono tabular at 13) */
            <span className="lumen-mono lumen-tnum text-[var(--type-13)] text-[var(--text-primary)]">
              {value}{unit ? <span className="text-[var(--text-tertiary)] ml-1">{unit}</span> : null}
            </span>
          )}
        </div>
      )}
      <ShadcnSlider
        id={sliderId}
        min={min}
        max={max}
        step={step}
        value={isControlled ? [controlled!] : undefined}
        defaultValue={!isControlled ? [internal] : undefined}
        onValueChange={handle}
      />
    </div>
  );
}
