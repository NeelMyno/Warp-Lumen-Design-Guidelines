---
name: Sheet
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Drawer", "Modal", "Dialog", "Popover", "CommandPalette"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/sheet"
---

# Sheet

Side-anchored or top/bottom-anchored panel built on Radix Dialog. Sliding entry from the chosen side. Includes Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription.

## When to use

- Settings panel.
- Filter editor (FilterBuilder).
- Contextual help.
- AI conversation embedded in a dashboard.
- Mobile bottom-sheet via side=bottom.

## Anatomy

1. Sheet root (Radix Root)
2. SheetTrigger — opens the sheet
3. SheetContent — the sliding panel, 75% viewport width default, max-w-sm
4. SheetHeader / SheetTitle / SheetDescription — header content
5. SheetFooter — flex column footer
6. SheetClose — the X button (icon-only, top-right)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=dialog, aria-modal, focus trap, escape-to-close, click-outside-to-close.
- Always provide a SheetTitle (visible or sr-only); Radix warns if missing.
- Use SheetDescription for the assistive technology description.

## Tokens consumed

- `surface.popover`
- `surface.scrim`
- `surface.sunken`
- `text.primary`
- `text.tertiary`
- `border.default`
- `shadow.modal`
- `shadow.focus`
- `radius.xs`
- `z-index.modal`

## Do

- Compose Header → content → Footer.
- Use side=bottom for mobile.
- Provide a SheetTitle for screen readers.

## Don't

- Don't disable Radix's focus trap.
- Don't replace the scrim with a backdrop-filter blur.

## Related

- Drawer
- Modal
- Dialog
- Popover
- CommandPalette

## Code

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
