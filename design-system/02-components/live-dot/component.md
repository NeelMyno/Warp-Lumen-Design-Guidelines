---
name: LiveDot
type: component
status: stable · Warp signature
version: 0.1.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Stat, Badge, RateTicker]
spec: ./component.json
last_updated: 2026-05-02
---

# LiveDot

> An 8 px filled green dot with a 2 px ring that pulses outward on a 3 s loop. **Warp signature primitive.** Signals "this is live" — used on tracking buttons, status indicators, and badges. The one signature recurring animation in the system.

## When to use
- Indicating real-time state ("Tracking live", "API healthy", "Quote refreshing").
- Pairing with `Badge` to make a status feel live ("Live · On time").
- The header of dashboards to confirm the system is connected.

## When NOT to use
- For static status — use `Badge` with a non-pulsing dot instead.
- For loading — use a spinner inside `Button[loading]`.
- More than 1–2 per page section. Pulse loses meaning if it's everywhere.

## Anatomy
1. Filled circle (8 px default, color overrideable)
2. Concentric ring (2 px, same color, pulses scale 1→2.4 with opacity 0.7→0)
3. Optional uppercase label

## Variants
| Prop | Values | Default |
|---|---|---|
| `color` | CSS color | `var(--accent-500)` (Warp green) |
| `size` | number (px) | `8` |
| `label` | string | — |

## States
- Default: pulsing.
- `prefers-reduced-motion: reduce`: ring stops pulsing, dot remains.

## Motion
- Keyframe: `lumen-live-pulse` — `transform: scale(1) → scale(2.4)`, `opacity 0.7 → 0`.
- Duration: `3s`.
- Easing: `var(--easing-decelerate)`.
- Iteration: infinite.
- Honors `prefers-reduced-motion: reduce`.

## Accessibility
- The pulse is decorative; aria-hidden on the ring.
- The label, if present, carries the meaning.
- For VoiceOver / TalkBack, expose the parent's `aria-live="polite"` if the state changes.

## Do
- Use the default green for healthy/live; warning fg for slow; danger fg for offline.
- Pair with a label for clarity.
- Place inside a `Badge` with `status="accent"` for the strongest "live" signal.

## Don't
- Don't use multiple LiveDots in the same eye-line. The pulse competes for attention.
- Don't change the duration. The 3-second cadence is the brand signature.
- Don't use a non-pulsing variant — that's just a status dot, use `Badge[leadingDot]`.

## Code
- [Web React](./examples/primary.tsx)
