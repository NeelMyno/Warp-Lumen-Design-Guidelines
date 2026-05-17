---
name: CrossDockGrid
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["DockBay", "PalletTile", "ShipmentTimeline"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/cross-dock-grid"
---

# CrossDockGrid

Top-down floor layout. Each cell = pallet position; color-coded by destination lane. Hover for pallet detail; click to drill in. Configurable rows × cols. Empty cells use surface-sunken; occupied cells inherit the lane's tinted color from a palette rotation.

## When to use

- Cross-dock floor overview.
- Pallet utilization dashboard.
- Live floor monitoring during shift.

## Anatomy

1. Grid root (configurable rows × cols)
2. Cell — empty (sunken) | occupied (lane-tinted)
3. Optional aisle gap visualizer
4. Hover popover for pallet detail

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Grid uses role=grid; cells role=gridcell.
- Each cell has aria-label='Row {r} col {c}, {occupied?'pallet ' + id + ', lane ' + lane:'empty'}'.
- Keyboard navigation via arrow keys.

## Tokens consumed

- `surface.raised`
- `surface.sunken`
- `lumen.accent.2`
- `lumen.accent.9`
- `lumen.cream.2`
- `lumen.amber.2`
- `lumen.red.2`
- `text.primary`
- `text.tertiary`
- `border.hairline`
- `radius.xs`

## Do

- Use 5-color lane palette.
- Show occupancy at a glance.
- Hover to drill in.

## Don't

- Don't use 10+ colors.
- Don't omit hover.

## Related

- DockBay
- PalletTile
- ShipmentTimeline

## Code

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
