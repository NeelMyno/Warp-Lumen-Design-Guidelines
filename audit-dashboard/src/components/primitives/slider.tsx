"use client";

import { ChangeEvent, useId, useState } from "react";

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
  const pct = ((value - min) / (max - min)) * 100;

  function handle(e: ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value);
    if (!isControlled) setInternal(n);
    onChange?.(n);
  }

  return (
    <div className="flex flex-col gap-2">
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-4">
          {label && (
            <label htmlFor={sliderId} className="text-[var(--type-13)] font-medium text-[var(--text-secondary)]">
              {label}
            </label>
          )}
          {showValue && (
            <span className="lumen-mono lumen-tnum text-[var(--type-13)] text-[var(--text-primary)]">
              {value}{unit ? <span className="text-[var(--text-tertiary)] ml-0.5">{unit}</span> : null}
            </span>
          )}
        </div>
      )}
      <div className="relative h-5 flex items-center">
        <span aria-hidden className="absolute inset-x-0 h-[3px] rounded-full bg-[var(--border-default)]" />
        <span aria-hidden className="absolute left-0 h-[3px] rounded-full bg-[var(--color-accent)]" style={{ width: `${pct}%` }} />
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handle}
          className="lumen-slider absolute inset-0 w-full appearance-none bg-transparent focus-visible:outline-none"
        />
      </div>
      <style>{`
        .lumen-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 9999px;
          background: #fff; border: 1.5px solid var(--color-accent);
          box-shadow: 0 1px 2px rgba(0,0,0,0.18), 0 0 0 4px rgba(74,222,128,0);
          cursor: pointer; transition: box-shadow 140ms;
        }
        .lumen-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 1px 2px rgba(0,0,0,0.18), 0 0 0 5px var(--lumen-accent-a32);
        }
        .lumen-slider::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 9999px;
          background: #fff; border: 1.5px solid var(--color-accent); cursor: pointer;
        }
      `}</style>
    </div>
  );
}
