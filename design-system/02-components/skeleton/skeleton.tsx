/**
 * @lumen/skeleton — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Loading placeholder with animate-pulse from tw-animate-css. Honors
 * prefers-reduced-motion (drops the pulse). Always aria-hidden — parent sets
 * aria-busy.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export function Skeleton({
  width,
  height = 14,
  className = "",
  rounded = "var(--radius-sm)",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string;
  height?: number | string;
  rounded?: string;
}) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "inline-block bg-[var(--surface-sunken)] animate-pulse",
        "motion-reduce:animate-none",
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width ?? "100%",
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: rounded,
      }}
      {...props}
    />
  );
}
