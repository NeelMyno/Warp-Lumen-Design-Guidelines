---
name: lumen-switch
description: Use for binary settings — Enabled/Disabled, Notifications on/off, Dark mode. For multi-option selection use RadioGroup. For multiple binary settings use a list of Switches with consistent label placement (left or right, not mixed).
---

# Lumen Switch

On/off toggle. Built on Radix Switch with the .lumen-switch shell. Thumb is composed via CSS ::before; Radix's data-state='checked|unchecked' drives the visual. Inline position math via style.left (no Tailwind arbitrary translate — hard rule 12).

## Use when

- Binary on/off settings (Notifications, Dark mode, Auto-save).
- List of toggleable preferences.
- Real-time settings without a Save button.

## NEVER

- NEVER use a Switch for actions (Save, Delete) — that's a Button.
- NEVER mix Switch + Checkbox in the same list — pick one pattern.
- NEVER use Tailwind arbitrary translate for the thumb (hard rule 12).

## Tokens consumed

- color.action.primary.bg.rest
- surface.sunken
- surface.raised
- border.default
- shadow.focus
- motion.duration.fast
- motion.easing.standard

## Anatomy

1. Switch root (.lumen-switch)
2. Inner thumb (CSS ::before, position via inline style)
3. Track (--surface-sunken rest, --color-action-primary-bg-rest checked)

## API

- Standard Radix Switch props.
- `checked`, `onCheckedChange` — controlled.
- `defaultChecked` — uncontrolled.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=switch + aria-checked + keyboard (Space, Enter to toggle).
- Pair with a <Label htmlFor> — clicking the label toggles the switch.
- Honor prefers-reduced-motion (transition becomes instant).

## Code (canonical)

```tsx
import { Switch } from "@/components/ui/switch";

export function Example() {
  return <Switch defaultChecked />;
}
```

## Related

- Checkbox
- Toggle
- RadioGroup
