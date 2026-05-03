import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium tracking-[var(--tracking-tight)] transition-[background-color,border-color,color,transform] disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:shadow-[var(--shadow-focus)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 active:translate-y-px select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground font-semibold hover:bg-[var(--lumen-accent-5)] active:bg-[var(--lumen-accent-6)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-[var(--lumen-red-6)] active:bg-[var(--lumen-red-7)]",
        outline: "border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] hover:border-[var(--border-strong)]",
        secondary: "bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] hover:border-[var(--border-strong)]",
        ghost: "text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]",
        link: "text-[var(--text-link)] underline-offset-4 hover:underline",
      },
      /* v0.5: Button size ramp uses raw type tokens (12/13/14/15/16) — finer-grained than text-label-sm/md/lg ramp; review for consolidation. */
      size: {
        default: "h-10 px-4 has-[>svg]:px-3",
        xs: "h-7 rounded-[var(--radius-sm)] gap-1.5 px-2 has-[>svg]:px-1.5 text-[var(--type-12)]",
        sm: "h-8 rounded-[var(--radius-md)] gap-2 px-3 has-[>svg]:px-2.5 text-[var(--type-13)]",
        md: "h-10 px-4 text-[var(--type-14)]",
        lg: "h-12 rounded-[var(--radius-lg)] px-6 text-[var(--type-15)] has-[>svg]:px-5",
        xl: "h-14 rounded-[var(--radius-full)] px-8 gap-2.5 text-[var(--type-16)]",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
