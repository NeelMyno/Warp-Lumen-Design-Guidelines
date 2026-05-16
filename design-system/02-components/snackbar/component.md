---
name: Snackbar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Toast, Alert, Banner]
spec: ./component.json
last_updated: 2026-05-16
---

# Snackbar

> Transient bottom-anchored message with a single trailing action. Mobile-flavor of Toast. Use when an action may need an Undo.

## When to use

- Just after a user action: "Order archived" + Undo.
- Confirm of a one-step destructive op that should be reversible.
- "Sent" on message send.

## When NOT to use

- Confirmation that doesn't need undo — **Toast**.
- Page-level state — **Banner**.
- Region status — **Alert**.
- Anything with two actions — **Dialog**.

## Anatomy

1. **Container** — `surface.raised`, hairline border, `radius.popover`, `shadow.popover`, bottom-anchored.
2. **Leading glyph** — optional CheckCircle (success) or AlertOctagon (danger).
3. **Message** — past-tense verb summary.
4. **Action** — single trailing button. Almost always "Undo".

## Tones

| Tone | Use |
|---|---|
| `neutral` | Default — most common |
| `success` | Leading CheckCircle in `text.accent` |
| `danger` | Leading AlertOctagon in `text.error` |

## Accessibility

- `role="status"` polite for neutral / success.
- `role="alert"` assertive for danger.
- Pause timer on hover / focus (WCAG 1.4.13).
- Returns focus on dismiss.

## Do

- One Snackbar at a time. Queue, don't stack.
- Pair with Undo when action is reversible.
- Render above the mobile home indicator.

## Don't

- Don't show two actions.
- Don't paint success as solid lime.
- Don't auto-dismiss critical failures.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
