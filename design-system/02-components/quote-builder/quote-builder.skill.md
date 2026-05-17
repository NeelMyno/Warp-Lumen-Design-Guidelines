---
name: lumen-quote-builder
description: Use as the centerpiece of a quoting surface — landing page CTA, in-product 'Get rate' modal, mobile bottom-sheet. Composes Combobox (lane) + NumberInput (weight) + Tag picker (accessorials) + Stat (rate output) + primary Button (book). Mobile collapses to single-column.
---

# Lumen QuoteBuilder

Composite for the quote flow. Lane input (origin + destination — composes Combobox) + weight input + accessorial chips + rate output (Stat) + book button. Right-rail layout: inputs left (60%), rate output + book right (40%). Mobile collapses to stacked layout.

## Use when

- Landing-page quoting CTA.
- In-product 'Get rate' modal.
- Mobile bottom-sheet quote flow.

## NEVER

- NEVER allow Book without a rate.
- NEVER fake the rate (always quote).
- NEVER use Title Case for the rate label.

## Tokens consumed

- surface.raised
- surface.sunken
- text.primary
- text.secondary
- text.tertiary
- border.hairline
- radius.lg
- space.4
- space.6

## Anatomy

1. Card root
2. Left column: Lane (Combobox × 2) + Weight (NumberInput) + Accessorials (Tag picker)
3. Right column: Rate output (Stat hero) + Book button
4. Mobile: stacked layout

## API

- `originOptions`, `destinationOptions` — ComboboxOption[].
- `onQuote` — (form) => Promise<{ rate, etaIso }>.
- `onBook` — () => void.
- `isLoading` — boolean (quote in flight).
- `accessorialOptions` — string[].

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Form wraps in <form>.
- Each input has a Label.
- Quote-in-flight surface uses aria-busy.
- Book button is the form's submit.

## Code (canonical)

```tsx
import { QuoteBuilder } from "@/components/ui/quote-builder";

export function Example() {
  return <QuoteBuilder originOptions={[]} destinationOptions={[]} onQuote={async () => ({ rate: "$262", etaIso: "" })} />;
}
```

## Related

- Combobox
- NumberInput
- Tag
- Stat
- LaneCode
- Button
