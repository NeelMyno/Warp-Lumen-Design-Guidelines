"use client";

import { useId } from "react";

import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Lumen Switch — wraps the Radix-backed shadcn Switch with Lumen's
 * label + description layout. Preserves the existing Lumen API.
 */

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
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";   /* kept for backward-compat; shadcn switch is one size */
  label?: string;
  description?: string;
  id?: string;
  /* v0.13.1 R5-006 — accept aria-label / aria-labelledby for callers that
     compose their own visible label (e.g. SwitchRow in /library showcase).
     If neither label nor aria-* is supplied, Radix Switch ships nameless
     and screen readers announce "switch, on" with no context. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const labelId = `${switchId}-label`;

  /* v0.13.2 — when `label` is provided, wire aria-labelledby to the Label's id.
     The Radix-backed shadcn Switch renders a <button role="switch">; HTML's
     implicit-label-via-htmlFor association does NOT propagate the accessible
     name to a button-role element (only to native form inputs), so the visible
     <Label htmlFor={switchId}> was rendering but the button stayed nameless.
     R5 fixed this for the SwitchRow pattern in library/client.tsx by passing
     aria-labelledby explicitly; R6 caught that the in-primitive `label` prop
     had the same bug — foundations/page.tsx renders <Switch label="…" /> and
     the resulting button was nameless. Resolution: when label is provided AND
     no explicit aria-* override is given, default aria-labelledby to the
     generated labelId. */
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (label ? labelId : undefined);
  const resolvedAriaLabel =
    !label && !resolvedAriaLabelledBy ? (ariaLabel ?? "Toggle") : ariaLabel;

  return (
    <div className="inline-flex items-start gap-3">
      <ShadcnSwitch
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-1 shrink-0"
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
      />
      {(label || description) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <Label id={labelId} htmlFor={switchId} className="text-label-md text-[color:var(--text-primary)] cursor-pointer">
              {label}
            </Label>
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
