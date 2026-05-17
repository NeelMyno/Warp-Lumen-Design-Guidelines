/**
 * @lumen/lane-code — v0.13 Phase 2 freight-domain primitive.
 * ----------------------------------------------------------------------------
 * Lane identifier — `LAX → SFO` (U+2192 arrow). Mono numerics. Optional inline
 * rate. Compact horizontal pill with optional hairline border.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const SIZE: Record<"sm" | "md", { text: string; px: string; gap: string; h: string }> = {
  sm: { text: "text-[length:var(--type-11)]", px: "px-1.5", gap: "gap-1", h: "h-5" },
  md: { text: "text-[length:var(--type-13)]", px: "px-2", gap: "gap-1.5", h: "h-6" },
};

export function LaneCode({
  origin,
  destination,
  rate,
  size = "md",
  bordered = false,
  className,
}: {
  origin: string;
  destination: string;
  rate?: string;
  size?: "sm" | "md";
  bordered?: boolean;
  className?: string;
}) {
  const s = SIZE[size];
  const aria = `Lane ${origin} to ${destination}${rate ? `, rate ${rate}` : ""}`;
  return (
    <span
      data-slot="lane-code"
      data-bordered={bordered || undefined}
      aria-label={aria}
      className={cn(
        "inline-flex items-center align-middle whitespace-nowrap lumen-mono lumen-tnum",
        s.text,
        s.gap,
        bordered &&
          cn(
            "border border-[var(--border-hairline)] rounded-[var(--radius-xs)]",
            s.px,
            s.h,
          ),
        className,
      )}
    >
      <span className="font-medium text-[color:var(--text-primary)] tracking-[0.04em] uppercase">
        {origin}
      </span>
      <span aria-hidden className="text-[color:var(--text-tertiary)]">
        →
      </span>
      <span className="font-medium text-[color:var(--text-primary)] tracking-[0.04em] uppercase">
        {destination}
      </span>
      {rate && (
        <>
          <span aria-hidden className="text-[color:var(--text-tertiary)] mx-0.5">
            ·
          </span>
          <span className="text-[color:var(--text-accent)] font-semibold">{rate}</span>
        </>
      )}
    </span>
  );
}
