---
name: ShipmentTimeline
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - color.accent
  - text.primary
  - text.secondary
  - text.tertiary
  - text.accent
  - border.hairline
  - border.default
  - lumen.red.5
  - radius.full
  - radius.xs
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["LiveDot", "Stepper", "Timeline", "RouteMap"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/shipment-timeline"
---

# ShipmentTimeline

Vertical timeline. Standard freight stages — pickup → cross-dock → line haul → last mile → delivered. Each stage: status (pending / active / done / failed), timestamp, optional ETA bubble. Active stage gets lime accent + pulsing LiveDot.

## When to use

- Shipment detail page.
- Tracking page (customer-facing).
- Cross-dock manifest detail.

## Anatomy

1. Vertical rail (1px hairline)
2. Stage node (circle, status-colored)
3. Stage row: status icon, label, timestamp, optional ETA bubble
4. Active stage: LiveDot pulse + lime accent
5. Failed stage: red ring + label

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Each stage is a <li> with aria-current=step on active.
- Status conveyed via icon + label, not color alone.
- LiveDot inherits its motion contract.

## Tokens consumed

- `surface.raised`
- `color.accent`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `text.accent`
- `border.hairline`
- `border.default`
- `lumen.red.5`
- `radius.full`
- `radius.xs`

## Do

- Use standard freight stages (pickup → cross-dock → line haul → last mile → delivered).
- Use compact in side panels.
- Pair active stage with LiveDot.

## Don't

- Don't use color alone.
- Don't fake ETAs.

## Related

- LiveDot
- Stepper
- Timeline
- RouteMap

## Code

```tsx
import { ShipmentTimeline } from "@/components/ui/shipment-timeline";

export function Example() {
  return (
    <ShipmentTimeline stages={[
      { id: "1", label: "Picked up", status: "done", timestamp: "08:14" },
      { id: "2", label: "In transit", status: "active" },
      { id: "3", label: "Delivered", status: "pending", etaIso: "2026-05-17T14:00:00Z" },
    ]} />
  );
}
```
