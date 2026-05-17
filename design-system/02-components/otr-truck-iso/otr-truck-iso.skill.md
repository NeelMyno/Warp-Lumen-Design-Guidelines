---
name: lumen-otr-truck-iso
description: Use anywhere a truck illustration belongs — landing hero, empty state, marketing cards. Three sizes (sm/md/lg). Phase 4 will replace the inline SVG body with a generated atmospheric render via the @import 05-prompts/style-anchor.md prompt; the public API stays stable. NEVER use a stock photo or hand-drawn raster — Lumen iconography contract.
---

# Lumen OTRTruckIso

Reusable isometric truck illustration. v0.13 Phase 2 ships an inline SVG line-art placeholder (~1.5px stroke, single-accent tint). Phase 4 will swap the SVG body for a gpt-image-2-generated atmospheric render via the prompt library. Public API stays stable across both versions.

## Use when

- Landing hero (medium / large).
- Empty state — 'No shipments yet'.
- Marketing card / pricing tier illustration.

## NEVER

- NEVER use a stock photo for trucks.
- NEVER replace with raster.
- NEVER use as a clickable affordance (it's illustrative, not interactive).

## Tokens consumed

- text.tertiary
- color.accent

## Anatomy

1. SVG canvas (configurable size)
2. Isometric truck body (line art)
3. Optional accent color tint on the cab

## API

- `size` — sm (64px) | md (96px) | lg (160px) | number (custom px).
- `tint` — 'accent' (lime cab) | 'neutral' (full tertiary).
- `label` — optional aria-label.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- role=img + aria-label (default: 'Long-haul truck').
- aria-hidden if purely decorative.

## Code (canonical)

```tsx
import { OTRTruckIso } from "@/components/ui/otr-truck-iso";

export function Example() {
  return <OTRTruckIso size="lg" tint="accent" />;
}
```

## Related

- PalletTile
- DockBay
- LaneArc
- RouteMap
