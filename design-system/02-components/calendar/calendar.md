---
name: Calendar
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - surface.tint-accent
  - color.action.primary.bg.rest
  - color.action.primary.fg
  - text.primary
  - text.tertiary
  - border.hairline
  - radius.md
  - radius.xs
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["DatePicker", "Popover", "Input"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/calendar"
---

# Calendar

Date picker grid. Built on react-day-picker v9. Supports single-date, multi-date, range. Lumen-styled day cells (lime tint on selected, hairline on outside-month). Month + year nav with mono-numeric labels.

## When to use

- Date entry — pickup date, delivery date, billing cycle.
- Range — date range filter for analytics.
- Multi-date — booking unavailable days.

## Anatomy

1. Caption (month + year)
2. Nav buttons (prev / next month)
3. Weekday header row
4. Day grid (7 × ~6)
5. Day cell (selected / range start / range end / today / outside / disabled)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- react-day-picker manages role=grid + role=gridcell + aria-selected + arrow-key navigation.
- Honor prefers-reduced-motion (no transition on day select).

## Tokens consumed

- `surface.raised`
- `surface.tint-accent`
- `color.action.primary.bg.rest`
- `color.action.primary.fg`
- `text.primary`
- `text.tertiary`
- `border.hairline`
- `radius.md`
- `radius.xs`

## Do

- Set defaultMonth to the relevant context.
- Disable invalid dates via disabled matcher.

## Don't

- Don't fork day cell rendering.

## Related

- DatePicker
- Popover
- Input

## Code

```tsx
import { Calendar } from "@/components/ui/calendar";

export function Example() {
  return <Calendar mode="single" selected={new Date()} />;
}
```
