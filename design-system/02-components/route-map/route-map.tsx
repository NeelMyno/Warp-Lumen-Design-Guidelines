"use client";

/**
 * @lumen/route-map — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Provider-agnostic map. Default renderer = stylized SVG placeholder (no
 * external map dep). Swap to Mapbox / Leaflet / Google via `mapProvider` prop.
 * Lane arcs + endpoint markers + optional live truck pin.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { LaneArc } from "../lane-arc/lane-arc";
import { LiveDot } from "../live-dot/live-dot";

type Pt = { x: number; y: number };

export type RouteLane = {
  id: string;
  origin: Pt;
  destination: Pt;
  label?: string;
  color?: string;
};

export type RouteMapProps = {
  lanes?: RouteLane[];
  truck?: { x: number; y: number; label?: string; active?: boolean };
  width?: number;
  height?: number;
  mapProvider?: React.ReactNode;
  label?: string;
  className?: string;
};

function PlaceholderBaseMap({ width, height }: { width: number; height: number }) {
  // Subtle dotted grid that suggests "map area" without claiming geography.
  const dotR = 1;
  const step = 24;
  const dots: React.ReactNode[] = [];
  for (let y = step; y < height; y += step) {
    for (let x = step; x < width; x += step) {
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={dotR}
          fill="var(--border-hairline)"
        />,
      );
    }
  }
  return <g aria-hidden>{dots}</g>;
}

export function RouteMap({
  lanes = [],
  truck,
  width = 480,
  height = 240,
  mapProvider,
  label = "Route map",
  className,
}: RouteMapProps) {
  return (
    <div
      data-slot="route-map"
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden border border-[var(--border-hairline)] bg-[var(--surface-sunken)] rounded-[var(--radius-lg)]",
        className,
      )}
      style={{ width, height }}
    >
      {mapProvider ? (
        <div className="absolute inset-0">{mapProvider}</div>
      ) : (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
          <PlaceholderBaseMap width={width} height={height} />
        </svg>
      )}
      {/* Overlay lanes */}
      <div className="absolute inset-0">
        {lanes.map((l) => (
          <div key={l.id} className="absolute inset-0">
            <LaneArc
              start={l.origin}
              end={l.destination}
              color={l.color}
              width={width}
              height={height}
              label={l.label}
              animated={false}
            />
          </div>
        ))}
      </div>
      {/* Truck pin */}
      {truck && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: (truck.x <= 1 ? truck.x * width : truck.x) + "px",
            top: (truck.y <= 1 ? truck.y * height : truck.y) + "px",
          }}
        >
          {truck.active ? <LiveDot label={truck.label} hideLabel={!truck.label} /> : (
            <span
              aria-label={truck.label ?? "Truck position"}
              className="size-2.5 rounded-full bg-[var(--color-accent)] block ring-2 ring-[var(--surface-canvas)]"
            />
          )}
        </span>
      )}
    </div>
  );
}
