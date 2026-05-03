// Lumen Button — Web React example (v0.9)
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/button.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// v0.9 — Implementation pattern moved from inline Tailwind arbitrary-value utilities
// to CSS-class composition (the `.lumen-btn-*` family declared in globals.css).
// This eliminates Tailwind v4's content-scanner fragility — the cva variants emit
// stable class names that the browser resolves via static CSS, not Tailwind's
// dynamic `@theme inline` output. See ADR 0015 (v0.8.1) and ADR 0016 (v0.9).
//
// v0.9 — DO NOT substitute shadcn's `bg-primary text-primary-foreground` utilities
// here, even if you also install shadcn/ui. The bridge resolves through three
// var() hops and Tailwind v4's content scanner has been observed to drop those
// utility classes from the compiled CSS. Pin direct semantic refs.

import { ReactNode, ButtonHTMLAttributes } from "react";

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

// Maps to the .lumen-btn-{intent} CSS classes declared in globals.css.
const INTENT_CLASS: Record<Intent, string> = {
  primary:       "lumen-btn-primary",
  secondary:     "lumen-btn-secondary",
  tertiary:      "lumen-btn-tertiary",
  ghost:         "lumen-btn-ghost",
  outline:       "lumen-btn-outline",
  danger:        "lumen-btn-danger",
  "danger-soft": "lumen-btn-danger-soft",
  ai:            "lumen-btn-ai",
  glass:         "lumen-btn-glass",
  link:          "lumen-btn-ghost underline-offset-4 hover:underline",
};

const SIZE_CLASS: Record<Size, string> = {
  xs: "lumen-btn-xs",
  sm: "lumen-btn-sm",
  md: "lumen-btn-md",
  lg: "lumen-btn-lg",
  xl: "lumen-btn-xl",
};

const SHAPE_CLASS: Record<Shape, string> = {
  rect:  "",
  pill:  "lumen-btn-pill",
  round: "lumen-icon-button lumen-btn-round",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  shape?: Shape;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  pressed?: boolean;
};

export function Button({
  intent = "secondary",
  size = "md",
  shape = "rect",
  leadingIcon,
  trailingIcon,
  fullWidth,
  loading,
  pressed,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      aria-pressed={pressed || undefined}
      disabled={disabled || loading}
      {...props}
      className={[
        "lumen-btn",
        INTENT_CLASS[intent],
        SIZE_CLASS[size],
        SHAPE_CLASS[shape],
        fullWidth ? "w-full" : "",
        pressed ? "lumen-btn-selected" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      {loading ? (
        <Spinner />
      ) : leadingIcon ? (
        <span aria-hidden>{leadingIcon}</span>
      ) : null}
      {children}
      {trailingIcon && !loading && <span aria-hidden>{trailingIcon}</span>}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="lumen-btn-spinner"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
