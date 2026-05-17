---
name: lumen-sheet
description: Use when an action requires a focused side surface — settings, filters, contextual help, AI conversation. Composed from Radix Dialog so keyboard / scrim / focus-trap behavior is correct. Side defaults to right; switch to bottom for mobile.
---

# Lumen Sheet

Side-anchored or top/bottom-anchored panel built on Radix Dialog. Sliding entry from the chosen side. Includes Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription.

## Use when

- Settings panel.
- Filter editor (FilterBuilder).
- Contextual help.
- AI conversation embedded in a dashboard.
- Mobile bottom-sheet via side=bottom.

## NEVER

- NEVER nest a Sheet inside another Sheet without an a11y reason.
- NEVER replace the close X without preserving the SheetClose role and aria-label.
- NEVER remove the focus trap.
- NEVER apply backdrop-filter to the overlay — it's a scrim, not a glass surface.

## Tokens consumed

- surface.popover
- surface.scrim
- surface.sunken
- text.primary
- text.tertiary
- border.default
- shadow.modal
- shadow.focus
- radius.xs
- z-index.modal

## Anatomy

1. Sheet root (Radix Root)
2. SheetTrigger — opens the sheet
3. SheetContent — the sliding panel, 75% viewport width default, max-w-sm
4. SheetHeader / SheetTitle / SheetDescription — header content
5. SheetFooter — flex column footer
6. SheetClose — the X button (icon-only, top-right)

## API

- `open`, `onOpenChange` — controlled or uncontrolled (Radix pattern).
- `side` — left | right (default) | top | bottom on SheetContent.
- All Radix Dialog props pass through.
- Modal / non-modal via Radix `modal` prop on the Root.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=dialog, aria-modal, focus trap, escape-to-close, click-outside-to-close.
- Always provide a SheetTitle (visible or sr-only); Radix warns if missing.
- Use SheetDescription for the assistive technology description.

## Code (canonical)

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Example() {
  return (
    <Sheet>
      <SheetTrigger>Filters</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
```

## Related

- Drawer
- Modal
- Dialog
- Popover
- CommandPalette
