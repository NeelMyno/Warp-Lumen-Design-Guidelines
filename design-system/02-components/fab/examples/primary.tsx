// Lumen FAB — Web React example (v0.9)
// Floating Action Button. Round, fixed bottom-end, primary CTA glow.

import { ButtonHTMLAttributes, ReactNode } from "react";

type Intent = "primary" | "ai";
type Size = "lg" | "xl";

export type FabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  "aria-label": string;
  intent?: Intent;
  size?: Size;
  position?: "bottom-end" | "bottom-start" | "bottom-center";
  children: ReactNode;
};

const INTENT: Record<Intent, string> = {
  primary: "lumen-btn-primary",
  ai:      "lumen-btn-ai",
};

const SIZE: Record<Size, string> = {
  lg: "lumen-btn-lg",
  xl: "lumen-btn-xl",
};

export function FAB({
  intent = "primary",
  size = "xl",
  position = "bottom-end",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: FabProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      data-position={position}
      {...props}
      className={[
        "lumen-btn",
        INTENT[intent],
        SIZE[size],
        "lumen-icon-button lumen-btn-round lumen-fab",
        intent === "primary" ? "lumen-glow-cta" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
