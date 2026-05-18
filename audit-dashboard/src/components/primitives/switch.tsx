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

  return (
    <div className="inline-flex items-start gap-3">
      <ShadcnSwitch
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-1 shrink-0"
        aria-label={!label && !ariaLabelledBy ? (ariaLabel ?? "Toggle") : ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      {(label || description) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <Label htmlFor={switchId} className="text-label-md text-[color:var(--text-primary)] cursor-pointer">
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
