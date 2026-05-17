---
name: ButtonGroup
type: component
status: beta
version: 0.12.6
since: 0.9.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton, Toggle, Tabs, Segmented]
spec: ./component.json
last_updated: 2026-05-17
---

# ButtonGroup

> A group of buttons joined edge-to-edge, sharing a single hairline border. Use for 2–5 related actions that read as a single composite affordance. Distinct from `Tabs` (navigation) and `Toggle` (binary state).

## When to use

- Filter chips ("All", "Active", "Archived") — non-exclusive multi-select.
- View-toggle ("Grid", "List", "Compact") — exclusive single-select.
- Alignment toolbar ("Left", "Center", "Right") — exclusive single-select.
- Related export actions ("CSV", "PDF", "JSON") joined as one toolbar element.

## When NOT to use

- For tab navigation between routes — use `Tabs`.
- For a binary state — use `Toggle`.
- For three+ exclusive options with rich labels — use `Segmented` (cleaner visual).
- For unrelated actions — keep them as separate `Button` instances with normal spacing.

## Anatomy

1. Container — flex row, no gap, hairline border on the outer perimeter, hairline divider between members.
2. Member buttons — each rendered with shared corner-radius behavior: first member gets left-radius, last gets right-radius, middle members get no rounding.
3. Selected state (for exclusive mode) — selected member highlights with `intent` accent.

## Tokens consumed

- `button.height.{sm,md,lg,xl}` (inherited from members)
- `border.default` for the perimeter + dividers
- `radius.control.md` (applied to outer corners only)
- `surface.raised` for the group background
- `motion.duration.fast` for selection transition

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `children` | `ReactNode` | — | Two or more `Button` / `IconButton` elements |
| `mode` | `"exclusive" \| "multi"` | `"exclusive"` | Exclusive = single selection; multi = independent toggles |

## States

- **rest** — all members un-selected.
- **selected** — one (exclusive) or multiple (multi) members in `intent="primary"` or `intent="ai"` accent.
- **focus** — each member has its own focus ring; group does not have a wrapping focus ring.
- **disabled** — group can disable individual members via their own `disabled` prop.

## Accessibility

- Wrap with `role="group"` + `aria-label` describing the group's purpose ("View mode", "Filter").
- Exclusive mode: use `role="radiogroup"` + each member as `role="radio"` + `aria-checked` semantics.
- Multi mode: each member is a normal `<button>` with `aria-pressed` for toggle state.
- Keyboard: `Tab` enters first focusable; `ArrowRight` / `ArrowLeft` cycle between members within the group.
- Touch target ≥ 44×44 px for each member.

## Related

- [Button](../button/component.md) — the primitive each member is.
- [Toggle](../toggle/component.md) — for binary on/off state.
- [Tabs](../tabs/component.md) — for navigation between routes / views.
- [Segmented](../segmented/component.md) — for 3+ exclusive options with rich content.

## Install

```bash
npx shadcn@latest add @lumen/button-group
```
