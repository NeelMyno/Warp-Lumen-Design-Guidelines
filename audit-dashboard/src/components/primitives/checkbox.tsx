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

  return (
    <div className="flex items-start gap-2.5">
      <ShadcnCheckbox
        id={cbId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        disabled={disabled}
        className="mt-0.5 shrink-0"
      />
      {(label || description) && (
        <div className="flex flex-col gap-0.5 leading-snug">
          {label && (
            <Label htmlFor={cbId} className="text-label-md text-[var(--text-primary)] cursor-pointer">
              {label}
            </Label>
          )}
          {description && (
            <span className="text-caption text-[var(--text-tertiary)]">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
