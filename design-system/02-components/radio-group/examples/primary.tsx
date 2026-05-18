// Lumen RadioGroup — Web React example (v0.6)
// Native radio inputs composed inside .lumen-radio visual primitives.
// Native input gives screen readers correct semantics (radiogroup +
// member checked-state) and free arrow-key navigation.

import { ReactNode } from "react";

export type RadioProps = {
  checked?: boolean;
  onChange?: () => void;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
  name?: string;
  value?: string;
};

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled,
  name,
  value,
}: RadioProps) {
  return (
    <label
      className={[
        "flex items-start gap-inline-sm cursor-pointer select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {/* v0.12.7 — switch to uncontrolled mode when no onChange handler
       *  supplied. Otherwise React warns "checked prop without onChange"
       *  for showcase / static usages. Radios can't take readOnly, so the
       *  only options are (a) a no-op handler — which silently absorbs
       *  keyboard clicks — or (b) defaultChecked. (b) is correct. */}
      <input
        type="radio"
        {...(onChange ? { checked, onChange } : { defaultChecked: checked })}
        disabled={disabled}
        name={name}
        value={value}
        className="peer sr-only"
        aria-checked={checked}
      />
      <span
        className="lumen-radio mt-[1px]"
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "true" : undefined}
        aria-hidden
      />
      <span className="min-w-0 leading-snug">
        <span className="block text-body-sm text-[color:var(--text-primary)]">
          {label}
        </span>
        {description && (
          <span className="block text-caption text-[color:var(--text-tertiary)] mt-1">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export function RadioGroup({
  children,
  label,
  description,
}: {
  children: ReactNode;
  label?: string;
  description?: ReactNode;
}) {
  return (
    <fieldset
      className="border-0 p-0 m-0 flex flex-col gap-stack-sm"
      role="radiogroup"
    >
      {label && (
        <legend className="text-label-md text-[color:var(--text-primary)] mb-1">
          {label}
        </legend>
      )}
      {description && (
        <p className="text-caption text-[color:var(--text-tertiary)] -mt-1">
          {description}
        </p>
      )}
      {children}
    </fieldset>
  );
}

// Usage:
//
//   <RadioGroup label="Rate type">
//     <Radio name="rate" value="contract" label="Contract rate" description="$0.18/mi · 14-day SLA" checked />
//     <Radio name="rate" value="spot" label="Spot rate" description="Live market · 24-hour SLA" />
//     <Radio name="rate" value="custom" label="Custom" description="Carrier negotiation" />
//   </RadioGroup>
