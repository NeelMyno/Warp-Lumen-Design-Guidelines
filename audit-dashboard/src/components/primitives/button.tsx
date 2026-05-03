import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";

type Intent = "primary" | "secondary" | "tertiary" | "danger" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";

const INTENT: Record<Intent, string> = {
  primary: [
    "bg-[var(--color-accent)] text-[var(--text-on-accent)]",
    "hover:bg-[var(--color-accent-hover)]",
    "active:bg-[var(--color-accent-press)]",
    "shadow-[var(--shadow-glow-accent)]",
    "border border-transparent",
  ].join(" "),
  secondary: [
    "bg-[var(--surface-raised)] text-[var(--text-primary)]",
    "border border-[var(--border-default)]",
    "hover:bg-[var(--surface-sunken)] hover:border-[var(--border-strong)]",
    "active:bg-[var(--surface-sunken)]",
  ].join(" "),
  tertiary: [
    "bg-transparent text-[var(--text-primary)]",
    "border border-transparent",
    "hover:bg-[var(--surface-sunken)]",
  ].join(" "),
  danger: [
    "bg-[var(--lumen-red-5)] text-white",
    "border border-transparent",
    "hover:bg-[var(--lumen-red-6)]",
    "active:bg-[var(--lumen-red-7)]",
  ].join(" "),
  ghost: [
    "bg-[var(--surface-tint-accent)] text-[var(--text-accent)]",
    "border border-transparent",
    "hover:bg-[color-mix(in_oklab,var(--lumen-accent-4)_18%,transparent)]",
  ].join(" "),
};

/* Heights snap to the 8pt soft grid:
 *   xs = 28 (3.5u soft) — dense data-table rows
 *   sm = 32 (4u)         — toolbars, secondary controls
 *   md = 40 (5u)         — DEFAULT
 *   lg = 48 (6u)         — primary CTA / hero
 */
const SIZE: Record<Size, string> = {
  xs: "h-7  px-2 text-[var(--type-12)] gap-1.5 rounded-[var(--radius-sm)]",
  sm: "h-8  px-3 text-[var(--type-13)] gap-2   rounded-[var(--radius-md)]",
  md: "h-10 px-4 text-[var(--type-14)] gap-2   rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-[var(--type-15)] gap-2   rounded-[var(--radius-lg)]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = "secondary",
    size = "md",
    leadingIcon,
    trailingIcon,
    fullWidth,
    loading,
    disabled,
    className,
    children,
    type,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      disabled={disabled || loading}
      {...props}
      className={[
        "inline-flex items-center justify-center font-medium tracking-[var(--tracking-tight)]",
        "transition-[background-color,border-color,box-shadow,color,transform] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        "active:translate-y-px",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
        "select-none",
        SIZE[size],
        INTENT[intent],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
    >
      {loading ? (
        <Spinner />
      ) : leadingIcon ? (
        <span aria-hidden className="shrink-0">{leadingIcon}</span>
      ) : null}
      {children}
      {trailingIcon && !loading ? (
        <span aria-hidden className="shrink-0">{trailingIcon}</span>
      ) : null}
    </button>
  );
});

function Spinner() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      className="animate-spin shrink-0"
      aria-hidden
      style={{ animationDuration: "0.9s" }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.9" />
      <path d="M2 12a10 10 0 0 0 6 9.3" opacity="0.4" />
    </svg>
  );
}

export function IconButton({
  size = "md",
  intent = "tertiary",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: ButtonProps & { "aria-label": string }) {
  const dim =
    size === "xs" ? "!h-7  !w-7"  :
    size === "sm" ? "!h-8  !w-8"  :
    size === "lg" ? "!h-12 !w-12" :
                    "!h-10 !w-10";
  return (
    <Button
      intent={intent}
      size={size}
      aria-label={ariaLabel}
      className={[dim, "!px-0", className ?? ""].join(" ")}
      {...props}
    >
      {children}
    </Button>
  );
}
