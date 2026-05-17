---
name: LiveDot
category: feedback
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react", "ios", "android"]
tokens:
  - color.accent
  - text.secondary
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Stat", "RateTicker", "Badge", "PresenceIndicator"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/live-dot"
---

# LiveDot

Warp signature. Filled dot + 1.5px ring that pulses outward on a 3s loop (scale 1 → 2.4, opacity 0.7 → 0, ease-out). Slow enough to never trigger flash thresholds, fast enough to read as 'alive'. Honors prefers-reduced-motion (ring becomes static).

## When to use

- Live status indicator (live rates, active connection).
- Operational state (LIVE on a streaming chart).
- Service status on a system page (paired with status pill).

## Anatomy

1. Filled dot (--color-accent default)
2. 1.5px ring (.lumen-live-dot-pulse — 3s loop, scale 1→2.4)
3. Optional label (overline + text-secondary)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Ring is aria-hidden (decorative).
- Honors prefers-reduced-motion (ring stays static).
- The label or its parent should convey live state to assistive tech.

## Tokens consumed

- `color.accent`
- `text.secondary`

## Do

- Use for true live state.
- Use only one per visible region.
- Pair with a label.

## Don't

- Don't use decoratively.
- Don't stack.

## Related

- Stat
- RateTicker
- Badge
- PresenceIndicator

## Code

```tsx
import { LiveDot } from "@/components/ui/live-dot";

export function Example() {
  return <LiveDot label="Live" />;
}
```
