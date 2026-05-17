---
name: lumen-radio
description: Use for single-select choices — payment method, shipping option, role. For 2-3 options consider Segmented instead. For 4+ in a tight space use Select.
---

# Lumen Radio

Single-select group built on Radix RadioGroup. .lumen-radio shell; inner dot composed via CSS ::after on data-state=checked. Items render as RadioGroupItem inside a RadioGroup. Grid layout with gap-3 by default.

## Use when

- Single-select choices (payment method, role, shipping option).
- Settings with 3+ mutually exclusive options.
- Survey responses.

## NEVER

- NEVER use Radio for 2 options — use Switch or Segmented.
- NEVER use Radio outside a RadioGroup — single Radio doesn't make sense.
- NEVER mix Radio styles within a single group.

## Tokens consumed

- color.action.primary.bg.rest
- border.default
- border.strong
- shadow.focus

## Anatomy

1. RadioGroup root (grid gap-3)
2. RadioGroupItem × N (.lumen-radio shell)
3. Inner dot (CSS ::after, animated in on checked)

## API

- `value`, `onValueChange` — controlled.
- `defaultValue` — uncontrolled.
- Standard Radix RadioGroup props.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=radiogroup / role=radio, arrow-key navigation, focus management.
- Pair each item with a <Label htmlFor>.
- Group has aria-labelledby for the group label.

## Code (canonical)

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

## Related

- RadioGroup
- Segmented
- Select
- Switch
