import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-[var(--text-tertiary)] selection:bg-[var(--lumen-lime-a32)] selection:text-[var(--text-primary)] border-[var(--border-default)] bg-[var(--surface-raised)] flex field-sizing-content min-h-22 w-full rounded-[var(--radius-md)] border px-3 py-2 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)]",
        "aria-invalid:border-[var(--lumen-red-5)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
