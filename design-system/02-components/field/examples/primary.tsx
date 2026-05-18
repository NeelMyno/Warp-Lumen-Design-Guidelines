// Lumen Field — Web React example (v0.6 single-shell architecture)
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/field.tsx. Tokens come from
// /_build/tailwind/theme.css imported by your global css.
//
// The .lumen-field shell owns the border, background, focus ring, lit-edge,
// and error/disabled state. The inner control (input / select / textarea)
// renders bare — no chrome of its own. Slots (`data-slot="leading"`,
// `data-slot="trailing"`, `data-slot="addon"`) compose around the control.

import { ReactNode, useId } from "react";

export type FieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: "sm" | "md";
  htmlFor?: string;
  /** The bare control: <input>, <select>, <textarea>, or a primitive that
   *  composes the `.lumen-field` shell. The Field wrapper handles the label,
   *  description, and error surface. */
  children: ReactNode;
  className?: string;
};

export function Field({
  label,
  description,
  error,
  required,
  size = "md",
  htmlFor,
  children,
  className,
}: FieldProps) {
  const generatedId = useId();
  const messageId = `${generatedId}-msg`;

  return (
    <div className={["flex flex-col gap-stack-xs", className ?? ""].join(" ")}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-label-md text-[color:var(--text-primary)] inline-flex items-center gap-1"
        >
          {label}
          {required && (
            <span
              aria-label="required"
              className="text-[color:var(--text-error)]"
            >
              *
            </span>
          )}
        </label>
      )}
      {description && (
        <span
          id={`${generatedId}-desc`}
          className="text-caption text-[color:var(--text-tertiary)]"
        >
          {description}
        </span>
      )}
      <div
        data-size={size === "md" ? undefined : size}
        data-error={error ? "true" : undefined}
        aria-describedby={error ? messageId : undefined}
      >
        {children}
      </div>
      {error && (
        <span
          id={messageId}
          role="alert"
          className="text-caption text-[color:var(--text-error)] inline-flex items-center gap-1"
        >
          {error}
        </span>
      )}
    </div>
  );
}

// Usage:
//
//   <Field label="Email" required error={errors.email?.message}>
//     <input className="lumen-field" type="email" {...register("email")} />
//   </Field>
//
//   <Field label="Notes" description="Internal — not shared with carriers">
//     <textarea className="lumen-field" rows={4} />
//   </Field>
