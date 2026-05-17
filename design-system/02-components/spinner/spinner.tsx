/**
 * @lumen/spinner — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Indeterminate loader; 0.9s rotation honors prefers-reduced-motion (CSS slows
 * it to 2s under the global @media rule).
 */
import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({
  size = 16,
  className = "",
  ...props
}: React.HTMLAttributes<SVGSVGElement> & { size?: number }) {
  return (
    <Loader2
      data-slot="spinner"
      size={size}
      strokeWidth={2.5}
      className={cn("lumen-spinner shrink-0 animate-spin motion-reduce:[animation-duration:2s]", className)}
      aria-label="Loading"
      role="status"
      style={{ animationDuration: "0.9s" }}
      {...props}
    />
  );
}
