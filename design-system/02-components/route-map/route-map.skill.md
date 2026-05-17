---
name: lumen-route-map
description: Use to visualize routes on a map. Default renderer is a stylized SVG placeholder (no external map dep) — good for prototyping. Pass `mapProvider` for production (Mapbox / Leaflet / Google). Lanes render as curved arcs (LaneArc); markers for endpoints; optional pulsing truck pin for live tracking.
---

# Lumen RouteMap

Bounded map surface with lane overlays + pickup/dropoff markers + optional live truck position pin. Provider-agnostic — accepts a map renderer prop (default: a stylized SVG placeholder for prototyping). Consumers pass Mapbox/Leaflet/Google instances as `mapProvider` for production.

## Use when

- Shipment tracking page (single route + live pin).
- Lane analytics (multiple lanes overlaid).
- Carrier coverage area map.

## NEVER

- NEVER ship the default placeholder to production.
- NEVER mix more than 5 overlaid lanes (visual noise).

## Tokens consumed

- surface.canvas
- surface.sunken
- color.accent
- border.hairline
- text.primary
- text.tertiary
- radius.lg

## Anatomy

1. Map canvas (configurable w × h, hairline border, radius-lg)
2. Optional base map (SVG placeholder OR consumer-provided renderer)
3. Lane arcs (LaneArc components)
4. Endpoint markers (origin + destination)
5. Optional live truck pin (LiveDot)

## API

- `lanes` — { id, origin: {x,y}, destination: {x,y}, label? }[].
- `truck` — { x, y, label?, active? } (renders LiveDot at coords).
- `width`, `height` — canvas px.
- `mapProvider` — optional consumer-rendered base map.
- `label` — aria-label.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- role=img + aria-label.
- Each lane has an inner aria-label on its LaneArc.

## Code (canonical)

```tsx
import { RouteMap } from "@/components/ui/route-map";

export function Example() {
  return (
    <RouteMap
      lanes={[{ id: "1", origin: { x: 0.1, y: 0.8 }, destination: { x: 0.9, y: 0.2 } }]}
      truck={{ x: 0.5, y: 0.5, active: true }}
      width={480}
      height={240}
    />
  );
}
```

## Related

- LaneArc
- LaneCode
- LiveDot
- ShipmentTimeline
