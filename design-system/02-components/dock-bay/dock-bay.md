---
name: DockBay
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["CrossDockGrid", "ShipmentTimeline", "CarrierBadge", "PalletTile"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/dock-bay"
---

# DockBay

Grid of dock-bay cards. Each bay shows: bay number (mono), state (open / occupied / reserved / out-of-service), optional carrier + ETA. Color-coded by state via PILL tokens. Click to drill into bay detail.

## When to use

- Cross-dock floor overview.
- Dock scheduling dashboard.
- Bay-by-bay occupancy at a glance.

## Anatomy

1. Grid root (configurable cols)
2. Bay card (radius-md hairline border)
3. Bay number (lumen-mono-cap, large)
4. State chip (PILL tone)
5. Optional carrier badge + ETA

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Each bay card is a <button> with aria-label='Bay {number}, {state}{', carrier ' + carrier}{', ETA ' + eta}'.
- Grid uses role=grid; cells role=gridcell.

## Tokens consumed

- `surface.raised`
- `surface.sunken`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `border.hairline`
- `pill.success.bg`
- `pill.success.fg`
- `pill.neutral.bg`
- `pill.neutral.fg`
- `pill.info.bg`
- `pill.info.fg`
- `pill.danger.bg`
- `pill.danger.fg`
- `radius.md`
- `radius.xs`

## Do

- Use 5-7 cols on desktop; 2-3 on mobile.
- Color-code by state.

## Don't

- Don't mix tones.
- Don't fake ETAs.

## Related

- CrossDockGrid
- ShipmentTimeline
- CarrierBadge
- PalletTile

## Code

```tsx
import { DockBay } from "@/components/ui/dock-bay";

export function Example() {
  return <DockBay bays={[
    { id: "1", number: 1, state: "open" },
    { id: "2", number: 2, state: "occupied", carrier: "Sterling LTL", eta: "08:30" },
  ]} />;
}
```
