---
name: DatePicker
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.input.rest
  - surface.popover
  - border.default
  - border.focus
  - text.primary
  - text.placeholder
  - shadow.input.lit-edge
  - shadow.input.focus
  - shadow.popover
  - radius.md
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Calendar", "Popover", "Input", "Field"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/date-picker"
---

# DatePicker

Input + popover-calendar composite. Built on Combobox-style trigger (Input visual) + Calendar in a Popover. Single date or range. date-fns for formatting.

## When to use

- Date entry in forms — pickup, delivery, billing cycle.
- Range — analytics date range filter.
- When the calendar should appear in a popover, not inline.

## Anatomy

1. Trigger (Input visual with calendar icon)
2. Popover calendar (Calendar inside Radix Popover)
3. Formatted display (date-fns format)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Calendar a11y inherited from react-day-picker.
- Trigger button has aria-haspopup=dialog.
- Format the date in aria-label for screen readers.

## Tokens consumed

- `surface.input.rest`
- `surface.popover`
- `border.default`
- `border.focus`
- `text.primary`
- `text.placeholder`
- `shadow.input.lit-edge`
- `shadow.input.focus`
- `shadow.popover`
- `radius.md`

## Do

- Use date-fns formatting.
- Provide a clear placeholder ('Pickup date').

## Don't

- Don't use native <input type='date'>.

## Related

- Calendar
- Popover
- Input
- Field

## Code

```tsx
import { DatePicker } from "@/components/ui/date-picker";

export function Example() {
  return <DatePicker placeholder="Pickup date" />;
}
```
