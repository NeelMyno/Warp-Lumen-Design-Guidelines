---
name: Spacing
type: foundation
version: 1.0.0
last_updated: 2026-05-03
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./typography.md
  - ./density.md
  - ./forms-and-inputs.md
  - ./accessibility.md
  - ../01-tokens/primitives/dimension.tokens.json
  - ../01-tokens/semantic/space.tokens.json
  - ../01-tokens/primitives/radius.tokens.json
---

# Lumen Spacing

> Lumen runs on a **4-point base grid** with an 8-point soft alignment. Every structural pixel snaps to 4 (most things to 8). The semantic space ladder is what consumers reach for; the primitive `dimension.*` table is what Style Dictionary emits to it. Whitespace lives **inside** sections, not between them — per [`principles.md`](./principles.md) §5.

This is the canonical reference. Primitives are in [`01-tokens/primitives/dimension.tokens.json`](../01-tokens/primitives/dimension.tokens.json). Semantic aliases are in [`01-tokens/semantic/space.tokens.json`](../01-tokens/semantic/space.tokens.json). Radius (sibling system) is in [`01-tokens/primitives/radius.tokens.json`](../01-tokens/primitives/radius.tokens.json).

---

## 1. The grid

**4-point base. 8-point soft.** Every structural pixel snaps to 4. Most snap to 8. Half-steps (4) are accepted; quarter-steps (2) are exceptions, reserved for hairline accents and the radius system.

| Grid | Unit | Use |
|---|---|---|
| **4-point base** | 4 px | Tightest legal step. Half-grid. Used for label-to-control gap, hairline offsets. |
| **8-point soft** | 8 px | Default rhythm. Section spacing, card padding, control padding. |
| **2-point exception** | 2 px | Hairline accents, `radius.xs`, micro-offsets. Document each use. |

Why both. The 4-point base gives precise control where it matters (form field rhythm, table cells, icon-to-label gaps). The 8-point soft grid gives macro rhythm that compounds cleanly across long-scroll pages. Linear, Stripe, Apple HIG, and Material 3 all converge on the 4 / 8 model — Lumen follows.

> [!note]
> Per [CHANGELOG v0.4](../../CHANGELOG.md): "The v0.3 8-point soft grid migration carries forward intact — every structural pixel still snaps to 8s with 4-pixel halves and 2-pixel quarters as exceptions."

### When the grid breaks intentionally

A small number of components ship off-grid because the visual target is optical, not structural. Each is documented in its component contract:

- **Switch track** — 36 px wide × 20 px tall (the Radix Switch standard width). Off the 8-grid by design; pill geometry doesn't quantize cleanly to 8.
- **`LiveDot`** — 8 px filled dot. On grid. Pulse ring expands to ~19 px (off-grid by design — it's an optical animation, not a layout primitive).
- **Focus ring** — 3 px spread per `shadow.focus`. Off the 4-grid because 3 px is the WCAG-validated visible-focus minimum for normal-stroke borders.

---

## 2. Primitive scale

Defined in [`01-tokens/primitives/dimension.tokens.json`](../01-tokens/primitives/dimension.tokens.json). The integer suffix maps directly to multiples of 4 px.

| Token | Value | Relation |
|---|---|---|
| `dimension.0` | 0 | Zero |
| `dimension.1` | 4 px | 1 × 4 |
| `dimension.2` | 8 px | 2 × 4 |
| `dimension.3` | 12 px | 3 × 4 |
| `dimension.4` | 16 px | 4 × 4 |
| `dimension.5` | 20 px | 5 × 4 |
| `dimension.6` | 24 px | 6 × 4 |
| `dimension.8` | 32 px | 8 × 4 |
| `dimension.10` | 40 px | 10 × 4 |
| `dimension.12` | 48 px | 12 × 4 |
| `dimension.16` | 64 px | 16 × 4 |
| `dimension.20` | 80 px | 20 × 4 |
| `dimension.24` | 96 px | 24 × 4 |
| `dimension.32` | 128 px | 32 × 4 |
| `dimension.40` | 160 px | 40 × 4 |
| `dimension.48` | 192 px | 48 × 4 |
| `dimension.64` | 256 px | 64 × 4 |

**Engineers do not consume `dimension.*` directly.** Per [AGENTS.md](../../AGENTS.md) hard rule #2, reach for `space.*` semantic aliases. The lint rule `lint-no-primitives-in-components` enforces.

---

## 3. Semantic space tokens

Defined in [`01-tokens/semantic/space.tokens.json`](../01-tokens/semantic/space.tokens.json). The integer-suffix tokens (`space.4`, `space.8`) mirror the primitive table 1:1 for predictability — `space.4` is always 16 px. The named tokens (`space.stack.md`, `space.inline.sm`) carry layout intent.

### Integer ladder (predictable)

| Token | Value |
|---|---|
| `space.0` | 0 |
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.6` | 24 px |
| `space.8` | 32 px |
| `space.16` | 64 px |
| `space.64` | 256 px |

### Stack — vertical rhythm within a section

For gaps between stacked elements within one section (header → body, list item → list item).

| Token | Value | Use |
|---|---|---|
| `space.stack.xs` | 8 px | Tight stack — adjacent labels, dense list. |
| `space.stack.sm` | 12 px | Default form-field stack. |
| `space.stack.md` | 16 px | Default body-paragraph stack. |
| `space.stack.lg` | 24 px | Loose stack — section sub-blocks. |
| `space.stack.xl` | 40 px | Section-internal breathing room. |

### Inline — horizontal gaps within a row

For gaps between inline elements (icon + label, button group, breadcrumbs).

| Token | Value | Use |
|---|---|---|
| `space.inline.xs` | 4 px | Icon-to-text within a button label. |
| `space.inline.sm` | 8 px | Default inline-element gap. |
| `space.inline.md` | 12 px | Loose inline gap. |
| `space.inline.lg` | 16 px | Button-group gap. |

### Section — vertical gap between major page sections

For gaps between marketing-section bands or operator-dashboard regions.

| Token | Value | Use |
|---|---|---|
| `space.section.sm` | 40 px | Tight operator-dashboard section break. |
| `space.section.md` | 48 px | Default section break. |
| `space.section.lg` | 64 px | Marketing section break. |
| `space.section.xl` | 80 px | Marketing hero / brutalist section break. |

### Page — outer container padding

| Token | Value | Use |
|---|---|---|
| `space.page.sm` | 16 px | Mobile / narrow viewport. |
| `space.page.md` | 24 px | Tablet / default. |
| `space.page.lg` | 32 px | Desktop wide. |

### Inset — padding inside containers

Lumen uses the integer ladder directly for inset (no separate `inset.*` namespace). Common patterns:

| Container | Inset | Token |
|---|---|---|
| Card (default) | 24 px | `space.6` |
| Card (compact) | 16 px | `space.4` |
| Card (hero) | 40 px | `space.10` (via `dimension.10`) |
| Button (sm) | 8 px x | `space.2` |
| Button (md) | 12 px x | `space.3` |
| Button (lg) | 16 px x | `space.4` |
| Input (sm) | 8 px x | `space.2` |
| Input (md) | 12 px x | `space.3` |
| Input (lg) | 16 px x | `space.4` |

---

## 4. Form-specific gaps

The forms layer (per [`forms-and-inputs.md`](./forms-and-inputs.md) §Form layout & rhythm) declares its own gap tokens via `field.gap.*` for label-control rhythm. These compose with the semantic space ladder — they are not separate from it.

| Gap | Default | Token | Notes |
|---|---|---|---|
| Label → control | 4 px | `field.gap.labelToControl` | Maps to `space.1`. |
| Control → hint / error | 4 px | `field.gap.controlToHelp` | Maps to `space.1`. |
| Field → field | 20 px | `field.gap.groupToGroup` | Maps to `space.5`. |
| Fieldset → fieldset | 32 px | `field.gap.fieldsetToFieldset` | Maps to `space.8`. |

> [!note]
> Per [`forms-and-inputs.md`](./forms-and-inputs.md): "Two-column layouts: only when the fields are conceptually related (city + state + ZIP triplet). Eye-tracking shows F-pattern fails on multi-column forms (Baymard)."

---

## 5. Container widths

Defined in [`01-tokens/primitives/dimension.tokens.json`](../01-tokens/primitives/dimension.tokens.json) under `size.container.*`. Set at the page-shell level, not on individual components.

| Token | Width | Use |
|---|---|---|
| `size.container.narrow` | 720 px | Reading column / single article. |
| `size.container.default` | 1100 px | Primary marketing + dashboard width. **Matches Warp production.** |
| `size.container.wide` | 1200 px | Wide hero blocks. |
| `size.container.max` | 1440 px | Audit dashboard maximum. |

### Reading-column widths

Per [`accessibility.md`](./accessibility.md) §Typography, reading copy is capped:

| Token | Width | Use |
|---|---|---|
| `size.reading.60ch` | 60 ch | Prose body (Source Serif 4 longform). |
| `size.reading.75ch` | 75 ch | Editorial body cap; wider tolerance for sans body. |

The `.prose-lumen` longform wrapper (per [`typography.md`](./typography.md) §10) sets `max-width: 65ch` — between the two tokens, tuned for Source Serif 4 at 18 px.

> [!note]
> Per [`principles.md`](./principles.md) §5: "Content widths: 1100px primary, 1200px wide hero, 720px / 60ch reading column." These are observed from Warp's production CSS. Do not invent in-between widths without an ADR.

---

## 6. Touch target floor

Per [`accessibility.md`](./accessibility.md) §Hard floor:

> Touch target: 44 × 44 px minimum on mobile (Apple HIG) / 48 × 48 dp on Android (Material 3). WCAG 2.5.8 floor is 24 × 24 px AA.

Lumen exposes this as a token:

| Token | Value | Source |
|---|---|---|
| `size.control.touch` | 44 px | Apple HIG minimum touch target. |
| `size.control.sm` | 32 px | Compact button / input height. **Desktop only.** |
| `size.control.md` | 40 px | Default control height. |
| `size.control.lg` | 48 px | Large CTA / form height. **Mobile / marketing.** |

Mobile clients should auto-bump `md` → `lg` to satisfy WCAG 2.5.8 and Apple HIG. Lumen's `lg` (48 px) satisfies both. See [`forms-and-inputs.md`](./forms-and-inputs.md) §Sizing scale.

---

## 7. Density modes — preview

Lumen ships two density modes: **comfortable** (default) and **compact** (operator surfaces). The full discussion lives in [`density.md`](./density.md). Spacing summary:

| Container | Comfortable | Compact |
|---|---|---|
| Card padding | 24–32 px (`space.6` / `space.8`) | 12–16 px (`space.3` / `space.4`) |
| Form field height | 40 px (`size.control.md`) | 32 px (`size.control.sm`) |
| Table row | 40 px or 48 px | 32 px (default) |

> [!warning]
> Compact mode never violates the 44 × 44 px touch target on mobile. Mobile auto-bumps controls regardless of density. See [`density.md`](./density.md) §Touch target compatibility.

---

## 8. Cross-references — radius

Border-radius is a sibling system to spacing. It snaps to its own scale, not the 4-grid. Defined in [`01-tokens/primitives/radius.tokens.json`](../01-tokens/primitives/radius.tokens.json):

| Token | Value | Use |
|---|---|---|
| `radius.xs` | 2 px | Hairline accents, Checkbox |
| `radius.sm` | 4 px | Small chips, kbd |
| `radius.md` | 6 px | Inputs, buttons |
| `radius.lg` | 10 px | Cards (default) |
| `radius.xl` | 14 px | Cards (lifted), navigation panels |
| `radius.2xl` | 20 px | Hero surfaces, large cards |
| `radius.3xl` | 28 px | Marketing surfaces, modal sheets |
| `radius.full` | 9999 px | Pills, dots, avatars |

The 8-point soft grid does **not** apply to radius. Radius is an optical concern; a 6 px input radius reads cleaner than a quantized 8 px would.

---

## 9. Patterns — per surface

### Operator dashboard

- Page padding: `space.page.md` (24 px)
- Container: `size.container.max` (1440 px)
- Stack between cards: `space.stack.lg` (24 px)
- Card inset: `space.6` (24 px) comfortable, `space.4` (16 px) compact
- Section break: `space.section.sm` (40 px) — operator pages stay tight per [`principles.md`](./principles.md) §5
- Table row: 32 px compact (default), 40 px regular

### Marketing landing

- Page padding: `space.page.lg` (32 px)
- Container: `size.container.default` (1100 px)
- Stack within hero: `space.stack.xl` (40 px)
- Section break: `space.section.lg` (64 px) or `space.section.xl` (80 px)
- Card inset: `space.6` (24 px) or hero card `space.10` (40 px)

### Reading / editorial

- Container: `size.container.narrow` (720 px) or `.prose-lumen` 65 ch wrapper
- Stack between paragraphs: `space.stack.md` (16 px)
- Section break: `space.section.md` (48 px)

### Form

- Stack between fields: 20 px (`field.gap.groupToGroup` = `space.5`)
- Stack within field (label → control): 4 px (`field.gap.labelToControl` = `space.1`)
- Fieldset → fieldset: 32 px (`field.gap.fieldsetToFieldset` = `space.8`)
- Inset within input: 12 px x (`space.3`) at `md`

---

## 10. Don'ts

- **Don't reach into `dimension.*` from product code.** Per [AGENTS.md](../../AGENTS.md) hard rule #2. Use `space.*` semantic aliases.
- **Don't invent in-between sizes** like 14 px or 18 px. Reach for the closest 4-multiple on the scale (12 or 16, 16 or 20). Off-grid sizes compound visually across a long-scroll page.
- **Don't add whitespace between sections to "look clean."** Per [`principles.md`](./principles.md) §5: "Whitespace lives inside sections, not between them." Operator pages with 12+ sections are correct.
- **Don't use `space.section.*` for inline gaps.** The intent is encoded in the token name. `space.inline.sm` for inline; `space.stack.sm` for vertical-within-section; `space.section.sm` for between sections.
- **Don't use `size.control.sm` (32 px) on mobile.** Per [`accessibility.md`](./accessibility.md), 32 px is below the 44 × 44 px touch floor. Mobile auto-bumps to `lg`.
- **Don't break the 8-point soft grid without a reason.** Switch (36 px), focus ring (3 px) and `radius.xs` (2 px) are documented exceptions. New off-grid values require an ADR.

---

## References

- [`principles.md`](./principles.md) — §1 (less, but better), §5 (density is dense, not airy)
- [`density.md`](./density.md) — comfortable vs compact, density mode behavior
- [`forms-and-inputs.md`](./forms-and-inputs.md) — `field.gap.*` form rhythm, `size.control.*` heights
- [`accessibility.md`](./accessibility.md) — 44 × 44 px touch floor, reflow at 200% zoom, line-length cap
- [`typography.md`](./typography.md) — 4-px-grid-aligned leading curve, container width context
- [`01-tokens/primitives/dimension.tokens.json`](../01-tokens/primitives/dimension.tokens.json) — primitive scale + container + control sizes
- [`01-tokens/semantic/space.tokens.json`](../01-tokens/semantic/space.tokens.json) — semantic ladder (integer + named)
- [`01-tokens/primitives/radius.tokens.json`](../01-tokens/primitives/radius.tokens.json) — sibling radius system
- [`research/lumen-brief.md`](../../research/lumen-brief.md) — D-004 (spacing & geometry)
- [`research/warp-brand-dna.md`](../../research/warp-brand-dna.md) — observed Warp container widths (1100 / 1200)
- [`CHANGELOG.md`](../../CHANGELOG.md) — v0.3 8-point soft grid migration, v0.4 grid carry-forward
