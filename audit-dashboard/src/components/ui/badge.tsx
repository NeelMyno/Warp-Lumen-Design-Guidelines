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
           bg deepened red.5 → red.7 to clear AA Normal.
           v0.11.3 — All tonal variants now read from --pill-{tone}-* mode-aware
           tokens, unifying with Tag/StatusPill/Lumen Badge. AAA contrast
           verified per tone in both modes — see globals.css §"PILL TONAL TOKENS". */
        default: "border-transparent bg-[var(--lumen-accent-4)] text-[color:var(--lumen-accent-fg)]",
        secondary: "border-transparent bg-[var(--surface-sunken)] text-[color:var(--text-secondary)]",
        destructive: "border-transparent bg-[var(--lumen-red-7)] text-white",
        outline: "border-[var(--border-default)] text-[color:var(--text-primary)]",
        /* Tonal status variants — read from --pill-* tokens. */
        success: "border-[var(--pill-success-border)] bg-[var(--pill-success-bg)] text-[var(--pill-success-fg)]",
        warning: "border-[var(--pill-warn-border)] bg-[var(--pill-warn-bg)] text-[var(--pill-warn-fg)]",
        info: "border-[var(--pill-info-border)] bg-[var(--pill-info-bg)] text-[var(--pill-info-fg)]",
        "accent-soft": "border-[var(--pill-accent-border)] bg-[var(--pill-accent-bg)] text-[var(--pill-accent-fg)]",
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
