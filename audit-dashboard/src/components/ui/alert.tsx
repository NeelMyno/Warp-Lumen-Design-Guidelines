import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-lg)] border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-raised)] text-[color:var(--text-primary)] border-[var(--border-default)]",
        info: "bg-[var(--lumen-cream-1)] text-[color:var(--lumen-cream-7)] border-[var(--lumen-cream-2)]",
        success: "bg-[var(--lumen-accent-1)] text-[color:var(--lumen-accent-8)] border-[var(--lumen-accent-2)]",
        warning: "bg-[var(--lumen-amber-0)] text-[color:var(--lumen-amber-7)] border-[var(--lumen-amber-2)]",
        destructive: "bg-[var(--lumen-red-0)] text-[color:var(--lumen-red-7)] border-[var(--lumen-red-2)] [&>svg]:text-current",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-[var(--tracking-tight)]",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed text-[color:var(--text-secondary)]",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
