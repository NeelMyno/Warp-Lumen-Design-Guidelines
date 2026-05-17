"use client";

/**
 * @lumen/lane-arc — v0.13 Phase 2 freight-domain primitive.
 * ----------------------------------------------------------------------------
 * SVG arc renderer with mount-time draw-in via stroke-dasharray. Honors
 * prefers-reduced-motion (renders instantly).
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type Pt = { x: number; y: number };

function resolveCoord(c: number, total: number): number {
  return c <= 1 ? c * total : c;
}

export function LaneArc({
  start,
  end,
  curve = 0.3,
  width = 320,
  height = 160,
  color = "var(--color-accent)",
  animated = true,
  label,
  className,
}: {
  start: Pt;
  end: Pt;
  curve?: number;
  width?: number;
  height?: number;
  color?: string;
  animated?: boolean;
  label?: string;
  className?: string;
}) {
  const x1 = resolveCoord(start.x, width);
  const y1 = resolveCoord(start.y, height);
  const x2 = resolveCoord(end.x, width);
  const y2 = resolveCoord(end.y, height);
  // Quadratic Bezier control point — perpendicular offset at midpoint.
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const offset = len * curve;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  const path = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  const dash = Math.ceil(Math.PI * Math.hypot(cx - x1, cy - y1));

  return (
    <svg
      data-slot="lane-arc"
      role="img"
      aria-label={label ?? "Lane arc"}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block", className)}
    >
      <defs>
        <marker id="lumen-lane-arc-end" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      {/* base ground line — faint */}
      <line x1="0" y1={height - 1} x2={width} y2={height - 1} stroke="var(--surface-sunken)" strokeWidth="1" />

      {/* arc — animated draw-in via stroke-dasharray */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#lumen-lane-arc-end)"
        style={{
          strokeDasharray: dash,
          strokeDashoffset: animated ? dash : 0,
          animation: animated ? "lumen-lane-arc-draw 1200ms cubic-bezier(0.2,0,0,1) forwards" : "none",
        }}
      />
      {/* origin marker */}
      <circle cx={x1} cy={y1} r="3" fill={color} />
      <circle cx={x1} cy={y1} r="6" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* destination marker */}
      <circle cx={x2} cy={y2} r="3" fill={color} />

      <style>{`
        @keyframes lumen-lane-arc-draw {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          path { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </svg>
  );
}
