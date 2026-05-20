/**
 * v0.9 — Lumen Button (vendor primitive)
 * ----------------------------------------------------------------------------
 * The cva variants compose CSS classes declared in
 * `audit-dashboard/src/app/globals.css` (`.lumen-btn`, `.lumen-btn-{intent}`,
 * `.lumen-btn-{size}`, `.lumen-btn-pill`, `.lumen-icon-button`, etc.).
 *
 * Why CSS classes, not Tailwind arbitrary-values:
 *   - v0.8.1 (ADR 0015) found Tailwind v4's content scanner intermittently
 *     drops the shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`).
 *     We pinned direct refs (`bg-[var(--lumen-accent-4)]`) per surface.
 *   - v0.9 generalises: the intent surfaces, sizes, and shape live in CSS
 *     (`.lumen-btn-primary` etc.) so the button is independent of Tailwind's
 *     content-scanning behavior and doesn't depend on `@theme inline` working.
 *   - Side benefit: hover, focus-visible, active, disabled, aria-busy, and the
 *     shadow ladder are all encoded once in CSS state selectors. The cva is
 *     short and the runtime stays predictable across dev / prod / SSR.
 *     v0.14 R11 (ADR 0030): the primary shadow ladder is now neutral; the
 *     green identity lives in the BG fill, not the shadow.
 *
 * Five sizes: xs (24) / sm (32) / md (40, default) / lg (48) / xl (56).
 * Eight intents: primary / secondary / outline / tertiary / ghost / danger /
 *   danger-soft / ai (+ destructive alias for shadcn parity, link for inline use).
 * Three shapes: rect (default) / pill / round (icon-only square + full radius).
 *
 * AGENTS.md hard rule #9 + ADR 0016 cover the no-white-on-lime guarantee.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  /* Base — every button gets these. globals.css `.lumen-btn` ships layout,
     transitions, focus-visible, disabled, no-transform press feedback. */
  "lumen-btn",
  {
    variants: {
      /* INTENT — role: what the button means. Composed with shape/size externally. */
      intent: {
        default:       "lumen-btn-primary",
        primary:       "lumen-btn-primary",
        secondary:     "lumen-btn-secondary",
        outline:       "lumen-btn-outline",
        tertiary:      "lumen-btn-tertiary",
        ghost:         "lumen-btn-ghost",
        destructive:   "lumen-btn-danger",
        danger:        "lumen-btn-danger",
        "danger-soft": "lumen-btn-danger-soft",
        ai:            "lumen-btn-ai",
        glass:         "lumen-btn-glass",
        link:          "lumen-btn-ghost underline-offset-4 hover:underline",
      },
      /* SIZE — height tier. Defaults to md (40 px). */
      size: {
        default: "lumen-btn-md",
        xs:      "lumen-btn-xs",
        sm:      "lumen-btn-sm",
        md:      "lumen-btn-md",
        lg:      "lumen-btn-lg",
        xl:      "lumen-btn-xl",
        /* `icon` is shorthand for size=md + IconButton aspect. New code should
           prefer the dedicated <IconButton /> component, but `size="icon"` is
           preserved for shadcn parity. */
        icon:    "lumen-btn-md lumen-icon-button",
      },
      /* SHAPE — rect / pill / round. Composes with size. Round = square + full radius. */
      shape: {
        rect:  "",
        pill:  "lumen-btn-pill",
        round: "lumen-icon-button lumen-btn-round",
      },
    },
    defaultVariants: { intent: "default", size: "default", shape: "rect" },
  },
);

function Button({
  className,
  intent,
  size,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      data-intent={intent ?? "default"}
      data-shape={shape ?? "rect"}
      className={cn(buttonVariants({ intent, size, shape }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
