"use client";

/**
 * @lumen/button — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Five sizes × eight intents × three shapes. Built on Radix Slot for composition
 * (e.g. wrap an <a> via asChild). Styling lives in the .lumen-btn-* class family
 * shipped by @lumen/tokens (lumen.css). No hex literals in this file — every
 * surface, shadow, border, radius, and motion duration reads from a Lumen CSS
 * variable.
 *
 * Hard rules carried forward:
 *   - Hard rule 9 — no white on accent (primary fg is --color-action-primary-fg).
 *   - Hard rule 11 — focus ring is outline + box-shadow, never box-shadow alone.
 *   - Hard rule 15 — mode-agnostic; no data-mode references here.
 *   - ADR 0016 / 0022 — primary glow ladder dialed via lumen.css tokens.
 *
 * Loading vs success vs disabled: visually distinct. Loading keeps color +
 * shows spinner + aria-busy=true + suppresses click. Success replaces leading
 * icon with a checkmark for SUCCESS_HOLD_MS, then auto-clears. Disabled sets
 * aria-disabled (not the disabled attribute when inside a form, so the button
 * stays in tab order).
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Check } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva("lumen-btn", {
  variants: {
    intent: {
      primary: "lumen-btn-primary",
      secondary: "lumen-btn-secondary",
      outline: "lumen-btn-outline",
      tertiary: "lumen-btn-tertiary",
      ghost: "lumen-btn-ghost",
      danger: "lumen-btn-danger",
      "danger-soft": "lumen-btn-danger-soft",
      ai: "lumen-btn-ai",
      glass: "lumen-btn-glass",
      link: "lumen-btn-ghost underline-offset-4 hover:underline",
      destructive: "lumen-btn-danger",
    },
    size: {
      xs: "lumen-btn-xs",
      sm: "lumen-btn-sm",
      md: "lumen-btn-md",
      lg: "lumen-btn-lg",
      xl: "lumen-btn-xl",
      icon: "lumen-btn-md lumen-icon-button",
    },
    shape: {
      rect: "",
      pill: "lumen-btn-pill",
      round: "lumen-icon-button lumen-btn-round",
    },
  },
  defaultVariants: { intent: "secondary", size: "md", shape: "rect" },
});

const SUCCESS_HOLD_MS = 1600;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
    success?: boolean;
    pressed?: boolean;
    pill?: boolean;
    glow?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent,
    size,
    shape,
    asChild = false,
    leadingIcon,
    trailingIcon,
    fullWidth,
    loading,
    success: successProp = false,
    pressed,
    pill,
    glow,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : "button";

  /* Transient success state — when `success` flips true we hold the checkmark
     for 1.6s, then auto-clear. Honors prefers-reduced-motion via the CSS in
     @lumen/tokens lumen.css; this hook just manages the data-attribute. */
  const [holdSuccess, setHoldSuccess] = React.useState(false);
  React.useEffect(() => {
    if (!successProp) return;
    setHoldSuccess(true);
    const id = window.setTimeout(() => setHoldSuccess(false), SUCCESS_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [successProp]);

  const resolvedShape = shape ?? (pill ? "pill" : undefined);
  const isLoading = !!loading;
  const isSuccess = holdSuccess;
  const isDisabled = !!disabled || isLoading;

  return (
    <Comp
      ref={ref}
      data-slot="button"
      data-intent={intent ?? "secondary"}
      data-shape={resolvedShape ?? "rect"}
      data-success={isSuccess || undefined}
      data-pressed={pressed || undefined}
      aria-busy={isLoading || undefined}
      aria-pressed={pressed || undefined}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ intent, size, shape: resolvedShape }),
        fullWidth && "w-full",
        glow && intent === "primary" && "lumen-glow-cta",
        pressed && "lumen-btn-selected",
        className,
      )}
      onClick={(e) => {
        if (isLoading) return;
        props.onClick?.(e);
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="lumen-btn-spinner shrink-0" aria-hidden />
      ) : isSuccess ? (
        <Check className="lumen-btn-success-icon shrink-0" aria-hidden />
      ) : leadingIcon ? (
        <span aria-hidden className="shrink-0">
          {leadingIcon}
        </span>
      ) : null}
      {children}
      {trailingIcon && !isLoading && !isSuccess ? (
        <span aria-hidden className="shrink-0">
          {trailingIcon}
        </span>
      ) : null}
    </Comp>
  );
});

export { buttonVariants };
