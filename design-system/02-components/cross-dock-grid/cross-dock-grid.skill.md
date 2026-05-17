---
name: lumen-cross-dock-grid
description: Use to visualize cross-dock floor utilization at a glance. Each cell is a pallet position; occupied cells tint by destination lane (5-lane rotation: accent / cream / amber / red / cream). Click a cell to drill into PalletTile detail. For per-pallet card view use @lumen/pallet-tile.
---

# Lumen CrossDockGrid

Top-down floor layout. Each cell = pallet position; color-coded by destination lane. Hover for pallet detail; click to drill in. Configurable rows × cols. Empty cells use surface-sunken; occupied cells inherit the lane's tinted color from a palette rotation.

## Use when

- Cross-dock floor overview.
- Pallet utilization dashboard.
- Live floor monitoring during shift.

## NEVER

- NEVER use 10+ distinct lane colors — palette is 5-rotation.
- NEVER omit the hover state (it's the affordance).

## Tokens consumed

- surface.raised
- surface.sunken
- lumen.accent.2
- lumen.accent.9
- lumen.cream.2
- lumen.amber.2
- lumen.red.2
- text.primary
- text.tertiary
- border.hairline
- radius.xs

## Anatomy

1. Grid root (configurable rows × cols)
2. Cell — empty (sunken) | occupied (lane-tinted)
3. Optional aisle gap visualizer
4. Hover popover for pallet detail

## API

- `rows`, `cols` — grid size.
- `occupancy` — { row, col, palletId, laneId }[].
- `onCellSelect` — (row, col, palletId?) => void.
- `aisleAt` — { rows?, cols? } — gap positions.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Grid uses role=grid; cells role=gridcell.
- Each cell has aria-label='Row {r} col {c}, {occupied?'pallet ' + id + ', lane ' + lane:'empty'}'.
- Keyboard navigation via arrow keys.

## Code (canonical)

```tsx
import { CrossDockGrid } from "@/components/ui/cross-dock-grid";

export function Example() {
  return (
    <CrossDockGrid
      rows={6}
      cols={12}
      occupancy={[
        { row: 1, col: 1, palletId: "PAL-1", laneId: "lax-sfo" },
        { row: 1, col: 2, palletId: "PAL-2", laneId: "ord-atl" },
      ]}
    />
  );
}
```

## Related

- DockBay
- PalletTile
- ShipmentTimeline
