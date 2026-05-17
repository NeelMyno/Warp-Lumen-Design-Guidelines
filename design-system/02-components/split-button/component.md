---
name: SplitButton
type: component
status: beta
version: 0.12.6
since: 0.9.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton, ButtonGroup, DropdownMenu]
spec: ./component.json
last_updated: 2026-05-17
---

# SplitButton

> A SplitButton is a primary action half joined to a dropdown-trigger half by a hairline divider. The action half commits the most likely choice; the dropdown half surfaces related alternatives. Use when one action covers ~80% of intent but the remaining 20% needs to stay reachable.

## When to use

- Save-as-primary with "save and X" alternatives ("Save", "Save and close", "Save as draft").
- Send-action variants ("Send", "Schedule send", "Send later").
- Generate-with-variants in AI surfaces ("Generate", "Regenerate", "Generate with different model").

## When NOT to use

- For a single primary action — use plain `Button`.
- For exclusive multi-choice — use `ButtonGroup` (segmented).
- For navigation menus — use `DropdownMenu` on its own.
- Inside a tight density (data-table row, command palette item) — use `IconButton` + a separate menu trigger.

## Anatomy

1. Action half — left side; primary trigger, surfaces the most likely action.
2. Hairline divider — `border.default`, 1px, between the two halves.
3. Dropdown trigger half — right side; chevron-down icon; opens the menu of alternatives.
4. Menu — floating popover (uses `DropdownMenu`'s portal contract per AGENTS.md hard rule 10).

## Tokens consumed

- `button.height.{sm,md,lg,xl}` for sized variants
- `button.intent.{primary,secondary,outline,ghost,danger,ai}` family for intent themes
- `border.default` for the hairline divider
- `radius.control.md` (rect default), `radius.full` (pill variant)
- `shadow.focus` for keyboard focus ring on each half independently

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `children` | `ReactNode` | — | Action-half label, sentence case, verb-led |
| `intent` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "ai"` | `"primary"` | Shared across both halves |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Standard control-height ladder |
| `onAction` | `MouseEventHandler` | — | Click handler for the action half |
| `onMenuOpen` | `MouseEventHandler` | — | Click handler for the dropdown half |
| `menuLabel` | `string` | — | `aria-label` for the dropdown trigger (required, sr-only) |
| `leadingIcon` | `ReactNode` | — | Icon shown before the label on the action half |
| `loading` | `boolean` | `false` | Replaces leading icon with spinner |
| `disabled` | `boolean` | `false` | Disables both halves |

## States

- **rest** — default presentation, hairline divider visible.
- **hover** — action half elevates by `button.intent.{intent}.hover`; dropdown half elevates independently.
- **focus** — each half has its own visible focus ring (`shadow.focus`). Tab cycles action → dropdown → next focusable.
- **disabled** — both halves at 40% opacity; both un-clickable.
- **loading** — leading icon swaps to spinner on the action half only; dropdown remains enabled.

## Accessibility

- Each half is a separate `<button>` element with its own `aria-label`.
- The dropdown trigger is `aria-haspopup="menu"` + `aria-expanded` bound to menu open state.
- Keyboard: `Tab` cycles into action half → dropdown half → out. `Space`/`Enter` activates the focused half.
- Screen reader: action half announces its label; dropdown half announces `menuLabel` (e.g., "Save options menu").

## Related

- [Button](../button/component.md) — the primary primitive SplitButton composes from.
- [IconButton](../icon-button/component.md) — for icon-only triggers in dense surfaces.
- [ButtonGroup](../button-group/component.md) — for exclusive multi-choice.
- [DropdownMenu](../dropdown-menu/dropdown-menu.md) — for the menu of alternatives.

## Install

```bash
npx shadcn@latest add @lumen/split-button
```
