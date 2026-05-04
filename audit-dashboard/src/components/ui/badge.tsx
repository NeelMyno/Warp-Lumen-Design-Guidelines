import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-full)] border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none aria-invalid:border-[var(--lumen-red-5)] transition-[color,background-color,border-color]",
  {
    variants: {
      variant: {
        /* v0.8.1 — Direct token refs, mirrors the Button fix. See ui/button.tsx.
           v0.11 — Added success / warning / info / accent-soft variants. Destructive
           bg deepened red.5 → red.7 to clear AA Normal (white-on-red.7 = 5.4:1; the
           v0.10.x white-on-red.5 pair was 3.94:1 — same fix as the danger button
           per ADR 0016). */
        default: "border-transparent bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]",
        secondary: "border-transparent bg-[var(--surface-sunken)] text-[var(--text-secondary)]",
        destructive: "border-transparent bg-[var(--lumen-red-7)] text-white",
        outline: "border-[var(--border-default)] text-[var(--text-primary)]",
        /* Tonal status variants — pastel bg + deep fg. Verified for v0.11. */
        success: "border-[var(--lumen-accent-2)] bg-[var(--lumen-accent-0)] text-[var(--lumen-accent-8)]",
        warning: "border-[var(--lumen-amber-2)] bg-[var(--lumen-amber-0)] text-[var(--lumen-amber-7)]",
        info: "border-[var(--lumen-cream-2)] bg-[var(--lumen-cream-0)] text-[var(--lumen-cream-7)]",
        "accent-soft": "border-[var(--lumen-accent-2)] bg-[var(--lumen-accent-1)] text-[var(--lumen-accent-8)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
