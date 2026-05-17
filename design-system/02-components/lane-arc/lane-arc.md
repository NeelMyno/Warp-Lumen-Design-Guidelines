---
name: LaneArc
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - color.accent
  - text.tertiary
  - surface.sunken
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["LaneCode", "RouteMap", "ShipmentTimeline"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/lane-arc"
---

# LaneArc

SVG arc renderer over a faint base map. The arc draws in on mount via stroke-dasharray animation (cubic-bezier(0.2,0,0,1), 1200ms). Lime-accent tinted by default. Origin + destination markers at endpoints. Honors prefers-reduced-motion (arc renders instantly).

## When to use

- Landing hero — animated route arc on a map placeholder.
- Route overview surface — single arc highlight.
- Empty state on a routes surface — illustrative arc.

## Anatomy

1. SVG canvas (configurable width × height)
2. Quadratic Bezier curve (computed from start, end, optional control)
3. Origin marker (circle)
4. Destination marker (filled circle + arrow)
5. Stroke-dasharray reveal animation

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- role=img + aria-label='Route from {origin} to {destination}'.
- Honors prefers-reduced-motion (no draw-in).

## Tokens consumed

- `color.accent`
- `text.tertiary`
- `surface.sunken`

## Do

- Use on hero surfaces.
- Provide aria-label.

## Don't

- Don't stack 4+.
- Don't speed faster than 800ms.

## Related

- LaneCode
- RouteMap
- ShipmentTimeline

## Code

```tsx
import { LaneArc } from "@/components/ui/lane-arc";

export function Example() {
  return <LaneArc start={{ x: 0.1, y: 0.8 }} end={{ x: 0.9, y: 0.2 }} label="LAX to SFO" />;
}
```
