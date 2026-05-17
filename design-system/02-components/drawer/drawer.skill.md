---
name: lumen-drawer
description: Use for compact side-panel navigation (account menu, notification list) or mobile bottom-drawer (filter picker). For full-task focused workflows use @lumen/sheet. Both are built on Radix Dialog so a11y is identical.
---

# Lumen Drawer

Side-anchored or bottom-anchored panel. Web: built on Radix Dialog with side=right (default) | bottom. Mobile contract: side=bottom slides up to a sheet. Distinguished from Sheet by typical use case — Drawer is for navigation/menu surfaces; Sheet is for full-task focused workflows.

## Use when

- Compact side-panel nav / menu.
- Mobile bottom-drawer filter picker.
- Notification list.

## NEVER

- NEVER use Drawer for full-screen modals — use Modal.
- NEVER strip the close affordance.
- NEVER nest Drawer in Drawer.

## Tokens consumed

- surface.popover
- surface.scrim
- text.primary
- border.default
- shadow.modal
- z-index.modal

## Anatomy

1. Drawer root (Radix)
2. DrawerTrigger
3. DrawerContent — side default 'right' or 'bottom' (mobile sheet)
4. DrawerHeader / DrawerFooter / DrawerTitle / DrawerDescription
5. DrawerClose

## API

- `open`, `onOpenChange` — controlled.
- `side` — right (default) | bottom.
- Standard Radix Dialog props pass through.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=dialog + focus trap + escape.
- Always provide DrawerTitle.
- Outside-click + escape both dismiss.

## Code (canonical)

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

## Related

- Sheet
- Modal
- Dialog
- Sidebar
