"use client";

/**
 * v0.9 — Lumen Button (consumer-facing wrapper)
 * ----------------------------------------------------------------------------
 * Forwards a stable Lumen API onto the v0.9 vendor primitive.
 *
 * Stable API (v0.6+):
 *   intent       primary | secondary | tertiary | ghost | danger | danger-soft | ai | link
 *   size         xs | sm | md | lg | xl
 *   shape        rect | pill | round           (v0.9 NEW — orthogonal to size)
 *   leadingIcon  ReactNode
 *   trailingIcon ReactNode
 *   loading      boolean (replaces leading icon with spinner; suppresses click)
 *   success      boolean (transient — replaces leading icon with checkmark; clears after 1.6 s)
 *   pressed      boolean (aria-pressed=true; renders selected surface)
 *   disabled     boolean (aria-disabled, opacity 0.4, no pointer events)
 *   pill         boolean (legacy — alias of shape="pill")
 *   glow         boolean (legacy — primary already has the neutral shadow ladder (v0.14 R11, ADR 0030); this layers .lumen-glow-cta on top for hero CTAs)
 *   fullWidth    boolean (w-full)
 *
 * Press feedback: filter brightness(0.92) (no transform / no scale).
 * Loading vs disabled: visually distinct (loading keeps color, shows spinner).
 * Focus: dual-ring on primary (lime accent surface), single-ring elsewhere.
 *
 * IconButton, ButtonGroup, SplitButton, CommandPaletteButton, FAB are split
 * into dedicated files. Import them from `./icon-button`, `./button-group`,
 * `./split-button`, `./command-palette-button`, `./fab`.
 */

import {
  ReactNode,
  ButtonHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Loader2, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";

type Intent =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "outline"
  | "danger"
  | "danger-soft"
  | "ai"
  | "glass"
  | "link";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

type Shape = "rect" | "pill" | "round";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  shape?: Shape;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  /** v0.9 — Brief success state. Pass `true` after a successful async action;
   *  the button shows a checkmark for 1.6 s then auto-clears. */
  success?: boolean;
  /** v0.9 — aria-pressed=true. Renders the accent-tinted selected surface
   *  (per R11 the tint is a BG fill, not a shadow halo — ADR 0030). */
  pressed?: boolean;
  /** v0.4 legacy — alias of shape="pill". */
  pill?: boolean;
  /** v0.4 legacy — layers the .lumen-glow-cta hero halo on top of the
   *  default primary surface. For hero/landing CTAs only. v0.14 R11
   *  (ADR 0030): both the halo and the primary shadow ladder are now
   *  neutral; the green identity lives in the BG fill, not the shadow. */
  glow?: boolean;
};

const SUCCESS_HOLD_MS = 1600;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = "secondary",
    size = "md",
    shape,
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
  /* Transient success state — when `success` flips true we hold the
     checkmark for 1.6 s, then auto-clear. Honors prefers-reduced-motion
     via the CSS in globals.css; this hook just manages the data-attribute. */
  const [holdSuccess, setHoldSuccess] = useState(false);
  useEffect(() => {
    if (!successProp) return;
    setHoldSuccess(true);
    const id = window.setTimeout(() => setHoldSuccess(false), SUCCESS_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [successProp]);

  const resolvedShape: Shape | undefined = shape ?? (pill ? "pill" : undefined);

  const isLoading = !!loading;
  const isSuccess = holdSuccess;
  const isDisabled = !!disabled || isLoading;

  return (
    <ShadcnButton
      ref={ref}
      intent={intent}
      size={size}
      shape={resolvedShape}
      aria-busy={isLoading || undefined}
      aria-pressed={pressed || undefined}
      aria-disabled={isDisabled || undefined}
      data-success={isSuccess || undefined}
      data-pressed={pressed || undefined}
      disabled={isDisabled}
      className={cn(
        fullWidth && "w-full",
        glow && intent === "primary" && "lumen-glow-cta",
        pressed && "lumen-btn-selected",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2
          className="lumen-btn-spinner shrink-0"
          aria-hidden
        />
      ) : isSuccess ? (
        <Check
          className="lumen-btn-success-icon shrink-0"
          aria-hidden
        />
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
    </ShadcnButton>
  );
});

export { buttonVariants };

/* IconButton — relocated to its own file for v0.9. Re-exported here for
   backwards compatibility; new code should import directly from
   `@/components/primitives/icon-button`. */
export { IconButton } from "./icon-button";
