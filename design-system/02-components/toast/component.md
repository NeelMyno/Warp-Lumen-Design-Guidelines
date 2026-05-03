---
name: Toast
type: component
status: beta
version: 0.1.0
platforms: [web-react, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Dialog, Banner]
spec: ./component.json
last_updated: 2026-05-02
---

# Toast

> A short, non-blocking message anchored to a corner of the viewport. Confirms an action or surfaces a passive event. Auto-dismisses for success/info; sticky for errors until acknowledged.

## When to use
- Confirming a successful action ("Booked. Tracking is live.").
- Surfacing a system event ("Quote refreshed").
- Reporting an error the user didn't initiate ("Lost connection. Retrying.").

## When NOT to use
- Critical errors that block the flow — use `Dialog`.
- Long-form messages — use `Banner` inside the page.
- Marketing announcements — use a `Banner` or page section.

## Anatomy
1. Container (280–360 px wide, `surface.raised`, `radius.card.lifted`, `shadow.toast`, hairline border)
2. Leading status icon (`16 px`, color = status)
3. Message body (`type.body.sm`)
4. Optional action button (`Button[size=sm, intent=tertiary]`)
5. Close button (`IconButton`, `aria-label="Dismiss"`)

## Variants
| Prop | Values | Default |
|---|---|---|
| `status` | `success` / `info` / `warning` / `danger` | `info` |
| `anchor` | `bottom-right` / `bottom-left` / `bottom-center` / `top-right` | `bottom-right` |
| `duration` | number (ms) | `6000` for success/info, `8000` for warning, `null` (sticky) for danger |

## Motion
- Enter: slide from anchor edge + fade. `motion.slow` + `easing.decelerate`.
- Exit: fade only. `motion.base` + `easing.accelerate`.

## Accessibility
- Wraps in a region with `aria-live="polite"` (for success/info/warning) or `aria-live="assertive"` (for danger).
- Toast container has `role="status"` for non-error, `role="alert"` for error.
- Dismiss button is keyboard reachable.
- Hover or focus pauses auto-dismiss.

## Do
- Use past tense for completed actions ("Booked").
- Use present continuous for ongoing ("Quoting 14 carriers…").
- Pair errors with an action ("Retry").
- Honor "respects prefers-reduced-motion" — replace slide with snap.

## Don't
- Don't queue more than 3 toasts on screen.
- Don't use toasts for confirmations of destructive actions — that's a `Dialog` first, then a confirmation toast after.
- Don't auto-dismiss errors.

## Code
- [Web React](./examples/primary.tsx)
