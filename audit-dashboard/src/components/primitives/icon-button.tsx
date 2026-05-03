/**
 * v0.9 — IconButton (formal primitive)
 * ----------------------------------------------------------------------------
 * A square Button containing only an icon. `aria-label` is REQUIRED — that's
 * the floor for accessibility per AGENTS.md hard rule #4 and WCAG 4.1.2 (Name).
 *
 * Sizes match the Button ladder: xs (24) / sm (32) / md (40, default) / lg (48) / xl (56).
 * Shape defaults to "rect" (rounded square). Pass shape="round" for a fully
 * rounded icon button (chips, FAB-shaped buttons, status pings).
 */

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button as LumenButton } from "./button";

type Intent =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "outline"
  | "danger"
  | "danger-soft"
  | "ai"
  | "glass";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

type Shape = "rect" | "round";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  /** Required — every icon-only control needs a name for screen readers. */
  "aria-label": string;
  intent?: Intent;
  size?: Size;
  shape?: Shape;
  loading?: boolean;
  pressed?: boolean;
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      intent = "ghost",
      size = "md",
      shape = "rect",
      loading,
      pressed,
      "aria-label": ariaLabel,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <LumenButton
        ref={ref}
        intent={intent}
        size={size}
        shape={shape === "round" ? "round" : "rect"}
        loading={loading}
        pressed={pressed}
        aria-label={ariaLabel}
        className={cn("lumen-icon-button", className)}
        {...props}
      >
        {children}
      </LumenButton>
    );
  },
);
