---
name: lumen-shipment-timeline
description: Use to surface a shipment's stage history + current state. Each stage takes status + timestamp + optional notes. Active stage gets LiveDot. ETA bubble appears on stages in the future (pending). Compact density default; expanded for shipment detail pages.
---

# Lumen ShipmentTimeline

Vertical timeline. Standard freight stages — pickup → cross-dock → line haul → last mile → delivered. Each stage: status (pending / active / done / failed), timestamp, optional ETA bubble. Active stage gets lime accent + pulsing LiveDot.

## Use when

- Shipment detail page.
- Tracking page (customer-facing).
- Cross-dock manifest detail.

## NEVER

- NEVER use color alone for stage status — pair with icon or label.
- NEVER hide the rail between stages (the visual continuity is the point).
- NEVER fake an ETA — omit if unknown.

## Tokens consumed

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

## Anatomy

1. Vertical rail (1px hairline)
2. Stage node (circle, status-colored)
3. Stage row: status icon, label, timestamp, optional ETA bubble
4. Active stage: LiveDot pulse + lime accent
5. Failed stage: red ring + label

## API

- `stages` — { id, label, status, timestamp?, etaIso?, note? }[].
- `density` — default | compact.
- `orientation` — vertical (default) | horizontal.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Each stage is a <li> with aria-current=step on active.
- Status conveyed via icon + label, not color alone.
- LiveDot inherits its motion contract.

## Code (canonical)

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

## Related

- LiveDot
- Stepper
- Timeline
- RouteMap
