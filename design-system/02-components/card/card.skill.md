---
name: lumen-card
description: Use when grouping content into a raised panel — KPI rows, settings cards, AI message bubbles, landing pricing tiles. Hairline border + --surface-raised bg. Compose Card with CardHeader/CardTitle/CardDescription/CardAction/CardContent/CardFooter for the standard layout.
---

# Lumen Card

Raised surface container. Hairline border, --surface-raised bg, --radius-xl. v0.12.4 corner-clip contract: when padding=none, child surfaces (e.g. inner header strip) get overflow-hidden on the parent to prevent stair-step past the rounded edge. Six sub-components: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter.

## Use when

- Any grouped block — KPI row, settings panel, pricing tier, AI message bubble.
- When you want raised separation from canvas without a heavy shadow.
- Inside dashboards as the standard container around Stat / StatGrid / LiveDot composites.

## NEVER

- NEVER hardcode hex / radius. All values come from tokens.
- NEVER add backdrop-filter to Card — Card is a dense surface; glass goes on floating shells only (hard rule 16).
- NEVER nest Card inside Card without a clear hierarchy reason — flattens visual depth.
- NEVER strip the hairline border — it's the brutalist voice element.

## Tokens consumed

- surface.raised
- text.primary
- text.tertiary
- border.hairline
- radius.xl
- shadow.sm
- tracking.tight

## Anatomy

1. Card root — bg + hairline + radius-xl + flex-col + gap-6
2. CardHeader — grid layout with optional CardAction in col 2
3. CardTitle — leading-none font-semibold tracking-tight
4. CardDescription — text-tertiary text-sm
5. CardContent — px-6 padding
6. CardFooter — flex items-center px-6 with optional border-t separation

## API

- Card — standard div, accepts className override.
- CardHeader — grid layout; auto-detects CardAction child via has-data attribute.
- CardTitle / CardDescription — semantic labels for the header.
- CardAction — positioned in col 2 of CardHeader; row-span-2.
- CardContent / CardFooter — body and footer slots.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Card itself is presentational — assign role / aria-* to its children semantically.
- When used as a clickable target, wrap in <a> or <button>; do NOT add onClick to a div.

## Code (canonical)

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

## Related

- Panel
- Sheet
- Drawer
- Stat
- StatGrid
- EmptyState
- KpiCard
- PricingCard
