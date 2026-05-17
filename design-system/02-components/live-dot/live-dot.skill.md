---
name: lumen-live-dot
description: Use for 'live' status — Live freight rates, Active lanes, Connection state. Never decorative — the pulse is precious. Default color is --color-accent (Spring Green); override for status indicators (red for down, amber for degraded). Pair with an inline label.
---

# Lumen LiveDot

Warp signature. Filled dot + 1.5px ring that pulses outward on a 3s loop (scale 1 → 2.4, opacity 0.7 → 0, ease-out). Slow enough to never trigger flash thresholds, fast enough to read as 'alive'. Honors prefers-reduced-motion (ring becomes static).

## Use when

- Live status indicator (live rates, active connection).
- Operational state (LIVE on a streaming chart).
- Service status on a system page (paired with status pill).

## NEVER

- NEVER use LiveDot decoratively.
- NEVER animate faster than 2s (anxious).
- NEVER stack two LiveDots — one signature per region.

## Tokens consumed

- color.accent
- text.secondary

## Anatomy

1. Filled dot (--color-accent default)
2. 1.5px ring (.lumen-live-dot-pulse — 3s loop, scale 1→2.4)
3. Optional label (overline + text-secondary)

## API

- `label` — optional string.
- `color` — CSS color (default: var(--color-accent)).
- `size` — px (default 8).
- `hideLabel` — boolean (renders dot only).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Ring is aria-hidden (decorative).
- Honors prefers-reduced-motion (ring stays static).
- The label or its parent should convey live state to assistive tech.

## Code (canonical)

```tsx
import { LiveDot } from "@/components/ui/live-dot";

export function Example() {
  return <LiveDot label="Live" />;
}
```

## Related

- Stat
- RateTicker
- Badge
- PresenceIndicator
