---
name: Modal
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.popover
  - surface.scrim
  - text.primary
  - text.tertiary
  - border.default
  - border.error
  - shadow.modal
  - radius.xl
  - z-index.modal
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Dialog", "Drawer", "Sheet", "Confirmation"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/modal"
---

# Modal

Centered modal dialog. Built on Radix Dialog. Same a11y as Drawer / Sheet (focus trap, escape dismiss, scrim). Use for confirmations, focused forms, AI artifact previews. v0.13 hard rule: brutalist hairline frame on destructive confirmations.

## When to use

- Confirmations (Delete account, Cancel shipment).
- Focused forms (Add lane, Edit carrier).
- AI artifact previews.

## Anatomy

1. Modal root (Radix)
2. ModalTrigger
3. ModalContent — centered, max-w-lg by default
4. ModalHeader / ModalTitle / ModalDescription
5. ModalFooter — flex column-reverse on mobile, row on desktop
6. ModalClose

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=dialog + aria-modal + focus trap + escape.
- ModalTitle required (visible or sr-only).
- ModalDescription provides screen-reader context.

## Tokens consumed

- `surface.popover`
- `surface.scrim`
- `text.primary`
- `text.tertiary`
- `border.default`
- `border.error`
- `shadow.modal`
- `radius.xl`
- `z-index.modal`

## Do

- Pair with ModalFooter primary + secondary buttons.
- Use destructive flag for delete/cancel confirmations.

## Don't

- Don't use for non-blocking.
- Don't nest.

## Related

- Dialog
- Drawer
- Sheet
- Confirmation

## Code

```tsx
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";

export function Example() {
  return (
    <Modal>
      <ModalTrigger>Open</ModalTrigger>
      <ModalContent>
        <ModalHeader><ModalTitle>Confirm</ModalTitle></ModalHeader>
        <ModalFooter>{/* buttons */}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```
