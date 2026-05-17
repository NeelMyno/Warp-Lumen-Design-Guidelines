---
name: lumen-date-picker
description: Use for date entry in forms — pickup, delivery, billing cycle. Composes the v0.6 field-shell input visual with a Calendar popover. For inline calendar use @lumen/calendar. For range use mode='range'.
---

# Lumen DatePicker

Input + popover-calendar composite. Built on Combobox-style trigger (Input visual) + Calendar in a Popover. Single date or range. date-fns for formatting.

## Use when

- Date entry in forms — pickup, delivery, billing cycle.
- Range — analytics date range filter.
- When the calendar should appear in a popover, not inline.

## NEVER

- NEVER use a native <input type='date'> (different per-browser visual).
- NEVER omit the calendar icon (it's the affordance).
- NEVER skip the portal.

## Tokens consumed

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

## Anatomy

1. Trigger (Input visual with calendar icon)
2. Popover calendar (Calendar inside Radix Popover)
3. Formatted display (date-fns format)

## API

- `value`, `onChange` — Date | DateRange | undefined.
- `mode` — single | range (default: single).
- `format` — date-fns format string (default: 'PP' / 'PP – PP' for range).
- `placeholder` — string.
- `disabled` — boolean.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Calendar a11y inherited from react-day-picker.
- Trigger button has aria-haspopup=dialog.
- Format the date in aria-label for screen readers.

## Code (canonical)

```tsx
import { DatePicker } from "@/components/ui/date-picker";

export function Example() {
  return <DatePicker placeholder="Pickup date" />;
}
```

## Related

- Calendar
- Popover
- Input
- Field
