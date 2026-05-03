import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] selection:bg-[var(--lumen-lime-a32)] selection:text-[var(--text-primary)] flex h-10 w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)]",
        "aria-invalid:border-[var(--lumen-red-5)] aria-invalid:focus-visible:shadow-[0_0_0_3.5px_rgba(226,59,59,0.32)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
