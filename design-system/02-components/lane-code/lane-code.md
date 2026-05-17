---
name: LaneCode
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react", "ios", "android"]
tokens:
  - text.primary
  - text.secondary
  - text.tertiary
  - text.accent
  - border.hairline
  - radius.xs
  - type.13
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["LaneArc", "RouteMap", "RateTicker", "CarrierBadge"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/lane-code"
---

# LaneCode

Lane identifier — renders as `LAX → SFO` with a proper arrow glyph (→ U+2192, not -> ascii) and mono-numerics. Optional inline rate (e.g. '$262'). Compact horizontal pill with hairline border. Use everywhere a freight lane is referenced.

## When to use

- Table cells (lane column).
- Breadcrumb segments.
- Page titles ('LAX → SFO · Rate analysis').
- Filter chip labels.

## Anatomy

1. Origin code (mono, 3 chars, --text-secondary)
2. Arrow glyph (→ U+2192, --text-tertiary)
3. Destination code (mono, 3 chars, --text-secondary)
4. Optional separator (· U+00B7) + rate (--text-primary, font-medium)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Renders the arrow as a real character (→) — screen readers read it naturally.
- aria-label='Lane: {origin} to {destination}{', rate ' + rate}' for clarity.

## Tokens consumed

- `text.primary`
- `text.secondary`
- `text.tertiary`
- `text.accent`
- `border.hairline`
- `radius.xs`
- `type.13`

## Do

- Use the U+2192 glyph.
- Pair with rate in revenue contexts.
- Use mono-numerics for codes.

## Don't

- Don't use ASCII arrows.
- Don't lowercase codes.

## Related

- LaneArc
- RouteMap
- RateTicker
- CarrierBadge

## Code

```tsx
import { LaneCode } from "@/components/ui/lane-code";

export function Example() {
  return <LaneCode origin="LAX" destination="SFO" rate="$262" />;
}
```
