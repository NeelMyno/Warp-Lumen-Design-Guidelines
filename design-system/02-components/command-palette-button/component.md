---
name: CommandPaletteButton
type: component
status: beta
version: 0.12.6
since: 0.9.0
deprecated: false
platforms: [web-react, ios-native, android-native, macos-native, windows-native]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton, FAB, CommandPalette]
spec: ./component.json
last_updated: 2026-05-17
---

# CommandPaletteButton

> A surfacing affordance for the command palette. Renders as a search-input-shaped button showing the active hotkey ( `⌘K` / `Ctrl+K` ) and clicks open the `CommandPalette`. Lives in the top bar by convention.

## When to use

- Top bar of any operator-density surface — Lumen dashboards, settings, terminal-style apps.
- As the spotlight summoning element when a user might not know the keyboard shortcut.
- Replacing a global search input — CommandPaletteButton is search + actions + navigation in one entry point.

## When NOT to use

- For a single-purpose search input — use plain `Input` with a search icon.
- When the command palette is keyboard-only (no visual summoning) — leave the keyboard shortcut as the only entry.
- On mobile where there's no keyboard chord — use `FAB` or a search icon in the bottom nav.

## Anatomy

1. Container — search-input-shaped, `surface.raised`, `radius.md`, hairline border.
2. Leading search icon — `lucide-react` `Search` at 16×16 px.
3. Placeholder text — `text.tertiary`, sentence case, verb-led ("Search Lumen, jump to a page…").
4. Trailing keyboard shortcut badge — `kbd` styling, shows the active OS chord (`⌘K` / `Ctrl+K`).

## Tokens consumed

- `surface.raised` for background
- `border.default` for the hairline
- `text.tertiary` for placeholder
- `text.secondary` for the keyboard shortcut
- `radius.md`
- `space.3`, `space.4` for padding
- `icon.size.sm`
- `shadow.focus` for focus ring

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `placeholder` | `string` | `"Search Lumen, jump to a page…"` | Visible placeholder text |
| `hotkey` | `"cmd-k" \| "ctrl-k" \| "auto"` | `"auto"` | `auto` picks based on `navigator.platform` |
| `onSummon` | `() => void` | — | Click / hotkey handler — typically opens `CommandPalette` |

## States

- **rest** — search icon + placeholder + hotkey badge visible.
- **hover** — subtle background lift to `surface.popover`.
- **focus** — outline + box-shadow dual ring per hard rule 11.
- **active** (palette open) — hotkey badge swaps to `Esc` to indicate close-affordance.

## Accessibility

- `role="combobox"` + `aria-expanded` bound to the palette open state.
- `aria-label="Search Lumen and jump anywhere"` (sr-only; placeholder visible).
- Keyboard: visible focusable on Tab. Activating opens the palette. `Esc` closes if open.
- `prefers-reduced-motion`: hover lift becomes opacity-only.
- The hotkey badge content is sr-only on platforms where the keyboard shortcut doesn't apply (touch-only devices).

## Related

- [CommandPalette](../command-palette/command-palette.md) — the palette that opens on click / hotkey.
- [Button](../button/component.md) — the underlying focus + button-conventions contract.
- [IconButton](../icon-button/component.md) — for dense surfaces where the search-bar shape is too wide.

## Install

```bash
npx shadcn@latest add @lumen/command-palette-button
```
