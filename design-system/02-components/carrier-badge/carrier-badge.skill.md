---
name: lumen-carrier-badge
description: Use in carrier picker rows, shipment cards, lane assignments — anywhere a carrier identity appears. Composes Avatar (for logo) + numeric OTD% (lumen-tnum). The OTD% colors via PILL token (≥97 success / 93-97 neutral / <93 danger). NEVER use real carrier or person names in fixtures — use the standard synthetic carrier list.
---

# Lumen CarrierBadge

Carrier identity chip. Logo slot + name + rating (★) + vehicle type (FTL / LTL / Reefer / Flatbed) + on-time percentage. Use synthetic names (Sterling LTL, Estes Express, ODFL) per privacy rule — no real-person names.

## Use when

- Carrier picker rows (Combobox option content).
- Lane assignments (carrier per lane).
- Shipment cards (which carrier handles this load).

## NEVER

- NEVER use real person names in fixtures.
- NEVER show a fractional OTD% (round to 1 decimal max).
- NEVER stack 4+ carrier badges per row (visual overload).

## Tokens consumed

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

## Anatomy

1. Avatar (logo or initials)
2. Name (font-medium, --text-primary)
3. Vehicle type chip (text-secondary, optional)
4. Rating (★ + numeric, optional)
5. On-time % (mono-numeric, tone-colored)

## API

- `name` — string (required).
- `logoSrc` — optional image url.
- `vehicle` — FTL | LTL | Reefer | Flatbed.
- `rating` — 1–5 number.
- `otdPct` — 0–100 number.
- `size` — sm | md (default) | lg.
- `compact` — boolean (renders just name + OTD).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- aria-label='Carrier: {name}, {vehicle}, {rating} stars, {otdPct}% on-time'.

## Code (canonical)

```tsx
import { CarrierBadge } from "@/components/ui/carrier-badge";

export function Example() {
  return <CarrierBadge name="Sterling LTL" vehicle="LTL" rating={4.6} otdPct={97.8} />;
}
```

## Related

- Avatar
- Badge
- LaneCode
- Stat
