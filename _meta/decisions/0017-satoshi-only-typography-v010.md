# ADR 0017 — Satoshi-only typography (v0.10) — single-typeface system

- **Date:** 2026-05-03
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Supersedes:** [ADR 0006 — Pair Satoshi with JetBrains Mono](./0006-satoshi-jetbrains-pairing.md)
- **Amends:** [ADR 0010 — Typography v0.5 system upgrade](./0010-typography-v05.md) (family decisions only; scale, presets, italic policy, modern-CSS techniques, and lint contract all stay)

## Context

Through v0.9 Lumen shipped four typefaces:

| Slot | Family | Job |
|---|---|---|
| `font.family.sans`     | **Satoshi Variable** (ITF-FFL, self-hosted) | UI, display, body |
| `font.family.mono`     | **JetBrains Mono** (OFL, next/font/google) | Numerics, code, terminal, IDs, money, ETAs |
| `font.family.serif`    | **Source Serif 4** (Adobe, OFL) | Editorial — `/blog`, `/changelog`, `/press` |
| `font.family.alt-sans` | **Inter Variable** (OFL) | Plan B — wired via `html[data-font="inter"]` for hostile rendering |

The user's directive (2026-05-03): **"I only want Satoshi as the font in the dashboard and in the design system."**

Three pressures pointed the same direction:

1. **Brand clarity.** A single-typeface system reads as more disciplined than a quartet, especially for a brutalist-leaning aesthetic where restraint is the voice.
2. **Payload.** Dropping JetBrains Mono saves ~40 KB of webfont (the next/font/google subset). Source Serif 4 was per-route; Inter was unloaded by default. Net web-font savings: ~40 KB on every page that previously hit the mono codepath.
3. **Operational simplicity.** One family means one license to track, one self-host pipeline, one font-display strategy, one fallback metric to tune. ADR 0006's "license action item" (have legal pull canonical ITF-FFL text) shrinks from four documents to one.

The blockers worth being honest about:

- **Numerics.** JetBrains Mono was bringing tabular alignment, slashed-zero, and the disambiguated `0/O 1/l/I` set. Satoshi has tabular numerals (`tnum`) and lining figures (`lnum`); it does NOT ship a slashed-zero glyph (`zero` feature is absent — verified via fontTools 2026-05-02). Satoshi's default `0` is already ovoid/disambiguated against `O`, so legibility holds at small sizes.
- **Code rendering.** Code blocks lose their monospaced rhythm. For a logistics-operator audience this is acceptable — code surfaces in Lumen are documentation snippets, not an IDE. Programming ligatures (`calt`, `liga`) ride Satoshi for inline + block code; terminal/diff turns them off.
- **Editorial.** Source Serif 4 brought a true serif voice for longform. Satoshi at editorial scale (18–22 px body, 1.65 leading, 60–65 ch measure, ligatures + proportional figures on) reads as confident-sans editorial. This is a deliberate stylistic shift, not an accidental loss.
- **Plan B Inter.** ADR 0010 wired `html[data-font="inter"]` as an emergency switch for ITF licensing changes, Cyrillic/Greek expansion, or Windows ClearType failure at 12–14 px. v0.10 retires this toggle in favor of an explicit ADR-gated process: if any of those failure modes ever materializes, raise a new ADR rather than silently flipping a CSS attribute.

## Decision

**Lumen v0.10: Satoshi is the only typeface.**

### What gets retired

- `font.family.mono` — JetBrains Mono import, next/font/google entry, primitive token.
- `font.family.serif` — Source Serif 4 family declaration in `globals.css` and primitive token.
- `font.family.alt-sans` — Inter Plan-B family declaration and the `html[data-font="inter"]` override block.
- `--font-jetbrains` CSS variable.
- The `--font-mono`, `--font-serif`, `--font-alt-sans` CSS variables in `:root`.
- The `--font-mono` republish in the Tailwind v4 `@theme` block (so the `font-mono` utility is no longer emitted).

### What stays — but resolves to Satoshi

- The semantic preset class names (`.lumen-mono`, `.lumen-mono-code`, `.lumen-mono-terminal`, `.lumen-mono-cap`, `.text-data-{lg,md,sm}`, `.text-metric-{xl,lg,md,sm}`, `.text-code-{inline,block,terminal}`, `.text-prose-{body,lead,title,subtitle}`, `.text-eyebrow-mono`).
- The semantic token presets (`type.eyebrow.mono`, `type.kbd`, `type.data.*`, `type.metric.*`, `type.code.*`, `type.prose.*`).
- The `mono` boolean prop on `<Field>` / `<Input>`.

These names persist for **component-API stability**. They no longer signal "different typeface" — they signal a feature-flag bundle:

| Class / preset | Renders | Carries |
|---|---|---|
| `.lumen-mono` family | Satoshi | `font-variant-numeric: tabular-nums slashed-zero` + `font-feature-settings: "calt" 0, "liga" 0, "zero" 1` |
| `.lumen-mono-code` | Satoshi | `font-feature-settings: "calt" 1, "liga" 1, "zero" 1` (programming ligatures ON) |
| `.lumen-mono-terminal` | Satoshi | `font-feature-settings: "calt" 0, "liga" 0, "zero" 1, "tnum" 1` (ligatures OFF) |
| `.lumen-mono-cap` / `eyebrow.mono` | Satoshi | `letter-spacing: 0.16em` + `text-transform: uppercase` + `font-feature-settings: "tnum" 1, "calt" 0, "zero" 1, "case" 1` |
| `.text-data-*` / `.text-metric-*` | Satoshi | `font-variant-numeric: tabular-nums lining-nums slashed-zero` |
| `.text-code-{inline,block}` | Satoshi | ligatures ON |
| `.text-code-terminal` | Satoshi | ligatures OFF, tabular |
| `.text-prose-*` | Satoshi | editorial sizes, looser leading, ligatures ON |

### What's new

- A single primitive `font.family.sans` carries the full Satoshi stack with the metric-aligned `Satoshi-Fallback` Arial alias for zero-CLS swap. No other family slots exist.
- Every semantic preset's `fontFamily` resolves to `{font.family.sans}`.
- `.prose-lumen` body uses `font-feature-settings: "kern" 1, "liga" 1, "pnum" 1` (proportional figures for editorial rhythm). The previous `onum` declaration was a silent no-op against Satoshi's GSUB and is gone.
- The `mono` prop on `<Field>` / `<Input>` toggles the OpenType feature stack (tnum + lnum + zero) rather than switching family. Field shell `[data-mono="true"]` rule preserves the same behavior.
- SVG chart text (in `audit-dashboard/src/components/primitives/charts.tsx`) carries `fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}` so axis labels keep column alignment under proportional Satoshi.
- The `lint-no-arbitrary-typography` allowlist is restricted to `--font-sans`. Arbitrary references to `--font-mono` or `--font-serif` in product code now flag.

### Token consumer impact

This is a **breaking change** for any external consumer that referenced `font.family.mono`, `font.family.serif`, or `font.family.alt-sans` from the Style Dictionary build outputs:

- `_build/css/tokens.css`: the `--font-family-mono`, `--font-family-serif`, `--font-family-alt-sans` CSS variables no longer emit. References to them will resolve to UA defaults.
- `_build/tailwind/theme.css`: the `font-mono` Tailwind utility is no longer published.
- `_build/ts/tokens.ts`: the corresponding TS exports are gone.
- `_build/ios/`, `_build/android/`, `_build/compose/`, `_build/flutter/`, `_build/liquid/`: parallel removals.

**Migration:** consumers that previously bound to `font.family.mono` should rebind to `font.family.sans` and add the relevant feature-flag bundle (`tabular-nums lining-nums slashed-zero` for numerics; `calt 0, liga 0, tnum 1, zero 1` for terminal output; `calt 1, liga 1, zero 1` for code prose). Internal consumers (audit-dashboard, design-system component examples) are migrated in this commit.

## Consequences

### Positive

- **Brand discipline.** One typeface, one weight ladder, one set of feature flags. The "operator-instrument-panel" voice is now carried by tracking and feature flags rather than a second family — more economy, less ornament.
- **Bundle.** ~40 KB saved on every page that previously hit the JetBrains Mono codepath. Source Serif 4 was per-route so its retirement saves on `/blog` / `/changelog` / `/press` only.
- **One license to track.** ITF-FFL on Satoshi. No OFL JetBrains Mono distribution, no OFL Source Serif 4 distribution, no Inter wiring to maintain.
- **Numerics still tabular.** Satoshi's `tnum` table preserves column alignment in tables, KPI stacks, and chart axes. Verified 2026-05-02 against `Satoshi-Variable.woff2` GSUB.
- **CLS unchanged.** The metric-aligned `Satoshi-Fallback` Arial alias is unchanged. Drop-in.

### Negative

- **No slashed zero on Satoshi.** Verified absent from Satoshi's GSUB. Mitigation: Satoshi's default `0` is already ovoid and visually distinct from `O`; we keep `font-feature-settings: "zero" 1` declared on `.lumen-mono*` so a future Satoshi build (or a self-hosted full-feature variant) lights up the slashed glyph zero-edit.
- **Code blocks render proportional.** A logistics-operator audience reads code surfaces as documentation, not as an IDE; line-aligned tabular code (line numbers, leading whitespace) still aligns via `tnum`. If this ever becomes a real legibility problem, the path back is an explicit ADR plus a new family slot — not a silent reintroduction.
- **Editorial loses its serif voice.** Satoshi at editorial scale is a different aesthetic. This is a deliberate brand shift; if the editorial surface ever needs a true serif, raise a new ADR.
- **Plan B Inter is gone.** No CSS-attribute escape hatch for hostile rendering. The path back is a new ADR — slower and more deliberate, which is the point.
- **External consumers may break.** Anyone outside this repo binding to `font.family.{mono,serif,alt-sans}` from a Style Dictionary build output will see undefined CSS variables. CHANGELOG calls this out.

### Tradeoffs not chosen

- **Did not keep a redirected `font.family.mono` token pointing at Satoshi.** Considered; rejected. A token named "mono" that resolves to Satoshi creates the impression that mono is still a thing in the system. Future authors would add new presets referencing it. Single primitive `font.family.sans` is the cleanest model.
- **Did not delete the `.lumen-mono*` and `.text-data-*` class names.** Considered; rejected. The class names already exist across consumer code; renaming them all to `.text-tabular-*` would churn every consumer for marginal naming-aesthetic gain. The classes signal a feature-flag bundle now; that's documented in this ADR.
- **Did not introduce a true monospaced numerics-only face.** Lumen's numerics are operator-readable at 14–16 px in tables, and at 31–61 px in KPI stacks; Satoshi's `tnum` table aligns both. A separate face would resurrect the 4-family complexity we are explicitly retiring.
- **Did not add an `opsz` axis story for Satoshi.** Satoshi's current variable axis is `wght` only. A future Satoshi build with `opsz` could improve small-text rendering at 12–14 px; we'll wire it through if/when it ships.

## Verification

### Required before merge

- [x] **`pnpm lint:no-arbitrary-typography`** — exits 0 ("No arbitrary-value typography. ✓") with the v0.10 allowlist (`--font-sans` only).
- [x] **Component contracts validate** — `ajv validate -s _schema/component.schema.json -d 'design-system/02-components/*/component.json'` passes for every component after the v0.10 token-consumption changes (Stat + RateTicker swap to `font.family.sans`; Input adds the v0.10 changelog entry).
- [x] **`audit-dashboard` `next build`** — TypeScript clean, all 12 static pages prerender (`/`, `/foundations`, `/landing`, `/library`, `/desktop`, `/ecommerce`, `/mobile`, `/saas`, `/tool`, `/_not-found`).
- [x] **Source clean** — no live `var(--font-mono)`, `var(--font-serif)`, `var(--font-alt-sans)`, or `var(--font-jetbrains)` references in `audit-dashboard/src/` or design-system component examples; remaining mentions are intentional retirement narrative.

### Pre-existing build state (not caused by, not blocked by, this change)

- **Style Dictionary `pnpm build`** fails with a circular reference between `color.action.primary.glow` and `shadow.accent-glow` (the `shadow.accent-glow` token aliases itself in `01-tokens/semantic/shadow.tokens.json:72`). Verified by stashing v0.10 changes and re-running on the v0.9 HEAD — the cycle predates this work. v0.10's source DTCG JSON correctly reflects the single-typeface system; the cycle blocks artifact emission for everyone, regardless of typography state. Track and fix in a separate change; do not bundle here.
- **`pnpm lint` (full suite)** exits non-zero with 20 pre-existing hardcoded-pixel + hardcoded-hex-color violations across `audit-dashboard/src/components/primitives/{feedback,inputs,mobile,motion-demo,nav,progress,rate-ticker,stat,swatch,templates}.tsx`. Verified pre-existing. Out of scope for v0.10.

### Open

- ⏳ **`pnpm cls`** against the deployed Vercel URL — re-verify Lighthouse cold-load CLS stays ≤ 0.05 with the JetBrains Mono codepath gone (the metric-aligned `Satoshi-Fallback` is unchanged so this should be a no-op, but verify).
- ⏳ **Visual regression on `/foundations` typography section** — TypeRow demos still work; the numerics + pairings panels read correctly under Satoshi.
- ⏳ **Editorial QA on `/blog`/`/changelog`/`/press`** — confirm Satoshi at 18 px / 1.65 leading / 65 ch reads as deliberate editorial rather than "the serif fell off."

## License action item (carry-over from ADR 0006)

Have legal pull the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build. v0.10 makes this the only license to track.

## References

- [`design-system/00-foundations/typography.md`](../../design-system/00-foundations/typography.md) — canonical guide (rewritten for v0.10)
- [`design-system/01-tokens/primitives/typography.tokens.json`](../../design-system/01-tokens/primitives/typography.tokens.json) — collapsed `font.family` to `sans` only
- [`design-system/01-tokens/semantic/type.tokens.json`](../../design-system/01-tokens/semantic/type.tokens.json) — every preset resolves to `{font.family.sans}`
- [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) — implementation
- [`audit-dashboard/src/app/layout.tsx`](../../audit-dashboard/src/app/layout.tsx) — JetBrains Mono import removed
- [`scripts/lint-no-arbitrary-typography.mjs`](../../scripts/lint-no-arbitrary-typography.mjs) — allowlist restricted to `--font-sans`
- [ADR 0006 — Satoshi + JetBrains Mono pairing](./0006-satoshi-jetbrains-pairing.md) — superseded
- [ADR 0010 — Typography v0.5 system upgrade](./0010-typography-v05.md) — family decisions amended
