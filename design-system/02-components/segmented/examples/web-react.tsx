// Lumen Segmented — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/segmented.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import {
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from "react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type SegmentedOption = {
  label: string;
  value: string;
  icon?: ReactNode;
  ariaLabel?: string;
};

export type SegmentedProps = {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedOption[];
  size?: "sm" | "md";
  disabled?: boolean;
  ariaLabel?: string;
};

export function Segmented({
  value,
  onChange,
  options,
  size = "sm",
  disabled,
  ariaLabel,
}: SegmentedProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const idx = options.findIndex((o) => o.value === value);

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (idx - 1 + options.length) % options.length;
      onChange(options[next].value);
      refs.current[next]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % options.length;
      onChange(options[next].value);
      refs.current[next]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(options[0].value);
      refs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = options.length - 1;
      onChange(options[last].value);
      refs.current[last]?.focus();
    }
  }

  const barHeight = size === "md" ? 40 : 32;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className="inline-flex items-center"
      style={{
        height: barHeight,
        // 4 px inset on every side keeps the active thumb on the 4-grid
        // (sm bar 32 → 24 thumb; md bar 40 → 32 thumb).
        padding: "var(--space-1)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-surface-sunken)",
        border: "1px solid var(--color-border-hairline, var(--color-border-default))",
        opacity: disabled ? 0.5 : undefined,
      }}
    >
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={onKey}
            disabled={disabled}
            aria-pressed={active}
            aria-label={o.ariaLabel ?? (typeof o.label === "string" ? undefined : o.value)}
            className={cn(
              "inline-flex items-center justify-center transition-[background,color,box-shadow] disabled:cursor-not-allowed text-label-sm",
            )}
            style={{
              height: barHeight - 8,
              paddingInline: "var(--space-3)",
              borderRadius: "var(--radius-sm)",
              gap: "var(--space-1)",
              background: active
                ? "var(--color-surface-raised)"
                : "transparent",
              color: active
                ? "var(--color-text-primary)"
                : "var(--color-text-tertiary)",
              boxShadow: active ? "var(--shadow-xs)" : undefined,
              transitionDuration: "var(--motion-duration-fast)",
              transitionTimingFunction: "var(--motion-easing-standard)",
            }}
          >
            {o.icon && <span aria-hidden>{o.icon}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
