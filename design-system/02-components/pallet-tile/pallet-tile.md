---
name: PalletTile
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - surface.tint-accent
  - text.primary
  - text.secondary
  - text.tertiary
  - border.hairline
  - border.strong
  - lumen.amber.5
  - lumen.amber.0
  - radius.md
  - shadow.sm
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["CrossDockGrid", "DockBay", "ShipmentTimeline", "LaneCode"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/pallet-tile"
---

# PalletTile

Individual pallet card. Weight + dimensions + hazmat flag + lane assignment + freight class. Mono numerics. Drag-handle slot for kanban-style reassignment. Hazmat flag is amber-tinted with a small ⚠ icon.

## When to use

- CrossDockGrid cells.
- Pallet assignment surfaces (drag-target).
- Manifest detail rows.
- Pallet inventory listings.

## Anatomy

1. Card root (hairline + bg + radius)
2. Pallet ID + Lane code (header row)
3. Weight + Dimensions (mono numeric row)
4. Freight class + Hazmat flag (footer row)
5. Optional drag handle (left edge)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Drag handle has aria-label='Drag pallet {id}'.
- Hazmat icon has visible label 'HAZMAT' for screen-reader users.
- Numbers use lumen-tnum + lumen-mono.

## Tokens consumed

- `surface.raised`
- `surface.tint-accent`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `border.hairline`
- `border.strong`
- `lumen.amber.5`
- `lumen.amber.0`
- `radius.md`
- `shadow.sm`

## Do

- Always show weight + dims.
- Highlight hazmat with amber + ⚠.
- Use compact density in CrossDockGrid.

## Don't

- Don't omit weight.
- Don't hide hazmat.

## Related

- CrossDockGrid
- DockBay
- ShipmentTimeline
- LaneCode

## Code

```tsx
import { PalletTile } from "@/components/ui/pallet-tile";

export function Example() {
  return <PalletTile id="PAL-1247" weightLbs={840} dims={{ l: 48, w: 40, h: 60 }} freightClass={100} lane={{ origin: "LAX", destination: "SFO" }} />;
}
```
