---
name: Badge
category: display
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Tag", "Trend", "LiveDot", "Status Pill"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/badge"
---

# Badge

Status pill. Six health states (neutral / success / warning / danger / info / accent) via the unified --pill-{tone}-{bg|fg|border} token contract (v0.11.3 ADR). Heights snap to 8pt: sm=20 / md=24. Optional leadingDot (size-dot-sm) + leadingIcon.

## When to use

- Status indicator next to a row — shipment status, lane state, payment status.
- Tag on a header — 'Beta', 'New', 'Deprecated'.
- Live indicator in chrome — pair with LiveDot for the pulsing variant.

## Anatomy

1. Span root (radius-full)
2. Optional leadingDot (size-dot-sm bg-current)
3. Optional leadingIcon
4. Children label (font-medium tracked-tight uppercase-allowed via consumer)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Badge IS the label — no aria-label needed if children is descriptive.
- For decorative dots, leadingDot uses aria-hidden by default.
- Pairing with a numeric value via `aria-describedby` from the consumer if Badge is referenced from another element.

## Tokens consumed

- `pill.neutral.bg`
- `pill.neutral.fg`
- `pill.neutral.border`
- `pill.success.bg`
- `pill.success.fg`
- `pill.success.border`
- `pill.warn.bg`
- `pill.warn.fg`
- `pill.warn.border`
- `pill.danger.bg`
- `pill.danger.fg`
- `pill.danger.border`
- `pill.info.bg`
- `pill.info.fg`
- `pill.info.border`
- `pill.accent.bg`
- `pill.accent.fg`
- `pill.accent.border`
- `radius.full`
- `size.dot.sm`
- `tracking.tight`
- `type.11`
- `type.12`

## Do

- Pair color with a label or icon.
- Use sm in dense tables; md in card headers.

## Don't

- Don't use color alone.
- Don't stack 4+ badges in a row — that's a tags-input case.

## Related

- Tag
- Trend
- LiveDot
- Status Pill

## Code

```tsx
import { Badge } from "@/components/ui/badge";

export function Example() {
  return <Badge status="success" leadingDot>Live</Badge>;
}
```
