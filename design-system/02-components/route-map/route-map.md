---
name: RouteMap
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.canvas
  - surface.sunken
  - color.accent
  - border.hairline
  - text.primary
  - text.tertiary
  - radius.lg
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["LaneArc", "LaneCode", "LiveDot", "ShipmentTimeline"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/route-map"
---

# RouteMap

Bounded map surface with lane overlays + pickup/dropoff markers + optional live truck position pin. Provider-agnostic — accepts a map renderer prop (default: a stylized SVG placeholder for prototyping). Consumers pass Mapbox/Leaflet/Google instances as `mapProvider` for production.

## When to use

- Shipment tracking page (single route + live pin).
- Lane analytics (multiple lanes overlaid).
- Carrier coverage area map.

## Anatomy

1. Map canvas (configurable w × h, hairline border, radius-lg)
2. Optional base map (SVG placeholder OR consumer-provided renderer)
3. Lane arcs (LaneArc components)
4. Endpoint markers (origin + destination)
5. Optional live truck pin (LiveDot)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- role=img + aria-label.
- Each lane has an inner aria-label on its LaneArc.

## Tokens consumed

- `surface.canvas`
- `surface.sunken`
- `color.accent`
- `border.hairline`
- `text.primary`
- `text.tertiary`
- `radius.lg`

## Do

- Use default placeholder for prototypes.
- Swap to a real map provider for prod.

## Don't

- Don't ship the placeholder.
- Don't overlay 6+ lanes.

## Related

- LaneArc
- LaneCode
- LiveDot
- ShipmentTimeline

## Code

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
