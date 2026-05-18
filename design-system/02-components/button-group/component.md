---
name: ButtonGroup
type: component
status: stable
version: 0.9.0
since: 0.9.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton, Segmented, Toolbar]
spec: ./component.json
last_updated: 2026-05-18
---

# ButtonGroup

> A row of joined Buttons sharing a single rounded outline. For segmented filters ("All · Active · Done"), toolbar action groups ("Cut · Copy · Paste"), and density toggles ("Compact · Comfortable · Spacious"). Visually one affordance, semantically a `role="group"` of independent buttons OR a `role="radiogroup"` of mutually exclusive options — the consumer chooses.

## When to use

- Toolbar actions where 2–5 related verbs share a context ("Approve · Decline · Snooze").
- Segmented filters where one option is "active" but the others are immediate switches, not destructive.
- View-density toggles, chart-range toggles ("1D · 1W · 1M · YTD · ALL"), and other small enumerations.

## When NOT to use

- More than 5 options. Use `Segmented` (mobile-friendly) or `Tabs` (full surface switch) instead.
- Destructive + non-destructive verbs side by side. The shared outline implies parity — use spaced Buttons for asymmetric verb weight.
- When any item needs its own size or icon. ButtonGroup enforces a single size and a single intent ladder across all members.

## Accessibility contract

- Wrapper carries `role="group"` (independent verbs) OR `role="radiogroup"` (mutually exclusive). Default is `"group"`.
- Each child Button is a real `<button>` — fully keyboard-reachable in DOM order.
- When `role="radiogroup"`, the active member carries `aria-checked="true"` and the rest `aria-checked="false"`. Arrow keys move the active member; Tab enters / exits the group.
- The group has its own accessible name via `aria-label` or `aria-labelledby` pointing to the enclosing heading.

## Visual contract

- Single rounded outline at `radius.control.md`. The outline belongs to the GROUP, not the children. Children share inner dividers at `border.hairline`.
- Active member at `surface.tint.accent` + `text.primary` + `font-semibold`.
- Inactive members at `text.secondary`; hover bumps to `text.primary` + `surface.sunken`.
- Disabled members render at `opacity-50` and skip pointer events but stay in tab order with `aria-disabled="true"`.

## Sizes

Inherits the Button size ladder: `sm` / `md` (default) / `lg`. All members share one size. Mixed sizes are not supported — use spaced Buttons if you need that.

## Pair with

- `Tooltip` — for icon-only ButtonGroup members
- `Segmented` — when there are more than 5 options or mobile is a primary surface
- `Toolbar` — when ButtonGroup sits inside a longer action rail

## Related Notes

- [Button](../button/component.md)
- [Segmented](../segmented/component.md)
- [ADR 0016](../../../_meta/decisions/0016-button-rebuild-v09.md)
