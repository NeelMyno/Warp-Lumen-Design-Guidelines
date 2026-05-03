import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lumen / shadcn Textarea. v0.6 — adopts the field-shell visual contract.
 * field-sizing: content lets the textarea auto-grow; we cap via min-height +
 * max-height applied via consumer style. Inside <Field>, the wrapper paints.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-22 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] px-3 py-2 text-body-md text-[var(--text-primary)] outline-none",
        "placeholder:text-[var(--text-placeholder)] selection:bg-[var(--lumen-lime-a32)] selection:text-[var(--text-primary)]",
        "transition-[color,box-shadow,border-color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "shadow-[var(--shadow-input-lit-edge)]",
        "hover:border-[var(--border-strong)]",
        "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-input-focus)]",
        "aria-invalid:border-[var(--border-error)] aria-invalid:focus-visible:shadow-[var(--shadow-input-error)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--surface-input-disabled)] disabled:text-[var(--text-disabled)] disabled:border-[var(--border-input-disabled)]",
        "read-only:cursor-default",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
