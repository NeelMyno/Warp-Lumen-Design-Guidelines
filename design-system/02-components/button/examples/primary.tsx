// Lumen Button — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/button.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

import { ReactNode, ButtonHTMLAttributes } from "react";

type Intent = "primary" | "secondary" | "tertiary" | "danger";
type Size = "sm" | "md" | "lg";

const INTENT: Record<Intent, string> = {
  primary:
    "bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)] " +
    "hover:bg-[var(--color-action-primary-bg-hover)] active:bg-[var(--color-action-primary-bg-press)] " +
    "shadow-[var(--shadow-accent-glow)]",
  secondary:
    "bg-[var(--color-action-secondary-bg-rest)] text-[var(--color-action-secondary-fg)] " +
    "border border-[var(--color-action-secondary-border)] " +
    "hover:bg-[var(--color-action-secondary-bg-hover)]",
  tertiary:
    "bg-transparent text-[var(--color-action-tertiary-fg)] " +
    "hover:bg-[var(--color-action-tertiary-bg-hover)]",
  danger:
    "bg-[var(--color-action-danger-bg-rest)] text-[var(--color-action-danger-fg)] " +
    "hover:bg-[var(--color-action-danger-bg-hover)]",
};

const SIZE: Record<Size, string> = {
  sm: "h-[var(--size-control-sm)] px-3 text-[var(--type-body-sm)]",
  md: "h-[var(--size-control-md)] px-4 text-[var(--type-label-sm)]",
  lg: "h-[var(--size-control-lg)] px-5 text-[var(--type-body-md)]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  intent = "secondary",
  size = "md",
  leadingIcon,
  trailingIcon,
  fullWidth,
  loading,
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
      disabled={disabled || loading}
      {...props}
      className={[
        "inline-flex items-center justify-center gap-[var(--space-inline-sm)]",
        "rounded-[var(--radius-control-md)] font-medium",
        "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-standard)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        SIZE[size],
        INTENT[intent],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-spin"
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
