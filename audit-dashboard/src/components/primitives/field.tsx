"use client";

import { ReactNode, InputHTMLAttributes, useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Lumen Field — composed form field that bundles label + description + control
 * shell + hint/error in one vertical stack. v0.6 rewrite: the control shell is
 * now the SINGLE focus surface, painting exactly one ring via :has(:focus-visible).
 * Leading icon, trailing icon, and trailing addon are siblings inside the shell
 * — bonded under the same focus boundary by construction.
 *
 * The CSS recipes live in globals.css under "v0.6 — FORMS & INPUT FIELDS".
 * Component contract: design-system/02-components/field/component.{md,json}.
 */

type Size = "sm" | "md" | "lg";

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "children"> & {
  /** Visible field label. Always render unless `aria-label` is set on the input. */
  label?: string;
  /** Description text shown beneath the label, above the control. */
  description?: string;
  /** Error message shown beneath the control. Sets aria-invalid + role=alert. */
  error?: string;
  /** Hint message shown beneath the control. Mutually exclusive with `error`. */
  hint?: string;
  /** Render `(optional)` next to the label. NN/g preferred over the asterisk pattern. */
  optional?: boolean;
  /** Render the required asterisk + sets aria-required on the input. */
  required?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Trailing unit chip (lb / STD / %). Renders mono uppercase. */
  trailingAddon?: ReactNode;
  size?: Size;
  /** Render value in JetBrains Mono with tabular numerics. For IDs / ZIPs / codes. */
  mono?: boolean;
  /** Custom control. When present, replaces the built-in <input>. The wrapper still owns focus. */
  children?: ReactNode;
};

export function Field({
  label, description, error, hint, optional, required,
  leadingIcon, trailingIcon, trailingAddon, size = "md", mono,
  id, className, disabled, readOnly, children, ...input
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpId = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn("lumen-form-field", className)}>
      {label && (
        <label htmlFor={inputId} className="lumen-form-field__label">
          {label}
          {optional && <span className="lumen-form-field__optional">(optional)</span>}
          {required && <span aria-hidden className="lumen-form-field__required">*</span>}
        </label>
      )}
      {description && (
        <p className="lumen-form-field__description">{description}</p>
      )}
      {children ? (
        // Custom control replaces the entire shell. Consumer is responsible for
        // wrapping in .lumen-field if they want the focus shell behavior.
        <div className="min-w-0">{children}</div>
      ) : (
        <div
          className="lumen-field"
          data-size={size === "md" ? undefined : size}
          data-mono={mono ? "true" : undefined}
          data-invalid={error ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          aria-readonly={readOnly ? "true" : undefined}
          // Click anywhere on the shell focuses the input — including padding,
          // slot icons, and the trailing addon. Required because slots are
          // pointer-events: none so they fall through, but we want clicks on
          // the addon to behave like clicks on the field.
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              const inp = e.currentTarget.querySelector("input");
              inp?.focus();
            }
          }}
        >
          {leadingIcon && (
            <span data-slot="leading" aria-hidden>{leadingIcon}</span>
          )}
          <input
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-required={required ? "true" : undefined}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={helpId}
            {...input}
          />
          {trailingIcon && (
            <span data-slot="trailing" aria-hidden>{trailingIcon}</span>
          )}
          {trailingAddon && (
            <span data-slot="addon">{trailingAddon}</span>
          )}
        </div>
      )}
      {error ? (
        <p id={helpId} role="alert" className="lumen-form-field__error">{error}</p>
      ) : hint ? (
        <p id={helpId} className="lumen-form-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
