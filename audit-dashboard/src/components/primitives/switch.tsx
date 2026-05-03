"use client";

import { useId, useState } from "react";

type Size = "sm" | "md";
const SIZES = {
  sm: { track: "h-4 w-7",  knob: "h-3 w-3",   slide: 12 },
  md: { track: "h-5 w-9",  knob: "h-4 w-4",   slide: 16 },
};

export function Switch({
  checked: controlled,
  defaultChecked,
  onCheckedChange,
  disabled,
  size = "md",
  label,
  description,
  id,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: Size;
  label?: string;
  description?: string;
  id?: string;
}) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const checked = isControlled ? controlled : internal;
  const s = SIZES[size];

  function toggle() {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }

  return (
    <label
      htmlFor={switchId}
      className={[
        "inline-flex items-start gap-3 cursor-pointer select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={toggle}
        className={[
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
          "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
          s.track,
          checked ? "bg-[var(--color-accent)]" : "bg-[var(--border-strong)]",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={[
            "absolute left-0.5 rounded-full bg-white shadow-[var(--shadow-sm)]",
            "transition-transform duration-[var(--motion-fast)] ease-[var(--easing-spring-soft)]",
            s.knob,
          ].join(" ")}
          style={{ transform: checked ? `translateX(${s.slide}px)` : "translateX(0)" }}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col gap-0.5 -mt-0.5 leading-snug">
          {label && (
            <span className="text-[var(--type-14)] font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[var(--type-12)] text-[var(--text-tertiary)]">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
