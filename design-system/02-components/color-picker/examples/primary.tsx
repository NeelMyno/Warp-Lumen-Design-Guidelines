// Lumen ColorPicker — Web React example. Swatches variant.

"use client";

import { Check } from "lucide-react";

const DEFAULT_SWATCHES = [
  "#00FA8A", "#0D0D0D", "#E6E6E6", "#FAFAFA",
  "#3B82F6", "#A855F7", "#EC4899", "#F59E0B",
  "#22C55E", "#EF4444", "#06B6D4", "#94A3B8",
];

export function ColorPicker({
  value,
  onValueChange,
  variant = "swatches",
  swatches = DEFAULT_SWATCHES,
  allowAlpha = false,
  ariaLabel = "Color",
}: {
  value: string;
  onValueChange: (v: string) => void;
  variant?: "swatches" | "full";
  swatches?: string[];
  allowAlpha?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-col gap-2">
      {variant === "swatches" && (
        <div className="grid grid-cols-6 gap-1.5">
          {swatches.map((s) => {
            const selected = s.toLowerCase() === value.toLowerCase();
            return (
              <button
                key={s}
                type="button"
                aria-label={`Hex ${s}`}
                aria-pressed={selected}
                onClick={() => onValueChange(s)}
                className={[
                  "relative h-7 w-7 rounded-[var(--radius-control-sm)] border border-[var(--color-border-hairline)]",
                  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
                  selected ? "ring-2 ring-[var(--color-accent-500)]" : "",
                  "transition-shadow duration-[var(--motion-duration-fast)]",
                ].join(" ")}
                style={{ background: s }}
              >
                {selected && (
                  <Check
                    aria-hidden
                    size={12}
                    className="absolute inset-0 m-auto"
                    style={{
                      color: isLight(s) ? "#0D0D0D" : "#FAFAFA",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
      <label className="flex items-center gap-2">
        <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">Hex</span>
        <input
          aria-label="Hex value"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          spellCheck={false}
          className={[
            "flex-1 h-8 px-2 rounded-[var(--radius-control-sm)] border border-[var(--color-border-default)]",
            "bg-[var(--color-surface-sunken)] text-[var(--color-text-primary)] text-[var(--type-label-sm)] font-mono",
            "outline-none focus-visible:shadow-[var(--shadow-focus)] focus-visible:border-[var(--color-accent-500)]",
          ].join(" ")}
        />
      </label>
    </div>
  );
}

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 156;
}
