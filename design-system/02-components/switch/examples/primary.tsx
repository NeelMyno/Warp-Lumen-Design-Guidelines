// Lumen Switch — Web React example (v0.6, Radix-backed)
//
// Wraps Radix Switch with Lumen's label + description layout.
//
// v0.13.1 — accepts aria-label / aria-labelledby for callers that compose
// their own visible label outside the primitive (label-elsewhere pattern,
// e.g. row in a notifications panel). Without either prop AND without
// a `label` prop, the underlying Radix button ships nameless. The
// implicit "wrap in <label>" pattern DOES NOT work for Radix Switch
// because Radix renders a `<button role="switch">` and HTML's
// implicit-label association breaks on role-overridden buttons.

import { useId, ReactNode } from "react";
import { Switch as RadixSwitch } from "@radix-ui/react-switch";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  description,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <div className="inline-flex items-start gap-3">
      <RadixSwitch
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="lumen-switch mt-1 shrink-0"
        aria-label={!label && !ariaLabelledBy ? (ariaLabel ?? "Toggle") : ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      {(label || description) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <label
              htmlFor={switchId}
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
//   <Switch
//     label="Auto-save"
//     description="Saves quote drafts every 12 seconds."
//     defaultChecked
//   />
//
// Usage (label-elsewhere, settings row — v0.13.1 a11y-correct pattern):
//
//   const labelId = useId();
//   return (
//     <span className="flex items-center gap-2">
//       <Switch aria-labelledby={labelId} />
//       <span id={labelId} className="text-body-xs">
//         Email · daily digest
//       </span>
//     </span>
//   );
