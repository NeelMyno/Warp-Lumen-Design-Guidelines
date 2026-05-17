---
name: lumen-dropdown-menu
description: Use for action menus next to a content row — table-row '...' button, top-bar user menu, settings options. Rich primitives: DropdownMenuCheckboxItem for multi-select toggles, DropdownMenuRadioItem for single-select, DropdownMenuSubTrigger/SubContent for nesting, DropdownMenuShortcut for keyboard hints, variant='destructive' for delete actions.
---

# Lumen DropdownMenu

Action menu built on Radix DropdownMenu. Items + Checkbox items + Radio items + Sub-menus + Separator + Label + Shortcut + destructive variant. Lime tint on focus; red on destructive focus.

## Use when

- Table-row action menu ('…' button).
- User menu in TopBar.
- Settings + format options on a content surface.
- Multi-select toggles + sub-menus.

## NEVER

- NEVER render menu items as plain <div onClick> — use DropdownMenuItem.
- NEVER omit the keyboard shortcut visual (DropdownMenuShortcut) when an action has one.
- NEVER stack 15+ items without grouping with Separators.

## Tokens consumed

- surface.popover
- surface.tint-accent
- text.primary
- text.tertiary
- border.default
- border.hairline
- shadow.popover
- radius.md
- radius.xs
- lumen.red.0
- lumen.red.5
- lumen.red.7
- z-index.overlay

## Anatomy

1. DropdownMenu root
2. DropdownMenuTrigger
3. DropdownMenuContent (portaled)
4. Items: DropdownMenuItem | CheckboxItem | RadioItem | SubTrigger + SubContent
5. DropdownMenuSeparator
6. DropdownMenuLabel + DropdownMenuShortcut

## API

- Standard Radix DropdownMenu props.
- `variant='destructive'` on Item turns it red.
- `inset` on Item adds left padding for icon alignment.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=menu / role=menuitem / aria-* / arrow-key navigation / type-ahead.
- Focus visible on hover/keyboard via lime tint.
- Sub-triggers have aria-haspopup.

## Code (canonical)

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Related

- Popover
- Combobox
- ContextMenu
- Sidebar (nav)
