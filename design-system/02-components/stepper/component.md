---
name: Stepper
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Tabs, Progress, Toolbar, Form]
spec: ./component.json
last_updated: 2026-05-15
---

# Stepper

> Linear multi-step progress affordance. Four states per step (complete, current, upcoming, error). Use for ordered flows where step N depends on step N-1.

## When to use

- Onboarding wizards.
- Multi-page forms (address → payment → review → confirm).
- Setup checklists.
- Audit trail / approval flow visualizations.

## When NOT to use

- Sibling views, free reordering — use Tabs.
- Single continuous progress — use Progress.
- One-step flows — drop the Stepper entirely.
- More than 6 inline steps — collapse to `Step N of M` + a Progress bar.

## Anatomy

1. **`<nav aria-label="Progress">`** — landmark.
2. **`<ol>`** — ordered list (preserves SR semantics).
3. **`<StepperStep>`** — single step. Contains marker + label + optional description + connector.
4. **Marker** — circle (`radius.circle`) sized 28 / 32 / 40 px depending on density. Contains the index, dot, or icon per variant.
5. **Connector** — line between markers. `color.border.hairline` for upcoming; `color.border.accent` for completed.

## States

| State | Marker | Label | Connector to next |
|---|---|---|---|
| `complete` | Filled `color.action.primary.bg.rest` + Check icon | `text.primary` | `border.accent` |
| `current` | Filled `color.action.primary.bg.rest` + index | `text.primary`, font-medium | `border.hairline` |
| `upcoming` | `surface.sunken` + index, dimmed | `text.tertiary` | `border.hairline` |
| `error` | Filled `status.danger.bg` + ! icon | `text.error` | `border.hairline` |

## Variants

- **`numbered`** — index in the marker (default).
- **`dotted`** — minimal dot; pair with `compact=true` on mobile.
- **`iconed`** — per-step lucide icon (e.g. user / credit-card / package).

## Accessibility

- `<nav aria-label="Progress">` + `<ol>`.
- Current step: `aria-current="step"`.
- Each marker's `aria-label` includes state ("Step 2 of 4: Shipping details, current").
- Completed steps with `clickable=true` are buttons; upcoming steps are not focusable.
- Error state announced via the form's own live region, not the Stepper.

## Do

- "Address → Payment → Review → Confirm".
- "Step 2 of 4" text near the Stepper for SR users who land mid-flow.
- Vertical orientation when each step has description text.
- Pair with a Toolbar (Back / Continue) at the bottom.

## Don't

- Don't use Stepper for free-reordered Tabs.
- Don't paint upcoming steps in lime.
- Don't allow forward jumps without validation.
- Don't render more than 6 inline steps.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
