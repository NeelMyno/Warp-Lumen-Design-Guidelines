---
name: Iconography
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [./illustration.md, ../00-foundations/principles.md]
---

# Iconography

> Single-stroke (1.5 px), 24 px grid, rounded ends, no fills. The custom logistics set sits inside the same drawing language as system icons. Reference: Linear's icon set, Apple SF Symbols.

## Specifications

| Property | Value |
|---|---|
| Stroke weight | 1.5 px (constant; do not vary by icon size) |
| Stroke linecap | round |
| Stroke linejoin | round |
| Stroke color | `currentColor` (inherits from parent) |
| Fill | none, with rare exceptions (filled status dots, arrowheads) |
| Grid | 24 × 24 px (1 unit = 1 px at 1× display) |
| Padding (optical balance) | 2 px on all sides |
| Output format | SVG, optimized with SVGO, no inline styles |

## Sizes

Icons render at these sizes:

| Size | Use |
|---|---|
| 12 px | Inline metadata, eyebrow indicator |
| 14 px | Inline body text, table cells |
| 16 px | Default — buttons, list rows |
| 18 px | Larger UI controls |
| 20 px | Mobile tab bar, larger inline |
| 24 px | Hero icon, sidebar nav, framed circle |
| 32 px | Empty state icon container |
| 48 px | Marketing feature icon |

Stroke weight stays 1.5 px at every size — do NOT scale stroke with icon size.

## Library

Lumen ships ~40 system icons + a custom logistics set. The current shipped library:

### System icons
`home`, `inbox`, `box`, `bell`, `search`, `filter`, `code`, `cart`, `user`, `plus`, `check`, `x`, `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `settings`, `menu`, `more-horizontal`, `external-link`.

### Logistics set
`truck`, `lane`, `bol` (bill of lading), `dock`, `pallet`, `route`, `network`, `customs`, `manifest`, `weight`, `dimensions`, `eta`, `pickup`, `delivery`, `cross-dock`, `live-tracking`, `signature`.

(Ship as a single SVG sprite + a per-icon React component.)

## Drawing rules

1. **Construct on the 24 px grid.** Even pixel-perfection shifts.
2. **Sit on the optical baseline,** not the geometric center. Visually balance — letters like "h" sit above the baseline, but icons should hover slightly.
3. **Rounded corners.** Hard 90° corners are too sharp at small sizes; use 0.5 – 1 px radius.
4. **Match Lumen line weight.** No exceptions. If a 1 px detail is required, simplify the icon instead.
5. **Do not include color.** Icons are monochrome via `currentColor`. Status meaning lives in the parent (a colored badge, a colored container).

## Adding a new icon

1. Draw in Figma at 24 × 24 px artboard, 1.5 px stroke.
2. Convert strokes to outlines at export time only if the consumer needs `<path fill>`; otherwise keep `<path stroke>`.
3. Run through SVGO with `removeTitle`, `removeDesc`, `removeViewBox=false`.
4. Add to `audit-dashboard/src/components/primitives/icon.tsx` as a named export.
5. Register in the icon registry: `_registry/icons.json`.

## Accessibility

- Decorative icons: `aria-hidden="true"`, no `title` element.
- Meaningful icons (icon-only buttons): wrap in a control with `aria-label`. The icon stays decorative.
- Inline icons next to text: `aria-hidden="true"`; the text is the label.

## What's forbidden

- Filled icons (except status dots, arrowheads).
- Duotone icons.
- Multiple stroke weights in one icon.
- Drop shadows.
- Color in the icon (color is only on the parent container).
- Outline + fill versions of the same glyph (causes inconsistency).
- Cartoon icons, cute icons, character icons.
