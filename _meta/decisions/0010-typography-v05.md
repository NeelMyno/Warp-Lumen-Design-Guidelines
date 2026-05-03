# ADR 0010 — Typography v0.5 system upgrade

- **Date:** 2026-05-02
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Supersedes:** complements [ADR 0006 — Satoshi + JetBrains Mono pairing](./0006-satoshi-jetbrains-pairing.md). Does not supersede; ADR 0006's family decisions stand.

## Context

The v0.4 "Obsidian Lime" rebuild pushed display sizes to 96–128 px and introduced the mono-uppercase tracked-out system-metadata voice. The token JSON did not follow — it stopped at 76 px and left leading/tracking values stuck on the v0.3 quiet-industrial scale. The implementation drifted to Tailwind arbitrary-value escapes (`text-[var(--type-N)] tracking-[var(--tracking-X)] leading-[var(--leading-Y)]`) because the semantic layer didn't expose what consumers needed.

A three-agent typography audit (current-state, peer-systems research, OpenType deep-dive) surfaced ten P0/P1 issues:

1. JSON ↔ CSS drift across sizes, leadings, trackings.
2. Eyebrow rendered two ways in CSS (sans 11px ad-hoc + mono 11px ad-hoc), neither matched the JSON's 12px label.eyebrow.
3. 11px floor below WCAG comfort threshold for normal text.
4. Display ceiling stated three different ways (76 / 96–144 / 128).
5. `font-feature-settings: "ss01", "ss02", "cv11"` declared globally but ITF does not publish what these tags do in Satoshi — current code is a guess.
6. `.lumen-mono` disabled `calt` globally — killed JetBrains Mono's programming ligatures even where wanted.
7. `.lumen-tnum` mixed `font-feature-settings` and `font-variant-numeric` — the former silently overrode the latter and dropped slashed-zero.
8. Pages reach into primitives (`text-[var(--type-N)]`), bypassing the semantic layer that lint was supposed to enforce.
9. No fluid typography, no `text-wrap: balance/pretty`, no metric-aligned font fallback — modern CSS techniques absent.
10. No italic policy, no Plan-B Inter wiring, no longform prose contract.

Peer-system research (Vercel Geist, Linear, Stripe Sail, GitHub Primer, Apple HIG, Material 3, IBM Carbon, Atlassian, Radix Themes, Inter, Klim, Mass Driver, Practical Typography) converged on:

- 1.25 modular ratio is fine — keep.
- Body 1.5 leading is the consensus default — keep.
- Display leading is a curve, not a single value (1.05 at 76 px → 1.30 at 20 px).
- Tracking has a continuous size-mapped curve, asymptote at -0.025 em (Inter formula).
- Add `metric.*` as a first-class token role (Atlassian).
- Add mono variants of label/copy as first-class tokens (Geist).
- Use inline mono at 0.9286em (= 13/14) relative ratio inside body sans (Primer).
- Apply `text-wrap: balance` on display/headings, `pretty` on body lead.
- Use `clamp()` for hero only, never body.

## Decision

**Lumen v0.5 typography system upgrade.** Token JSON is the source of truth; CSS mirrors. Semantic layer carries every preset a component should reach for. Ten changes:

### 1. Type scale — extend, don't change ratio

Major Third (1.25) on 16 px base, **floor-to-ceiling 11 → 128 px**:

```
11 · 12 · 13 · 14 · 15 · 16 · 17 · 18 · 20 · 22 · 25 · 28 · 31 · 36 · 39 · 44 · 49 · 56 · 61 · 72 · 76 · 84 · 96 · 112 · 128
```

Adds 11, 17, 22, 28, 36, 44, 56, 72, 84, 96, 112, 128 to the JSON. Reconciles with the v0.4 CSS that already used these.

### 2. Leading curve

Replace single-value `leading.tight: 1.10` with a 13-step curve from 1.00 (≥96 px display) to 1.65 (longform prose), each step grid-aligned to 4 px at its target size. Documented per-tier mapping in [`00-foundations/typography.md`](../../design-system/00-foundations/typography.md).

### 3. Tracking curve

Replace 5-bucket tracking with a 13-step continuous curve, asymptote at -0.025 em on display, +0.012 em on small text. Three additional `cap-*` tokens for uppercase runs (`cap-eyebrow` 0.10 em, `cap-overline` 0.05 em, `cap-mono` 0.16 em).

### 4. Weights — drop Light (300)

Light weight added zero audit usage and violated the "operator-confident" voice. Drop. Bundle saves ~25 KB. Add ExtraBold (800) optional. Black (900) reserved for `display.hero`.

### 5. Semantic presets — 18+ new tokens

Add: `display.hero`, `display.2xl`, `display.sm`, `heading.h4/h5/h6`, `lead`, `body.xs`, `body.tabular`, `label.lg`/`label.md`, `eyebrow.sans`/`eyebrow.mono`, `overline`, `data.lg`/`data.md`/`data.sm`, `metric.xl`/`metric.lg`/`metric.md`/`metric.sm`, `code.terminal`, `prose.body`/`prose.lead`/`prose.title`/`prose.subtitle`, `quote`, `display-italic-accent`, `kbd`.

The `metric.*` role is the Atlassian steal — the Stat primitive's anatomy now has a dedicated token role instead of borrowing `heading.*`. The `eyebrow.sans`/`eyebrow.mono` split formalizes the v0.4 system-metadata signature.

### 6. OpenType features — strip unverified, fix the slashed-zero bug

- **Strip `ss01`/`ss02`/`cv11` from global `font-feature-settings`.** ITF does not publish Satoshi's feature-tag mapping; the prior declaration was a guess. Re-add only after `python -m fontTools.ttx -t GSUB Satoshi-Variable.ttf` confirms the alternate.
- **Global stack:** `font-feature-settings: "kern" 1, "liga" 1` (universally safe across all OpenType fonts) + `font-kerning: normal` + `font-optical-sizing: auto`.
- **Fix `.lumen-tnum`:** use `font-variant-numeric: tabular-nums lining-nums slashed-zero` only. Drop the `font-feature-settings` declaration that was silently overriding it.
- **Split `.lumen-mono` into three:**
  - `.lumen-mono` — default (IDs, ETAs, money). `calt 0` (no ligatures), `zero 1`, `tabular-nums`.
  - `.lumen-mono-code` — for `<code>`/`<pre>` in prose. `calt 1, liga 1` (programming ligatures ON).
  - `.lumen-mono-terminal` — for terminal/diff. `calt 0, liga 0` (no ligatures), `tabular-nums`.

Programming ligatures ON in code prose, OFF in terminal output. Slashed zero verified for JetBrains Mono; not verified for Satoshi (skip there).

### 7. Italic policy — three rules, codified

Satoshi italic VF is shipped (`Satoshi-VariableItalic.woff2`). `<em>` resolves to it. `font-synthesis: none` enforced globally so the browser never fakes italic from upright Regular.

1. Italic = emphasis (single word or short phrase that shifts meaning).
2. Italic = citation, foreign terms, ship names.
3. Italic ≠ system text (loading, error, status, button, table header, eyebrow are upright).

The `display-italic-accent` preset enables the brutalist "one italic word per hero" treatment. Renders in `text-accent`. ≤1 per page.

### 8. Modern CSS techniques

- `font-optical-sizing: auto` at root — harmless on Satoshi (no opsz axis), beneficial on Source Serif 4.
- `text-wrap: balance` on `display.*` and `heading.h1/h2/h3` (91% global support).
- `text-wrap: pretty` on `body.lg` and `prose.lead` only — Firefox lags through 153 and full-page application is CPU-expensive.
- `clamp()` fluid type for `display.hero/2xl/xl` only. Body and headings stay fixed (operator UI expects predictable line breaks).
- `Satoshi-Fallback` `@font-face` — Arial alias with `size-adjust: 121%`, `ascent-override: 81%`, `descent-override: 18%` to eliminate CLS on font swap-in. Numbers tuned for Satoshi v2.000 metrics; verify in Lighthouse on cold load.

### 9. Plan B Inter wiring

`html[data-font="inter"]` overrides `--font-sans` to the Inter Variable stack. Documented as the emergency switch if (a) ITF licensing changes, (b) Cyrillic/Greek market expansion, (c) Windows ClearType QA fails at 12–14 px.

### 10. Semantic utility classes — the lint-enforced contract

Emit `text-display-hero`, `text-display-2xl`, …, `text-heading-h1`, …, `text-body-md`, …, `text-data-md`, `text-eyebrow-mono`, etc. as Tailwind v4 utility classes via `globals.css`. Components reach for these — never raw `text-[var(--type-N)] font-bold tracking-[var(--tracking-X)]`. Lint flags raw arbitrary-value typography in product code.

## Consequences

### Positive

- One source of truth (JSON) drives all 9 platform outputs identically.
- Display ceiling 128 px now codified — iOS/Android builds will render brutalist hero treatment that v0.4 already shipped on web.
- Programming ligatures restored to code blocks (calt bug fixed); terminal output explicitly ligature-free.
- Slashed-zero now actually applies on tabular numbers (was silently dropped).
- Italic policy codifies the "one italic word per hero" pattern that was floating in research/v04-direction without enforcement.
- Plan B Inter is wired and one CSS-attribute toggle away.
- Modern CSS (clamp, text-wrap, optical-sizing, fallback metrics) ships universally.
- Eyebrow caps WCAG-comfortable at 12 px (raised from 11 px floor).
- `metric.*` role gives Stat primitive a non-borrowed token vocabulary.

### Negative

- Mechanical refactor of audit-dashboard pages — every `text-[var(--type-N)] tracking-[…] leading-[…]` chain becomes one `text-display-2xl` class. Estimated ~150 occurrences across 8 page files. Tracked as v0.5.1 follow-up.
- Three component contracts gained new token references (`stat`, `badge`, `table`) — consuming components need re-validation. Schema is unchanged so no JSON breakage.
- The `font-feature-settings: "ss01", "ss02", "cv11"` global declaration is gone. Anyone who liked Satoshi's single-storey alternates will lose them until visual QA verifies the actual feature tag and we re-add with a verification comment.
- Light (300) weight removal is a hard break for any consumer using `font-weight: 300`. Document migration path in changelog.

### Tradeoffs not chosen

- **Did not add Source Serif 4 to the global font load.** Editorial face is loaded only on prose routes (`/blog`, `/changelog`, `/press`) — the per-route load saves the ~115 KB weight on every other page.
- **Did not adopt fluid type for body or headings.** Operator UI benefits from predictable line breaks; fluid is hero-only.
- **Did not adopt the IBM Carbon expressive-vs-productive parallel scale.** One scale + fluid hero overlay is sufficient — doubling the design surface adds complexity without proportional value.
- **Did not adopt Linear's variable-axis 510 weight as default for body.** The 440 (`font.axis.body`) and 510 (`font.axis.body-strong`) tokens exist for VF-aware components but are not the default weight; default body stays at Regular 400 for cross-platform parity.
- **Did not change the modular ratio.** 1.25 is peer-validated; cross-platform clean; tinkering with ratio churns every preset for marginal aesthetic gain.

## Verification

### Done in v0.5.1 (2026-05-02)

- ✅ **Satoshi GSUB inventory verified** via `fontTools` against `Satoshi-Variable.woff2`. Confirmed tags:
  - `ss01` → alternate single-storey `a` + alternate `G` (17 glyphs incl. accented forms)
  - `ss02` → alternate single-storey `g` (5 glyphs)
  - `ss03` → alternate `t` (5 glyphs) — the v0.4 code's `cv11` was a guess; the correct tag is `ss03`
  - `ss04` → alternate `Q`
  - 20 GSUB tags total: `aalt, case, ccmp, dlig, dnom, frac, liga, locl, numr, ordn, pnum, salt, sinf, ss01–ss04, subs, sups, tnum`
  - 2 GPOS tags: `kern, mark`
  - Variable axis: wght 300–900 (default 900)
  - **Confirmed absent:** `zero` (slashed), `onum` (oldstyle figures), `smcp/c2sc` (small caps). Earlier code that declared `zero` for Satoshi was a no-op.
  - Re-added as **opt-in** utilities in globals.css: `.lumen-display-alt` (ss01+ss02+ss03 — single-storey alternates), `.lumen-alt-q` (ss04). Single-storey is a brand-level decision; not enabled globally.
- ✅ **JetBrains Mono next/font/google subset audited.** Subset ships only 4 GSUB features: `calt, ccmp, frac, locl`. No `zero` slashed-zero glyph in subset. Documented in globals.css as a no-op declaration kept for graceful self-host migration; JetBrains Mono's default `0` glyph is already dotted/disambiguated, so IDs read unambiguously without slashed-zero.
- ✅ **Audit-dashboard pages migrated** to semantic utility classes — landing, foundations, library, desktop, saas, tool, ecommerce, mobile, plus dashboard-shell + section. Every product-code call site now uses `text-display-*`, `text-heading-h*`, `text-body-*`, `text-data-*`, `text-metric-*`, `text-eyebrow-*`. Intermediate sizes without semantic preset (type-15, type-17, type-22, etc.) carry `lumen-lint-allow: typography` directives with rationale.
- ✅ **`scripts/lint-no-arbitrary-typography.mjs`** — emits violations for raw `text-[var(--type-N)]`, `tracking-[var(--tracking-*)]`, `leading-[var(--leading-*)]`, `font-[var(--font-...)]` (excluding `--font-sans/mono/serif`). Supports inline `lumen-lint-allow: typography` and `lumen-lint-allow-block: typography` directives. Path-exempts `components/primitives/` (showcase) and `components/ui/` (shadcn upstream). Wired into `pnpm lint`. **Lint exits 0 across the entire dashboard.**
- ✅ **`scripts/measure-cls.mjs`** — Lighthouse-driven cold-load CLS measurement targeting the Vercel-deployed dashboard URL. Runs twice, prints per-run + average, fails if either run > 0.05 CLS. Wired as `pnpm cls`. Devdeps `lighthouse@^12` + `chrome-launcher@^1` added to `package.json` — install on first run.

### Open

- ⏳ **Run `pnpm cls`** against the deployed Vercel URL once the v0.5 bundle is deployed. Tune `Satoshi-Fallback @font-face` `size-adjust` / `ascent-override` if drift > 0.05.
- ⏳ **Windows 1080p ClearType QA** at 12–14 px Satoshi VF rendering — Plan-B Inter is now wired (`html[data-font="inter"]`) and one toggle away if QA fails.
- ⏳ **Visual regression** on the foundations page typography section — TypeRow demo strings still show raw recipes (intentional, allow-block exempted).

## License action item (still open from ADR 0006)

Have legal pull the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build. Independent of v0.5; tracked separately.

## References

- [`design-system/00-foundations/typography.md`](../../design-system/00-foundations/typography.md) — canonical guide
- [`design-system/01-tokens/primitives/typography.tokens.json`](../../design-system/01-tokens/primitives/typography.tokens.json) — primitives
- [`design-system/01-tokens/semantic/type.tokens.json`](../../design-system/01-tokens/semantic/type.tokens.json) — semantic presets
- [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) — implementation
- [ADR 0006 — Satoshi + JetBrains Mono pairing](./0006-satoshi-jetbrains-pairing.md)
- [`research/satoshi-typography.md`](../../research/satoshi-typography.md) — original family selection research
- Peer system sources cited: Vercel Geist, Linear, Stripe Sail, GitHub Primer, Apple HIG, Material 3, IBM Carbon, Atlassian DS, Radix Themes, Inter dynmetrics, Klim, Mass Driver, Practical Typography (Butterick), Utopia.fyi.
