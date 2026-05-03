/**
 * v0.9 — FAB (Floating Action Button)
 * ----------------------------------------------------------------------------
 * A round, fixed-position primary action button. Sits at the bottom-right of
 * the viewport on mobile; offers single-tap access to the most common verb in
 * a flow (e.g., "+ New shipment").
 *
 * Material 3 floor for FAB is 56 × 56 dp; Lumen uses size.control.xl (56 px)
 * to match. Always honors the 44 px touch target floor.
 *
 * `aria-label` is REQUIRED.
 */

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button as LumenButton } from "./button";

type Intent = "primary" | "ai";
type Size = "lg" | "xl";

export type FabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  /** Required — FAB is icon-only on mobile; needs an accessible name. */
  "aria-label": string;
  intent?: Intent;
  size?: Size;
  /** Optional position override. Defaults to bottom-end via CSS. */
  position?: "bottom-end" | "bottom-start" | "bottom-center";
  children: ReactNode;
};

export const FAB = forwardRef<HTMLButtonElement, FabProps>(function FAB(
  { intent = "primary", size = "xl", position = "bottom-end", className, children, ...props },
  ref,
) {
  return (
    <LumenButton
      ref={ref}
      intent={intent}
      size={size}
      shape="round"
      glow={intent === "primary"}
      data-position={position}
      className={cn("lumen-fab lumen-icon-button", className)}
      {...props}
    >
      {children}
    </LumenButton>
  );
});
