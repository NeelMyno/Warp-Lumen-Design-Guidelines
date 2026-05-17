---
name: lumen-rate-ticker
description: Use on the landing hero or a marketing surface to surface live freight rates. The animation establishes 'this is a live system' visually. Three speeds for context (hero = slow, in-product = normal). NEVER use in dense operator chrome — it's a marketing voice element.
---

# Lumen RateTicker

Warp signature. Horizontal marquee of freight lane rates. Pure CSS animation. Edge-fade gradients give it the 'windowed view onto a stream' feel. Three speeds (slow/normal/fast). Mono-numeric prices with up/down arrows. Honors prefers-reduced-motion (track becomes static).

## Use when

- Landing hero (slow speed).
- Marketing surface signaling live rates.
- Dashboard 'live rates' panel (normal speed).

## NEVER

- NEVER use in dense operator chrome (it's a marketing voice element).
- NEVER allow rates count to drop below 5 (marquee becomes obviously short).
- NEVER animate faster than 40s — too anxious.

## Tokens consumed

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

## Anatomy

1. Bordered track (sunken bg + hairline top/bottom)
2. Marquee container (.lumen-ticker-track, duplicated content for seamless loop)
3. Rate row: from → to · price · trend arrow · separator dot
4. Edge fade gradients (sunken → transparent, left + right 48px)

## API

- `rates` — Rate[] (default: a 10-rate freight sample).
- `speed` — slow | normal (default) | fast.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- aria-label='Live freight rates' on the root.
- Honors prefers-reduced-motion (track becomes static).
- Trend arrows are aria-hidden — the up/down meaning is in the price comparison.

## Code (canonical)

```tsx
import { RateTicker } from "@/components/ui/rate-ticker";

export function Example() {
  return <RateTicker />;
}
```

## Related

- LiveDot
- Stat
- Sparkline
