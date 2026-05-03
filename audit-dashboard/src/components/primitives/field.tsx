"use client";

import { ReactNode, InputHTMLAttributes, useId } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Lumen Field — composed form field that bundles shadcn's Label + Input
 * with the Lumen description / hint / error / leading-trailing addon
 * scaffold. Preserves the prior Lumen API; consumer pages keep using
 * `<Field label hint error leadingIcon trailingAddon>` exactly as before.
 */

type Size = "sm" | "md" | "lg";
/* v0.5: Field size ramp uses raw type tokens — input text sizes intentionally don't snap to body presets. */
const SIZE_INPUT_CLS: Record<Size, string> = {
  sm: "h-8  text-[var(--type-13)] px-3",
  md: "h-10 text-[var(--type-14)] px-3",
  lg: "h-12 text-[var(--type-15)] px-4",
};

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "children"> & {
  label?: string;
  description?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  required?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  trailingAddon?: ReactNode;
  size?: Size;
  mono?: boolean;
  /** Custom control. When present, replaces the built-in <Input> and chrome. */
  children?: ReactNode;
};

export function Field({
  label, description, error, hint, optional, required,
  leadingIcon, trailingIcon, trailingAddon, size = "md", mono,
  id, className, children, ...input
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpId = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-label-sm text-[var(--text-secondary)]">
          {label}
          {/* v0.5: arbitrary-value type — review for semantic preset (12 plain optional flag) */}
          {optional && <span className="text-[var(--text-tertiary)] text-[var(--type-12)] font-normal ml-1">(optional)</span>}
          {required && <span aria-hidden className="text-[var(--lumen-red-5)] ml-0.5">*</span>}
        </Label>
      )}
      {description && (
        /* v0.5: arbitrary-value type — review for semantic preset (12 plain helper) */
        <p className="text-[var(--type-12)] text-[var(--text-tertiary)] -mt-0.5 leading-snug">
          {description}
        </p>
      )}
      {children ? (
        <div className="min-w-0">{children}</div>
      ) : leadingIcon || trailingIcon || trailingAddon ? (
        // Composed shell when icon/addon slots are used. Wraps the shadcn
        // Input but adds the leading/trailing affordances Lumen ships with.
        <div
          className={cn(
            "relative flex items-center rounded-[var(--radius-md)] bg-[var(--surface-raised)] border transition-[border-color,box-shadow]",
            error
              ? "border-[var(--lumen-red-5)] focus-within:shadow-[0_0_0_3.5px_rgba(237,94,94,0.20)]"
              : "border-[var(--border-default)] hover:border-[var(--border-strong)] focus-within:border-[var(--border-focus)] focus-within:shadow-[var(--shadow-focus)]",
          )}
        >
          {leadingIcon && (
            <span aria-hidden className="pl-3 text-[var(--text-tertiary)] flex items-center">{leadingIcon}</span>
          )}
          <input
            id={inputId}
            aria-invalid={!!error || undefined}
            aria-describedby={helpId}
            required={required}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] file:text-[var(--text-primary)]",
              SIZE_INPUT_CLS[size],
              mono && "lumen-mono lumen-tnum",
              leadingIcon && "!pl-2",
              (trailingIcon || trailingAddon) && "!pr-2",
            )}
            {...input}
          />
          {trailingIcon && (
            <span aria-hidden className="pr-3 text-[var(--text-tertiary)] flex items-center">{trailingIcon}</span>
          )}
          {trailingAddon && (
            /* v0.5: arbitrary-value type — review for semantic preset (mono regular at 12) */
            <span className="pr-2 text-[var(--type-12)] text-[var(--text-tertiary)] lumen-mono">{trailingAddon}</span>
          )}
        </div>
      ) : (
        // No icons/addons — use the bare shadcn Input.
        <Input
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={helpId}
          required={required}
          className={cn(
            SIZE_INPUT_CLS[size],
            mono && "lumen-mono lumen-tnum",
          )}
          {...input}
        />
      )}
      {error ? (
        /* v0.5: arbitrary-value type — review for semantic preset (12 plain error) */
        <p id={helpId} role="alert" className="text-[var(--type-12)] text-[var(--lumen-red-6)] mt-0.5">{error}</p>
      ) : hint ? (
        /* v0.5: arbitrary-value type — review for semantic preset (12 plain hint) */
        <p id={helpId} className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
}
