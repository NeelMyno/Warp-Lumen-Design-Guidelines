// Lumen IconButton — Web React example (v0.9)
// Square Button containing only an icon. aria-label is REQUIRED.

import { ButtonHTMLAttributes, ReactNode } from "react";

type Intent = "primary" | "secondary" | "tertiary" | "ghost" | "outline" | "danger" | "ai";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Shape = "rect" | "round";

const INTENT: Record<Intent, string> = {
  primary:   "lumen-btn-primary",
  secondary: "lumen-btn-secondary",
  tertiary:  "lumen-btn-tertiary",
  ghost:     "lumen-btn-ghost",
  outline:   "lumen-btn-outline",
  danger:    "lumen-btn-danger",
  ai:        "lumen-btn-ai",
};

const SIZE: Record<Size, string> = {
  xs: "lumen-btn-xs",
  sm: "lumen-btn-sm",
  md: "lumen-btn-md",
  lg: "lumen-btn-lg",
  xl: "lumen-btn-xl",
};

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  "aria-label": string; // REQUIRED — TS will refuse to compile without
  intent?: Intent;
  size?: Size;
  shape?: Shape;
  pressed?: boolean;
  children: ReactNode;
};

export function IconButton({
  intent = "ghost",
  size = "md",
  shape = "rect",
  pressed,
  "aria-label": ariaLabel,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      aria-label={ariaLabel}
      aria-pressed={pressed || undefined}
      {...props}
      className={[
        "lumen-btn",
        INTENT[intent],
        SIZE[size],
        "lumen-icon-button",
        shape === "round" ? "lumen-btn-round" : "",
        pressed ? "lumen-btn-selected" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
