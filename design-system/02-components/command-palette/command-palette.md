---
name: CommandPalette
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Dialog", "Sheet", "Modal", "CommandPaletteButton"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/command-palette"
---

# CommandPalette

⌘K global search + action surface. Built on cmdk (the canonical headless command-menu lib used by Linear, Vercel, GitHub). Composed inside a Dialog for portal + focus management. Glass-strong shell, search-shaped input, grouped results, kbd hints in footer. Lumen API: pass `items` + `onSelect` for the basic usage; compose Command primitives for advanced.

## When to use

- Global ⌘K nav + actions surface.
- Replace a scattered Settings menu with a single search.
- Power-user command surface — recent actions, shortcuts, AI actions.

## Anatomy

1. Dialog overlay (radix portal)
2. Glass-strong shell (top-aligned via top-[18%])
3. Search input row (sr-only label + visible icon + kbd 'esc' hint)
4. Grouped result list (cmdk Command.Group)
5. Footer hint row (kbd ↑↓ navigate, ↵ select)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Dialog manages role + focus trap + escape.
- cmdk manages role=listbox + role=option + aria-selected + aria-activedescendant.
- Provide DialogTitle (sr-only is fine) + DialogDescription for screen readers.

## Tokens consumed

- `surface.popover`
- `surface.tint-accent`
- `surface.sunken`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `border.default`
- `border.hairline`
- `shadow.modal`
- `radius.md`
- `radius.lg`
- `z-index.modal`

## Do

- Bind ⌘K to open.
- Group results semantically.
- Show kbd hints.

## Don't

- Don't auto-open.
- Don't skip the search input.

## Related

- Dialog
- Sheet
- Modal
- CommandPaletteButton

## Code

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
