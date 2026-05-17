---
name: lumen-modal
description: Use for centered modal interactions — confirmations, focused forms, AI artifact previews. For side panels use Drawer; for full-screen workflows use Sheet. Destructive confirmations get the brutalist hairline frame (border-2 border-[var(--border-error)]).
---

# Lumen Modal

Centered modal dialog. Built on Radix Dialog. Same a11y as Drawer / Sheet (focus trap, escape dismiss, scrim). Use for confirmations, focused forms, AI artifact previews. v0.13 hard rule: brutalist hairline frame on destructive confirmations.

## Use when

- Confirmations (Delete account, Cancel shipment).
- Focused forms (Add lane, Edit carrier).
- AI artifact previews.

## NEVER

- NEVER use Modal for non-blocking content (use Toast or Banner).
- NEVER nest Modals.
- NEVER strip the close affordance unless destructive flow forces explicit action.

## Tokens consumed

- surface.popover
- surface.scrim
- text.primary
- text.tertiary
- border.default
- border.error
- shadow.modal
- radius.xl
- z-index.modal

## Anatomy

1. Modal root (Radix)
2. ModalTrigger
3. ModalContent — centered, max-w-lg by default
4. ModalHeader / ModalTitle / ModalDescription
5. ModalFooter — flex column-reverse on mobile, row on desktop
6. ModalClose

## API

- `open`, `onOpenChange` — controlled.
- `size` — sm | md (default) | lg | xl.
- `destructive` — boolean adds brutalist hairline frame.
- Standard Radix Dialog props.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=dialog + aria-modal + focus trap + escape.
- ModalTitle required (visible or sr-only).
- ModalDescription provides screen-reader context.

## Code (canonical)

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

## Related

- Dialog
- Drawer
- Sheet
- Confirmation
