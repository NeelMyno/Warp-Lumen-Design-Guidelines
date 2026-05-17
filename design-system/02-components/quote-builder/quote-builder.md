---
name: QuoteBuilder
category: freight-domain
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
  - radius.lg
  - space.4
  - space.6
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Combobox", "NumberInput", "Tag", "Stat", "LaneCode", "Button"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/quote-builder"
---

# QuoteBuilder

Composite for the quote flow. Lane input (origin + destination — composes Combobox) + weight input + accessorial chips + rate output (Stat) + book button. Right-rail layout: inputs left (60%), rate output + book right (40%). Mobile collapses to stacked layout.

## When to use

- Landing-page quoting CTA.
- In-product 'Get rate' modal.
- Mobile bottom-sheet quote flow.

## Anatomy

1. Card root
2. Left column: Lane (Combobox × 2) + Weight (NumberInput) + Accessorials (Tag picker)
3. Right column: Rate output (Stat hero) + Book button
4. Mobile: stacked layout

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Form wraps in <form>.
- Each input has a Label.
- Quote-in-flight surface uses aria-busy.
- Book button is the form's submit.

## Tokens consumed

- `surface.raised`
- `surface.sunken`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `border.hairline`
- `radius.lg`
- `space.4`
- `space.6`

## Do

- Pair with Combobox for lanes.
- Use Stat hero for the rate display.
- Disable Book until rate is fresh.

## Don't

- Don't allow Book without rate.
- Don't fake quotes.

## Related

- Combobox
- NumberInput
- Tag
- Stat
- LaneCode
- Button

## Code

```tsx
import { QuoteBuilder } from "@/components/ui/quote-builder";

export function Example() {
  return <QuoteBuilder originOptions={[]} destinationOptions={[]} onQuote={async () => ({ rate: "$262", etaIso: "" })} />;
}
```
