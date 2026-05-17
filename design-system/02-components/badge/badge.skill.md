---
name: lumen-badge
description: Use to surface compact status — On time / Delayed / Tendered / Booked / Live. Six tones: neutral, success, warning, danger, info, accent. Two sizes: sm (h20) and md (h24). Optional leadingDot or leadingIcon (NEVER both). All three pill primitives (Badge, Tag, StatusPill) share one --pill-* token contract — change once, repaint all.
---

# Lumen Badge

Status pill. Six health states (neutral / success / warning / danger / info / accent) via the unified --pill-{tone}-{bg|fg|border} token contract (v0.11.3 ADR). Heights snap to 8pt: sm=20 / md=24. Optional leadingDot (size-dot-sm) + leadingIcon.

## Use when

- Status indicator next to a row — shipment status, lane state, payment status.
- Tag on a header — 'Beta', 'New', 'Deprecated'.
- Live indicator in chrome — pair with LiveDot for the pulsing variant.

## NEVER

- NEVER convey meaning by color alone — Badge ALWAYS carries a label or icon next to the color.
- NEVER use status=accent for non-action visual; it conflicts with the accent primary CTA.
- NEVER drop the border — it carries the brutalist hairline voice.

## Tokens consumed

- pill.neutral.bg
- pill.neutral.fg
- pill.neutral.border
- pill.success.bg
- pill.success.fg
- pill.success.border
- pill.warn.bg
- pill.warn.fg
- pill.warn.border
- pill.danger.bg
- pill.danger.fg
- pill.danger.border
- pill.info.bg
- pill.info.fg
- pill.info.border
- pill.accent.bg
- pill.accent.fg
- pill.accent.border
- radius.full
- size.dot.sm
- tracking.tight
- type.11
- type.12

## Anatomy

1. Span root (radius-full)
2. Optional leadingDot (size-dot-sm bg-current)
3. Optional leadingIcon
4. Children label (font-medium tracked-tight uppercase-allowed via consumer)

## API

- `status` — neutral | success | warning | danger | info | accent (default: neutral).
- `size` — sm | md (default: sm).
- `leadingDot` — boolean (renders bg-current colored dot).
- `leadingIcon` — ReactNode (replaces dot).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Badge IS the label — no aria-label needed if children is descriptive.
- For decorative dots, leadingDot uses aria-hidden by default.
- Pairing with a numeric value via `aria-describedby` from the consumer if Badge is referenced from another element.

## Code (canonical)

```tsx
import { Badge } from "@/components/ui/badge";

export function Example() {
  return <Badge status="success" leadingDot>Live</Badge>;
}
```

## Related

- Tag
- Trend
- LiveDot
- Status Pill
