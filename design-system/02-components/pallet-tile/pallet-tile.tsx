/**
 * @lumen/pallet-tile — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Per-pallet card. Weight + dims + class + hazmat + lane. Mono numerics.
 */
import * as React from "react";
import { AlertTriangle, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { LaneCode } from "../lane-code/lane-code";

export type PalletStatus = "open" | "tendered" | "enroute" | "delivered";

export type PalletTileProps = {
  id: string;
  weightLbs?: number;
  dims?: { l: number; w: number; h: number };
  freightClass?: number;
  hazmat?: boolean;
  lane?: { origin: string; destination: string } | string;
  status?: PalletStatus;
  density?: "default" | "compact";
  draggable?: boolean;
  className?: string;
};

const STATUS_LABEL: Record<PalletStatus, string> = {
  open: "Open",
  tendered: "Tendered",
  enroute: "En route",
  delivered: "Delivered",
};

export function PalletTile({
  id,
  weightLbs,
  dims,
  freightClass,
  hazmat,
  lane,
  status,
  density = "default",
  draggable,
  className,
}: PalletTileProps) {
  const padding = density === "compact" ? "p-2" : "p-3";
  return (
    <div
      data-slot="pallet-tile"
      data-status={status || undefined}
      data-hazmat={hazmat || undefined}
      className={cn(
        "relative flex flex-col gap-1.5 bg-[var(--surface-raised)] border rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]",
        hazmat
          ? "border-[var(--lumen-amber-5)] bg-[var(--lumen-amber-0)]"
          : "border-[var(--border-hairline)]",
        padding,
        className,
      )}
    >
      {draggable && (
        <span
          aria-label={`Drag pallet ${id}`}
          role="button"
          tabIndex={0}
          className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[color:var(--text-tertiary)] cursor-grab"
        >
          <GripVertical size={12} aria-hidden />
        </span>
      )}
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <span className="lumen-mono lumen-tnum text-[length:var(--type-12)] font-semibold text-[color:var(--text-primary)]">
          {id}
        </span>
        {lane && (
          typeof lane === "string" ? (
            <span className="text-[length:var(--type-11)] text-[color:var(--text-secondary)] lumen-mono">{lane}</span>
          ) : (
            <LaneCode origin={lane.origin} destination={lane.destination} size="sm" />
          )
        )}
      </div>
      {/* Numeric row */}
      {(weightLbs != null || dims) && (
        <div className="flex items-center gap-3 lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-secondary)]">
          {weightLbs != null && (
            <span>
              <span className="text-[color:var(--text-tertiary)]">wt</span>{" "}
              <span className="text-[color:var(--text-primary)] font-medium">{weightLbs.toLocaleString()}</span>
              <span className="text-[color:var(--text-tertiary)] ml-0.5">lb</span>
            </span>
          )}
          {dims && (
            <span>
              <span className="text-[color:var(--text-tertiary)]">dim</span>{" "}
              <span className="text-[color:var(--text-primary)] font-medium">
                {dims.l}×{dims.w}×{dims.h}
              </span>
              <span className="text-[color:var(--text-tertiary)] ml-0.5">in</span>
            </span>
          )}
        </div>
      )}
      {/* Footer row */}
      {(freightClass != null || hazmat || status) && (
        <div className="flex items-center gap-2 text-[length:var(--type-10)]">
          {freightClass != null && (
            <span className="inline-flex items-center px-1.5 h-4 rounded-[var(--radius-xs)] bg-[var(--surface-sunken)] text-[color:var(--text-secondary)] lumen-mono lumen-tnum font-medium">
              CL {freightClass}
            </span>
          )}
          {hazmat && (
            <span className="inline-flex items-center gap-1 px-1.5 h-4 rounded-[var(--radius-xs)] bg-[var(--lumen-amber-2)] text-[color:var(--lumen-amber-9)] font-semibold tracking-[var(--tracking-wider)] uppercase">
              <AlertTriangle size={10} aria-hidden />
              <span>Hazmat</span>
            </span>
          )}
          {status && (
            <span className="ml-auto text-[color:var(--text-tertiary)] lumen-mono-cap tracking-[var(--tracking-wider)]">
              {STATUS_LABEL[status]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
