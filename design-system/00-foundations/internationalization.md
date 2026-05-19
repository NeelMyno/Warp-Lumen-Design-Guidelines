---
name: Internationalization
type: foundation
version: 1.0.0
last_updated: 2026-05-19
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA + Unicode CLDR + W3C i18n contract
related: [./color.md, ./typography.md, ./os-modes.md, ./print.md, ../../_meta/decisions/0031-i18n-rtl-v014.md]
---

# Internationalization (i18n)

> Lumen is currently English-rendered. The audit-dashboard's demo content is English. But Lumen's typography subset (R8a) covers Western European text; the design tokens are locale-agnostic; the primitive contracts are language-agnostic. This document codifies the i18n contract so Lumen consumers can render in **any locale with predictable behavior** — including RTL languages — without forking the system. v0.14.0 ships the foundation; consumer apps wire the actual locale.

## TL;DR — what i18n means in Lumen

| Concern | Contract |
|---|---|
| **Direction (LTR / RTL)** | Lumen primitives use CSS logical properties (`margin-inline-start`, `padding-block-end`, etc.) where direction matters. Setting `<html dir="rtl">` flips all inline-flow primitives correctly: chevrons mirror, sidebars move right-to-left, table-of-contents anchors reverse, breadcrumb chevrons flip. Lumen has NOT been visually audited at RTL — consumer apps should run their own audit |
| **Locale tokens** | Date / number / currency / percentage / unit formatters are NOT baked into Lumen. Consumer apps use `Intl.DateTimeFormat` / `Intl.NumberFormat` (browser built-ins) with locale strings. Lumen primitives that display formatted values accept pre-formatted strings — they don't format internally |
| **Font subset coverage** | The audit-dashboard's bundled Satoshi VF covers ASCII + Latin-1 supplement (Western European). Eastern European, Greek, Cyrillic, Asian scripts fall through to system fonts. Consumer apps using Lumen tokens but their own typeface should pick a font with broader script coverage. See [ADR 0027](../../_meta/decisions/0027-satoshi-subset-mobile-perf-v0134.md) for the keep-set |
| **Text expansion** | Lumen layouts are built for 30–40% text expansion (translation overhead). Lines wrap; `text-wrap: balance` on displays. Buttons grow vertically before truncating horizontally. Test pseudo-localization at translation time |
| **Message catalogs** | Lumen does NOT ship a message catalog. Microcopy lives in `04-content/microcopy.md` as English source-of-truth; consumer apps maintain their own translation pipeline (icu-messageformat, formatjs, i18next, etc.) |
| **Pseudo-localization** | A developer-mode toggle that swaps every visible string with accented variants ("Spring Green" → "Ŝṕŕıŋġ Ġřêêñ") to surface untranslated strings + measure text expansion. Carried to a future round (R10.5 / R11.x) |

## 1. Direction (LTR / RTL)

### Contract

The Lumen system honors `<html dir="rtl">` and `<html dir="ltr">` (default). When `dir="rtl"`:

1. **Block direction is unchanged.** Vertical flow (top-to-bottom) stays the same in RTL — only horizontal flow reverses.
2. **Inline flow reverses.** `flex-direction: row` becomes effectively right-to-left; `text-align: start` aligns to the right; sidebars on the left flip to the right.
3. **Logical-property CSS handles 90% of cases.** `margin-inline-start` instead of `margin-left`; `padding-block-end` instead of `padding-bottom`; `border-inline-start` instead of `border-left`. CSS automatically maps these to LTR or RTL based on the direction.
4. **Icons that have direction (arrows, chevrons, back-buttons) flip.** This is HANDLED PER PRIMITIVE — not automatic. Lumen's `ChevronRight` icon used as a "forward" affordance should render as `ChevronLeft` under RTL. Convention: components that use directional icons import them with a `directional?: boolean` prop or use a `useDirection()` hook.
5. **Number direction stays LTR even inside RTL paragraphs.** Arabic, Hebrew, Persian all render numerals left-to-right even when surrounding text is right-to-left. Lumen's `tnum` (tabular numerals) preset works correctly under RTL.
6. **Tables / data grids stay column-stable.** A DataGrid's "first column" is the leftmost column under LTR and the rightmost under RTL — same data, different visual position. Lumen DataGrid honors this via CSS logical properties.

### Where this lives in Lumen

| Mechanism | File |
|---|---|
| CSS logical-property migration | `audit-dashboard/src/app/globals.css` — gradual migration; v0.14 adds the `:where([dir="rtl"])` overrides for non-logical-property primitives |
| Per-component RTL contract | Each affected primitive's `component.md` § RTL section |
| Audit attribute on `<html>` | The audit-dashboard does NOT currently set `dir="rtl"` — consumer apps add this attribute on `<html>` based on user locale |

### Audit probe

```js
// Toggle direction at runtime for testing
document.documentElement.setAttribute('dir', 'rtl');
// Test every route — verify chevrons mirror, sidebar flips, breadcrumb chevrons flip
// Verify no text overflow at boundary points
// Verify focus order matches reading order in RTL
```

## 2. Locale-aware formatting

### Contract

Lumen primitives that DISPLAY formatted values (dates, numbers, currencies, percentages, units) accept **pre-formatted strings**, not raw values. The formatting happens upstream in the consumer app via `Intl.*` browser APIs.

### Patterns

**Dates:**
```js
// Wrong — Lumen does NOT format dates
<DatePicker value={new Date()} />  // Lumen displays raw Date — locale-blind

// Right — consumer formats per locale
const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const displayValue = formatter.format(new Date());
<DatePicker displayValue={displayValue} />
```

**Numbers:**
```js
const formatter = new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 });
const stat = formatter.format(1234567.89); // "1,234,567.89" in en-US, "1 234 567,89" in fr-FR
<Stat value={stat} />
```

**Currencies:**
```js
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const price = formatter.format(99.99); // "$99.99" in en-US, "99,99 $" in fr-FR
<PricingCard amount={price} />
```

**Relative time:**
```js
const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
const ago = formatter.format(-3, 'hour'); // "3 hours ago" in en-US, "il y a 3 heures" in fr-FR
<Timeline.Event timestamp={ago} />
```

**Units:**
```js
const formatter = new Intl.NumberFormat('en-US', { style: 'unit', unit: 'kilometer', unitDisplay: 'long' });
const distance = formatter.format(42); // "42 kilometers"
<Trip distance={distance} />
```

### Pseudo-localization developer toggle (R10.5 candidate)

Not shipped in v0.14.0. The pattern when shipped:
```js
// Wrap every string at render time with accented variants + ~30% width padding
function pseudo(str: string): string {
  if (!process.env.NEXT_PUBLIC_PSEUDOLOC) return str;
  const accented = str.replace(/a/g, 'ä').replace(/e/g, 'ê').replace(/i/g, 'ï') /* etc */;
  const padded = `[${accented}    ]`; // simulate text expansion
  return padded;
}
```

## 3. Font subset + script coverage (interaction with R8a)

### The audit-dashboard's bundled Satoshi VF post-R8a

| Script range | Coverage status |
|---|---|
| ASCII (U+0020–U+007E) | ✓ — every Latin character |
| Latin-1 Supplement (U+00A0–U+00FF) | ✓ — Western European accented letters (é à ñ ü ö ç í ø å) |
| Latin Extended-A (U+0100–U+017F) | ✗ DROPPED — Polish ł, Czech ř, Hungarian ő, Romanian ș, Turkish ğ fall through |
| Latin Extended-B (U+0180–U+024F) | ✗ DROPPED |
| Greek (U+0370–U+03FF) | ✗ DROPPED — Ω, π fall through |
| Cyrillic (U+0400–U+04FF) | ✗ DROPPED |
| Arabic (U+0600–U+06FF) | ✗ DROPPED |
| Hebrew (U+0590–U+05FF) | ✗ DROPPED |
| CJK (U+4E00–U+9FFF) | ✗ DROPPED |
| General Punctuation (U+2000–U+206F) | ✓ — em dash, smart quotes, ellipsis |
| Currency Symbols (U+20A0–U+20CF) | ✓ — €, £, ¥, ₹, $, ¢, ₩, ฿ |

### Implication

The audit-dashboard renders correctly for **Western European text** in Satoshi (français, español, português, Deutsch, italiano, etc.) but **falls through to system fonts** for Eastern European, Greek, Cyrillic, Arabic, Hebrew, CJK, and other scripts.

Consumer apps that target broader locales should EITHER:
- Re-run `scripts/subset-satoshi.mjs` with their needed codepoints added to the keep-set, OR
- Self-host a broader-coverage typeface (e.g., Inter, IBM Plex Sans, Noto Sans) and override the `--font-satoshi` CSS variable

For RTL languages (Arabic, Hebrew, Persian, Urdu), the typeface MUST support the script + handle bidirectional text correctly. Satoshi does not currently ship Arabic/Hebrew variants. Consumer apps targeting these locales need a different typeface (Lumen's tokens, components, and contracts remain consumable).

## 4. Text expansion budget

### Contract

Lumen layouts are built for **30–40% text expansion** — the typical overhead when translating from English (compact) to languages like German, Finnish, Russian, or Hungarian (verbose).

| Layout pattern | Expansion behavior |
|---|---|
| Button labels | Vertical growth via `min-height` + wrapping; horizontal truncation only as last resort |
| Heading display copy | `text-wrap: balance` (modern browsers) so the break is visually optimal; allow 2-line break in display headings |
| Card titles | Single-line truncation with `text-overflow: ellipsis` + tooltip on hover to show full text |
| Form field labels | Multi-line allowed; field row grows |
| Navigation labels | Truncate at the icon-only level only as last resort; prefer label-and-icon |
| Status pills | Grow horizontally first; truncate at 12 characters with ellipsis |

### Audit probe

Pseudo-localization (when shipped) would wrap every English string with the 30% padding pattern, surfacing layout breaks at audit time. Until then, hand-test with German or Hungarian translation pre-shipped.

## 5. Message catalog — externalized

Lumen does NOT ship a message catalog. Microcopy lives in `04-content/microcopy.md` and is sourced as English. Consumer apps wire their own translation pipeline:

| Tool | Lumen integration |
|---|---|
| `@formatjs/intl` | Pass formatted strings via primitive props (`<Button>{intl.formatMessage({ id: 'button.save' })}</Button>`) |
| `i18next` | Same pattern — `t('button.save')` resolves at render time |
| `next-intl` | Next.js-native; works with Lumen primitives via `useTranslations()` |
| Custom (per-product) | Any solution that produces translated strings; Lumen consumes them as React children or props |

The contract: **Lumen primitives accept React children or string props for any displayable text.** They never source strings from a global catalog. This keeps Lumen agnostic to the i18n library + lets each consumer wire what fits their stack.

## 6. R11 i18n verification checklist

When auditing a Lumen-consuming surface for i18n compliance:

| # | Check | How |
|---|---|---|
| R11-1 | `<html lang="..." dir="...">` is set correctly | View source on any route; verify lang + dir attributes |
| R11-2 | RTL flips chevrons + directional icons | Set `dir="rtl"`; verify forward chevrons render as left-pointing |
| R11-3 | Sidebar / breadcrumb / pagination flip horizontally under RTL | Set `dir="rtl"`; visually verify position |
| R11-4 | Numbers stay LTR inside RTL paragraphs | Render a price ($42.99) inside an Arabic paragraph; verify "42.99" stays left-to-right |
| R11-5 | Currency formatting matches locale | Render a price; verify "$99.99" in en-US, "99,99 $" in fr-FR, "99,99 €" in de-DE |
| R11-6 | Date formatting matches locale | Render a date; verify "May 19, 2026" in en-US, "19 mai 2026" in fr-FR |
| R11-7 | German pseudo-localized text doesn't break layout | Pseudo-localize with 30% padding; verify no overflow or text clipping |
| R11-8 | Script coverage matches consumer's locale | Render the route at the consumer's typeface; verify all glyphs render (not boxed fallback) |
| R11-9 | Font subset doesn't drop user's locale | Run subset-satoshi audit script with target codepoints |
| R11-10 | Print stylesheet works under RTL | Cmd+P under `dir="rtl"`; verify nav chrome retires correctly, page-break logic preserved |

## 7. Cross-references

- W3C Internationalization Working Group — Latin script: https://www.w3.org/International/
- MDN — `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`
- CSS Logical Properties Level 1 — `margin-inline-*`, `padding-block-*`, `border-inline-*`
- Lumen ADR 0027 — R8a Satoshi subset codepoint contract (font coverage)
- Lumen ADR 0031 — R11 i18n + RTL foundation contract (v0.14.0)
- Lumen [`./typography.md`](./typography.md) — typeface + subset coverage details
- Lumen [`./color.md`](./color.md) — color tokens are locale-agnostic
- Lumen [`../04-content/microcopy.md`](../04-content/microcopy.md) — English source-of-truth strings

## 8. Open questions (deliberately deferred)

- **Pseudo-localization developer toggle** — A `NEXT_PUBLIC_PSEUDOLOC=1` env-var-gated mode that swaps every visible string. Surfaces hardcoded strings + measures text expansion. Carried to R10.5.
- **RTL visual audit of the audit-dashboard** — The 9 audit-dashboard routes have NEVER been visually audited at `dir="rtl"`. Carried to R11.2 (the visual-audit follow-up).
- **Bidi (bidirectional text)** — Mixing LTR and RTL within a single paragraph (English brand name inside Arabic body copy). CSS `unicode-bidi: isolate` is the typical fix. Carried to R11.3.
- **Locale tokens for currency / date / number defaults** — Should Lumen ship semantic tokens like `--locale-date-format-medium` that consumers wire to their `Intl.DateTimeFormat` options? Decision deferred — current approach (consumer wires `Intl.*` directly) is simpler.
- **`<bdi>` and `<bdo>` element usage** — Bi-directional isolation HTML elements. Lumen primitives don't currently use them; should they? Carried to R11.3 for the typography contract.
