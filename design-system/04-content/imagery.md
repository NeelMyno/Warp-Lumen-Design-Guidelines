---
name: Imagery
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [./illustration.md, ./iconography.md, ../00-foundations/principles.md]
---

# Imagery

> Lumen's imagery rules are restrictive on purpose. Warp ships zero stock photography in production. The system inherits that discipline.

## What imagery Lumen ALLOWS

In order of preference:

### 1. Product screenshots
- The product UI as it actually exists, in the obsidian-mint mood, with a soft hairline frame, optional radial-lime ambient glow, and `radius-2xl` corners.
- Always real data, never lorem ipsum.
- For marketing, screenshots may be lightly retouched (re-anonymized customer names) but never invented.
- Hero placement: full-bleed or centered with `space.16` margin.
- Caption: optional, `type.caption` muted, lower-left.

### 2. Documentary photography
- Real warehouses, real ports, real trucks, real operators — never stock photographers' interpretations of those.
- Shot in natural light when possible; avoid heavy studio lighting.
- People are present but rarely featured (operators with backs to camera, hands on terminal — not portrait poses).
- Color: lean into neutrals + the natural world. Avoid the green accent in photography (it's a UI signal, not a photographic motif).
- Aspect ratios: 16:9 (hero), 4:5 (portrait), 4:3 (medium).

### 3. Monoline technical diagrams
- For abstract concepts (network topology, data flow, contract structure).
- 1.5 px stroke, single color (`text-primary`), no fills.
- Built in Figma or hand-drawn in the same iconography language.

### 4. Customer + press logos
- Flat monoline lockups in `text-tertiary` color (light mode) / `text-secondary` (dark mode).
- Arranged in a single row at uniform optical weight (size logos so they read as equal, not pixel-equal).
- Never on a colored background; always on `surface.page` or `surface.sunken`.

## What Lumen FORBIDS

Hard rules. No exceptions.

- ❌ **Stock photography.** Office workers high-fiving, abstract bokeh, hands on a laptop, glowing servers, blue-purple gradient sunsets. None.
- ❌ **AI-generated images.** Even if technically excellent, they have a tell. They also lack the documentary integrity Lumen claims.
- ❌ **Illustrated mascots.** No characters. No "Warpy the truck."
- ❌ **Isometric scenes.** The early-2020s SaaS aesthetic.
- ❌ **Colored gradients used as decoration.** Gradients only when they communicate (data range, network flow).
- ❌ **Pattern backgrounds** (dots, lines, hex grids) used as decoration. The blueprint grid backdrop on Warp's site is the only allowed pattern, and it's structural, not decorative.
- ❌ **Hero videos that auto-play with sound.** Auto-play muted is fine; sound is not.

## Treatment specs

### Product screenshots
- Border: 1px hairline `border-subtle`.
- Radius: `radius.2xl` (20 px).
- Shadow: `shadow.xl` for marketing hero; `shadow.lg` for in-page; none for dashboard.
- Background: `surface.sunken` to give the screenshot air.
- Optional: 1px outline at the screen-bezel level for the "device-on-canvas" feel.

### Documentary photography
- Border: none.
- Radius: `radius.lg` (10 px) for cards; full-bleed for hero.
- Filter: warm-tone shift +5%, contrast +5%, saturation -5% to harmonize with paper-warm palette.
- Captions: `type.caption` italic, secondary color, attribution lower-right.

### Customer logos
- Render at consistent optical weight, not pixel weight.
- Container: `space.4` (16 px) padding around each.
- Hover: light-mode darken to `text-secondary`, dark-mode lighten to `text-primary`.
- Group: `space.10` (40 px) gaps between logos in a row.

## Sourcing

- For product screenshots: take them yourself, with real data.
- For documentary photography: commission from photographers who've shot logistics / industrial subjects (not lifestyle photographers). Look at: Adam Magyar, Edward Burtynsky, Christoph Niemann's instructional drawings as taste references.
- For customer / press logos: get the official monoline version from the customer's brand kit. Never trace.

## Accessibility

- Every image gets `alt` text. For decorative images, `alt=""`.
- Captions are present in HTML, not baked into the image.
- Photography meets contrast minimums for any overlaid text — overlay text uses `text-inverse` over `surface.scrim`.

## File specs

- Web: WebP primary, JPEG fallback. Max 240 KB for hero, 120 KB for in-page.
- Mobile: same, with `srcset` for 1×/2×/3× density.
- Lazy load all images below the fold.
