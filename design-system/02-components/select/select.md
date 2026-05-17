---
name: Select
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.input.rest
  - surface.input.disabled
  - surface.popover
  - surface.tint-accent
  - border.default
  - border.strong
  - border.focus
  - border.error
  - text.primary
  - text.tertiary
  - text.placeholder
  - shadow.input.lit-edge
  - shadow.input.focus
  - shadow.popover
  - radius.md
  - radius.xs
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Combobox", "DropdownMenu", "RadioGroup"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/select"
---

# Select

Single-select dropdown built on Radix Select. v0.6 field-shell trigger. Portaled content. For searchable lists use @lumen/combobox.

## When to use

- Single-select with ≤ 8 options.
- Form fields where typing isn't the affordance.
- Inline option pickers (sort by, page size).

## Anatomy

1. Select root
2. SelectTrigger (field-shell visual)
3. SelectValue (renders the selected label / placeholder)
4. SelectContent (portaled)
5. SelectItem × N
6. SelectGroup + SelectLabel + SelectSeparator

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=combobox + role=listbox + aria-* + arrow-key + type-ahead.
- SelectValue shows the selected item or placeholder for screen readers.

## Tokens consumed

- `surface.input.rest`
- `surface.input.disabled`
- `surface.popover`
- `surface.tint-accent`
- `border.default`
- `border.strong`
- `border.focus`
- `border.error`
- `text.primary`
- `text.tertiary`
- `text.placeholder`
- `shadow.input.lit-edge`
- `shadow.input.focus`
- `shadow.popover`
- `radius.md`
- `radius.xs`

## Do

- Use for ≤ 8 options.
- Pair with <Label> via <Field>.

## Don't

- Don't use for >8 options.
- Don't render content inline.

## Related

- Combobox
- DropdownMenu
- RadioGroup

## Code

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function Example() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Service" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ltl">LTL</SelectItem>
        <SelectItem value="ftl">FTL</SelectItem>
      </SelectContent>
    </Select>
  );
}
```
