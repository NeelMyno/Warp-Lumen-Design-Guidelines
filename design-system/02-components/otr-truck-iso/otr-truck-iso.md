---
name: OTRTruckIso
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - text.tertiary
  - color.accent
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["PalletTile", "DockBay", "LaneArc", "RouteMap"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/otr-truck-iso"
---

# OTRTruckIso

Reusable isometric truck illustration. v0.13 Phase 2 ships an inline SVG line-art placeholder (~1.5px stroke, single-accent tint). Phase 4 will swap the SVG body for a gpt-image-2-generated atmospheric render via the prompt library. Public API stays stable across both versions.

## When to use

- Landing hero (medium / large).
- Empty state — 'No shipments yet'.
- Marketing card / pricing tier illustration.

## Anatomy

1. SVG canvas (configurable size)
2. Isometric truck body (line art)
3. Optional accent color tint on the cab

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- role=img + aria-label (default: 'Long-haul truck').
- aria-hidden if purely decorative.

## Tokens consumed

- `text.tertiary`
- `color.accent`

## Do

- Use Phase 4 generated render when available.
- Use accent tint sparingly.

## Don't

- Don't use stock photos.
- Don't make interactive.

## Related

- PalletTile
- DockBay
- LaneArc
- RouteMap

## Code

```tsx
import { OTRTruckIso } from "@/components/ui/otr-truck-iso";

export function Example() {
  return <OTRTruckIso size="lg" tint="accent" />;
}
```
