---
name: lumen-lane-arc
description: Use to visualize a freight lane as a curved arc on a base map (or empty canvas). The animated draw-in is a peak-end moment — landing heroes, route-overview surfaces. For raw code-only label use @lumen/lane-code.
---

# Lumen LaneArc

SVG arc renderer over a faint base map. The arc draws in on mount via stroke-dasharray animation (cubic-bezier(0.2,0,0,1), 1200ms). Lime-accent tinted by default. Origin + destination markers at endpoints. Honors prefers-reduced-motion (arc renders instantly).

## Use when

- Landing hero — animated route arc on a map placeholder.
- Route overview surface — single arc highlight.
- Empty state on a routes surface — illustrative arc.

## NEVER

- NEVER use LaneArc as a static decoration — the animation is the point.
- NEVER stack more than 3 arcs (visual noise).
- NEVER animate faster than 800ms.

## Tokens consumed

- color.accent
- text.tertiary
- surface.sunken

## Anatomy

1. SVG canvas (configurable width × height)
2. Quadratic Bezier curve (computed from start, end, optional control)
3. Origin marker (circle)
4. Destination marker (filled circle + arrow)
5. Stroke-dasharray reveal animation

## API

- `start` — { x, y } 0–1 normalized coords or px.
- `end` — { x, y }.
- `curve` — 0–1 curve height (default 0.3).
- `width`, `height` — canvas px (default 320 × 160).
- `color` — stroke color (default --color-accent).
- `animated` — boolean (default true).
- `label` — optional alt text.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- role=img + aria-label='Route from {origin} to {destination}'.
- Honors prefers-reduced-motion (no draw-in).

## Code (canonical)

```tsx
import { LaneArc } from "@/components/ui/lane-arc";

export function Example() {
  return <LaneArc start={{ x: 0.1, y: 0.8 }} end={{ x: 0.9, y: 0.2 }} label="LAX to SFO" />;
}
```

## Related

- LaneCode
- RouteMap
- ShipmentTimeline
