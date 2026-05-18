---
name: SplitButton
type: component
status: stable
version: 0.9.0
since: 0.9.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton, DropdownMenu]
spec: ./component.json
last_updated: 2026-05-18
---

# SplitButton

> A primary action + a dropdown caret in a single joined affordance. Two clickable surfaces inside one outline: the left half fires the default verb, the right half (the caret) opens a menu of 1–4 close-cousin alternates. Use SplitButton when "the default action is right 80% of the time, but there's a small set of valid alternates worth one click away."

## When to use

- "Save" with alternates: Save · Save as draft · Save and continue · Save and close.
- "Send" with alternates: Send now · Schedule · Send to draft.
- "Approve" with alternates: Approve · Approve with notes · Approve and assign.
- The default verb is clear and dominant; the alternates are variations on the same goal.

## When NOT to use

- The default isn't obvious. Use a `Button` + adjacent `DropdownMenu` instead — the disjoint affordance signals "pick first."
- The alternates are unrelated verbs (Save / Delete / Cancel). Use a `DropdownMenu` of distinct actions.
- The menu has more than 5 items. Use a full `DropdownMenu` so the search / scrolling pattern is correct.

## Accessibility contract

- Two real `<button>` elements joined by a `border-l` hairline divider. Each is independently focusable.
- The primary button's accessible name is its visible text. The caret button uses `aria-label` like "Open save options."
- The caret carries `aria-haspopup="menu"` and `aria-expanded="true|false"` to advertise its menu state.
- The menu (when open) is a real `role="menu"` portaled to `document.body` per the v0.12.4 floating-UI contract — never inline-absolute.
- Arrow Down on the primary button DOES NOT open the menu — that's a Down-on-caret behavior. Enter / Space fire the primary verb.

## Visual contract

- Single rounded outline at `radius.control.md`. Internal divider at `border.hairline`.
- Primary half uses the chosen intent's full chrome (`primary` ladder = Spring Green); the caret half inherits the same surface with a 1 px inset divider.
- Hover lifts both halves together via the same `shadow.button.glow.rest → hover` ladder so the joined affordance reads as one.
- Disabled state dims both halves to `opacity-50` and removes the divider's contrast bump.

## Sizes

Inherits the Button size ladder: `sm` / `md` (default) / `lg`. Caret half size matches the primary half so the visual joins land clean.

## Pair with

- `DropdownMenu` — implementation pattern for the alternate list
- `IconButton` — for the caret affordance internally (`size="sm"`, `shape="rect"`)

## Related Notes

- [Button](../button/component.md)
- [DropdownMenu](../dropdown-menu/component.md)
- [ADR 0016](../../../_meta/decisions/0016-button-rebuild-v09.md)
