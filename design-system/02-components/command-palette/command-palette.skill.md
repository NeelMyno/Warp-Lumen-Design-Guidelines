---
name: lumen-command-palette
description: Use for ⌘K-style global navigation, quick actions, command discovery — Linear/Vercel/Raycast pattern. Lift open/close state to a parent and bind ⌘K. For simple lists use the `<CommandPalette items={…} onSelect={…} />` sugar; for grouped/conditional render the Command primitives directly.
---

# Lumen CommandPalette

⌘K global search + action surface. Built on cmdk (the canonical headless command-menu lib used by Linear, Vercel, GitHub). Composed inside a Dialog for portal + focus management. Glass-strong shell, search-shaped input, grouped results, kbd hints in footer. Lumen API: pass `items` + `onSelect` for the basic usage; compose Command primitives for advanced.

## Use when

- Global ⌘K nav + actions surface.
- Replace a scattered Settings menu with a single search.
- Power-user command surface — recent actions, shortcuts, AI actions.

## NEVER

- NEVER stack 100+ items without virtualization (cmdk handles it).
- NEVER omit the kbd ↑↓↵ esc hints — they teach the interaction.
- NEVER auto-open on page load — wait for the keyboard shortcut.

## Tokens consumed

- surface.popover
- surface.tint-accent
- surface.sunken
- text.primary
- text.secondary
- text.tertiary
- border.default
- border.hairline
- shadow.modal
- radius.md
- radius.lg
- z-index.modal

## Anatomy

1. Dialog overlay (radix portal)
2. Glass-strong shell (top-aligned via top-[18%])
3. Search input row (sr-only label + visible icon + kbd 'esc' hint)
4. Grouped result list (cmdk Command.Group)
5. Footer hint row (kbd ↑↓ navigate, ↵ select)

## API

- `open`, `onOpenChange` — controlled.
- `items` — quick sugar for `[{id, label, hint?, group?, icon?, onSelect}]`.
- Or compose `<Command>` + `<Command.Input>` + `<Command.List>` + `<Command.Group>` + `<Command.Item>` directly.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Dialog manages role + focus trap + escape.
- cmdk manages role=listbox + role=option + aria-selected + aria-activedescendant.
- Provide DialogTitle (sr-only is fine) + DialogDescription for screen readers.

## Code (canonical)

```tsx
import { useState } from "react";
import { CommandPalette } from "@/components/ui/command-palette";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      items={[{ id: "lanes", label: "Lanes", group: "Go to", onSelect: () => {} }]}
    />
  );
}
```

## Related

- Dialog
- Sheet
- Modal
- CommandPaletteButton
