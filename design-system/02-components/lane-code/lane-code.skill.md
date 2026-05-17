---
name: lumen-lane-code
description: Use anywhere a freight lane shows up — table cells, breadcrumbs, page titles, chart axes. Always use the U+2192 → glyph (not ASCII -> or →). Optional `rate` slot renders the price inline with a hairline separator. For animated arc rendering on a map, use @lumen/lane-arc.
---

# Lumen LaneCode

Lane identifier — renders as `LAX → SFO` with a proper arrow glyph (→ U+2192, not -> ascii) and mono-numerics. Optional inline rate (e.g. '$262'). Compact horizontal pill with hairline border. Use everywhere a freight lane is referenced.

## Use when

- Table cells (lane column).
- Breadcrumb segments.
- Page titles ('LAX → SFO · Rate analysis').
- Filter chip labels.

## NEVER

- NEVER use ASCII '->' for the arrow — use U+2192 ('→').
- NEVER use Title Case for codes (always uppercase).
- NEVER nest a LaneCode inside another LaneCode.

## Tokens consumed

- text.primary
- text.secondary
- text.tertiary
- text.accent
- border.hairline
- radius.xs
- type.13

## Anatomy

1. Origin code (mono, 3 chars, --text-secondary)
2. Arrow glyph (→ U+2192, --text-tertiary)
3. Destination code (mono, 3 chars, --text-secondary)
4. Optional separator (· U+00B7) + rate (--text-primary, font-medium)

## API

- `origin` — 3-char IATA or ISO code.
- `destination` — 3-char code.
- `rate` — optional string (e.g. '$262').
- `size` — sm | md (default).
- `bordered` — boolean (renders as a pill).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Renders the arrow as a real character (→) — screen readers read it naturally.
- aria-label='Lane: {origin} to {destination}{', rate ' + rate}' for clarity.

## Code (canonical)

```tsx
import { LaneCode } from "@/components/ui/lane-code";

export function Example() {
  return <LaneCode origin="LAX" destination="SFO" rate="$262" />;
}
```

## Related

- LaneArc
- RouteMap
- RateTicker
- CarrierBadge
