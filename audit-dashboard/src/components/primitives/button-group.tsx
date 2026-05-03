/**
 * v0.9 — ButtonGroup (joined buttons)
 * ----------------------------------------------------------------------------
 * Renders a row of buttons that share a single rounded outline. Each child is
 * rendered with `borderRadius: 0` and offset by -1 px to overlap the borders.
 * Focus-visible lifts the focused button to z-index 1 so its ring isn't
 * clipped by neighbours.
 *
 * Use for:
 *   - Segmented filter rows ("All / Active / Done")
 *   - Toolbar action groups ("Cut / Copy / Paste")
 *   - Sort/density toggles
 *
 * For "Quote / Quote with AI" split-action use SplitButton instead.
 */

import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Pill mode — first/last child get full radius. Pair with shape="pill" on children for visual consistency. */
  pill?: boolean;
  children: ReactNode;
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ pill, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        className={cn("lumen-button-group", pill && "lumen-button-group-pill", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
