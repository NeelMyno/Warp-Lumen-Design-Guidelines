---
name: lumen-pallet-tile
description: Use in CrossDockGrid cells, pallet-assignment surfaces, manifest detail rows. Compact density default; padded variant for hover/edit. Hazmat = amber border + flag. For top-down floor layout use @lumen/cross-dock-grid.
---

# Lumen PalletTile

Individual pallet card. Weight + dimensions + hazmat flag + lane assignment + freight class. Mono numerics. Drag-handle slot for kanban-style reassignment. Hazmat flag is amber-tinted with a small ⚠ icon.

## Use when

- CrossDockGrid cells.
- Pallet assignment surfaces (drag-target).
- Manifest detail rows.
- Pallet inventory listings.

## NEVER

- NEVER omit weight + dims — they're the load-bearing identity.
- NEVER use Pallet for non-freight items (cartons → use CartonTile).
- NEVER hide hazmat flag — regulatory requirement.

## Tokens consumed

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

## Anatomy

1. Card root (hairline + bg + radius)
2. Pallet ID + Lane code (header row)
3. Weight + Dimensions (mono numeric row)
4. Freight class + Hazmat flag (footer row)
5. Optional drag handle (left edge)

## API

- `id` — string (PAL-XXXX).
- `weightLbs` — number.
- `dims` — { l, w, h } inches.
- `freightClass` — number (50, 60, 70, 85, 100, 125, 150, 175, 200, 250, 300, 400, 500).
- `hazmat` — boolean.
- `lane` — { origin, destination } or string.
- `status` — open | tendered | enroute | delivered.
- `onDrag` — drag handler (optional).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Drag handle has aria-label='Drag pallet {id}'.
- Hazmat icon has visible label 'HAZMAT' for screen-reader users.
- Numbers use lumen-tnum + lumen-mono.

## Code (canonical)

```tsx
import { PalletTile } from "@/components/ui/pallet-tile";

export function Example() {
  return <PalletTile id="PAL-1247" weightLbs={840} dims={{ l: 48, w: 40, h: 60 }} freightClass={100} lane={{ origin: "LAX", destination: "SFO" }} />;
}
```

## Related

- CrossDockGrid
- DockBay
- ShipmentTimeline
- LaneCode
