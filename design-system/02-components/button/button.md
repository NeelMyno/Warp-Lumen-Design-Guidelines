---
name: Button
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react", "ios", "android"]
tokens:
  - color.action.primary.bg.rest
  - color.action.primary.bg.hover
  - color.action.primary.bg.press
  - color.action.primary.fg
  - color.action.secondary.bg.rest
  - color.action.secondary.fg
  - color.action.outline.fg
  - color.action.outline.border.rest
  - color.action.ghost.fg
  - color.action.danger.bg.rest
  - color.action.danger.fg
  - color.action.danger-soft.bg.rest
  - color.action.danger-soft.fg
  - color.action.ai.bg.rest
  - color.action.ai.fg
  - color.action.glass.bg.rest
  - color.action.glass.fg
  - shadow.button.glow.rest
  - shadow.button.glow.hover
  - shadow.button.glow.active
  - shadow.focus
  - shadow.focus.dual.stack
  - button.height.xs
  - button.height.sm
  - button.height.md
  - button.height.lg
  - button.height.xl
  - button.radius.rect
  - button.radius.pill
  - button.radius.round
  - motion.duration.fast
  - motion.easing.standard
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["IconButton", "ButtonGroup", "SplitButton", "CommandPaletteButton", "FAB", "Toggle", "Segmented", "Link"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/button"
---

# Button

Primary action affordance. Five sizes × eight intents × three shapes. The single most-used control in Lumen — every product surface depends on it. v0.9 introduced the dual-ring focus on lime + the three-state glow ladder; v0.12.2 dialed the hover bloom down at the token layer.

## When to use

- Any clickable commit-to-action affordance — Save, Get rates, Book, Delete, Send.
- Primary CTA on a landing hero, an AI Improve action, a destructive Delete account confirmation.
- Inline table-row actions (intent=ghost size=xs) and modal-footer paired primary + secondary.

## Anatomy

1. Optional leading icon (12/14/16/20 px by size)
2. Label text (verb-led, sentence case)
3. Optional trailing icon (chevron, arrow-right)
4. Optional loading spinner (replaces leading icon)
5. Optional success checkmark (transient, 1.6s, replaces leading icon)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Visible focus ring required — do NOT remove via `outline: none`. Primary intent uses dual-ring focus (canvas-colored 2px inner + lime 4px outer; Atlassian 2024 fix; WCAG 2.4.13).
- Disabled state inside a form uses `aria-disabled`, not the `disabled` attribute, so the button stays in tab order.
- Loading state sets `aria-busy=true` and suppresses `onClick`.
- Label must contain ≥ 1 visible character. Icon-only requires the IconButton component with `aria-label`.
- Honor prefers-reduced-motion — hover-color transitions + glow pulses are dropped; the resting glow stays steady.

## Tokens consumed

- `color.action.primary.bg.rest`
- `color.action.primary.bg.hover`
- `color.action.primary.bg.press`
- `color.action.primary.fg`
- `color.action.secondary.bg.rest`
- `color.action.secondary.fg`
- `color.action.outline.fg`
- `color.action.outline.border.rest`
- `color.action.ghost.fg`
- `color.action.danger.bg.rest`
- `color.action.danger.fg`
- `color.action.danger-soft.bg.rest`
- `color.action.danger-soft.fg`
- `color.action.ai.bg.rest`
- `color.action.ai.fg`
- `color.action.glass.bg.rest`
- `color.action.glass.fg`
- `shadow.button.glow.rest`
- `shadow.button.glow.hover`
- `shadow.button.glow.active`
- `shadow.focus`
- `shadow.focus.dual.stack`
- `button.height.xs`
- `button.height.sm`
- `button.height.md`
- `button.height.lg`
- `button.height.xl`
- `button.radius.rect`
- `button.radius.pill`
- `button.radius.round`
- `motion.duration.fast`
- `motion.easing.standard`

## Do

- Use one primary intent per view.
- Lead the label with a verb. Numerate when possible: 'Add 3 lanes' not 'Add lanes'.
- Pair danger intent with a confirmation dialog or HoldToConfirm pattern.
- Use intent=ai for AI-driven primary actions (Improve, Summarize, Suggest) — pair with sparkle leading icon.
- Use shape=pill for hero / marketing CTAs and the AI primary. Operator pages stay shape=rect for density.
- Use intent=danger-soft for destructive actions in tight contexts (table-row delete) where solid red over-emphasizes.

## Don't

- Don't stack three primary buttons in a row.
- Don't use Title Case. Use sentence case.
- Don't put icons on both sides of a short label. Pick one.
- Don't translate or scale on press.
- Don't use intent=ai for non-AI actions — the sparkle + tonal lime is reserved for AI affordances.

## Related

- IconButton
- ButtonGroup
- SplitButton
- CommandPaletteButton
- FAB
- Toggle
- Segmented
- Link

## Code

```tsx
import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <div className="flex gap-3">
      <Button intent="primary">Get rates</Button>
      <Button intent="secondary">Cancel</Button>
    </div>
  );
}
```
