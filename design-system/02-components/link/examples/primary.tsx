// Lumen Link — Web React example.
// Always renders <a>. For routing-aware links wire via asChild → Next Link / RR Link.

import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

type Appearance = "default" | "subtle" | "accent";
type Underline = "always" | "hover" | "none";
type Size = "inherit" | "sm" | "md" | "lg";

const APPEARANCE: Record<Appearance, string> = {
  default: "text-[var(--color-text-primary)]",
  subtle:  "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
  accent:  "text-[var(--color-text-accent)]",
};

const UNDERLINE: Record<Underline, string> = {
  always: "underline underline-offset-[3px] decoration-1",
  hover:  "no-underline hover:underline hover:underline-offset-[3px] hover:decoration-1",
  none:   "no-underline",
};

const SIZE: Record<Size, string> = {
  inherit: "",
  sm: "text-[var(--type-label-sm)]",
  md: "text-[var(--type-label-md)]",
  lg: "text-[var(--type-label-lg)]",
};

export type LumenLinkProps = {
  href: string;
  children: ReactNode;
  appearance?: Appearance;
  external?: boolean;
  underline?: Underline;
  size?: Size;
  onClick?: () => void;
  className?: string;
};

export function LumenLink({
  href,
  children,
  appearance = "default",
  external = false,
  underline = "hover",
  size = "inherit",
  onClick,
  className,
}: LumenLinkProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noreferrer noopener", "aria-label": typeof children === "string" ? `${children}, opens in new tab` : undefined }
    : {};
  return (
    <a
      href={href}
      onClick={onClick}
      {...externalProps}
      className={[
        "inline-flex items-center gap-[var(--space-inline-xs)]",
        APPEARANCE[appearance],
        UNDERLINE[underline],
        SIZE[size],
        "rounded-[2px] -m-[1px] p-[1px]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
        "focus-visible:shadow-[var(--shadow-focus)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        className ?? "",
      ].join(" ")}
    >
      <span>{children}</span>
      {external && <ExternalLink aria-hidden size={12} className="opacity-70" />}
    </a>
  );
}
