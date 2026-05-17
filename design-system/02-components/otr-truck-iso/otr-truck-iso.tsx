/**
 * @lumen/otr-truck-iso — v0.13 Phase 2 freight-domain illustration.
 * ----------------------------------------------------------------------------
 * Inline SVG placeholder. Phase 4 swaps the SVG body for a gpt-image-2-generated
 * atmospheric render via the prompt library; this public API stays stable.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const SIZE_MAP: Record<"sm" | "md" | "lg", number> = {
  sm: 64,
  md: 96,
  lg: 160,
};

export type OTRTruckIsoProps = {
  size?: "sm" | "md" | "lg" | number;
  tint?: "accent" | "neutral";
  label?: string;
  className?: string;
};

export function OTRTruckIso({ size = "md", tint = "accent", label = "Long-haul truck", className }: OTRTruckIsoProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const cab = tint === "accent" ? "var(--color-accent)" : "var(--text-tertiary)";
  const body = "var(--text-tertiary)";

  return (
    <svg
      data-slot="otr-truck-iso"
      role="img"
      aria-label={label}
      width={px}
      height={px * 0.6}
      viewBox="0 0 160 96"
      className={cn("block", className)}
    >
      {/* Trailer body (isometric box) */}
      <g stroke={body} strokeWidth="1.5" strokeLinejoin="round" fill="none">
        <path d="M20,60 L20,28 L84,16 L84,48 Z" />
        <path d="M20,60 L84,48 L130,55 L66,67 Z" />
        <path d="M84,16 L130,22 L130,55 L84,48 Z" />
        {/* Trailer slats */}
        <line x1="38" y1="55" x2="38" y2="24" />
        <line x1="56" y1="51" x2="56" y2="20" />
        <line x1="72" y1="49" x2="72" y2="18" />
      </g>
      {/* Cab */}
      <g stroke={cab} strokeWidth="1.5" strokeLinejoin="round" fill="none">
        <path d="M130,30 L150,30 L150,55 L130,55 Z" />
        <path d="M130,55 L150,55 L156,60 L136,60 Z" />
        <path d="M150,30 L156,35 L156,60 L150,55 Z" />
        {/* Windshield */}
        <path d="M132,32 L148,32 L148,42 L132,42 Z" fill={cab} fillOpacity="0.12" />
      </g>
      {/* Wheels */}
      <g fill={body}>
        <circle cx="30" cy="72" r="5" />
        <circle cx="60" cy="76" r="5" />
        <circle cx="120" cy="68" r="5" />
        <circle cx="146" cy="71" r="5" />
      </g>
      {/* Ground line */}
      <line x1="0" y1="92" x2="160" y2="92" stroke="var(--border-hairline)" strokeWidth="1" />
    </svg>
  );
}
