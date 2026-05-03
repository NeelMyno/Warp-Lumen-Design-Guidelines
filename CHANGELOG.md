# Changelog

All notable changes to **Lumen** (Warp's design system) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [ADR 0009](./_meta/decisions/0009-versioning-semver-system-wide.md) for the versioning policy.

## [Unreleased]

_Nothing yet. Open a PR with an entry under one of: Added, Changed, Deprecated, Removed, Fixed, Security._

---

## [0.5.1] — 2026-05-02 — Typography verification & lint enforcement

A same-day follow-up to v0.5.0 that closes every "pending" verification item. Satoshi OpenType features verified against the actual woff2 binary; audit-dashboard migrated end-to-end to semantic utility classes; lint and Lighthouse-CLS scripts wired so drift cannot regress.

### Added

- **Verified Satoshi GSUB inventory** — ran `fontTools` against `Satoshi-Variable.woff2`. 20 GSUB tags confirmed: `aalt, case, ccmp, dlig, dnom, frac, liga, locl, numr, ordn, pnum, salt, sinf, ss01, ss02, ss03, ss04, subs, sups, tnum`. Verified semantics:
  - `ss01` → alternate single-storey `a` + alternate `G` (17 glyphs)
  - `ss02` → alternate single-storey `g` (5 glyphs)
  - `ss03` → alternate `t` (5 glyphs) — **the v0.4 code's `cv11` was wrong; the actual tag is `ss03`**
  - `ss04` → alternate `Q`
  - Confirmed absent: `zero` (slashed), `onum` (oldstyle), `smcp/c2sc` (small caps).
- **`.lumen-display-alt` utility** in globals.css — opt-in single-storey alternates (`ss01 + ss02 + ss03`) for display moments where the brand wants Satoshi's geometric character. Apply per-element, never globally.
- **`.lumen-alt-q` utility** — opt-in alternate `Q` (`ss04`).
- **`scripts/lint-no-arbitrary-typography.mjs`** — lints `audit-dashboard/src/**/*.{ts,tsx,jsx}` for raw `text-[var(--type-N)]`, `tracking-[var(--tracking-*)]`, `leading-[var(--leading-*)]`, `font-[var(--font-...)]` (excluding root family vars). Supports inline directives:
  - `// lumen-lint-allow: typography` — exempt same line + next non-empty line
  - `{/* lumen-lint-allow-block: typography */}` ... `{/* lumen-lint-allow-end: typography */}` — exempt a region
- **Path-based exemptions** — `audit-dashboard/src/components/primitives/` (demo showcase that renders every size by design) and `audit-dashboard/src/components/ui/` (shadcn upstream conventions) are exempt by file path; the lint enforces semantic-utility usage in all other product code.
- **`scripts/measure-cls.mjs`** — Lighthouse-driven cold-load CLS measurement. Runs twice against `LUMEN_LIGHTHOUSE_URL` (default `https://lumen-design-guidelines.vercel.app/`), prints per-run + avg, fails if either > 0.05 CLS. Wired as `pnpm cls`.
- **Lighthouse + chrome-launcher** added to devDependencies (`lighthouse@^12`, `chrome-launcher@^1`).
- **Per-page `lumen-lint-allow: typography` rationale comments** — every intermediate-size escape hatch (type-15, type-17, type-22, type-44, type-56, type-72, type-128) now carries an inline rationale (e.g., "intermediate body density between body-md and body-lg", "ornamental marquee numeral").

### Changed

- **Audit-dashboard fully migrated to semantic utility classes.** 8 page files (landing, foundations, desktop, saas, tool, ecommerce, mobile, library/client) + dashboard-shell + section components — every product-code typography call site now uses `text-display-*`, `text-heading-h*`, `text-body-*`, `text-data-*`, `text-metric-*`, `text-eyebrow-*`, `text-overline`, `text-micro`, `text-caption`, `text-label-*`. The lint exits clean across the entire dashboard.
- **`pnpm lint`** is now a composite (`pnpm lint:no-primitives && pnpm lint:no-arbitrary-typography`). Existing primitive-lint script renamed to `lint:no-primitives`.
- **`globals.css` body-level `font-feature-settings` comment** — replaced the v0.5 "stripped unverified" rationale with the v0.5.1 verified GSUB inventory and rationale for keeping single-storey alternates as opt-in only.
- **`globals.css` `.lumen-mono` comment** — documents that `zero` is a no-op on next/font/google's JetBrains Mono subset (only `calt/ccmp/frac/locl` ship), and that JetBrains Mono's default `0` glyph is already dotted/disambiguated. Declaration kept so a future self-host migration is zero-edit.
- **`dashboard-shell.tsx`** — version pill + footer + system-live indicator bumped from `v0.4` to `v0.5`. Every `text-[var(--type-N)]` chain replaced with `text-overline`, `text-micro`, `text-label-sm`.
- **`section.tsx`** (`PageHeader` + `Section` + `SubSection`) — responsive lead/description ramps simplified from `text-[var(--type-17)] md:text-body-lg` to `text-body-md md:text-body-lg` (and `text-body-sm md:text-body-md` for the smaller variant). Drops the type-17 / type-15 escape hatches that no longer pull weight.
- **`foundations/page.tsx` TypeRow demo block** wrapped in `lumen-lint-allow-block: typography` — the `cls=` props are intentional documentation showing the raw recipe each preset expands to. Reader-facing, not consumer-facing.

### Fixed

- **Audit-dashboard typography drift sealed.** Pages no longer reach into primitives via Tailwind arbitrary values. Every new component author who tries will fail the lint at PR time.
- **`text-[var(--type-11)] tracking-[var(--tracking-wide)]` micro-pills** in dashboard-shell raised to `text-overline` (still 11px but with the verified semantic preset and proper uppercase rhythm).
- **Stale `v0.4` copy** in dashboard-shell footer + version pill + system-live indicator updated to `v0.5`.

### Verified (post-deploy actions)

The remaining open verifications are deploy-blocked, not code-blocked:

1. Run `pnpm cls` against the deployed Vercel URL once v0.5 ships. Tune `Satoshi-Fallback @font-face` size-adjust/ascent-override if either run > 0.05 CLS.
2. Windows 10/11 1080p ClearType QA at 12–14 px Satoshi VF — Plan-B Inter (`html[data-font="inter"]`) is wired and one attribute toggle away if QA fails.
3. Visual regression on the foundations page TypeRow demo block — intentionally still shows raw recipes (allow-block exempted).

### Notes

- **Why `ss01/ss02/ss03` are opt-in, not global.** The v0.5 strip-then-verify approach was correct: declaring stylistic sets globally without verification was a guess. Verification confirmed the tags exist and do what we expected — but **enabling them globally is a brand decision** (single-storey changes Satoshi's character noticeably). Lumen v0.5.1 ships them as opt-in utilities (`lumen-display-alt`, `lumen-alt-q`); a future ADR can promote to global if the brand wants the alternate as default.
- **JetBrains Mono next/font/google subset is feature-thin.** Only 4 GSUB tags ship (`calt, ccmp, frac, locl`) — no slashed zero, no character variants, no stylistic sets. The CSS keeps the `zero 1` declaration so a future self-host migration (loading the full JetBrains Mono via `next/font/local`) instantly activates the slashed glyph. For now, JetBrains Mono's default `0` is already dotted/disambiguated, so IDs read clean.
- **Lint coverage is enforceable.** Lint runs in `pnpm lint` and exits non-zero on violation. Wire into CI as a PR gate when v0.5 lands in shared infrastructure.

---

## [0.5.0] — 2026-05-02 — Typography rebuild

A ground-up rebuild of Lumen's typographic system. Three-agent audit (current-state, peer-systems research, OpenType deep-dive) surfaced ten P0/P1 issues; v0.5 closes them. The faces stay (Satoshi + JetBrains Mono + Source Serif 4 + Inter Plan-B). Everything else — token shape, leading curve, tracking curve, OpenType stack, italic policy, modern CSS, semantic utility surface — is rewritten. Source of truth restored: token JSON drives implementation; CSS mirrors. See [ADR 0010](./_meta/decisions/0010-typography-v05.md) for the full reasoning.

### Added

- **`design-system/00-foundations/typography.md`** — the canonical typography guide. Family decisions, scale rationale, leading + tracking curves, semantic preset table (35 presets), italic policy, OpenType strategy, per-platform mapping (web/iOS/Android), performance budget, do/don't list. New foundation document — was missing in v0.1–v0.4.
- **18 new semantic presets** in `01-tokens/semantic/type.tokens.json`:
  - `display.hero` (128 px Black 900, brutalist ceiling), `display.2xl` (96 px), `display.sm` (28 px) — fills the brutalist scale.
  - `heading.h4`, `heading.h5`, `heading.h6` — finally a complete six-level hierarchy.
  - `lead` (20 px secondary deck), `body.xs` (13 px), `body.tabular` (16 px tabular nums).
  - `label.lg`, `label.md` — were missing alongside `label.sm`.
  - `eyebrow.sans` and `eyebrow.mono` — formal split (the v0.4 system-metadata signature now has a token).
  - `overline` (11 px chart axis).
  - `data.lg`/`data.md`/`data.sm` — Lumen-signature tabular numerics with `tabular-nums lining-nums slashed-zero` baked in.
  - `metric.xl`/`metric.lg`/`metric.md`/`metric.sm` — Atlassian-pattern KPI tier; the Stat primitive's anatomy now has its own role.
  - `code.terminal` — separate from `code.block`, with programming ligatures explicitly OFF.
  - `prose.body`/`prose.lead`/`prose.title`/`prose.subtitle` — Source Serif 4 longform tier for `/blog`, `/changelog`, `/press`, legal.
  - `quote` (block quote / testimonial).
  - `display-italic-accent` — the brutalist "one italic word per hero" preset.
  - `kbd` — keyboard glyph.
- **Primitive size tokens 11 / 17 / 22 / 28 / 36 / 44 / 56 / 72 / 84 / 96 / 112 / 128 px** added to `01-tokens/primitives/typography.tokens.json`. The full floor-to-ceiling 11→128 px scale is now codified — JSON matches the v0.4 CSS truth.
- **Leading curve** — replaces single-value `leading.tight` with a 13-step curve from `flat 1.00` (≥96 px) to `relaxed 1.65` (longform). Each value grid-aligned to 4 px at its target size.
- **Tracking curve** — 13-step continuous curve mapped to size, asymptote at -0.025 em (Inter formula convergence). `cap-eyebrow 0.10em`, `cap-overline 0.05em`, `cap-mono 0.16em` for uppercase runs.
- **Variable axis tokens** — `font.axis.body` (440), `font.axis.body-strong` (510), `font.axis.ui` (500), `font.axis.display` (700) for VF-aware components. Linear-pattern non-integer weights.
- **`weight.extrabold` (800)** added as optional bridge between Bold and Black.
- **Tailwind v4 semantic utility classes** in `audit-dashboard/src/app/globals.css` — `text-display-hero/2xl/xl/lg/md/sm`, `text-heading-h1…h6`, `text-body-lg/md/sm/xs/tabular`, `text-lead`, `text-label-lg/md/sm`, `text-eyebrow-sans/mono`, `text-overline`, `text-caption`, `text-micro`, `text-data-lg/md/sm`, `text-metric-xl/lg/md/sm`, `text-code-inline/block/terminal`, `text-prose-body/lead/title/subtitle`, `text-display-italic-accent`, `text-quote`. Components reach for these — no more raw `text-[var(--type-N)]` arbitrary values.
- **`text-wrap: balance` baked into display + heading utility classes**; `text-wrap: pretty` baked into `text-body-lg`, `text-lead`, `text-prose-*`.
- **Fluid hero variants** — `--type-fluid-hero` (`clamp(4rem, 4rem + 4vw, 8rem)`), `--type-fluid-2xl`, `--type-fluid-xl`. Hero scales smoothly between viewports without media queries; body and headings stay fixed.
- **`Satoshi-Fallback` `@font-face` block** at the top of globals.css — Arial alias with `size-adjust: 121%`, `ascent-override: 81%`, `descent-override: 18%`. Eliminates CLS on font swap-in. Verify in Lighthouse on cold load; tune if drift > 0.05 CLS.
- **`font-optical-sizing: auto`** at root — harmless on Satoshi (no opsz axis), beneficial on Source Serif 4.
- **Plan B Inter wiring** — `html[data-font="inter"]` toggle on the root flips `--font-sans` to the Inter Variable stack. Documented as the emergency switch for ITF licensing changes / Cyrillic-Greek expansion / Windows ClearType failure.
- **Editorial slot wiring** — `--font-serif: "Source Serif 4", …` exposed as a CSS variable; `prose.*` semantic presets bind to it.
- **`.lumen-mono-code` and `.lumen-mono-terminal`** utility classes — the mono split (see Fixed below).
- **`.lumen-eyebrow-sans` and `.lumen-eyebrow-mono`** utility classes — formal naming for the two eyebrow systems.
- **`.lumen-overline`** utility — chart axis / sub-eyebrow secondary uppercase tier.
- **`.prose-lumen` longform wrapper** — `max-width: 65ch`, `text-wrap: pretty`, `hanging-punctuation: first last`, `font-feature-settings: "onum" 1` (oldstyle figures in editorial), Source Serif 4 family. Use on `/blog`, `/changelog`, `/press`.
- **`design-system/00-foundations/voice-and-tone.md`** — added "Italic — three rules" section codifying when italics may and may not be used; expanded the "Capitalization" eyebrow rules to call out the sans/mono split; expanded "Numbers" to require the `data.*`/`metric.*`/`body.tabular` semantic presets and warn against manual `font-feature-settings: "tnum"` (which overrides `font-variant-numeric` and silently drops `slashed-zero`).
- **`design-system/00-foundations/accessibility.md`** — added six WCAG typography mappings (1.4.4 Resize Text, 1.4.5 Images of Text, 1.4.10 Reflow, 1.4.12 Text Spacing, plus Lumen-internal 12 px body floor). Added a dedicated "Typography" section covering body floor, line-length cap, `font-synthesis: none` rationale, Dynamic Type / Material font scale support, eyebrow contrast on glass surfaces. Updated the Tables section to reference `data.*` presets instead of manual `font-feature-settings: "tnum"`.
- **[ADR 0010 — Typography v0.5 system upgrade](./_meta/decisions/0010-typography-v05.md)** — durable record of the audit, the ten P0/P1 issues, the ten changes, the consequences, and the verification action items.

### Changed

- **Token JSON is now the source of truth.** Previously the v0.4 `globals.css` quietly extended the scale to 128 px and used different leading/tracking values than the JSON. Reconciled — JSON now contains everything the CSS needed. Style Dictionary outputs for iOS/Android/Liquid will match web for the first time since v0.3.
- **Primitive `font.size` table** — restructured. Was 13 stops (12–76); now 25 stops (11–128). Existing references via `{font.size.16}` etc. continue to resolve.
- **Primitive `font.leading`** — replaced `tight 1.10 / snug 1.25 / normal 1.50 / relaxed 1.65` with a 13-step curve. `tight` retuned from 1.10 → 1.05 to align with display brutalist intent. `snug` retuned from 1.25 → 1.12 (display tier). New tier names: `flat 1.00`, `compact 1.16` (h1 grid-aligned), `comfortable 1.20` (h2), `snug-body 1.30` (h3 / eyebrow), `tight-table 1.18` (dense data UI), `uppercase 1.30` (caps), `ui 1.40` (h4–h6, caption, label), `body-comfortable 1.55` (size-tuned body), `loose 1.80` (reserved). `normal 1.50` and `relaxed 1.65` unchanged. **Breaking** for any consumer that referenced `{font.leading.tight}` or `{font.leading.snug}` in component code expecting the old values; migrate to the per-tier semantic preset.
- **Primitive `font.tracking`** — replaced 7-bucket scale with 13-step continuous curve. `tightest` retuned from -0.04 → -0.025 (Inter asymptote convergence). `tighter` -0.02 → -0.020 (unchanged value, formalized name). `tight` -0.01 → -0.015. New tokens: `tight-soft -0.010`, `tight-micro -0.005`, `tight-body -0.002`, `wide-micro 0.005`, `wide 0.008`, `wider 0.012`, `cap-overline 0.05`, `cap-eyebrow 0.10`, `cap-mono 0.16`. The legacy `widest` aliases `cap-eyebrow` for backward compatibility. **Breaking** for any consumer that referenced `{font.tracking.tightest}` expecting -0.04; the new value is -0.025. Migrate display.xl/2xl/hero references to the per-tier semantic preset.
- **Semantic `type.display.xl`** — was 76 px / Bold / leading.tight 1.10 / tracking.tightest -0.04. Now 76 px / Bold / leading.tight 1.05 / tracking.tighter -0.020. Visual difference: ~3 px per line of leading saved, slightly looser tracking. Legacy callers using the JSON token will pick up the change automatically.
- **Semantic `type.heading.h2`** — weight retuned. Was Semibold (matches voice); kept Semibold but tracking moved from `tight -0.01` to `tight-soft -0.010` (same value, formalized name).
- **Semantic `type.heading.h3`** — weight retuned. Was Medium; now Semibold for sharper subsection definition. Tracking from `normal 0` to `tight-micro -0.005` (Apple optical-size threshold).
- **Semantic `type.body.md/sm`** — leading lifted from `normal 1.50` to `body-comfortable 1.55` for size-tuned screen comfort. Imperceptible change at 16 px (24 → 25 px line height); meaningful at 14 px (20 → 22 px).
- **Semantic `type.body.lg`** — tracking shifted from `normal 0` to `tight-body -0.002`. Whisper-tight; visually invisible to most readers but improves rhythm at 18 px.
- **Semantic `type.label.eyebrow`** — split into `type.eyebrow.sans` and `type.eyebrow.mono`. Both at 12 px (raised from 11 px floor for WCAG comfort). Sans at 0.10 em tracking, mono at 0.16 em tracking. Old `type.label.eyebrow` reference still exists in some component contracts; will be removed in v0.6.
- **Semantic `type.code.inline`** — sized as relative `0.9286em` (= 13/14 ratio) instead of absolute 14 px. Inline mono now optically matches surrounding sans body x-height per the GitHub Primer pattern. Inline `<code>` in body will visually shrink ~1 px; code blocks unchanged at 13 px absolute.
- **Component contracts** — every component's `tokens.consumed` array updated to reference v0.5 semantic presets:
  - `Stat` — drops `type.heading.h1/h2`, `type.label.eyebrow`, `type.display.md/lg/xl`. Adds `type.metric.sm/md/lg/xl`, `type.eyebrow.sans`, `type.data.sm`. New `sizeMapping` block declares which preset binds to value/unit/delta at each size.
  - `Badge` — adds `type.eyebrow.mono` for status caps.
  - `Table` — drops `type.label.eyebrow`. Adds `type.eyebrow.sans/mono`, `type.data.sm/md`, `type.heading.h6` (table column headers).
  - `Button` — adds `type.label.lg/md` for size-conditional binding.
  - `Input` — adds `type.body.sm`, `type.label.md`, `type.data.md` (mono variant).
  - `LiveDot` — `type.label.eyebrow` → `type.eyebrow.mono` (LiveDot's label is system metadata).
  - `RateTicker` — adds `type.data.md/sm`, `type.eyebrow.mono`.
  - `Toast` — adds `type.label.md`, `type.heading.h6`.
  - `Dialog` — adds `type.heading.h2`, `type.body.md/sm`, `type.label.lg`.
  - `EmptyState` — adds `type.body.md`, `type.lead`, `type.label.md`.
  - `Toggle` — adds `type.label.md`.
  - `Card` — adds `type.heading.h4`, `type.body.md`, `type.eyebrow.mono`.
- **Global `font-feature-settings`** — was `"ss01", "ss02", "cv11"`. Now `"kern" 1, "liga" 1` only (universally safe). The unverified Satoshi stylistic-set tags were stripped — ITF does not publish what these do in Satoshi. Re-add only after `python -m fontTools.ttx -t GSUB` confirms the alternate. **Visible difference:** the single-storey `a`/`g` alternates (if `ss01`/`ss02` actually trigger them in Satoshi v2.000) will revert to default double-storey. If the brand depends on this alternate, re-add with a verification comment.
- **`.lumen-mono` utility** — was `font-feature-settings: "tnum" 1, "calt" 0`. Now uses `font-variant-numeric: tabular-nums slashed-zero` + `font-feature-settings: "calt" 0, "liga" 0, "zero" 1`. Slashed zero now actually applies (it was being silently dropped by the property override).
- **`.lumen-tnum` utility** — was mixing `font-feature-settings: "tnum" 1, "ss01" 1` and `font-variant-numeric: tabular-nums slashed-zero` (the former was overriding the latter). Now uses `font-variant-numeric: tabular-nums lining-nums slashed-zero` only.
- **`.lumen-eyebrow` utility** — raised from 11 px Semibold to 12 px Medium with `tracking.cap-eyebrow 0.10em`. Aliased as `.lumen-eyebrow-sans` for clarity.
- **`.lumen-mono-cap` utility** — raised from 11 px to 12 px. Added `font-feature-settings: "case" 1` so case-sensitive forms (raised punctuation aligned to caps) work correctly inside ALL CAPS runs. Aliased as `.lumen-eyebrow-mono`.
- **`.lumen-kbd` utility** — added `font-feature-settings: "tnum" 1, "calt" 0, "zero" 1` so keyboard glyphs render with disambiguated zero and no programming ligatures.
- **`::selection` background** — `--lumen-lime-a32` → `--lumen-lime-a24`. Softened so selection reads as selection, not as an active state.
- **`html[data-font="inter"]` switch** wired in globals.css. The Plan-B Inter swap is one attribute toggle away.
- **VERSION bumped from 0.4.0 to 0.5.0.**

### Deprecated

- **`font.weight.light` (300)** — removed in v0.5 (see Removed). Migration path: any component or page using weight 300 should move to weight 400 (Regular). Bundle saves ~25 KB.
- **`type.label.eyebrow`** — superseded by `type.eyebrow.sans`. Existing references continue to work via primitive token resolution; will be hard-removed in v0.6 with a deprecation period.
- **`tracking.tightest` at -0.04 em** — superseded by -0.025 em (Inter asymptote convergence). Existing references resolve to the new value automatically. If a consumer wants the old extra-tight feel, declare it inline; the system asymptote no longer goes that far.
- **Raw arbitrary-value typography in product code** (`text-[var(--type-N)] tracking-[var(--tracking-X)] leading-[var(--leading-Y)]`) — deprecated in favor of semantic utility classes (`text-display-xl`, `text-body-md`, etc.). Lint will flag in a follow-up release.

### Removed

- **`font.weight.light` (300)** primitive — was unused in audit dashboard, conflicts with operator-confident voice. Bundle saves ~25 KB. **Breaking** for any consumer using `font-weight: 300`.
- **`--font-italic-display` CSS variable** — was an aspirational "future swap to Source Serif 4 italic" slot. Replaced with `--font-serif` directly; editorial italics now come from the serif family explicitly via `prose.*` presets.
- **`tracking-widest` distinct token value** — kept as alias to `tracking.cap-eyebrow` for backward compat. The 0.10 em value is unchanged; the alias removes the orphan name.

### Fixed

- **JSON ↔ CSS drift** — sizes 11/17/22/28/36/44/56/72/84/96/112/128 now exist in both. Leading curve matches between sources. Tracking values match (within rounding — both use 0.025 em as the asymptote, not 0.04). Style Dictionary outputs will be consistent across all 9 platforms.
- **Slashed zero silently dropped on `.lumen-tnum`** — `font-feature-settings` was overriding `font-variant-numeric` so the `slashed-zero` from the latter was lost. Now uses one property only.
- **Programming ligatures killed in code blocks** — `.lumen-mono` was setting `calt 0` globally, disabling JetBrains Mono's `=>`, `!=`, `>=` ligatures everywhere. Split into `.lumen-mono` (data, no ligatures), `.lumen-mono-code` (code blocks, ligatures ON), and `.lumen-mono-terminal` (terminal, ligatures OFF).
- **Eyebrow at 11 px below WCAG comfort** — raised to 12 px in both sans and mono cuts. WCAG AA passes at 11 px under 4.5:1 contrast but stress-reads under tracking; 12 px is the comfort floor.
- **Display ceiling stated three different ways** (76 in JSON, 96–144 in v0.4 brief, 128 in v0.4 CSS) — locked at 128 px. JSON, foundation doc, and CSS all agree.
- **Eyebrow had two coexisting systems** (sans 11 Semibold widest in `.lumen-eyebrow` vs mono 11 Medium 0.16 em in `.lumen-mono-cap`) — formalized as `eyebrow.sans` and `eyebrow.mono` semantic presets at 12 px.
- **`font-synthesis: none` was undocumented** — added inline comment explaining why (real italic VF + full wght axis are shipped, browser must never fake) so future maintainers don't remove it for compatibility.
- **No `font-optical-sizing` set** — added `font-optical-sizing: auto` at root for Source Serif 4 to auto-apply the right cut at the rendered size.
- **No metric-aligned font fallback** — added `Satoshi-Fallback @font-face` aliasing Arial with `size-adjust: 121%` etc. CLS on cold-load font-swap-in should now be ≈ 0.

### Notes

- **Audit-dashboard page refactor pending.** Pages currently use raw `text-[var(--type-N)] tracking-[var(--tracking-X)] leading-[var(--leading-Y)] font-bold` chains. Mechanical migration to the new semantic utility classes (`text-display-2xl`, etc.) is tracked as v0.5.1 follow-up — ~150 occurrences across 8 page files.
- **Stylistic-set verification action item.** Run `python -m fontTools.ttx -t GSUB Satoshi-Variable.ttf` once and document the actual feature tags for single-storey `a`/`g` and alternate `G`/`t`. Re-add to `.text-display-*` (or `.lumen-display`) with a code comment recording verification date and tester.
- **Windows ClearType QA still flagged.** Satoshi VF at 12–14 px on Windows 10 1080p has an ongoing rendering risk per `research/satoshi-typography.md`. Plan B Inter is now wired and one attribute toggle away if QA fails.
- **Audit-dashboard `globals.css` is still the placeholder per the Style Dictionary plan.** Once `_build/tailwind/theme.css` is generated, the dashboard's tokens will be replaced with the built file. v0.5 changes preserve token names so the swap-in is non-breaking.
- **Light theme — typography parity verified for sizes/leadings/trackings.** Eyebrow color (`text-tertiary`) is identical in both themes; on glass surfaces in light theme, prefer `text-secondary` for caps to maintain ≥4.5:1 contrast.

---

## [0.4.0] — 2026-05-02 — Obsidian Lime

A clean break from the navy + lime mood. Anchor references: SuperDesign · Glassmorphism Style and SuperDesign · Neon Velocity Countdown. The brand-green stays — everything else is rebuilt around an obsidian canvas, generous whitespace, glass surfaces, and a radial lime ambient glow as the brand's signature lighting gesture.

### Changed

- **Default mood is now `obsidian-lime`** (replaces `quiet-industrial`). `lib/moods.ts` and `[data-mood]` updated accordingly.
- **Default theme is now `dark`** (the obsidian canvas is the brand stage). Light mode is the cream-paper inverse and remains a first-class citizen.
- **Color primitives retuned** in `01-tokens/primitives/color.tokens.json`:
  - `color.brand.*` retuned to the **obsidian** ramp — warm-leaning near-black, never navy.
  - `color.warm.*` retuned to the **cream** ramp — warm paper for light mode.
  - `color.accent.*` keeps `#4ade80` at 400/500 (brand value unchanged); ramp top brightened so the lime reads "laser" against obsidian.
  - `color.status.info.*` shifts off sky-blue to a warm cream tone — no second loud color, no navy partnership.
  - `color.alpha.accent.40` and `.64` added for ambient-glow stops.
- **Semantic dark/light tokens** (`color.dark.tokens.json`, `color.light.tokens.json`) updated to match: new `surface.glass`, `surface.tint-accent`, `border.hairline`, `border.frame`, `border.accent`, `aurora.color`, `aurora.core` keys.
- **Audit dashboard** (`audit-dashboard/src/`):
  - `globals.css` rewritten — drops the navy ramp; introduces obsidian, cream, lime alphas, glass utilities, architectural grid, radial aurora, brutalist frame, mono uppercase tracked label.
  - `dashboard-shell.tsx` rebuilt with a glass pill nav, a fixed architectural grid behind the canvas, and the radial aurora over hero content.
  - `tab-nav.tsx` rebuilt as glass-pill chips with lime hairline + tint on active.
  - `theme-toggle.tsx` defaults to dark.
  - `foundations/page.tsx` rebuilt — brutalist-frame hero, `voice` section, glass + glow + grid surfaces, 13 navigable sections with a sticky right-rail TOC.
  - `landing/page.tsx` hero refreshed: italic lime accent on "builders.", pill XL CTAs with `glow`, architectural grid + aurora canvas.
  - `library/client.tsx` hero badge bumped to v0.4.0.
- **Primitives**:
  - `Card` — added `glass` and `glow` elevations, added `hero` padding, default radius bumped to `radius-xl`.
  - `Button` — added `xl` size (h-14 pill), `glow` boolean for hero halo, `pill` boolean for radius-full override.
  - `Tooltip` — surface upgraded to `lumen-glass-strong`.
  - Avatar / Charts / Display / Feedback / AI / Inputs / Mobile / Commerce / Templates — every direct primitive reference (`lumen-navy-*`, `lumen-sky-*`, `lumen-gray-*`) replaced with the v0.4 vocabulary (`lumen-obsidian-*`, `lumen-cream-*`).
- **Radius scale** — slightly rounder: `xs=3 sm=6 md=8 lg=12 xl=16 2xl=20 3xl=28 4xl=36 full=∞`. The 8-point soft grid is unchanged; only the optical radius dial moved.
- **Type scale** — display ceiling pushed to 84 / 96 / 112 / 128 px to support brutalist hero treatments. Existing scale steps unchanged below 76 px.
- **Motion tokens** — added `--motion-aurora-fade-in` (1200ms) and `--motion-glow-pulse` (2400ms) for the new ambient signatures. Existing eases unchanged. `prefers-reduced-motion` honoured throughout.

### Added

- **Direction brief** — `research/lumen-v04-direction.md` documenting the references, the v0.4 axioms, and the cascade plan.
- **`.lumen-glass`, `.lumen-glass-strong`** utilities — glass surfaces with backdrop-filter for floating shells.
- **`.lumen-aurora`** utility — fixed radial-lime ambient glow with reduced-motion fallback.
- **`.lumen-grid-architectural`** utility — whisper-faint 64px lattice for canvas texture.
- **`.lumen-frame-brutalist`** utility — hairline frame around statement headlines, no shadow.
- **`.lumen-mono-cap`** utility — JetBrains Mono · uppercase · +0.16em tracking. The v0.4 system-metadata voice.
- **`.lumen-dot-pulse`** utility — replaces ad-hoc pulse styles; signature loop for live-status dots.

### Removed

- **`color.brand` namespace as "Warp navy"** — same JSON path, but values are now obsidian. Token consumers using semantic aliases (`color.surface.page`, `color.border.default`, etc.) need no changes.
- **`lumen-navy-*`** CSS primitives — gone. Replaced with `lumen-obsidian-*`.
- **`lumen-sky-*`** CSS primitives — gone. v0.4 doesn't use a sky-blue family. Components that referenced sky now use cream or accent.
- **`lumen-gray-*`** CSS primitives — gone. Replaced with `lumen-cream-*` (warm paper neutrals are the v0.4 'gray' family).
- **Mood: Quiet Industrial** — superseded. Mood-switcher hides itself when `MOODS.length <= 1`.

### Notes

- The v0.3 `95fdd3d` 8-point soft grid migration carries forward intact — every structural pixel still snaps to 8s with 4-pixel halves and 2-pixel quarters as exceptions.
- Component spec docs in `02-components/{name}/component.md` still describe v0.3 sizing and v0.3 token vocabulary in places — bringing those to full v0.4 parity is the obvious next wave.
- No localhost dev server (kernel watchdog crashes documented through v0.1–v0.3). View on Vercel only.

---

## [0.1.0] — 2026-05-02

The initial Lumen drop. Audit baseline.

### Added

- **Brand & inspiration brief** — `/research/lumen-brief.md` synthesizing four research streams (Warp brand DNA, Apple/Ive/Rams inspiration, Satoshi typography, system architecture).
- **Visual mood: Quiet Industrial** as default. Three alternates documented (`soft-luminous`, `mono-editorial`, `premium-glass`) and exposed in the audit dashboard's mood switcher.
- **Color tokens** — Warp's actual navy ladder for dark mode, paper-warm white for light mode, Warp lime green (`#4ade80`) as the only loud accent. Three layers (primitives, semantic, component-bound) in DTCG JSON.
- **Typography tokens** — Satoshi (UI/display) + JetBrains Mono (numerics) on a 1.25 modular scale. Editorial pair: Source Serif 4. Plan B: Inter.
- **Spacing, radius, motion, elevation tokens** — full DTCG primitive + semantic ladders.
- **Components (12)** with both `component.md` (human spec) and `component.json` (machine contract):
  - **Button** — primary/secondary/tertiary/danger, three sizes, loading state, full Web React example.
  - **Input** — single-line text input with mono variant for codes/IDs.
  - **Card** — bounded surface with hairline border + subtle shadow.
  - **Badge** — status/category/count pill with mandatory leading dot for status variants.
  - **Stat** ⚡ Warp signature — big bold tabular number + small mono unit + optional delta.
  - **LiveDot** ⚡ Warp signature — 8 px green dot with 2 px pulsing ring (3 s loop).
  - **RateTicker** ⚡ Warp signature — horizontal marquee of freight lane rates.
  - **Table** — operator-density data table with hairline rows, sticky header, tabular numerics.
  - **Dialog** (beta) — modal interrupt for confirmation / focused decision / short form.
  - **Toast** (beta) — non-blocking corner message, sticky for errors.
  - **EmptyState** — type-led, never illustrated, two-line template.
  - **Toggle** — switch for binary on/off settings.
- **Component schema** at `design-system/02-components/_schema/component.schema.json` — every `component.json` validates against it.
- **Foundations docs (4)** — principles, voice & tone, accessibility (WCAG 2.2 AA hard floor), motion language.
- **Content docs (8)** — imagery, illustration, iconography, motion (recipes), UI writing style, microcopy library, error messages, empty states.
- **Platform consumption guides (9)** — web (Next.js + Tailwind v4 + shadcn), React Native, iOS native (SwiftUI), Android native (Compose), macOS desktop, Windows desktop (WinUI 3), Shopify Liquid, BigCommerce Stencil, WooCommerce / WordPress.
- **LLM contract surfaces** — `llms.txt`, `llms-full.txt`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/lumen.mdc`, `.warp/lumen.mdc`, `.github/copilot-instructions.md`.
- **shadcn-compatible registry** at `_registry/registry.json` + per-component sidecars for all 12 components.
- **Style Dictionary v5 build pipeline** at `style-dictionary.config.ts` with 9 platform outputs (CSS, Tailwind, TS, iOS Swift, Android XML, Compose Kotlin, Flutter, Liquid, flat JSON).
- **Build & validation scripts** — `pnpm build`, `pnpm validate`, `pnpm registry`, `pnpm lint`, `pnpm release`.
- **\_meta**:
  - `glossary.json` — 30 term disambiguations for AI agents.
  - 9 ADRs covering DTCG, Style Dictionary, shadcn registry, Quiet Industrial mood, single-accent rule, Satoshi pairing, two-file component contract, layered LLM contract, semver-system-wide.
  - 5 reusable prompt fragments — new-component, token-update, platform-port, audit-dashboard-tab, accessibility-pass.
- **Audit dashboard** at `/audit-dashboard/` — Next.js 16 + Tailwind v4 + Satoshi self-hosted. Seven template tabs (Foundations, SaaS, Landing, Tool, E-commerce, Mobile, Native Desktop). Mood switcher and dark/light theme toggle.

### Notes

- Satoshi is shipped under ITF-FFL (free for personal + commercial use, must self-host, must NOT redistribute the font files in a public repo). License action item: have legal pull the canonical text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build.
- The accent green `#4ade80` is verbatim from Warp's production CSS (used 788 times). Do not soften without an ADR.
- The audit dashboard's `globals.css` is a placeholder. Once Style Dictionary outputs `_build/tailwind/theme.css`, replace the dashboard's tokens with the built file.
