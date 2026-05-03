// Lumen Toggle — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/toggle.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Toggle is a switch for binary on/off settings with INSTANT effect — no submit,
// no apply. Distinct from Switch (which is a stateful Radix wrapper) and
// Checkbox (which collects a value to be submitted later).

import { ReactNode, useId } from "react";

type Size = "sm" | "md";

// Track + knob dimensions snap to the 4-grid:
//   sm  → 12 × 20 track, 8 × 8 knob, 4 px inset, 8 px slide.
//   md  → 16 × 28 track, 12 × 12 knob, 4 px inset, 12 px slide.
// (Inset = 20 − 8 − 8 / 28 − 12 − 12. Slide arithmetic stays on the grid.)
const SIZE: Record<Size, { track: string; knob: string; translate: string; label: string }> = {
  sm: {
    track: "h-3 w-5",
    knob: "h-2 w-2",
    translate: "translate-x-2",
    label: "text-[var(--type-label-md)]",
  },
  md: {
    track: "h-4 w-7",
    knob: "h-3 w-3",
    translate: "translate-x-3",
    label: "text-[var(--type-label-md)]",
  },
};

export type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  size?: Size;
  /** Visible label rendered to the right of the toggle. */
  label?: string;
  /** Optional one-line description below the label. */
  description?: string;
  /** When no visible label, supply aria-label for screen readers. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  id?: string;
  className?: string;
  children?: ReactNode;
};

export function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  className,
  id,
  children,
  ...aria
}: ToggleProps) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  const descriptionId = description ? `${toggleId}-desc` : undefined;
  const dims = SIZE[size];

  return (
    <div className={["inline-flex items-start gap-3", className ?? ""].join(" ")}>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-describedby={descriptionId ?? aria["aria-describedby"]}
        aria-label={aria["aria-label"]}
        aria-labelledby={aria["aria-labelledby"]}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          "relative inline-flex shrink-0 items-center rounded-[var(--radius-pill)]",
          "border border-[var(--color-border-strong)]",
          "transition-colors duration-[var(--motion-transition-fast)] ease-[var(--motion-easing-standard)]",
          "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          dims.track,
          checked
            ? "bg-[var(--color-accent-500)] border-transparent"
            : "bg-[var(--color-surface-raised)]",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={[
            "inline-block rounded-[var(--radius-pill)] bg-white shadow-[var(--shadow-xs)]",
            "transition-transform duration-[var(--motion-transition-fast)] ease-[var(--motion-easing-standard)]",
            "ml-1",
            dims.knob,
            checked ? dims.translate : "translate-x-0",
          ].join(" ")}
        />
      </button>
      {(label || description || children) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <label
              htmlFor={toggleId}
              className={[
                dims.label,
                "text-[var(--color-text-primary)] cursor-pointer select-none",
                disabled ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              {label}
            </label>
          )}
          {description && (
            <span
              id={descriptionId}
              className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]"
            >
              {description}
            </span>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
