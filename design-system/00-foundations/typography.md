---
name: Typography
type: foundation
version: 0.5.0
last_updated: 2026-05-02
audience: [designer, engineer, writer, llm-agent]
related:
  - ./principles.md
  - ./voice-and-tone.md
  - ./accessibility.md
  - ../01-tokens/primitives/typography.tokens.json
  - ../01-tokens/semantic/type.tokens.json
  - ../../research/satoshi-typography.md
  - ../../_meta/decisions/0006-satoshi-jetbrains-pairing.md
  - ../../_meta/decisions/0010-typography-v05.md
---

# Lumen Typography

> Lumen is the typographic spine of Warp's UI. Every word the user reads — KPI, error, lane name, button — is set in this system. The principles are simple: **type does the hierarchy, numbers align in columns, and one italic word is allowed per page.** Everything else is restraint.

This is the canonical reference. Tokens are in [`01-tokens/primitives/typography.tokens.json`](../01-tokens/primitives/typography.tokens.json) and [`01-tokens/semantic/type.tokens.json`](../01-tokens/semantic/type.tokens.json). The research that shaped these decisions lives in [`research/satoshi-typography.md`](../../research/satoshi-typography.md). The why is in [ADR 0006](../../_meta/decisions/0006-satoshi-jetbrains-pairing.md) and [ADR 0010](../../_meta/decisions/0010-typography-v05.md).

---

## 1. Faces

| Face | Use | License | File |
|---|---|---|---|
| **Satoshi Variable** | Primary UI + display, sans | ITF-FFL — free, self-hosted, do NOT redistribute | `Satoshi-Variable.woff2` (wght 300–900), `Satoshi-VariableItalic.woff2` |
| **JetBrains Mono** | Numerics, code, terminal, IDs, money, ETAs | OFL | served via `next/font/google` |
| **Source Serif 4** | Editorial longform only — `/blog`, `/changelog`, `/press`, legal | OFL | optional load on prose routes |
| **Inter** (Plan B) | Emergency swap if (a) ITF licensing changes, (b) Cyrillic/Greek expansion, (c) Windows ClearType QA fails | OFL | wired via `[data-font="inter"]` override |

**Why Satoshi.** Geometric Swiss-modernist sans. Subtle humanist details (single-storey alternates available via stylistic set). Designed by Deni Anggara at Indian Type Foundry. Reads "modern operator" — what Warp is. Plus it's free.

**Why JetBrains Mono.** Closest mono companion to Satoshi: same geometric DNA, x-height match, disambiguated `0/O 1/l/I` for terminal-adjacent contexts. Slashed zero is verified.

**Why Source Serif 4 only for editorial.** Source Serif 4 has the `opsz` (optical-size) axis — at 18px it draws warm and humanist; at 49px it sharpens for headlines. We never use serif in product UI. We do use it for blog body, where the warmth pays off.

**Plan B is wired, not aspirational.** Toggling `[data-font="inter"]` on the root flips the whole system to Inter Variable in one render. Do this if QA flags Windows hinting issues at 12–14px or if we expand into Cyrillic/Greek markets. See [ADR 0006](../../_meta/decisions/0006-satoshi-jetbrains-pairing.md) §Plan B switch.

---

## 2. The scale

**Major Third (1.25) modular scale on a 16px base.** Cross-platform clean: rounds to integer-friendly steps, matches iOS Dynamic Type Body 17pt and Android Body Large 16sp.

```
11 · 12 · 13 · 14 · 15 · 16 · 17 · 18 · 20 · 22 · 25 · 28 · 31 · 36 · 39 · 44 · 49 · 56 · 61 · 72 · 76 · 84 · 96 · 112 · 128
```

Floor-to-ceiling, every step you'd ever need. **Designers and engineers must reach for the closest size on this scale, never an in-between value.** v0.4 introduced 84/96/112/128 to honor the brutalist hero treatment; v0.5 codifies 11/17/22/28/36/44/56/72 so cross-platform builds match the web.

### Why 1.25 (and not 1.2 or 1.333)
- 1.125 is too tight — display sizes don't get visual lift.
- 1.333 is too wide for multi-platform — gap between H2 and H3 blows past mobile widths.
- **1.25 is the sweet spot** — peer convergence (Material 3, Atlassian, Apple HIG, Geist).

---

## 3. Weights

Five static weights from the Variable file. Light (300) was dropped in v0.5 — it doesn't serve the operator-confident voice and it added 25 KB to the bundle for zero usage.

| Weight | Value | Use |
|---|---|---|
| Regular | 400 | Body, paragraphs, default UI text |
| Medium | 500 | UI labels, tabs, button text, eyebrows, mono captions |
| Semibold | 600 | h2/h3/h4, emphasis, table headers |
| Bold | 700 | h1, display tier, hero impact text |
| ExtraBold | 800 | Optional. display.2xl/hero only when extra heft is wanted without going Black |
| Black | 900 | **Reserved for `display.hero` (128px) brutalist treatment.** Never body. Never below 96px. |

**Variable axis — also available.** The Satoshi VF accepts any value 300–900. Use `font-variation-settings: 'wght' 440` for body-emphasis weight that sits between Regular and Medium. Defined in [`primitives/typography.tokens.json`](../01-tokens/primitives/typography.tokens.json) under `font.axis.*`.

---

## 4. Leading (line-height) — a curve, not a single value

Display tightens as size grows. Body relaxes for screen comfort. Each value is grid-aligned to the 4px baseline at its target size.

| Tier | Size range | Leading | Reason |
|---|---|---|---|
| Display flat | ≥96px | 1.00 | Brutalist letter-stacking |
| Display tight | 49–84px | 1.05 | Tight headline rhythm |
| Display snug | 39–56px | 1.12 | |
| Display compact | 31–36px (h1) | 1.16 | 31×1.16 = 36 (4px-grid-aligned) |
| Heading comfortable | 25px (h2) | 1.20 | 30px |
| Heading snug-body | 20px (h3) | 1.30 | 26px |
| UI rhythm | 13–17px (h4/h5/h6, label, caption, micro) | 1.40 | |
| Body | 16px | 1.50 | Peer consensus default |
| Body comfortable | 14px / 16px / 18px (size-tuned) | 1.55 | Per-size tuning above 1.50 for screen comfort |
| Editorial relaxed | 18px (Source Serif 4) | 1.65 | Longform reading |
| Compact-table | 13–15px (dense data UI) | 1.18 | Reserved — only for high-density operator views |
| Uppercase | 11–12px (caps eyebrow, overline) | 1.30 | Caps need slightly looser leading than mixed-case |

In tokens, every preset binds to one of these named values via `{font.leading.*}`. Component CSS never sets a raw line-height — always reach for the preset.

---

## 5. Tracking (letter-spacing) — continuous, asymptote at -0.025em

Below 14px, tracking goes slightly positive for legibility. Above 20px, it goes negative; the asymptote at -0.025em (Inter formula convergence — pushing tighter has no measurable benefit). All-caps runs need separate `cap-*` tracking because the visual rhythm of caps differs from mixed-case.

| Size | Tracking | Token |
|---|---|---|
| 11–12px (kbd, micro) | +0.012em | `tracking.wider` |
| 13px (caption) | +0.008em | `tracking.wide` |
| 14px (body sm, label sm) | +0.005em | `tracking.wide-micro` |
| 16–17px (body md, h4) | 0 | `tracking.normal` |
| 18px (body lg) | -0.002em | `tracking.tight-body` |
| 20px (h3) | -0.005em | `tracking.tight-micro` |
| 25px (h2) | -0.010em | `tracking.tight-soft` |
| 28–44px (display sm/md, h1) | -0.015em | `tracking.tight` |
| 49–84px (display lg/xl) | -0.020em | `tracking.tighter` |
| 96–128px (display 2xl/hero) | -0.025em | `tracking.tightest` |
| 12px ALL CAPS (eyebrow.sans) | +0.10em | `tracking.cap-eyebrow` |
| 12px MONO ALL CAPS (eyebrow.mono) | +0.16em | `tracking.cap-mono` |
| 11px ALL CAPS (overline) | +0.05em | `tracking.cap-overline` |

**The cap-mono 0.16em tracking is the v0.4 system-metadata signature.** `[•] SYSTEM V0.5 LIVE`, `@ DIGITAL HQ / GLOBAL ACCESS`, `INVITES IN:`. It's what makes Lumen sound like a freight Bloomberg terminal.

---

## 6. Semantic preset map

Components consume **semantic presets**, never primitives. Every preset bundles family + size + weight + leading + tracking (and OpenType features where relevant) into a single token in [`semantic/type.tokens.json`](../01-tokens/semantic/type.tokens.json).

### Display (marketing impact)

| Preset | Size | Weight | Use |
|---|---|---|---|
| `display.hero` | 128px | Black 900 | Brutalist hero — one-word brand statement. ≤1 per page. |
| `display.2xl` | 96px | Bold 700 | Landing-page hero headline. |
| `display.xl` | 76px | Bold 700 | Marketing landing hero default. |
| `display.lg` | 49px | Bold 700 | Section opener (marketing). |
| `display.md` | 39px | Bold 700 | Marketing page title. |
| `display.sm` | 28px | Bold 700 | Bridge between heading.h1 and display.md. |

### Heading (app structure)

| Preset | Size | Weight | Use |
|---|---|---|---|
| `heading.h1` | 31px | Bold 700 | Page title (app). |
| `heading.h2` | 25px | Semibold 600 | Section header. |
| `heading.h3` | 20px | Semibold 600 | Subsection. |
| `heading.h4` | 17px | Semibold 600 | Card title, list section header. |
| `heading.h5` | 15px | Semibold 600 | Settings group title, dialog section. |
| `heading.h6` | 13px | Semibold 600 | Form field-group title. |

### Body

| Preset | Size | Weight | Use |
|---|---|---|---|
| `body.lg` | 18px | Regular 400 | Lead paragraph, marketing deck. text-wrap: pretty applied. |
| `body.md` | 16px | Regular 400 | Default body. The most-used preset. |
| `body.sm` | 14px | Regular 400 | Secondary body, helper text, table prose. |
| `body.xs` | 13px | Regular 400 | Smallest body — dense table description, helper on small controls. |
| `body.tabular` | 16px | Regular 400 | Body sized + tabular nums, for paragraphs that mix aligned numerics. |
| `lead` | 20px | Regular 400 | Section deck under display/heading. Renders in text-secondary. |

### UI label

| Preset | Size | Weight | Use |
|---|---|---|---|
| `label.lg` | 16px | Medium 500 | Large button, primary CTA, large tab. |
| `label.md` | 14px | Medium 500 | Default button text, default tab. |
| `label.sm` | 13px | Medium 500 | Compact button, dense table action. |

### Eyebrow / overline (uppercase tracked)

| Preset | Size | Family | Tracking | Use |
|---|---|---|---|---|
| `eyebrow.sans` | 12px | Sans Medium | 0.10em UPPER | Section eyebrow above display/heading. |
| `eyebrow.mono` | 12px | Mono Medium | 0.16em UPPER | **System-metadata signature** — `[•] SYSTEM V0.5 LIVE`. |
| `overline` | 11px | Sans Medium | 0.05em UPPER | Chart axis, sub-eyebrow secondary uppercase. |

### Tabular data — Lumen's signature

The voice contract says "always use tabular monospace for numbers in UI" (see [voice-and-tone.md](./voice-and-tone.md#numbers)). These presets enforce it at the token level via `font-feature-settings: 'tnum' 1, 'lnum' 1, 'zero' 1` baked in.

| Preset | Size | Use |
|---|---|---|
| `data.lg` | 20px Mono Medium | Stat secondary metric, prominent table cell. |
| `data.md` | 16px Mono Medium | Default tabular cell — money, weight, ETA. |
| `data.sm` | 14px Mono Regular | Compact table — `DRY-93H7` IDs, timestamps. |

### Metric (Big-number KPI — Stat primitive)

| Preset | Size | Weight | Use |
|---|---|---|---|
| `metric.xl` | 61px Mono Bold | Hero KPI — landing-page revenue counter. |
| `metric.lg` | 49px Mono Bold | Page-level KPI block. |
| `metric.md` | 31px Mono Bold | Card-level KPI (Stat default). |
| `metric.sm` | 20px Mono Semibold | Sidebar KPI, table summary row. |

### Code

| Preset | Size | Use |
|---|---|---|
| `code.inline` | 0.9286em (relative) | Inline `code` in body. Programming ligatures ON. |
| `code.block` | 13px | Code snippet/sample. Programming ligatures ON. |
| `code.terminal` | 13px | Terminal output, diff view. **Ligatures OFF** so `==` reads as two `=`. |

The 0.9286em ratio (= 13/14) makes inline mono optically match the surrounding sans body — a Primer/GitHub trick that prevents inline code from popping above body x-height.

### Editorial prose (Source Serif 4)

| Preset | Size | Use |
|---|---|---|
| `prose.body` | 18px Serif Regular | Longform reading body. 60–75ch measure. |
| `prose.lead` | 22px Serif Regular | Longform lead paragraph. |
| `prose.title` | 49px Serif Semibold | Article title. |
| `prose.subtitle` | 25px Serif Regular | Article subtitle, section heading inside prose. |

### Utility

| Preset | Size | Use |
|---|---|---|
| `caption` | 13px Sans Regular | Photo caption, image alt visible, helper text. |
| `micro` | 12px Sans Medium | Badge body, timestamp, tooltip. |
| `kbd` | 11px Mono Medium | Keyboard shortcut glyph (always inside `.lumen-kbd`). |
| `quote` | 31px Sans Semibold | Block quote / testimonial. |
| `display-italic-accent` | 96px Sans Bold *italic* | The one-italic-word-per-page moment. |

---

## 7. Italic policy — three rules

Satoshi ships true italics (separate Variable file, not slanted oblique). `<em>`/`<i>` resolve to it. `font-synthesis: none` is set globally to enforce real italic over browser-faked slant.

1. **Italic = emphasis.** A single word or short phrase that genuinely shifts meaning. Never for "vibe."
2. **Italic = citation, foreign terms, ship names.** Book titles, untranslated phrases (`façon de parler`), carrier vessel names, scientific genus.
3. **Italic ≠ system text.** Loading states, error toasts, status pills, button labels, table headers, eyebrows are all upright. Italic on a system message reads as editorial commentary, not system fact.

The display-italic-accent preset enables the brutalist "one italic word per hero" treatment (e.g., italicizing _builders_ in "The freight network for builders."). It renders in `text-accent` (lime). Use at most once per page.

---

## 8. Numbers — the operator contract

From [voice-and-tone.md § Numbers](./voice-and-tone.md#numbers):

- **Tabular monospace, always.** `data.*`, `metric.*`, and `body.tabular` presets bake this in via `font-feature-settings: 'tnum' 1, 'lnum' 1, 'zero' 1`.
- **Money:** `$262`, `$1,243.50`. Currency symbol attached to first digit; no space.
- **Weights:** `520 lb`, `2,100 lb`. Unit detached, lowercase.
- **Time:** `04:18`, `Today · 9:30 AM`. 24-hour for operator UI; 12-hour for marketing.
- **ETAs:** `Today · 04:18`, `Tomorrow · 12:30`, `Wed 10:00`.
- **Percentages:** `98.2%` operator (one decimal); `98%` marketing (integer).

Inline figure runs in regular sans body (e.g., reading "We saved 18.3% on Q3 lanes" in a paragraph) should use `body.tabular` so the percentages align with any preceding figures. Don't switch to mono mid-sentence.

---

## 9. OpenType features

Per-context feature stack. Set globally on `html, body` and overridden on utility classes. The full feature inventory and verification status is in [ADR 0010](../../_meta/decisions/0010-typography-v05.md).

| Context | Feature stack |
|---|---|
| Default body | `kern 1, liga 1` (kerning + standard ligatures only) |
| Tabular data | `font-variant-numeric: tabular-nums lining-nums` (composes cleanly) |
| Inline code (prose) | `calt 1, liga 1, zero 1` (programming ligatures ON) |
| Code block / sample | `calt 1, liga 1, zero 1` |
| Terminal / diff / source viewer | `calt 0, liga 0, zero 1, tnum 1` (ligatures OFF) |
| Mono uppercase tracked | `calt 0, zero 1, case 1` (case-sensitive forms enabled) |
| Mathematical fractions | `numr 1` on `<sup>`, `dnom 1` on `<sub>` |

> **⚠️ Stylistic sets (`ss01`, `ss02`, `cv11`)** are NOT applied globally in v0.5. The tags exist in Satoshi but ITF does not publish their mapping. They were declared in the v0.4 globals.css as guesses; v0.5 strips them until visual QA confirms the alternate. Re-add with a code comment recording verification date and sample.

**Tabular nums via `font-variant-numeric` (preferred), not `font-feature-settings`.** The latter overrides the former — mixing them silently drops the property that lost. The `data.*` presets use both; `body.tabular` uses both. This is intentional, the inline `font-feature-settings` is the override; consumers should not also set `font-variant-numeric`.

---

## 10. Modern CSS techniques

These ship in v0.5 globals.css.

### `font-optical-sizing: auto` at root
Free win. Harmless on Satoshi (no opsz axis). Beneficial on Source Serif 4 (auto-applies the right cut at the rendered size).

### `text-wrap: balance` on `display.*` and `heading.h1/h2/h3`
Browser balances short headlines so the last line doesn't dangle alone. 91.44% global support. Headlines look better at zero cost.

### `text-wrap: pretty` on `body.lg` (lead) and `prose.lead`
Browser optimizes line breaks to prevent widows/orphans on the last line. 84.52% global support (Firefox lags through 153). Apply selectively — long-scroll body would burn CPU.

### Fluid hero (`clamp()`) for `display.hero`, `display.2xl`, `display.xl`
Hero scales smoothly between viewports without media queries. Body and headings stay fixed (operator UI expects predictable line breaks).

```css
:root {
  --display-fluid-hero: clamp(4rem, 4rem + 4vw, 8rem);   /* 64 → 128 */
  --display-fluid-2xl:  clamp(3.5rem, 3rem + 3vw, 6rem);  /* 56 → 96 */
  --display-fluid-xl:   clamp(2.75rem, 2.5rem + 2vw, 4.75rem); /* 44 → 76 */
}
```

### Metric-aligned fallback (`Satoshi-Fallback`)
Eliminates CLS on font-swap. Defined in globals.css as an `@font-face` aliasing Arial with `size-adjust`, `ascent-override`, and `descent-override` tuned to Satoshi metrics. When Satoshi is loading, the system falls through to "Satoshi-Fallback" → renders Arial scaled to occupy Satoshi's box → swaps in cleanly.

---

## 11. Per-platform mapping

### Web (Next.js + Tailwind v4)

Semantic utility classes `text-display-hero`, `text-display-2xl`, `text-heading-h1`, `text-body-md`, `text-data-md`, `text-eyebrow-mono`, etc. are emitted by `@theme` in globals.css. Components reach for these — never raw `text-[var(--type-N)]`.

```tsx
// ✓ Correct
<h1 className="text-display-2xl text-balance">The freight network for builders.</h1>

// ✗ Wrong — bypasses the semantic layer
<h1 className="text-[var(--type-96)] font-bold tracking-[var(--tracking-tightest)]">…</h1>
```

### iOS (SwiftUI)

Map presets to Apple text styles. UIFontMetrics.scaledFont wraps every binding so Dynamic Type scales user-set Accessibility sizes.

| Preset | Apple text style |
|---|---|
| `display.md` (39pt) | largeTitle |
| `heading.h1` (31pt) | title1 |
| `heading.h2` (25pt) | title2 |
| `heading.h3` (20pt) | title3 |
| `heading.h4` / `label.lg` | headline |
| `body.md` | body |
| `body.sm` / `caption` | subheadline / footnote |
| `micro` | caption2 |

Full table in [`03-platforms/ios-native/README.md`](../03-platforms/ios-native/README.md).

### Android (Jetpack Compose)

Map presets to Material 3 text roles (display/headline/title/body/label).

| Preset | Material 3 role |
|---|---|
| `display.2xl/xl` | displayLarge / displayMedium |
| `display.md/sm` | displaySmall / headlineLarge |
| `heading.h1` | headlineMedium |
| `heading.h2/h3` | headlineSmall / titleLarge |
| `heading.h4` | titleMedium |
| `body.md` / `body.sm` | bodyLarge / bodyMedium |
| `label.md` / `micro` | labelLarge / labelMedium |

Full table in [`03-platforms/android-native/README.md`](../03-platforms/android-native/README.md).

---

## 12. Performance

| Asset | Size (woff2 Latin) | Strategy |
|---|---|---|
| Satoshi-Variable | ~85 KB | preload, swap |
| Satoshi-VariableItalic | ~85 KB | lazy (no preload — most pages have no above-the-fold italic) |
| JetBrains Mono Regular | ~28 KB | preload only on routes with above-the-fold mono content |
| Source Serif 4 Variable | ~115 KB | only loaded on /blog, /changelog, /press, legal |

Total font budget per landing page: ~115 KB (Satoshi VF + JetBrains Mono Regular). Well under the 150 KB-per-page font budget recommended by web.dev.

`unicode-range` subsetting: Latin only by default. Latin Extended-A only on routes that need Polish/Turkish/Czech/Croatian (none currently).

`font-display`: `swap` for Satoshi (accept FOUT, keep LCP fast). Italic VF lazy-loads on first `<em>` paint.

`font-synthesis: none`: enforced globally so the browser cannot fake italic from upright Regular or fake Bold from interpolated wght. Both real italic VF and full Bold weight axis are shipped, so there's nothing for the browser to fake — this rule prevents drift.

---

## 13. What to do (and not do) — for designers and engineers

### Do

- Reach for the semantic utility class first (`text-heading-h1`, `text-body-md`).
- Trust the presets — they're tuned. Don't override `letter-spacing` or `line-height` at the call site.
- Use `eyebrow.mono` for system metadata (state, version, region). Use `eyebrow.sans` for human-facing section labels.
- Apply `text-wrap: balance` on any custom hero treatment (it's already on the presets).
- Use `data.*` and `metric.*` for any number that lives in a column or a KPI block.
- One italic word per page, max — the brutalist "Speed-word" moment.
- For a new size or feature you can't find a preset for: add a new preset to `type.tokens.json` (with an ADR note), don't reach into primitives in product code.

### Don't

- Don't write `text-[var(--type-31)] font-bold tracking-[var(--tracking-tight)]` — that's bypassing the semantic layer. Lint flags this in v0.5.
- Don't pick a leading or tracking ad-hoc — use the curve.
- Don't apply `tnum` globally — it widens digit spacing and looks wrong in marketing prose. Apply via `data.*` / `metric.*` / `body.tabular` only.
- Don't enable programming ligatures in terminal/diff views — operators must see `==` as two `=` signs.
- Don't use Light (300). It was dropped in v0.5.
- Don't add a third typeface. Satoshi + JetBrains Mono + Source Serif 4 is the cap.
- Don't synthesize italic or bold (`font-synthesis: none`). If you need a weight or italic, ship the real file.
- Don't push tracking past -0.025em on display. Inter formula convergence; tighter has no benefit.
- Don't use `font-feature-settings` and `font-variant-numeric` together — they fight; the former wins and silently drops what the latter set. Use one.
- Don't reach for 11px outside `kbd` and `overline`. WCAG floor for normal text is 12px in Lumen.

---

## 14. The voice signature, in type

From [voice-and-tone.md](./voice-and-tone.md): "Declarative. Fragmenting. Numerate."

- **Declarative.** Use `display.xl/2xl` Bold over headings stacked — one statement headline, not three. Pair with `lead` 20px below. Don't use `display.hero` Black 900 unless you're making a one-word brand moment.
- **Fragmenting.** Use `eyebrow.mono` short tracked-out caps to break sections without subheading them — `[•] OPERATE`, `[•] SHIP`, `[•] PAY`. Mono caps signal "system metadata," exactly the freight-Bloomberg-terminal voice.
- **Numerate.** Use `metric.lg` for the KPI moment, `data.md` for the column moment. Money, weight, ETA — every number tabular and aligned. Never let prose hide a number.

If you're doing it right, the page should read like a senior operator's slide deck, not a marketing intern's landing page. If three sentences could become one number-led sentence and an `eyebrow.mono` line, do that.

---

## Related

- [Principles](./principles.md) — the five constraints that shaped this system
- [Voice and tone](./voice-and-tone.md) — how Lumen sounds; numbers contract
- [Accessibility](./accessibility.md) — WCAG 2.2 AA floor; contrast pairs
- [Motion language](./motion-language.md) — type doesn't move; only state pulses
- [ADR 0006 — Satoshi + JetBrains Mono pairing](../../_meta/decisions/0006-satoshi-jetbrains-pairing.md)
- [ADR 0010 — Typography v0.5 system upgrade](../../_meta/decisions/0010-typography-v05.md)
- [Typography research](../../research/satoshi-typography.md)
