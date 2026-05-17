---
name: lumen-dock-bay
description: Use to visualize cross-dock floor occupancy. State-coded: open=success, occupied=neutral, reserved=info, out=danger. Pass `bays={[]}` to render; consumer wires onClick for drill-in. For top-down pallet-cell view inside an occupied bay use @lumen/cross-dock-grid.
---

# Lumen DockBay

Grid of dock-bay cards. Each bay shows: bay number (mono), state (open / occupied / reserved / out-of-service), optional carrier + ETA. Color-coded by state via PILL tokens. Click to drill into bay detail.

## Use when

- Cross-dock floor overview.
- Dock scheduling dashboard.
- Bay-by-bay occupancy at a glance.

## NEVER

- NEVER mix occupied + open + reserved without distinct colors.
- NEVER fake an ETA (omit if unknown — don't show 'TBD' as a number).

## Tokens consumed

- surface.raised
- surface.sunken
- text.primary
- text.secondary
- text.tertiary
- border.hairline
- pill.success.bg
- pill.success.fg
- pill.neutral.bg
- pill.neutral.fg
- pill.info.bg
- pill.info.fg
- pill.danger.bg
- pill.danger.fg
- radius.md
- radius.xs

## Anatomy

1. Grid root (configurable cols)
2. Bay card (radius-md hairline border)
3. Bay number (lumen-mono-cap, large)
4. State chip (PILL tone)
5. Optional carrier badge + ETA

## API

- `bays` — { id, number, state, carrier?, eta? }[].
- `cols` — number (default 6).
- `onSelect` — (id) => void.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Each bay card is a <button> with aria-label='Bay {number}, {state}{', carrier ' + carrier}{', ETA ' + eta}'.
- Grid uses role=grid; cells role=gridcell.

## Code (canonical)

```tsx
import { DockBay } from "@/components/ui/dock-bay";

export function Example() {
  return <DockBay bays={[
    { id: "1", number: 1, state: "open" },
    { id: "2", number: 2, state: "occupied", carrier: "Sterling LTL", eta: "08:30" },
  ]} />;
}
```

## Related

- CrossDockGrid
- ShipmentTimeline
- CarrierBadge
- PalletTile
