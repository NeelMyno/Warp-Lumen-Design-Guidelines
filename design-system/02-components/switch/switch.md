---
name: Switch
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - color.action.primary.bg.rest
  - surface.sunken
  - surface.raised
  - border.default
  - shadow.focus
  - motion.duration.fast
  - motion.easing.standard
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Checkbox", "Toggle", "RadioGroup"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/switch"
---

# Switch

On/off toggle. Built on Radix Switch with the .lumen-switch shell. Thumb is composed via CSS ::before; Radix's data-state='checked|unchecked' drives the visual. Inline position math via style.left (no Tailwind arbitrary translate — hard rule 12).

## When to use

- Binary on/off settings (Notifications, Dark mode, Auto-save).
- List of toggleable preferences.
- Real-time settings without a Save button.

## Anatomy

1. Switch root (.lumen-switch)
2. Inner thumb (CSS ::before, position via inline style)
3. Track (--surface-sunken rest, --color-action-primary-bg-rest checked)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=switch + aria-checked + keyboard (Space, Enter to toggle).
- Pair with a <Label htmlFor> — clicking the label toggles the switch.
- Honor prefers-reduced-motion (transition becomes instant).

## Tokens consumed

- `color.action.primary.bg.rest`
- `surface.sunken`
- `surface.raised`
- `border.default`
- `shadow.focus`
- `motion.duration.fast`
- `motion.easing.standard`

## Do

- Pair with a label.
- Use for binary real-time settings.

## Don't

- Don't use for actions.
- Don't mix Switch + Checkbox.

## Related

- Checkbox
- Toggle
- RadioGroup

## Code

```tsx
import { Switch } from "@/components/ui/switch";

export function Example() {
  return <Switch defaultChecked />;
}
```
