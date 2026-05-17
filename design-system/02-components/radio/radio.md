---
name: Radio
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - color.action.primary.bg.rest
  - border.default
  - border.strong
  - shadow.focus
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["RadioGroup", "Segmented", "Select", "Switch"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/radio"
---

# Radio

Single-select group built on Radix RadioGroup. .lumen-radio shell; inner dot composed via CSS ::after on data-state=checked. Items render as RadioGroupItem inside a RadioGroup. Grid layout with gap-3 by default.

## When to use

- Single-select choices (payment method, role, shipping option).
- Settings with 3+ mutually exclusive options.
- Survey responses.

## Anatomy

1. RadioGroup root (grid gap-3)
2. RadioGroupItem × N (.lumen-radio shell)
3. Inner dot (CSS ::after, animated in on checked)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=radiogroup / role=radio, arrow-key navigation, focus management.
- Pair each item with a <Label htmlFor>.
- Group has aria-labelledby for the group label.

## Tokens consumed

- `color.action.primary.bg.rest`
- `border.default`
- `border.strong`
- `shadow.focus`

## Do

- Pair each option with a Label.
- Use for 3+ options.

## Don't

- Don't use for 2 options.
- Don't omit RadioGroup wrapper.

## Related

- RadioGroup
- Segmented
- Select
- Switch

## Code

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function Example() {
  return (
    <RadioGroup defaultValue="ftl">
      <RadioGroupItem value="ftl" />
      <RadioGroupItem value="ltl" />
    </RadioGroup>
  );
}
```
