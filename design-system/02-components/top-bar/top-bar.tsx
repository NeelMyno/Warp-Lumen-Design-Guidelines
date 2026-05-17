/**
 * @lumen/top-bar — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Horizontal app chrome — brand mark + breadcrumb + search trigger + user menu.
 * h-14 sticky-top, hairline bottom border. Mode-agnostic.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export function TopBar({
  children,
  className,
  sticky = true,
}: React.HTMLAttributes<HTMLElement> & { sticky?: boolean }) {
  return (
    <header
      data-slot="top-bar"
      data-sticky={sticky || undefined}
      className={cn(
        "h-14 flex items-center gap-4 px-4 bg-[var(--surface-canvas)] text-[color:var(--text-primary)] border-b border-[var(--border-hairline)]",
        sticky && "sticky top-0 z-[var(--z-sticky)]",
        className,
      )}
    >
      {children}
    </header>
  );
}

export function TopBarLeft({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="top-bar-left" className={cn("flex items-center gap-3 shrink-0", className)}>
      {children}
    </div>
  );
}

export function TopBarCenter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="top-bar-center" className={cn("flex-1 flex items-center justify-center min-w-0 gap-2", className)}>
      {children}
    </div>
  );
}

export function TopBarRight({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="top-bar-right" className={cn("flex items-center gap-2 shrink-0", className)}>
      {children}
    </div>
  );
}
