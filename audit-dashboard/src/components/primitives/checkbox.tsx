"use client";

import { useId } from "react";

import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * Lumen Checkbox — wraps the Radix-backed shadcn Checkbox with the
 * Lumen label + description layout. API preserved from prior version.
 */
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
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  /* v0.13.1 R5-006 — accept aria-label / aria-labelledby for callers that
     compose their own visible label outside the primitive (label-elsewhere
     pattern). Without this prop, Radix Checkbox ships nameless and screen
     readers announce "checkbox, unchecked" with no context. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const generatedId = useId();
  const cbId = id ?? generatedId;
  const labelId = `${cbId}-label`;

  /* v0.13.2 — when `label` is provided, wire aria-labelledby to the Label's id.
     The Radix-backed shadcn Checkbox renders a <button role="checkbox">; HTML's
     implicit-label-via-htmlFor association does NOT propagate the accessible
     name to a button-role element (only to native form inputs), so the visible
     <Label htmlFor={cbId}> was rendering but the button stayed nameless. R5
     fixed this for the SwitchRow pattern in library/client.tsx by passing
     aria-labelledby explicitly; R6 caught that the in-primitive `label` prop
     had the same bug — foundations/page.tsx renders <Checkbox label="…" /> and
     the resulting button was nameless. Resolution: when label is provided AND
     no explicit aria-* override is given, default aria-labelledby to the
     generated labelId. */
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (label ? labelId : undefined);
  const resolvedAriaLabel =
    !label && !resolvedAriaLabelledBy ? (ariaLabel ?? "Toggle") : ariaLabel;

  return (
    <div className="flex items-start gap-inline-sm">
      <ShadcnCheckbox
        id={cbId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        disabled={disabled}
        className="mt-1 shrink-0"
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
      />
      {(label || description) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <Label id={labelId} htmlFor={cbId} className="text-label-md text-[color:var(--text-primary)] cursor-pointer">
              {label}
            </Label>
          )}
          {description && (
            <span className="text-caption text-[color:var(--text-tertiary)]">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
