/**
 * @lumen/input — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * v0.6 field-shell contract. Standalone, this input paints its own border, bg,
 * and focus halo. Inside <Field> (.lumen-field wrapper), the wrapper paints
 * and the bare input renders via globals.css `.lumen-field input` rules — no
 * double ring.
 *
 * Body type is text-body-md (14px). The previous text-base md:text-sm (16/14)
 * chain fought Lumen's 14px body floor — removed in v0.6.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        /* Shell — used standalone. Inside .lumen-field these are overridden. */
        "flex h-10 w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] px-3 text-[length:var(--type-14)] text-[color:var(--text-primary)] outline-none",
        "placeholder:text-[color:var(--text-placeholder)] selection:bg-[var(--lumen-lime-a32)] selection:text-[color:var(--text-primary)] file:text-[color:var(--text-primary)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "transition-[color,box-shadow,border-color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "shadow-[var(--shadow-input-lit-edge)]",
        /* States — hover, focus, error, disabled, readonly. */
        "hover:border-[var(--border-strong)]",
        "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-input-focus)]",
        "aria-invalid:border-[var(--border-error)] aria-invalid:focus-visible:shadow-[var(--shadow-input-error)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--surface-input-disabled)] disabled:text-[color:var(--text-disabled)] disabled:border-[var(--border-input-disabled)] disabled:pointer-events-none",
        "read-only:cursor-default",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
