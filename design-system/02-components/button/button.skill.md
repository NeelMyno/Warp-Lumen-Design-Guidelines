---
name: lumen-button
description: Use when generating any clickable action surface in a Lumen-themed React app. Returns a token-driven Button matching the v0.13 contract — eight intents (primary, secondary, outline, tertiary, ghost, danger, danger-soft, ai, glass, link), five sizes (xs/sm/md/lg/xl), three shapes (rect/pill/round), with dual-ring focus on lime accent. Use one primary per view. Lead the label with a verb.
---

# Lumen Button

Primary action affordance. Five sizes × eight intents × three shapes. The single most-used control in Lumen — every product surface depends on it. v0.9 introduced the dual-ring focus on lime + the three-state glow ladder; v0.12.2 dialed the hover bloom down at the token layer.

## Use when

- Any clickable commit-to-action affordance — Save, Get rates, Book, Delete, Send.
- Primary CTA on a landing hero, an AI Improve action, a destructive Delete account confirmation.
- Inline table-row actions (intent=ghost size=xs) and modal-footer paired primary + secondary.

## NEVER

- NEVER render white or near-white text on the Spring Green accent surface. The primary action fg is bound to `--color-action-primary-fg` (= #07120D, 14.7:1 AAA). White on spring green = ~1.4:1 (WCAG AA fail). Lint rule `lint:no-white-on-accent` enforces.
- NEVER use the shadcn token-bridge utilities (`bg-primary text-primary-foreground`) in product code — Tailwind v4's content scanner has been observed to drop them (ADR 0015). Use the `.lumen-btn-*` classes or direct `var(--…)` refs.
- NEVER stack three primary buttons in a row. One primary per view. Multiple primaries = no primary.
- NEVER use Title Case. Sentence case only. Lead the label with a verb.
- NEVER apply intent=primary to a destructive action — that's intent=danger.
- NEVER translate or scale the button on press. Press feedback is `filter: brightness(0.92)` + glow ladder shrink. Decelerate, no bounce.

## Tokens consumed

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

## Anatomy

1. Optional leading icon (12/14/16/20 px by size)
2. Label text (verb-led, sentence case)
3. Optional trailing icon (chevron, arrow-right)
4. Optional loading spinner (replaces leading icon)
5. Optional success checkmark (transient, 1.6s, replaces leading icon)

## API

- `intent` — primary | secondary | outline | tertiary | ghost | danger | danger-soft | ai | glass | link (default: secondary)
- `size` — xs | sm | md | lg | xl (default: md). Mobile primary ≥ lg to clear 44px touch.
- `shape` — rect | pill | round (default: rect). Pill = hero / AI / marketing.
- `leadingIcon`, `trailingIcon` — ReactNode
- `loading` — boolean. Shows spinner, sets aria-busy, suppresses click.
- `success` — boolean. Transient checkmark, 1.6s, then auto-clears.
- `pressed` — boolean. aria-pressed=true, renders the lime-tinted selected surface.
- `fullWidth` — boolean. w-full for modal footers + mobile CTAs.
- `asChild` — boolean. Composes via Radix Slot (e.g. wrap an `<a>` for link buttons).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: no behavior change — the primary surface stays lime, the glow ladder honors prefers-reduced-motion regardless of mode.

## Accessibility

- Visible focus ring required — do NOT remove via `outline: none`. Primary intent uses dual-ring focus (canvas-colored 2px inner + lime 4px outer; Atlassian 2024 fix; WCAG 2.4.13).
- Disabled state inside a form uses `aria-disabled`, not the `disabled` attribute, so the button stays in tab order.
- Loading state sets `aria-busy=true` and suppresses `onClick`.
- Label must contain ≥ 1 visible character. Icon-only requires the IconButton component with `aria-label`.
- Honor prefers-reduced-motion — hover-color transitions + glow pulses are dropped; the resting glow stays steady.

## Code (canonical)

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

## Related

- IconButton
- ButtonGroup
- SplitButton
- CommandPaletteButton
- FAB
- Toggle
- Segmented
- Link
