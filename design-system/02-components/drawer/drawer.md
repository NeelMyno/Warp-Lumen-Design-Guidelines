---
name: Drawer
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.popover
  - surface.scrim
  - text.primary
  - border.default
  - shadow.modal
  - z-index.modal
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Sheet", "Modal", "Dialog", "Sidebar"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/drawer"
---

# Drawer

Side-anchored or bottom-anchored panel. Web: built on Radix Dialog with side=right (default) | bottom. Mobile contract: side=bottom slides up to a sheet. Distinguished from Sheet by typical use case — Drawer is for navigation/menu surfaces; Sheet is for full-task focused workflows.

## When to use

- Compact side-panel nav / menu.
- Mobile bottom-drawer filter picker.
- Notification list.

## Anatomy

1. Drawer root (Radix)
2. DrawerTrigger
3. DrawerContent — side default 'right' or 'bottom' (mobile sheet)
4. DrawerHeader / DrawerFooter / DrawerTitle / DrawerDescription
5. DrawerClose

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=dialog + focus trap + escape.
- Always provide DrawerTitle.
- Outside-click + escape both dismiss.

## Tokens consumed

- `surface.popover`
- `surface.scrim`
- `text.primary`
- `border.default`
- `shadow.modal`
- `z-index.modal`

## Do

- Use for navigation surfaces.
- Use side=bottom on mobile.

## Don't

- Don't use for full-task workflows.
- Don't nest.

## Related

- Sheet
- Modal
- Dialog
- Sidebar

## Code

```tsx
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export function Example() {
  return (
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader><DrawerTitle>Menu</DrawerTitle></DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
```
