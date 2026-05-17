---
name: Card
category: surface
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - text.primary
  - text.tertiary
  - border.hairline
  - radius.xl
  - shadow.sm
  - tracking.tight
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Panel", "Sheet", "Drawer", "Stat", "StatGrid", "EmptyState", "KpiCard", "PricingCard"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/card"
---

# Card

Raised surface container. Hairline border, --surface-raised bg, --radius-xl. v0.12.4 corner-clip contract: when padding=none, child surfaces (e.g. inner header strip) get overflow-hidden on the parent to prevent stair-step past the rounded edge. Six sub-components: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter.

## When to use

- Any grouped block — KPI row, settings panel, pricing tier, AI message bubble.
- When you want raised separation from canvas without a heavy shadow.
- Inside dashboards as the standard container around Stat / StatGrid / LiveDot composites.

## Anatomy

1. Card root — bg + hairline + radius-xl + flex-col + gap-6
2. CardHeader — grid layout with optional CardAction in col 2
3. CardTitle — leading-none font-semibold tracking-tight
4. CardDescription — text-tertiary text-sm
5. CardContent — px-6 padding
6. CardFooter — flex items-center px-6 with optional border-t separation

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Card itself is presentational — assign role / aria-* to its children semantically.
- When used as a clickable target, wrap in <a> or <button>; do NOT add onClick to a div.

## Tokens consumed

- `surface.raised`
- `text.primary`
- `text.tertiary`
- `border.hairline`
- `radius.xl`
- `shadow.sm`
- `tracking.tight`

## Do

- Compose Header → Content → Footer for the standard layout.
- Use padding=none + overflow-hidden when children paint full-bleed surfaces.
- Pair with hairline divider via border-t in CardFooter.

## Don't

- Don't apply backdrop-filter.
- Don't nest more than 2 deep.
- Don't use Card as a clickable target without a wrapping <a>/<button>.

## Related

- Panel
- Sheet
- Drawer
- Stat
- StatGrid
- EmptyState
- KpiCard
- PricingCard

## Code

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Example() {
  return (
    <Card>
      <CardHeader><CardTitle>On-time index</CardTitle></CardHeader>
      <CardContent>98.2%</CardContent>
    </Card>
  );
}
```
