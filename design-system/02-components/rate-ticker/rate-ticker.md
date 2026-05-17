---
name: RateTicker
category: data
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.sunken
  - border.hairline
  - border.strong
  - text.primary
  - text.secondary
  - text.tertiary
  - status.success.fg
  - status.danger.fg
  - type.13
  - type.11
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["LiveDot", "Stat", "Sparkline"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/rate-ticker"
---

# RateTicker

Warp signature. Horizontal marquee of freight lane rates. Pure CSS animation. Edge-fade gradients give it the 'windowed view onto a stream' feel. Three speeds (slow/normal/fast). Mono-numeric prices with up/down arrows. Honors prefers-reduced-motion (track becomes static).

## When to use

- Landing hero (slow speed).
- Marketing surface signaling live rates.
- Dashboard 'live rates' panel (normal speed).

## Anatomy

1. Bordered track (sunken bg + hairline top/bottom)
2. Marquee container (.lumen-ticker-track, duplicated content for seamless loop)
3. Rate row: from → to · price · trend arrow · separator dot
4. Edge fade gradients (sunken → transparent, left + right 48px)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- aria-label='Live freight rates' on the root.
- Honors prefers-reduced-motion (track becomes static).
- Trend arrows are aria-hidden — the up/down meaning is in the price comparison.

## Tokens consumed

- `surface.sunken`
- `border.hairline`
- `border.strong`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `status.success.fg`
- `status.danger.fg`
- `type.13`
- `type.11`

## Do

- Use on landing surfaces.
- Use slow speed for hero context.
- Keep ≥ 5 rates.

## Don't

- Don't use in dense chrome.
- Don't speed faster than 40s.

## Related

- LiveDot
- Stat
- Sparkline

## Code

```tsx
import { RateTicker } from "@/components/ui/rate-ticker";

export function Example() {
  return <RateTicker />;
}
```
