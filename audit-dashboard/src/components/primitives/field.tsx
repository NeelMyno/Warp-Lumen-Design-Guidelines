"use client";

import { ReactNode, InputHTMLAttributes, useId } from "react";

type Size = "sm" | "md" | "lg";
/* Heights track Button — 8pt soft grid (32 / 40 / 48). */
const SIZES: Record<Size, string> = {
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
  /** Custom control. When present, replaces the built-in <input> and the
   *  bordered chrome — bring your own styled control (TextInput, Select,
   *  Combobox, Textarea, etc). The label, hint, and error still wrap it. */
  children?: ReactNode;
};

/**
 * Composed form field. Two modes:
 * - Default: renders a built-in styled <input> (label · helper · error · slots).
 * - With children: renders the children verbatim under the label/hint scaffold.
 */
export function Field({
  label, description, error, hint, optional, required,
  leadingIcon, trailingIcon, trailingAddon, size = "md", mono,
  id, className, children, ...input
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpId = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className={["flex flex-col gap-1.5", className ?? ""].join(" ")}>
      {label && (
        <label htmlFor={inputId} className="flex items-center gap-1.5 text-[var(--type-13)] font-medium text-[var(--text-secondary)]">
          {label}
          {optional && <span className="text-[var(--text-tertiary)] text-[var(--type-12)] font-normal">(optional)</span>}
          {required && <span aria-hidden className="text-[var(--lumen-red-5)]">*</span>}
        </label>
      )}
      {description && (
        <p className="text-[var(--type-12)] text-[var(--text-tertiary)] -mt-0.5 leading-snug">
          {description}
        </p>
      )}
      {children ? (
        <div className="min-w-0">{children}</div>
      ) : (
        <div
          className={[
            "relative flex items-center rounded-[var(--radius-md)] bg-[var(--surface-raised)]",
            "border transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
            error
              ? "border-[var(--lumen-red-5)] focus-within:border-[var(--lumen-red-6)] focus-within:shadow-[0_0_0_3.5px_rgba(237,94,94,0.20)]"
              : "border-[var(--border-default)] hover:border-[var(--border-strong)] focus-within:border-[var(--color-accent)] focus-within:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        >
          {leadingIcon && (
            <span aria-hidden className="pl-3 text-[var(--text-tertiary)] flex items-center">{leadingIcon}</span>
          )}
          <input
            id={inputId}
            aria-invalid={!!error || undefined}
            aria-describedby={helpId}
            required={required}
            className={[
              "flex-1 min-w-0 bg-transparent outline-none placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)]",
              SIZES[size],
              mono ? "lumen-mono lumen-tnum" : "",
              leadingIcon ? "!pl-2" : "",
              trailingIcon || trailingAddon ? "!pr-2" : "",
            ].join(" ")}
            {...input}
          />
          {trailingIcon && (
            <span aria-hidden className="pr-3 text-[var(--text-tertiary)] flex items-center">{trailingIcon}</span>
          )}
          {trailingAddon && (
            <span className="pr-2 text-[var(--type-12)] text-[var(--text-tertiary)] lumen-mono">{trailingAddon}</span>
          )}
        </div>
      )}
      {error ? (
        <p id={helpId} role="alert" className="text-[var(--type-12)] text-[var(--lumen-red-6)] mt-0.5">{error}</p>
      ) : hint ? (
        <p id={helpId} className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
}
