---
name: CommandPaletteButton
type: component
status: stable
version: 0.9.0
since: 0.9.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [SearchInput, CommandPalette, Button]
spec: ./component.json
last_updated: 2026-05-18
---

# CommandPaletteButton

> Search-styled trigger that opens the global command palette (⌘K). Looks like a search input — leading magnifying-glass icon, placeholder hint ("Search Lumen…"), trailing `<kbd>` chip showing the keyboard shortcut. Behaves like a button: click or focus + Enter triggers the palette overlay.

## When to use

- Top-bar / header search affordance for app-wide command surfaces (Linear, Slack, Notion, VS Code patterns).
- Marketing-page "Try the command palette" demo trigger.
- Any moment where the affordance should *suggest* search behaviour without committing to a real search input (real search inputs filter live; command palettes open a modal overlay).

## When NOT to use

- True live-filter contexts. Use `SearchInput` (the actual input primitive) when each keystroke filters in-place.
- Compact toolbar surfaces with no room for the keyboard-shortcut chip. Use a plain icon `Button` with `aria-label="Open command palette"` instead.

## Accessibility contract

- Renders as a real `<button>` — not an `<input>`. The placeholder text is decorative.
- Accessible name: "Open command palette" (overrideable via `aria-label`).
- The kbd chip uses `<kbd>` for semantic + screen-reader announcement: "⌘ K". On non-Mac platforms, render `Ctrl K` instead via a platform check.
- Keyboard: Tab focuses the trigger; Enter / Space opens the palette. ⌘K is a global handler bound at the app root — not on the trigger itself.
- Focus indicator follows the global v0.12.4 dual-ring contract: `outline + box-shadow`.

## Visual contract

- Composes the `.lumen-field` shell visual (border, height, leading slot, trailing slot) — gives the trigger the search-input look without being one.
- Width: typically `w-full max-w-[480px]` in the header chrome; collapses to icon-only on `< sm` viewports.
- Leading icon: lucide `Search` at 14 px.
- Placeholder: `text.tertiary`, italic-off (Satoshi doesn't ship italic at body-sm), placeholder weight 400.
- Trailing kbd chip: monospace, `text.tertiary`, `border.hairline` outline, `surface.sunken` fill.
- Hover lifts border to `border.subtle` + adds the `shadow.button.glow.rest` brand halo. Active state mirrors button-press: 1 px translate-y.

## Layout pattern

```tsx
<CommandPaletteButton
  placeholder="Search Lumen…"
  shortcut="⌘K"
  onClick={openPalette}
/>
```

## Pair with

- `CommandPalette` — the modal overlay the button opens
- `Toolbar` — when sitting in a longer action rail

## Related Notes

- [CommandPalette](../command-palette/component.md)
- [SearchInput](../search-input/component.md)
- [ADR 0016](../../../_meta/decisions/0016-button-rebuild-v09.md)
