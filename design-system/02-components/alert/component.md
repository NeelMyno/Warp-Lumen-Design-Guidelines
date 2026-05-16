---
name: Alert
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Toast, Banner, ValidationMessage, Snackbar]
spec: ./component.json
last_updated: 2026-05-16
---

# Alert

> Inline status block. Persistent, region-scoped, never floating. Four tones — info / success / warning / danger.

## When to use

- A form section with a validation summary.
- A settings page reporting a connection failure.
- A Card body explaining why a feature is unavailable.

## When NOT to use

- Transient "Saved" / "Sent" confirmation — **Toast**.
- Page-level system state (outage, maintenance) — **Banner**.
- Single-field validation — **ValidationMessage**.

## Tones

| Tone | Glyph | Live | Use |
|---|---|---|---|
| `info` | `Info` | `polite` | Informational, low-urgency |
| `success` | `CheckCircle` | `polite` | Persistent success state ("Connected") |
| `warning` | `AlertTriangle` | `polite` | Recoverable concern ("Trial ends in 3 days") |
| `danger` | `AlertOctagon` | `assertive` | Failure or blocker ("Payment declined") |

## Anatomy

1. **Container** — `surface.raised` body, 1 px border in the tone color at 24-32% alpha, radius `card.default`.
2. **Leading icon** — 16 px tone glyph.
3. **Title** — `text.primary`, font-medium, sentence case.
4. **Description** — `text.secondary`, 2 lines max.
5. **Action** — optional inline Link or text Button.
6. **Dismiss** — optional trailing IconButton.

## Accessibility

- `role="status"` for info / success / warning.
- `role="alert"` for danger.
- Glyph + label + color — never color alone.
- Dismiss has `aria-label`.

## Do

- Title leads with the consequence.
- Pair danger with a fixing action.
- Persistent by design — don't auto-dismiss.

## Don't

- Don't use for transient confirmations.
- Don't paragraph an Alert.
- Don't drop the glyph.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
