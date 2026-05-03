// Lumen SplitButton — Web React example (v0.9)
// Primary action half + dropdown trigger half, joined.

import { ButtonHTMLAttributes, ReactNode } from "react";

type Intent = "primary" | "secondary" | "outline" | "ghost" | "danger" | "ai";
type Size = "sm" | "md" | "lg" | "xl";

export type SplitButtonProps = {
  children: ReactNode;
  intent?: Intent;
  size?: Size;
  onAction?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  onMenuOpen?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  menuLabel: string;
  leadingIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const INTENT: Record<Intent, string> = {
  primary:   "lumen-btn-primary",
  secondary: "lumen-btn-secondary",
  outline:   "lumen-btn-outline",
  ghost:     "lumen-btn-ghost",
  danger:    "lumen-btn-danger",
  ai:        "lumen-btn-ai",
};

const SIZE: Record<Size, string> = {
  sm: "lumen-btn-sm",
  md: "lumen-btn-md",
  lg: "lumen-btn-lg",
  xl: "lumen-btn-xl",
};

export function SplitButton({
  children,
  intent = "primary",
  size = "md",
  onAction,
  onMenuOpen,
  menuLabel,
  leadingIcon,
  loading,
  disabled,
  className,
}: SplitButtonProps) {
  const sharedClass = ["lumen-btn", INTENT[intent], SIZE[size]].join(" ");
  return (
    <div role="group" className={["lumen-split-button", className ?? ""].join(" ")}>
      <button
        type="button"
        className={sharedClass}
        onClick={onAction}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {leadingIcon && <span aria-hidden>{leadingIcon}</span>}
        {children}
      </button>
      <button
        type="button"
        className={[sharedClass, "lumen-icon-button"].join(" ")}
        aria-label={menuLabel}
        aria-haspopup="menu"
        onClick={onMenuOpen}
        disabled={disabled || loading}
      >
        <ChevronDown />
      </button>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
