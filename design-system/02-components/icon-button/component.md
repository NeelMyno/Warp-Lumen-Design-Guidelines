---
name: IconButton
type: component
status: stable
version: 0.9.0
since: 0.9.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Button, Tooltip, ButtonGroup, FAB]
spec: ./component.json
last_updated: 2026-05-18
---

# IconButton

> A square Button containing only an icon. Carries every Button intent / size / state, but its accessible name comes from `aria-label` because there's no visible text. The compiler rejects an IconButton without `aria-label` — there is no escape hatch.

## When to use

- Dense toolbars and overflow menus where text labels would crowd the surface.
- Segmented icon toggles (compose / decompose, view-list / view-grid) using `pressed`.
- Chip-close, status pings, and table-row actions.
- Round shape (`shape="round"`) for FAB-adjacent moments — but only when there's no fixed-position context (use the `FAB` primitive there instead).

## When NOT to use

- The only primary action on a screen. Pair an IconButton with a labelled `Button` for the primary moment so the verb is in plain text.
- Mobile primary surfaces below the `md` size tier — `xs` (24×24) and `sm` (32×32) miss the 44 × 44 touch floor.
- When the icon's meaning is ambiguous. Pair with `Tooltip` after the standard 600 ms hover-delay so sighted users get disambiguation.

## Accessibility contract

- `aria-label` is **required**. Without it the button is invisible to assistive tech. The TypeScript signature enforces it.
- The label MUST be specific. "Edit row 42" beats "Edit" when the same icon appears in multiple rows.
- Provide a `Tooltip` wrapper for hover disambiguation (sighted-user UX) — never the only source of label text.
- `pressed` maps to `aria-pressed` for toggle moments. `loading` maps to `aria-busy="true"` and replaces the icon with a spinner.
- Touch target: `md` (40 × 40) just meets WCAG 2.2 AA `2.5.5` at 24 px target size; for **enhanced** (44 × 44), use `lg`.

## Sizes

| Size | Square | Touch | Use |
|---|---|---|---|
| `xs` | 24 × 24 | desktop-only | tag-close, kbd-chip kill |
| `sm` | 32 × 32 | desktop-only | toolbar density |
| `md` | 40 × 40 | mobile-min | default |
| `lg` | 48 × 48 | mobile-enhanced | primary mobile actions |
| `xl` | 56 × 56 | hero | FAB-shape ping or single-action card |

## Intents

Inherits the full Button intent ladder: `primary`, `secondary`, `tertiary`, `ghost` (default), `outline`, `danger`, `danger-soft`, `ai`, `glass`. Default is `ghost` so a toolbar row of IconButtons stays quiet against the surrounding chrome. Use `primary` SPARINGLY — round + solid Spring Green is loud.

## Shape

- `rect` (default) — rounded square at `radius.control.md`. Use in toolbars and table actions.
- `round` — full radius. Use for FAB-shape pings, chip-close, status indicators. If the IconButton is `position: fixed`, use the `FAB` primitive instead — it ships with the right elevation + edge-inset contract.

## Pair with

- `Tooltip` — for hover disambiguation
- `ButtonGroup` — to join 2–5 IconButtons into a segmented row
- `Button` (with `leadingIcon`) — when the verb deserves text but you still want the icon

## See also

- [Button](../button/component.md) — when text is part of the label
- [FAB](../fab/component.md) — when the icon button is a fixed-position primary action
- [SplitButton](../split-button/component.md) — when the icon button needs a dropdown caret next to it

## Related Notes

- `design-system/00-foundations/buttons.md` — full button language (sizes × intents × shapes × states × motion)
- [ADR 0016](../../../_meta/decisions/0016-button-rebuild-v09.md) — v0.9 button rebuild rationale
