// Lumen Checkbox — Web React example (v0.6, Radix-backed)
// Wraps a Radix Checkbox primitive with Lumen's label + description layout.
//
// v0.13.1 — accepts aria-label / aria-labelledby for callers that compose
// their own visible label outside the primitive (label-elsewhere pattern,
// e.g. compact row in a settings panel). Without either prop AND without
// a `label` prop, the underlying Radix button ships nameless and screen
// readers announce "checkbox, unchecked" with no context.

import { useId, ReactNode } from "react";
import { Checkbox as RadixCheckbox } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  label?: string;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  disabled,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: CheckboxProps) {
  const generatedId = useId();
  const cbId = id ?? generatedId;

  return (
    <div className="flex items-start gap-inline-sm">
      <RadixCheckbox
        id={cbId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        disabled={disabled}
        className="lumen-checkbox mt-1 shrink-0"
        aria-label={!label && !ariaLabelledBy ? (ariaLabel ?? "Toggle") : ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <Check size={12} aria-hidden />
      </RadixCheckbox>
      {(label || description) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <label
              htmlFor={cbId}
              className="text-label-md text-[color:var(--text-primary)] cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-caption text-[color:var(--text-tertiary)]">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Usage (label-inside, common case):
//
//   <Checkbox
//     label="Email me when carrier accepts"
//     description="One email per accepted quote, none for rejections."
//     defaultChecked
//   />
//
// Usage (label-elsewhere, settings row):
//
//   <span className="flex items-center gap-2">
//     <Checkbox aria-labelledby="row-1" />
//     <span id="row-1" className="text-body-xs">Slack · Sterling LTL channel</span>
//   </span>
