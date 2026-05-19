"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  InputHTMLAttributes,
  useId,
  forwardRef,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Lumen Field — composed form field that bundles label + description + control
 * shell + hint/error in one vertical stack. v0.6 rewrite: the control shell is
 * now the SINGLE focus surface, painting exactly one ring via :has(:focus-visible).
 * Leading icon, trailing icon, and trailing addon are siblings inside the shell
 * — bonded under the same focus boundary by construction.
 *
 * v0.7 forwarding: the inner <input> ref is forwarded so RHF's
 * Controller.render({ field: { ref } }) can wire up focus-on-first-invalid.
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
  /** Render value with tabular numerics + slashed-zero (Satoshi tnum). For IDs / ZIPs / codes. */
  mono?: boolean;
  /** Custom control. When present, replaces the built-in <input>. The wrapper still owns focus. */
  children?: ReactNode;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  {
    label, description, error, hint, optional, required,
    leadingIcon, trailingIcon, trailingAddon, size = "md", mono,
    id, className, disabled, readOnly, children, ...input
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = label ? `${inputId}-label` : undefined;
  const helpId = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;

  /* v0.13.2 — children pattern (`<Field label="X"><TextInput /></Field>`) was
     dropping the htmlFor→id linkage because the inner TextInput renders its
     own <input> with its own id (not the inputId on the Field's <label>).
     Result: the visible label rendered correctly but the input was nameless
     to screen readers. Fix: when children are provided AND label exists, clone
     the first child and inject aria-labelledby + id pointing at the Field's
     labelId / inputId. For composite children (fragments, multiple children),
     the clone applies to the first valid React element only — the consumer
     remains responsible for nested controls. */
  let renderedChildren: ReactNode = children;
  if (children && label) {
    const arr = Children.toArray(children);
    if (arr.length === 1 && isValidElement(arr[0])) {
      const child = arr[0] as ReactElement<Record<string, unknown>>;
      renderedChildren = cloneElement(child, {
        id: (child.props.id as string) ?? inputId,
        "aria-labelledby": (child.props["aria-labelledby"] as string) ?? labelId,
        "aria-describedby": (child.props["aria-describedby"] as string) ?? helpId,
        "aria-invalid": child.props["aria-invalid"] ?? (error ? true : undefined),
      });
    }
  }

  return (
    <div className={cn("lumen-form-field", className)}>
      {label && (
        <label id={labelId} htmlFor={inputId} className="lumen-form-field__label">
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
        // v0.13.2 — when there's a single child element and a label exists, we
        // cloned it above to inject aria-labelledby / id so the inner control
        // gets the accessible name from the Field's <label>. See comment block
        // above the renderedChildren = ... block.
        <div className="min-w-0">{renderedChildren}</div>
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
            ref={ref}
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
});
