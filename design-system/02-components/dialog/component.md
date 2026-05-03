---
name: Dialog
type: component
status: beta
version: 0.1.0
platforms: [web-react, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Toast, Drawer, Button]
spec: ./component.json
last_updated: 2026-05-02
---

# Dialog

> A modal that interrupts the flow for confirmation, focused decision, or short-form. Used for destructive confirmations, single-step forms, and previewable choices. Backdrop scrim + scaled-in container.

## When to use
- Destructive confirmation ("Cancel order WRP-9824?").
- Short-form quick action (1–3 fields max).
- A focused choice among 2–4 explicit options.
- Auth or escalation flows.

## When NOT to use
- Multi-step flows — use a wizard page.
- Passive notifications — use `Toast`.
- Anything that should be reachable via URL — use a route, not a dialog.

## Anatomy
1. Scrim (backdrop, `surface.scrim`, fade in `motion.base`)
2. Container (`surface.raised`, `radius.card.hero`, `shadow.modal`, `max-width: 480px`)
3. Title (h2, `type.heading.h2`)
4. Optional description (`type.body.md`, `text-secondary`)
5. Body (form fields or list)
6. Actions (right-aligned button group; primary on the right, cancel on the left)

## States
- Closed (default).
- Opening: scale `0.96 → 1` + opacity fade (`motion.slow` + `easing.decelerate`).
- Open.
- Closing: same in reverse with `easing.accelerate`.

## Accessibility
- `role="dialog"` + `aria-modal="true"`.
- Focus trap inside the dialog. First focusable receives focus on open.
- `Escape` key closes (also documented in `keyboard`).
- Page background gets `aria-hidden="true"` while open.
- Close button has `aria-label="Close"` and is the LAST focusable.
- Returns focus to the trigger element on close.

## Do
- Lead the title with the consequence: "Cancel order WRP-9824?".
- Put the destructive primary on the right; the cancel on the left.
- For destructive actions, require typing the confirmation phrase ("CANCEL") before enabling the primary.

## Don't
- Don't open a dialog from a dialog.
- Don't put long-form content in a dialog. Route to a page.
- Don't use a dialog as a marketing teaser.

## Code
- [Web React](./examples/primary.tsx)
