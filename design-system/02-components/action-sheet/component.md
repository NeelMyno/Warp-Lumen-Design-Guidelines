---
name: ActionSheet
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Sheet, DropdownMenu, Dialog]
spec: ./component.json
last_updated: 2026-05-16
---

# ActionSheet

> Mobile-only bottom-anchored choice sheet. 2-6 large-tap actions + mandatory Cancel.

## When to use

- Mobile context actions on a row / object.
- Destructive confirmation that needs a single Cancel.
- iOS-style "Move to…" / "Share to…" lists.

## When NOT to use

- Desktop — **DropdownMenu**.
- > 6 actions — paginate or move to **Sheet**.
- Free-form content — **Sheet**.

## Anatomy

1. Scrim (`surface.scrim`).
2. Optional title (small, tertiary).
3. Action list — each tap row, icon + label, 56 px tall.
4. Gap.
5. Cancel button — same chrome as the list, separated.

## Accessibility

- `role="dialog"`, `aria-modal="true"`.
- Each action is `<button>`.
- Destructive action has `aria-label` including "destructive".
- Respects `safe-area-inset-bottom`.

## Do

- Most common first; destructive LAST in the list.
- Verb-led labels.
- Leading lucide icon per action.
- Always include Cancel.

## Don't

- Don't use on desktop.
- Don't pack > 6 actions.
- Don't allow two destructive actions.
- Don't skip Cancel.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
