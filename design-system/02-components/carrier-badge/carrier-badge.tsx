/**
 * @lumen/carrier-badge — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Carrier identity chip: logo + name + vehicle + rating + OTD%. OTD% colors
 * via tier (≥97 success, 93–97 neutral, <93 danger). Per privacy rule —
 * carrier names are real B2B carriers; person names use synthetic operators.
 */
import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type CarrierBadgeProps = {
  name: string;
  logoSrc?: string;
  vehicle?: "FTL" | "LTL" | "Reefer" | "Flatbed" | "Drayage";
  rating?: number;
  otdPct?: number;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
  className?: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function otdTone(pct: number): { bg: string; fg: string } {
  if (pct >= 97) {
    return { bg: "var(--pill-success-bg)", fg: "var(--pill-success-fg)" };
  }
  if (pct >= 93) {
    return { bg: "var(--pill-neutral-bg)", fg: "var(--pill-neutral-fg)" };
  }
  return { bg: "var(--pill-danger-bg)", fg: "var(--pill-danger-fg)" };
}

const SIZE: Record<"sm" | "md" | "lg", { logo: string; name: string; row: string }> = {
  sm: { logo: "size-5 text-[10px]", name: "text-[length:var(--type-12)]", row: "gap-1.5" },
  md: { logo: "size-7 text-[length:var(--type-12)]", name: "text-[length:var(--type-13)]", row: "gap-2" },
  lg: { logo: "size-9 text-[length:var(--type-14)]", name: "text-[length:var(--type-14)]", row: "gap-2.5" },
};

export function CarrierBadge({
  name,
  logoSrc,
  vehicle,
  rating,
  otdPct,
  size = "md",
  compact,
  className,
}: CarrierBadgeProps) {
  const s = SIZE[size];
  const tone = otdPct != null ? otdTone(otdPct) : null;
  const aria = `Carrier: ${name}${vehicle ? `, ${vehicle}` : ""}${
    rating != null ? `, ${rating} stars` : ""
  }${otdPct != null ? `, ${otdPct.toFixed(1)} percent on-time` : ""}`;

  return (
    <span
      data-slot="carrier-badge"
      aria-label={aria}
      className={cn("inline-flex items-center align-middle", s.row, className)}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-[var(--surface-sunken)] text-[color:var(--text-secondary)] font-semibold shrink-0 overflow-hidden",
          s.logo,
        )}
      >
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="" className="size-full object-cover" />
        ) : (
          initials(name)
        )}
      </span>
      <span className="flex items-center gap-1.5 min-w-0">
        <span className={cn("font-medium text-[color:var(--text-primary)] truncate", s.name)}>{name}</span>
        {!compact && vehicle && (
          <span className="text-[color:var(--text-tertiary)] text-[length:var(--type-11)] lumen-mono-cap tracking-[var(--tracking-wider)]">
            {vehicle}
          </span>
        )}
        {!compact && rating != null && (
          <span className="inline-flex items-center gap-0.5 text-[color:var(--text-secondary)] text-[length:var(--type-11)] lumen-tnum">
            <Star size={10} aria-hidden className="fill-current text-[color:var(--text-accent)]" />
            {rating.toFixed(1)}
          </span>
        )}
        {otdPct != null && tone && (
          <span
            className="ml-1 inline-flex items-center h-4 px-1.5 rounded-[var(--radius-full)] text-[length:var(--type-10)] font-medium lumen-tnum"
            style={{ background: tone.bg, color: tone.fg }}
          >
            {otdPct.toFixed(1)}% OTD
          </span>
        )}
      </span>
    </span>
  );
}
