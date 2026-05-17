---
name: IconButton
type: component
status: stable
version: 0.12.6
since: 0.1.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native, shopify-liquid]
a11y_level: WCAG-2.2-AA
related: [Button, FAB, Toggle, ButtonGroup, Tooltip]
spec: ./component.json
last_updated: 2026-05-17
---

# IconButton

> An icon-only button. The accessible name lives in the `aria-label` prop, never visibly. Always pair with a `Tooltip` for sighted-user discoverability unless the icon is unambiguously universal (close, search, back).

## When to use

- Dense surfaces (data-table rows, toolbars, top bars, command palette items) where space is at a premium.
- Affordances paired with adjacent text that already names the action ("Edit" link + pencil IconButton repeating it).
- Toolbar grids — bulk actions, view-toggle, share, export.

## When NOT to use

- For a primary affordance — use `Button` with a leading icon + label.
- For binary state — use `Toggle` (it announces the bound state, IconButton does not).
- For a floating CTA over scrollable content — use `FAB`.
- For three+ exclusive related actions — use `ButtonGroup`.

## Anatomy

1. Container — square at the chosen control height.
2. Icon — single lucide-react icon (or custom 24×24 / 1.5px stroke per Lumen icon spec).
3. Optional focus ring + ambient tint matching the intent.

## Tokens consumed

- `button.size.{xs,sm,cozy,md,touch,lg,xl}` for square dimensions
- `button.intent.{primary,secondary,outline,ghost,danger,ai}` family
- `radius.control.md` (square, default), `radius.full` (round variant)
- `icon.size.{sm,md,lg,xl}` for inner icon sizing
- `shadow.focus` for focus ring
- `motion.duration.fast` for hover transitions

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `icon` | `ReactNode` | — | The icon element (typically a lucide-react component) |
| `aria-label` | `string` | — | **Required.** Visible name for screen readers |
| `intent` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "ai"` | `"ghost"` | Ghost default for dense surfaces |
| `size` | `"xs" \| "sm" \| "cozy" \| "md" \| "touch" \| "lg" \| "xl"` | `"md"` | Control-height ladder |
| `shape` | `"square" \| "round"` | `"square"` | Round = `radius.full` |
| `loading` | `boolean` | `false` | Replaces icon with spinner |
| `disabled` | `boolean` | `false` | 40% opacity + non-interactive |
| `className` | `string` | — | Forwarded to root |

## States

- **rest** — icon at neutral hue.
- **hover** — accent-on-hover per AGENTS.md guidance (`text-accent` + ambient ring).
- **focus** — outline + box-shadow dual ring per hard rule 11.
- **active** — icon tint deepens.
- **disabled** — 40% opacity.
- **loading** — icon swaps to spinner; disabled implicitly.

## Accessibility

- `aria-label` is **required**. Lint catches missing labels via `lint:button-conventions`.
- Always pair with a `Tooltip` unless the icon is universal (close `×`, search `🔍`, back `←`).
- Touch target ≥ 44×44 px (use `size="touch"` for mobile).
- Focus ring visible per AGENTS.md hard rule 11.

## Related

- [Button](../button/component.md) — text + icon variant.
- [Toggle](../toggle/component.md) — for binary state.
- [FAB](../fab/component.md) — for floating CTA.
- [Tooltip](../tooltip/component.md) — discoverability pairing.

## Install

```bash
npx shadcn@latest add @lumen/icon-button
```
