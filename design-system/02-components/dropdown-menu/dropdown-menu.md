---
name: DropdownMenu
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Popover", "Combobox", "ContextMenu", "Sidebar (nav)"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/dropdown-menu"
---

# DropdownMenu

Action menu built on Radix DropdownMenu. Items + Checkbox items + Radio items + Sub-menus + Separator + Label + Shortcut + destructive variant. Lime tint on focus; red on destructive focus.

## When to use

- Table-row action menu ('…' button).
- User menu in TopBar.
- Settings + format options on a content surface.
- Multi-select toggles + sub-menus.

## Anatomy

1. DropdownMenu root
2. DropdownMenuTrigger
3. DropdownMenuContent (portaled)
4. Items: DropdownMenuItem | CheckboxItem | RadioItem | SubTrigger + SubContent
5. DropdownMenuSeparator
6. DropdownMenuLabel + DropdownMenuShortcut

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=menu / role=menuitem / aria-* / arrow-key navigation / type-ahead.
- Focus visible on hover/keyboard via lime tint.
- Sub-triggers have aria-haspopup.

## Tokens consumed

- `surface.popover`
- `surface.tint-accent`
- `text.primary`
- `text.tertiary`
- `border.default`
- `border.hairline`
- `shadow.popover`
- `radius.md`
- `radius.xs`
- `lumen.red.0`
- `lumen.red.5`
- `lumen.red.7`
- `z-index.overlay`

## Do

- Group with Separator.
- Use shortcuts via DropdownMenuShortcut.
- Use variant='destructive' for delete actions.

## Don't

- Don't render as plain divs.
- Don't stack 15+ items.

## Related

- Popover
- Combobox
- ContextMenu
- Sidebar (nav)

## Code

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
