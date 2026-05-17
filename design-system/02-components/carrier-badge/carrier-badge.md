---
name: CarrierBadge
category: freight-domain
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - text.primary
  - text.secondary
  - text.tertiary
  - text.accent
  - border.hairline
  - pill.success.bg
  - pill.success.fg
  - pill.warn.bg
  - pill.warn.fg
  - pill.danger.bg
  - pill.danger.fg
  - radius.md
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Avatar", "Badge", "LaneCode", "Stat"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/carrier-badge"
---

# CarrierBadge

Carrier identity chip. Logo slot + name + rating (★) + vehicle type (FTL / LTL / Reefer / Flatbed) + on-time percentage. Use synthetic names (Sterling LTL, Estes Express, ODFL) per privacy rule — no real-person names.

## When to use

- Carrier picker rows (Combobox option content).
- Lane assignments (carrier per lane).
- Shipment cards (which carrier handles this load).

## Anatomy

1. Avatar (logo or initials)
2. Name (font-medium, --text-primary)
3. Vehicle type chip (text-secondary, optional)
4. Rating (★ + numeric, optional)
5. On-time % (mono-numeric, tone-colored)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- aria-label='Carrier: {name}, {vehicle}, {rating} stars, {otdPct}% on-time'.

## Tokens consumed

- `surface.raised`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `text.accent`
- `border.hairline`
- `pill.success.bg`
- `pill.success.fg`
- `pill.warn.bg`
- `pill.warn.fg`
- `pill.danger.bg`
- `pill.danger.fg`
- `radius.md`

## Do

- Use synthetic carrier names.
- Color OTD% by tier.
- Use compact in dense rows.

## Don't

- Don't use real names.
- Don't show fractional OTD beyond 0.1.

## Related

- Avatar
- Badge
- LaneCode
- Stat

## Code

```tsx
import { CarrierBadge } from "@/components/ui/carrier-badge";

export function Example() {
  return <CarrierBadge name="Sterling LTL" vehicle="LTL" rating={4.6} otdPct={97.8} />;
}
```
