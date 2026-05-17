---
name: FAB
type: component
status: beta
version: 0.12.6
since: 0.9.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton, CommandPaletteButton]
spec: ./component.json
last_updated: 2026-05-17
---

# FAB

> Floating Action Button. A circular, elevated primary affordance that lives above scrollable content. Use sparingly — one FAB per surface, for the single most-likely action.

## When to use

- Mobile surfaces where the primary action must remain reachable as content scrolls.
- Empty states where a single action ("New shipment", "Quote a lane", "Compose") needs prominence without consuming chrome space.
- Map / canvas surfaces where the action button overlays content.

## When NOT to use

- On dense desktop dashboards — the primary action belongs in a fixed top bar.
- For secondary actions — FAB is for the ONE most important action.
- For navigation — use a bottom-nav primitive instead.
- For sustained multi-action workflows — use a fixed Toolbar.

## Anatomy

1. Circular container — `radius.full`, elevated via `shadow.lg` rest / `shadow.xl` hover.
2. Single centered icon (no label) — 24×24 lucide-react.
3. Optional label slot — extended FAB variant (`extended=true`) shows label next to icon.

## Tokens consumed

- `button.intent.{primary,secondary,ai}` family (primary is canonical for FAB)
- `dimension.13` (56px md) / `dimension.14` (64px lg) for size
- `radius.full`
- `shadow.lg` / `shadow.xl` for rest / hover elevation
- `shadow.glow-accent` for primary-intent ambient halo
- `motion.duration.base`, `motion.easing.emphasized` for hover lift
- `icon.size.lg`
- `space.4` for extended-variant label gap

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `icon` | `ReactNode` | — | Primary icon (lucide-react) |
| `aria-label` | `string` | — | **Required** for the icon-only variant |
| `label` | `string` | — | Visible label for extended variant |
| `extended` | `boolean` | `false` | Pill-shaped with icon + label |
| `intent` | `"primary" \| "secondary" \| "ai"` | `"primary"` | FAB intent is narrower than Button |
| `size` | `"md" \| "lg"` | `"md"` | 56 / 64 px |
| `onClick` | `MouseEventHandler` | — | Action handler |
| `position` | `"bottom-right" \| "bottom-left" \| "static"` | `"bottom-right"` | Fixed positioning shorthand |

## States

- **rest** — `shadow.lg` ambient elevation, accent hue at full opacity.
- **hover** — lift to `shadow.xl` + `shadow.glow-accent` (primary intent only); `motion.easing.emphasized`.
- **active** — drop back to `shadow.md` for a press-down feel.
- **focus** — outline + box-shadow dual ring per hard rule 11.
- **disabled** — 40% opacity + non-interactive.

## Accessibility

- Icon-only variant: `aria-label` required.
- Extended variant: visible label IS the accessible name.
- `position="bottom-right"` places at safe-area-inset offsets on mobile.
- Touch target ≥ 56×56 px (always exceeds 44px floor).
- Focus ring visible at the elevated layer (z-index must keep ring on top).

## Related

- [Button](../button/component.md) — the in-flow primary action.
- [IconButton](../icon-button/component.md) — for dense surfaces.
- [CommandPaletteButton](../command-palette-button/component.md) — alternative summoning affordance.

## Install

```bash
npx shadcn@latest add @lumen/fab
```
