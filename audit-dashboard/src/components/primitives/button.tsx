import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";

/**
 * Lumen Button — thin wrapper over the shadcn Button.
 *
 * Preserves the existing Lumen API (`intent`, `size`, `leadingIcon`,
 * `trailingIcon`, `loading`, `glow`, `pill`) by mapping it onto shadcn's
 * (`variant`, `size`, `asChild`) contract. Consumer pages don't need to
 * change a single import.
 */

type Intent = "primary" | "secondary" | "tertiary" | "danger" | "ghost";
type Size = "xs" | "sm" | "md" | "lg" | "xl";

const INTENT_TO_VARIANT: Record<Intent, "default" | "secondary" | "ghost" | "destructive" | "link"> = {
  primary:   "default",
  secondary: "secondary",
  tertiary:  "ghost",
  ghost:     "ghost",
  danger:    "destructive",
};

const SIZE_MAP: Record<Size, "xs" | "sm" | "md" | "lg" | "xl"> = {
  xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  /** v0.4 — strengthen the lime ambient glow on this button (hero CTAs only). */
  glow?: boolean;
  /** v0.4 — render as a pill regardless of size. */
  pill?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = "secondary",
    size = "md",
    leadingIcon,
    trailingIcon,
    fullWidth,
    loading,
    glow,
    pill,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <ShadcnButton
      ref={ref}
      variant={INTENT_TO_VARIANT[intent]}
      size={SIZE_MAP[size]}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(
        fullWidth && "w-full",
        pill && "!rounded-[var(--radius-full)]",
        glow && intent === "primary" && "lumen-glow-cta",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin shrink-0" aria-hidden />
      ) : leadingIcon ? (
        <span aria-hidden className="shrink-0">{leadingIcon}</span>
      ) : null}
      {children}
      {trailingIcon && !loading ? (
        <span aria-hidden className="shrink-0">{trailingIcon}</span>
      ) : null}
    </ShadcnButton>
  );
});

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
    size === "xl" ? "!h-14 !w-14" :
                    "!h-10 !w-10";
  return (
    <Button
      intent={intent}
      size={size}
      aria-label={ariaLabel}
      className={cn(dim, "!px-0", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export { buttonVariants };
