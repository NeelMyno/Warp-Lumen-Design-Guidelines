---
name: lumen-calendar
description: Use for inline calendar grids — date picker popovers, range pickers, scheduling. Lumen wraps react-day-picker so the API matches upstream. For the Field + popover composite see @lumen/date-picker.
---

# Lumen Calendar

Date picker grid. Built on react-day-picker v9. Supports single-date, multi-date, range. Lumen-styled day cells (lime tint on selected, hairline on outside-month). Month + year nav with mono-numeric labels.

## Use when

- Date entry — pickup date, delivery date, billing cycle.
- Range — date range filter for analytics.
- Multi-date — booking unavailable days.

## NEVER

- NEVER fork the day cell rendering — use react-day-picker's classNames to retint.
- NEVER skip the today affordance (outline-color on today).

## Tokens consumed

- surface.raised
- surface.tint-accent
- color.action.primary.bg.rest
- color.action.primary.fg
- text.primary
- text.tertiary
- border.hairline
- radius.md
- radius.xs

## Anatomy

1. Caption (month + year)
2. Nav buttons (prev / next month)
3. Weekday header row
4. Day grid (7 × ~6)
5. Day cell (selected / range start / range end / today / outside / disabled)

## API

- `mode` — single | multiple | range (default: single).
- `selected`, `onSelect` — react-day-picker pattern.
- `defaultMonth` — Date.
- `disabled` — Date | Date[] | Matcher.
- All react-day-picker props pass through.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- react-day-picker manages role=grid + role=gridcell + aria-selected + arrow-key navigation.
- Honor prefers-reduced-motion (no transition on day select).

## Code (canonical)

```tsx
import { Calendar } from "@/components/ui/calendar";

export function Example() {
  return <Calendar mode="single" selected={new Date()} />;
}
```

## Related

- DatePicker
- Popover
- Input
