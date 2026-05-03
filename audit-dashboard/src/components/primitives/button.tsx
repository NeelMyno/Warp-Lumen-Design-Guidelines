import { ReactNode, ButtonHTMLAttributes } from "react";

type Intent = "primary" | "secondary" | "tertiary" | "danger";
type Size = "sm" | "md" | "lg";

const INTENT: Record<Intent, string> = {
  primary:
    "bg-[var(--accent-500)] text-[var(--accent-fg)] border border-transparent " +
    "hover:bg-[var(--accent-600)] active:bg-[var(--accent-700)] " +
    "shadow-[var(--accent-glow)]",
  secondary:
    "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] " +
    "hover:bg-[var(--surface-sunken)] active:bg-[var(--surface-sunken)]",
  tertiary:
    "bg-transparent text-[var(--text-primary)] border border-transparent " +
    "hover:bg-[var(--surface-sunken)]",
  danger:
    "bg-[var(--status-danger-fg)] text-white border border-transparent " +
    "hover:opacity-90",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[var(--type-13)]",
  md: "h-10 px-4 text-[var(--type-14)]",
  lg: "h-12 px-5 text-[var(--type-16)]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  intent = "secondary",
  size = "md",
  leadingIcon,
  trailingIcon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)]",
        "font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        SIZE[size],
        INTENT[intent],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
    >
      {leadingIcon && <span aria-hidden>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span aria-hidden>{trailingIcon}</span>}
    </button>
  );
}
