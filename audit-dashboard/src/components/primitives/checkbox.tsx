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

  return (
    <div className="flex items-start gap-inline-sm">
      <ShadcnCheckbox
        id={cbId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        disabled={disabled}
        className="mt-1 shrink-0"
        aria-label={!label && !ariaLabelledBy ? (ariaLabel ?? "Toggle") : ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      {(label || description) && (
        <div className="flex flex-col gap-1 leading-snug">
          {label && (
            <Label htmlFor={cbId} className="text-label-md text-[color:var(--text-primary)] cursor-pointer">
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
