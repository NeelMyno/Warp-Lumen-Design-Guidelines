"use client";

import { ChangeEvent, useId, useState } from "react";
import { Check } from "./icon";

export function Checkbox({
  checked: controlled,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  disabled,
  id,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}) {
  const generatedId = useId();
  const cbId = id ?? generatedId;
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const checked = isControlled ? controlled : internal;

  function handle(e: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternal(e.target.checked);
    onCheckedChange?.(e.target.checked);
  }

  return (
    <label
      htmlFor={cbId}
      className={[
        "flex items-start gap-2.5 cursor-pointer select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <span className="relative inline-flex shrink-0 items-center justify-center" style={{ marginTop: 2 }}>
        <input
          id={cbId}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={handle}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={[
            "h-[18px] w-[18px] rounded-[5px] border transition-colors duration-[var(--motion-fast)]",
            "peer-focus-visible:shadow-[var(--shadow-focus)]",
            checked
              ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
              : "bg-[var(--surface-raised)] border-[var(--border-strong)]",
          ].join(" ")}
        />
        {checked && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[var(--text-on-accent)]"
          >
            <Check size={12} />
          </span>
        )}
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5 leading-snug">
          {label && (
            <span className="text-[var(--type-14)] text-[var(--text-primary)]">{label}</span>
          )}
          {description && (
            <span className="text-[var(--type-12)] text-[var(--text-tertiary)]">{description}</span>
          )}
        </span>
      )}
    </label>
  );
}
