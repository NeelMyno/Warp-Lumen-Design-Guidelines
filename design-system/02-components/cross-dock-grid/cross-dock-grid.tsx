/**
 * @lumen/cross-dock-grid — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Top-down floor layout. Each cell = pallet position. Occupied cells tint by
 * destination lane via a 5-color rotation. Click for detail.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type Occupancy = {
  row: number;
  col: number;
  palletId: string;
  laneId: string;
};

const LANE_PALETTE: { bg: string; fg: string }[] = [
  { bg: "var(--lumen-accent-2)", fg: "var(--lumen-accent-9)" },
  { bg: "var(--lumen-cream-2)", fg: "var(--lumen-cream-9)" },
  { bg: "var(--lumen-amber-2)", fg: "var(--lumen-amber-9)" },
  { bg: "var(--lumen-red-2)", fg: "var(--lumen-red-9)" },
  { bg: "var(--lumen-cream-3)", fg: "var(--lumen-cream-9)" },
];

function paletteFor(laneId: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < laneId.length; i++) h = (h * 31 + laneId.charCodeAt(i)) >>> 0;
  return LANE_PALETTE[h % LANE_PALETTE.length];
}

export type CrossDockGridProps = {
  rows: number;
  cols: number;
  occupancy?: Occupancy[];
  onCellSelect?: (row: number, col: number, palletId?: string) => void;
  cellSize?: number;
  className?: string;
};

export function CrossDockGrid({
  rows,
  cols,
  occupancy = [],
  onCellSelect,
  cellSize = 28,
  className,
}: CrossDockGridProps) {
  const occMap = React.useMemo(() => {
    const m = new Map<string, Occupancy>();
    for (const o of occupancy) m.set(`${o.row},${o.col}`, o);
    return m;
  }, [occupancy]);

  const total = rows * cols;
  const occupied = occupancy.length;
  const utilization = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <div
      data-slot="cross-dock-grid"
      className={cn(
        "inline-flex flex-col gap-2 p-3 bg-[var(--surface-raised)] rounded-[var(--radius-md)] border border-[var(--border-hairline)]",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
          Cross-dock floor
        </span>
        <span className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-secondary)]">
          {occupied}/{total} · {utilization}%
        </span>
      </div>
      <div
        role="grid"
        aria-label={`Cross-dock grid ${rows} rows × ${cols} columns`}
        className="inline-grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: total }).map((_, idx) => {
          const r = Math.floor(idx / cols) + 1;
          const c = (idx % cols) + 1;
          const occ = occMap.get(`${r},${c}`);
          const palette = occ ? paletteFor(occ.laneId) : null;
          return (
            <button
              key={idx}
              type="button"
              role="gridcell"
              onClick={() => onCellSelect?.(r, c, occ?.palletId)}
              aria-label={
                occ
                  ? `Row ${r} col ${c}, pallet ${occ.palletId}, lane ${occ.laneId}`
                  : `Row ${r} col ${c}, empty`
              }
              title={occ ? `${occ.palletId} · ${occ.laneId}` : `(${r}, ${c})`}
              className={cn(
                "rounded-[var(--radius-xs)] transition-transform duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
                "hover:scale-[1.08] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
                occ
                  ? "border border-[var(--border-hairline)]"
                  : "bg-[var(--surface-sunken)] border border-transparent",
              )}
              style={
                palette
                  ? {
                      background: palette.bg,
                      color: palette.fg,
                      width: cellSize,
                      height: cellSize,
                    }
                  : { width: cellSize, height: cellSize }
              }
            />
          );
        })}
      </div>
    </div>
  );
}
