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
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";   /* kept for backward-compat; shadcn switch is one size */
  label?: string;
  description?: string;
  id?: string;
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
