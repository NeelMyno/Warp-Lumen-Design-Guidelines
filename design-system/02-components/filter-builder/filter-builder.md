---
name: FilterBuilder
category: data
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - surface.sunken
  - text.primary
  - text.secondary
  - text.tertiary
  - border.hairline
  - border.default
  - radius.md
  - space.2
  - space.3
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["FilterChip", "SavedView", "Combobox", "DatePicker"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/filter-builder"
---

# FilterBuilder

Query-DSL editor — operator/field/value chip rows. Each row is a (field, operator, value) triple. Composable AND/OR groups. Add-condition button + Save-as-view CTA.

## When to use

- Lane filter — origin = LAX AND destination IN (SFO, OAK) AND status != cancelled.
- Shipment filter — pickup-date BETWEEN x AND y AND lane = LAX→SFO.
- Saved query state via SavedView.

## Anatomy

1. FilterBuilder root
2. FilterRow × N — { field-select, operator-select, value-input/combobox, remove-button }
3. FilterGroup — wraps rows; AND/OR connector chip
4. Add condition button
5. Save-as-view button

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Each row is a labeled group with role=group + aria-label='Filter row N'.
- Add/remove buttons have descriptive aria-labels.
- Use semantic HTML — <fieldset> for the whole builder.

## Tokens consumed

- `surface.raised`
- `surface.sunken`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `border.hairline`
- `border.default`
- `radius.md`
- `space.2`
- `space.3`

## Do

- Provide type-appropriate operators (text: contains/equals; date: before/after/between).
- Pair with SavedView.

## Don't

- Don't allow ambiguous operators.
- Don't hide the remove button.

## Related

- FilterChip
- SavedView
- Combobox
- DatePicker

## Code

```tsx
import { FilterBuilder } from "@/components/ui/filter-builder";

export function Example() {
  return <FilterBuilder fields={[{ value: "lane", label: "Lane", type: "text" }]} />;
}
```
