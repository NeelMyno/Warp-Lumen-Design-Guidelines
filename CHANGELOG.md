# Changelog

All notable changes to **Lumen** (Warp's design system) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [ADR 0009](./_meta/decisions/0009-versioning-semver-system-wide.md) for the versioning policy.

## [Unreleased]

_Nothing yet. Open a PR with an entry under one of: Added, Changed, Deprecated, Removed, Fixed, Security._

---

## [0.11.1] — 2026-05-04 — Audit-dashboard rendering sweep · v0.11 cleanup

User feedback after v0.11.0 deployed: status pills, primary buttons, and tier badges across the audit dashboard rendered with washed/illegible text on accent surfaces, plus the brand chip still showed `v0.5` and the mood label still said `obsidian-lime`. v0.11.0 retuned tokens but didn't sweep the audit-dashboard's component code or the user-facing version labels. v0.11.1 closes those gaps.

### Fixed

- **Brand chip drift.** `dashboard-shell.tsx` showed `v0.5` (3 places) and `obsidian-lime` in the footer; updated to `v0.11`, `v0.11.0 · audit preview`, and `obsidian-mint`.
- **Mono-cap version labels.** `foundations/page.tsx` had `SYSTEM V0.4 LIVE` / `SYSTEM V0.4 · LIVE` (3 places); updated to `SYSTEM V0.11 LIVE` / `SYSTEM V0.11 · LIVE`.
- **`v0.4 · beta` / `v0.4` badges.** `tool/page.tsx` had two `<Badge status="neutral">v0.4…</Badge>` instances; bumped to `v0.11`.
- **Library page version meta.** `library/client.tsx` `v0.4.0 · 25 sections · 250+ components` and `End of library — last refreshed v0.4.0` → `v0.11.0`.
- **Landing hero version line.** `landing/page.tsx` `system v0.4 live` → `system v0.11 live` in the brutalist hero eyebrow.
- **Layout metadata description.** `app/layout.tsx` "v0.4 Obsidian Lime" → "v0.11 Premium Psychology · Obsidian Mint". `data-mood="obsidian-lime"` → `data-mood="obsidian-mint"`.
- **Mood definitions.** `lib/moods.ts` MoodId, MOODS array, and labels updated from `obsidian-lime` to `obsidian-mint`. Default mood in `mood-switcher.tsx` updated to match.
- **Foundations descriptions.** Color-section, radius-section, hero-section, signature-primitives section descriptions all rewritten to reflect Spring Green / Obsidian Mint framing instead of the v0.4 lime / cream framing. The "Accent · Warp lime" SubSection title is now "Accent · Spring Green".
- **Stale rgba in `globals.css` status bgs (dark mode):**
  - `--status-success-bg: rgba(22, 163, 74, 0.16)` (old lime RGB) → `rgba(0, 250, 138, 0.16)` (spring green at 16%).
  - `--status-warning-bg: rgba(173, 108, 8, 0.18)` (old amber RGB) → `rgba(245, 177, 24, 0.16)` (refined amber at 16%).
  - `--status-danger-bg: rgba(183, 29, 42, 0.18)` (old danger.700 RGB) → `rgba(229, 72, 77, 0.16)` (refined danger.500 at 16%).
- **Hardcoded `#ecfdf3` (old success-50) replaced with `var(--lumen-accent-0)`** in three places:
  - `display.tsx` Trend up-state bg.
  - `display.tsx` TAG_TONE.success bg.
  - `feedback.tsx` ALERT_STYLES.success bg.
- **Comment on the Lumen brand mark** (`dashboard-shell.tsx`) updated implicitly via the obsidian-mint footer label.

### Changed

- **`components/ui/badge.tsx`** — extended from 4 → 8 variants. Added `success` (lime tonal), `warning` (amber tonal), `info` (cool-neutral tonal), `accent-soft` (mid-tint accent for in-table status pills). The `destructive` variant deepened from `--lumen-red-5` to `--lumen-red-7` (`#931620`) so white-on-red clears AA Normal at 10.9:1 — same fix as the danger button per ADR 0016.
- **Foundations source-comment annotation** — landing-page hero comment updated to reference `first-impression.md` and the 50ms halo contract (cosmetic; no behavior change).

### Verification

- All status pill / badge tonal pairs verified for v0.11:
  - accent: `#00633A` on `#B7FFD9` ≈ 5.9:1 — AA Normal
  - success: `#00633A` on `#E2FFF1` ≈ 6.4:1 — AA Normal
  - warning: `#7A5408` on `#FFF8E5` ≈ 9.2:1 — AAA
  - danger: `#931620` on `#FDECEB` ≈ 9.6:1 — AAA
  - info: `#383A39` on `#FAFAFA` ≈ 12.0:1 — AAA
  - destructive (filled): `#FFFFFF` on `#931620` ≈ 10.9:1 — AAA
- Wide grep confirms zero remaining user-facing `v0.4` / `v0.5` / `Warp lime` / `obsidian-lime` references; only historical CSS / TSX header comments retain those (intentional record).
- `.lumen-btn-primary` cascade verified intact: `var(--color-action-primary-bg-rest)` → `var(--lumen-accent-4)` = `#00FA8A`; `var(--color-action-primary-fg)` → `var(--lumen-accent-fg)` = `#07120D` (14.7:1 AAA).

---

## [0.11.0] — 2026-05-04 — Premium Psychology · Obsidian Mint recolor · seven principles

User brief (2026-05-04, condensed):

> "I have finalized a few colors for the brand: Accent #00FA8A, Dark #171A18, Light #E6E6E6. You can use these to create other shades. Font remains Satoshi. Pay extra attention to element spacing, white spacing, minimalism, UI cleanliness — basically whatever is in the Psychology of Premium Websites transcript. You have complete independence to change anything. Iterate boldly."

The Premium-Psychology brief synthesizes Thorndike's halo effect (1920) + Lindgaard et al. (2006) on 50ms visual judgment + Reber/Schwarz/Winkielman (2004) on cognitive fluency + Kahneman's peak-end rule + the canonical Linear/Stripe/Apple "aggressive hierarchy" pattern + the "restraint as confidence" rule from luxury design (Hermès, Aesop, Bottega Veneta). v0.11 encodes these as first-class principles — the recolor is the visible half; the foundations rewrite is the structural half. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md).

### Added

- **Three new foundations** (operationalize the new principles):
  - **[`design-system/00-foundations/hierarchy.md`](design-system/00-foundations/hierarchy.md)** — Aggressive hierarchy. Three-tier rule (primary / secondary / tertiary), 1.5–2× weight rule, visual-weight calculator, per-surface patterns (hero, KPI, card, section header, pricing tier, operator dashboard), single-focal-point checklist.
  - **[`design-system/00-foundations/first-impression.md`](design-system/00-foundations/first-impression.md)** — The 50ms contract. Three questions (what / who / why), three checks (branded chrome on first paint, single focal point, no layout shift), three canonical hero patterns (type-led, product-led, stat-led), above-the-fold rules, skeleton + empty-state first impressions, the cold-load technical contract, the halo-audit checklist.
  - **[`design-system/00-foundations/micro-interactions.md`](design-system/00-foundations/micro-interactions.md)** — Peak-end rule. The standard responses catalog (button, input, card, toggle, tab, modal/drawer/popover, toast, scroll fade-in, page transition, LiveDot), the reduced-motion contract, the "approximate" anti-pattern, the peak audit.
- **[ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md)** — full rationale for the v0.11 shift. Amends ADR 0004 (mood) and ADR 0005 (single accent — hue only, discipline preserved).
- **`color.alpha.accent.08` and `color.alpha.accent.16`** — added to round out the alpha ladder (08 for whisper-tint hovers, 16 for slightly stronger surface tints).
- **`color.brand.950`** primitive — the deepest void step (`#060807`). Replaces the v0.10 11-step `--lumen-obsidian-10`.
- **`color.alpha.ink.84`** — heavy ink scrim for high-contrast moments (e.g. modal backdrops on light mode where `.40` reads too quiet).
- **`--lumen-neutral-N` aliases** (CSS) — semantic alternative to `--lumen-cream-N` for new code. Same underlying values; the brand is no longer warm so the new name is more honest.
- **`--lumen-accent-aN` aliases** (CSS) — re-exposed at 08/14/24/32/40/64 stops. Same as `--lumen-lime-aN` (preserved for backwards-compat); both resolve to the same spring-green RGB.
- Glossary additions: *halo effect*, *cognitive fluency*, *peak-end rule*, *aggressive hierarchy*, *the four-color floor*, *the 50ms contract*, *the peak audit*, *Spring Green*, *Obsidian Mint*.

### Changed

- **The accent**. Brand canonical shifted from Warp lime `#4ade80` → Spring Green `#00FA8A`. The single-accent rule (ADR 0005) is preserved verbatim — only the hue changed. All lime-RGB rgba values across `globals.css` re-anchored to (0, 250, 138):
  - `--shadow-button-glow-{rest,hover,active}` — RGB shifted, opacities preserved (0.25 / 0.40 / 0.20).
  - `--shadow-button-ai-shimmer` — RGB shifted, opacity preserved (0.32).
  - `--lumen-lime-a{08,14,24,32,40,64}` — RGB shifted (var name preserved for back-compat).
  - `@keyframes lumen-btn-ai-shimmer` — RGB shifted.
  - The accent-glow recipe `0 14px 34px rgba(accent, 0.24)` reads with the same atmospheric weight on the new hue.
- **The dark canvas**. `color.surface.page` (dark) shifted from obsidian `#0a0a0d` → obsidian-mint `#171A18` (the user-fixed brand dark). Faint green undertone (G channel +2 over R, +1 over B) reads cohesive against the spring-green accent without competing. Raised surface `#21241F`, sunken `#0E110F`, popover `#2E3230` retuned to match.
- **The light canvas**. `color.surface.page` (light) shifted from cream paper `#fdfcf7` → cool paper `#FAFAFA`. The brand is no longer warm; the system is cool-neutral with a faint warm-mint awareness so all surfaces harmonize against the spring-green accent.
- **Primary text on dark**. Shifted from off-white `#f5f5f3` → user-fixed light `#E6E6E6`. Pure white on dark canvas reads harsh and fatigues the eye on long-scroll pages; the user-fixed light value is calmer and more readable. Contrast 13.7:1 — AAA. Documented in [`color.md`](design-system/00-foundations/color.md) §3.
- **`color.accent.fg`** — retuned from `#0a0a0d` → `#07120D` for 14.7:1 AAA on the new spring-green accent.
- **Status palette refined**:
  - `status.danger.500` `#ef4444` → `#E5484D` (8% desat — feels less alert, more considered).
  - `status.warning.500` `#f59e0b` → `#F5B118` (slightly more golden, slightly less saturated).
  - `status.danger.{600,700,800}` retuned for AA contrast under the new red.
  - `--shadow-input-error` rgba re-anchored from `(239,68,68)` → `(229,72,77)`.
  - `--color-action-danger-soft-bg-{hover,press}` re-anchored from `(201,38,38)` → `(229,72,77)`.
- **`color.text.{error,warning}` (dark)** — retuned to harmonize with the new canvas: error `#F8A8AA` (was `#f48a86`), warning `#F5DEA3` (was `#f3d8a4`).
- **`color.alpha.ink.*`** — re-anchored from `(10,10,13)` → `(23,26,24)` to match the new obsidian-mint canvas. Visually subtle change but keeps all ink overlays harmonized to the new brand dark.
- **`color.surface.glass`** (dark) — re-anchored from `rgba(20,20,26,0.62)` → `rgba(33,36,31,0.62)` to match the new raised surface.
- **`principles.md`** — rewritten. Grew from 5 to 7 principles. New: principle 1 (Engineer the first impression), principle 2 (Lead the eye — one focal point per section), principle 4 (Cognitive fluency over decoration). Reframed: principle 5 (Care is total — peak moments, end moments, every state). Retired: "Density is dense, not airy" (reabsorbed into principles 3 + 4; marketing-vs-operator surface split now lives explicitly in `spacing.md` §3).
- **`color.md`** — rewritten. Opens with the four-color floor (accent / dark / soft light / paper). Documents the obsidian-mint and neutral-grayscale ramps. Retains the parallel-modes rule and the single-accent discipline.
- **`spacing.md`** — header note added clarifying that the v0.1 "density is dense" principle was reabsorbed into 3 + 4. The marketing-vs-operator section split is mandatory, not optional.
- **`motion-language.md`** — added principle 6 ("Spend on peaks, save on decoration") and cross-references to `micro-interactions.md`.
- **`typography.md`** — header note + cross-refs aligning with the new principles. Single-typeface discipline (Satoshi alone) is now framed as serving principle 3 directly — premium reads as confidence, confidence reads as restraint.
- **`button/component.json`** — accent.fg description updated; v0.11 changelog entry added.
- **`AGENTS.md`** hard rule #7 (single accent) and #9 (white-on-accent forbidden) — values updated to spring green / `#07120D`. Hard rule itself unchanged.
- **`CLAUDE.md`** — new cross-cutting concern bullets pointing at hierarchy.md, first-impression.md, micro-interactions.md.
- **`README.md`** — visual-mood summary box updated for v0.11. Open questions list re-pruned post-v0.11.
- **`llms.txt`** + **`llms-full.txt`** — v0.11 brand summary, new foundations, principles list updated 5 → 7, single-accent rule rephrased to spring green.
- **`accessibility.md`** §"Primary action contrast" — accent values updated.
- **`audit-dashboard/src/components/primitives/inputs.tsx`** ColorPicker default swatches — first three colors updated to the new brand ramp; misc swatch refresh.
- **`audit-dashboard/src/app/library/client.tsx`** ColorPicker demo state — `#4ade80` → `#00FA8A`.

### Deprecated

- **`color.warm.*` (primitive)** — replaced by `color.neutral.*`. The `color.warm.*` paths remain as backwards-compat aliases resolving through to `color.neutral.*` until v1.0. The brand is no longer warm; the system ships cool-neutral with a faint warm-mint awareness.
- **The terminology "Warp lime green" / "Warp green"** — replaced by "Spring Green" or just "the accent" in all new copy. The old terminology is preserved in historical ADRs (0004, 0005) as the record of when the discipline was adopted.

### Verification

- Contrast pairs verified for v0.11 — all ≥ 4.5:1 AA Normal; most clear AAA. See [ADR 0018 § Verification](_meta/decisions/0018-premium-psychology-recolor.md#verification).
- Token files validated via `grep` for broken `{…}` references (none).
- Audit-dashboard visual sweep pending — flagged as v0.11.1 cleanup.

---

## [0.10.3] — 2026-05-03 — Mockup typography rebuild · semantic presets, no more lint bypasses

User feedback on `/mobile`: "looks awful, so it Dashboard and all the other mockups. Improve them. Stick to the design system and focus on the typography. Right now the line height and other nuances are all messed up." The mockups had drifted into ~30 raw `text-[var(--type-N)]` arbitrary-value chains, each annotated with a `lumen-lint-allow: typography` directive. The directives were a tell: every "no semantic preset for this size" comment was the system being asked to do something the system explicitly disallows (11 px outside kbd/overline, 15 px between body-sm and body-md, 18 px semibold for app bar titles). Plus `leading-tight` (1.05, display tier) was being applied to body-tier list rows, cramping line rhythm where snug-body (1.30) belongs.

### Changed

- **`audit-dashboard/src/app/mobile/page.tsx`** — full rewrite of both iOS and Android frames.
  - iOS status bar / 5G chip: `text-heading-h6` + `text-[var(--type-12)]` → `text-label-sm lumen-tnum` + `text-micro lumen-mono lumen-tnum` (consistent 13/12 tier across the row instead of 13/12 mismatch).
  - iOS large title block: gives the `Today` eyebrow a 6 px gap to the 31 px Bold `Shipments` so the heading-h1 leading (`compact` 1.16) reads correctly.
  - Stat cards: bumped from `size="xs"` (20 px value) to `size="sm"` (25 px value) so the 360 px-wide phone frame doesn't underweight the metrics.
  - List rows: lane title was `text-heading-h5 leading-tight` (15 px Semibold at 1.05 — display-tier leading on body content). Now `text-label-md` (14 Medium with snug-body 1.30) — Apple HIG list-row weight + correct body leading. WRP-id below: `text-[var(--type-11)] mono` → `lumen-mono text-micro` (12 Medium tabular). Avatar bumped from `xs` to `sm` for matching presence.
  - Tab labels: `text-[var(--type-11)]` → `text-micro` (12 Medium). One step up from iOS HIG's 10–11 pt, deliberately, to honor Lumen's 12 px UI floor.
  - Android top app bar title: `text-[var(--type-18)] font-semibold` → `text-heading-h3` (20 Semibold) — closer to M3 Title Large's 22 sp.
  - Android FAB-style button: explicit `text-label-md` (14 Medium) instead of inheriting an unsized weight-only override.
  - Android list rows: same lane-title fix (`text-[var(--type-15)] leading-tight` → `text-label-md`); WRP-id meta `text-[var(--type-11)] mono` → `lumen-mono text-micro`. Truncate added so longer ETAs don't break layout.
  - All decorative icons size-bumped (Search/Bell from 18 → 20) for app-bar density parity.
- **`audit-dashboard/src/app/saas/page.tsx`** — top bar `<h1>` `text-[var(--type-18)] font-semibold` → `text-heading-h3` (20 Semibold). Sidebar workspace switcher avatar mark `text-[var(--type-13)]` → `text-label-sm`; "Workspace" caption `text-[var(--type-11)]` → `text-micro`. Nav item count badges, status footer (v2.18.4 · 12 ms p50), pagination meta, ProgressRing meta lines: every `text-[var(--type-11)]` and `text-[var(--type-12)]` → `text-micro`. Side-panel delta value `text-[var(--type-15)] mono semibold` → `text-data-md font-semibold` (uses the actual data semantic preset, 16 px tnum).
- **`audit-dashboard/src/app/tool/page.tsx`** — Quote Builder header app icon mark + title (`text-[var(--type-11)] mono bold` + `text-[var(--type-14)] font-semibold`) → `text-micro mono bold` + `text-heading-h6` (13 Semibold). Best-value carrier name + lane meta + per-row carrier metadata: bumped from arbitrary 11/14 to `text-heading-h6` + `text-micro`. Per-row price `text-[var(--type-15)] mono semibold` → `text-data-md font-semibold`. Auto-save status, progress meta, footer kbd bar all unified at `text-micro`.
- **`audit-dashboard/src/app/landing/page.tsx`** — CLI prompt mock `text-[var(--type-13)] mono` → `text-body-xs mono` (semantic preset). Trust-row wordmarks `text-[var(--type-18)] font-bold` → `text-body-lg font-bold` (uses the body-lg 18 px size token while keeping the bold override for the wordmark feel). FAQ answer `text-[var(--type-15)] leading-snug` → `text-body-md` (16, comfortable). Feature card copy: same. Browser-chrome URL bar `text-[var(--type-12)]` → `text-micro`.
- **`audit-dashboard/src/app/desktop/page.tsx`** — both macOS and Windows frames. Sidebar nav badges, vertion/latency footer, search-bar placeholder, list-row plain text: all `text-[var(--type-11/12)]` → `text-micro` or `text-body-xs` depending on tier. macOS title-bar `<h2>` `text-[var(--type-14)] font-semibold` → `text-heading-h6` (13 Semibold). Windows content header `<h2>` `text-[var(--type-16)] font-semibold` → `text-heading-h4` (17 Semibold). Activity rows: `text-[var(--type-12)] + text-[var(--type-11)] mono` → `text-body-xs + lumen-mono text-micro`.
- **`audit-dashboard/src/app/ecommerce/page.tsx`** — brand wordmark `text-[var(--type-18)] font-bold` → `text-body-lg font-bold`. Buy panel price `text-[var(--type-25)] mono semibold` → `text-heading-h2 mono` (uses the actual h2 preset's weight + tracking + leading). Strikethrough comparison price → `text-body-md mono`. Product description, Materials & care / Shipping & returns summaries: dropped `text-[var(--type-15)]` for `text-body-md` / `text-label-lg`. Review author `text-[var(--type-12)] mono` → `lumen-mono text-micro`. "/5 · 184 reviews" + related-card price → `text-body-xs mono`. Announcement bar + size-guide link + rating bar percentages → `text-micro`.

### Removed

- **24+ `lumen-lint-allow: typography` bypass directives** across the six mockup pages. Each was a workaround for "I want to use a size or weight the system doesn't have a preset for" — now resolved by either nudging to the closest preset (most cases) or by accepting a one-step size adjustment (11 px nav badges → 12 px micro, 15 px body density → 16 px body-md, etc.). One legitimate directive remains in `landing/page.tsx` for the brutalist italic-word-per-hero accent override on the display headline; that is the documented brand pattern.

### Why the small bumps

Lumen's typography contract (ADR 0010, foundations/typography.md § 2) declares 12 px as the UI floor. The pre-v0.10.3 mockups violated that floor in 18 places (every nav badge, mobile tab label, status footer, activity timestamp). The v0.10.3 sweep raises those to 12 px (`text-micro`) — one notch up from iOS HIG's 10–11 pt and Material 3's 11 sp Label Small, but in line with what Lumen's own typography.md actually prescribes. The result reads slightly more breathable on a phone or sidebar, with no loss of "instrument-panel" density because the surrounding leading + tracking are tuned for it.

### Verification

- ✅ `audit-dashboard` `next build` — TypeScript clean, 12 static pages prerender.
- ✅ `grep -rn 'text-\[var(--type-' audit-dashboard/src/app/{mobile,saas,tool,landing,desktop,ecommerce}` → 0 hits.
- ✅ `grep -rn 'lumen-lint-allow' audit-dashboard/src/app/{mobile,saas,tool,landing,desktop,ecommerce}` → 1 hit (landing italic-accent display override; intentional).

---

## [0.10.2] — 2026-05-03 — Lucide is the only icon system

User directive: **"Replace all the icons and use Lucide icons, everywhere in the design system."** Most of the audit-dashboard already used Lucide via the central `@/components/primitives/icon` wrapper (`primitives/icon.tsx` re-exports 18 lucide-react icons with a Lumen-consistent `strokeWidth={1.5}` + `aria-hidden` defaulting). v0.10.2 retires every hand-rolled inline-SVG icon that hadn't yet migrated and pins lucide-react as the only icon source.

### Changed

- **`audit-dashboard` UI affordance icons → Lucide.** Hand-rolled inline SVGs replaced with their lucide-react equivalents:
  - [`components/theme-toggle.tsx`](audit-dashboard/src/components/theme-toggle.tsx) — `SunIcon` / `MoonIcon` → `Sun` / `Moon`.
  - [`components/primitives/templates.tsx`](audit-dashboard/src/components/primitives/templates.tsx) — `KeyIcon` (Passkey button) → `Key`; the inline wrench SVG inside `MaintenanceCard` → `Wrench`.
  - [`components/primitives/mobile.tsx`](audit-dashboard/src/components/primitives/mobile.tsx) — phone status-bar icons (`SignalIcon`, `WifiIcon`, `BatteryIcon`) → `SignalHigh`, `Wifi`, `BatteryFull`. The pull-to-refresh spinner → `Loader2` with `animate-spin`. Face ID prompt's `FaceIcon` → `ScanFace`.
  - [`components/primitives/inputs.tsx`](audit-dashboard/src/components/primitives/inputs.tsx) — `CalendarSm` → `Calendar`.
  - [`components/primitives/display.tsx`](audit-dashboard/src/components/primitives/display.tsx) — `FolderIcon` / `FileIcon` (file-tree leaves) → `Folder` / `File`. `Stars` rating SVG → `Star` from lucide-react with binary fill/stroke driven by `value`.
  - [`components/primitives/spinner.tsx`](audit-dashboard/src/components/primitives/spinner.tsx) — the dual-arc spinner → `Loader2` (preserves `lumen-spinner` className + 0.9 s animation duration so the rest of the system that styles by class continues to work).
  - [`components/primitives/ai.tsx`](audit-dashboard/src/components/primitives/ai.tsx) — the local `Sparkles` SVG → `Sparkles` from lucide-react (consumed by `AIBadge` and `AIThinking`).
  - [`app/library/client.tsx`](audit-dashboard/src/app/library/client.tsx) — `UploadRow` file SVG → `FileText`.
  - [`app/landing/page.tsx`](audit-dashboard/src/app/landing/page.tsx) — the `●` unicode "live" indicator inside the URL-bar mock → `Dot` (icon-shaped, color-bound to `--text-accent`).
- **Design-system component examples → Lucide.** The example `.tsx` files that ship to consumers via the shadcn registry now reference `lucide-react` directly instead of inlining icon paths:
  - [`02-components/split-button/examples/primary.tsx`](design-system/02-components/split-button/examples/primary.tsx) — `ChevronDown` SVG → `ChevronDown`.
  - [`02-components/toast/examples/primary.tsx`](design-system/02-components/toast/examples/primary.tsx) — `StatusIcon` (success / warning / danger / info / neutral) → `Check`, `AlertCircle`, `Info`. `CloseIcon` → `X`.
  - [`02-components/command-palette-button/examples/primary.tsx`](design-system/02-components/command-palette-button/examples/primary.tsx) — `SearchIcon` SVG → `Search`.
  - [`02-components/button/examples/primary.tsx`](design-system/02-components/button/examples/primary.tsx) — `Spinner` SVG → `Loader2`.

### Kept (intentionally not migrated)

- **Brand logos** stay as inline SVG with their original brand colors: Google G + Microsoft 4-square ([templates.tsx](audit-dashboard/src/components/primitives/templates.tsx)) and Apple ([commerce.tsx](audit-dashboard/src/components/primitives/commerce.tsx)). Lucide does not ship brand marks, and the brand colors must stay literal — these are not UI icons.
- **Data-driven SVG geometry** stays as inline SVG: `charts.tsx` (line / area / donut / bar charts), `stat.tsx` sparklines, `progress.tsx` circular progress, `display.tsx` semicircle gauge, `app/ecommerce/page.tsx` partial-fill rating stars (linearGradient stop offsets driven by `value`). These are charts, not icons — Lucide cannot represent them.
- **Decorative empty-state illustrations** stay as inline SVG: `templates.tsx`'s `NoDataIllustration`, `display.tsx`'s `DefaultEmpty`, and `02-components/empty-state/examples/primary.tsx`'s `DefaultIcon`. These are stylized placeholders, not icons.
- **`primitives/icon.tsx` central wrapper** is unchanged — its 18 wrapped exports (`ArrowRight`, `Check`, `Plus`, `Minus`, `Search`, `Truck`, `MapPin`, `Box`, `Settings`, `Bell`, `Home`, `Filter`, `ChevronDown`, `Cart`, `User`, `X`, `Inbox`, `Code`) all already source from lucide-react. Files that need an icon outside that 18 import from `lucide-react` directly per the wrapper's own guidance.

### Verification

- ✅ `audit-dashboard` `next build` — TypeScript clean, all 12 static pages prerender.
- ✅ `grep -rn '<svg' audit-dashboard/src design-system/02-components` returns only the intentional keeps above (brand logos, charts, decorative illustrations).
- ✅ Every replacement uses Lumen-consistent props: `strokeWidth={1.5}` (matching the wrapper's default) or `2` for status-bar/keyboard-affordance density, `aria-hidden focusable={false}` on every decorative icon.

---

## [0.10.1] — 2026-05-03 — Card slot alignment fix

User reported visual misalignment in `/foundations` § Card variants — title and bare-`<p>` body text inside the same `<Card>` rendered at different x positions, with the body paragraph appearing 24 px further left than the `<CardHeader>` title and description. The same offset showed up everywhere a Card mixed a `<CardHeader />` with bare body content (the pattern is repeated 25 times across `/foundations` and `/library`).

### Fixed

- **`audit-dashboard/src/components/primitives/card.tsx`** — Lumen's `Card` wrapper was adding `p-N` to the outer card AND `[&_[data-slot=card-{header,content,footer}]]:px-N` in lockstep on the slot wrappers. The descendant-variant CSS specificity (`:where(parent) [data-slot=card-header]:where(.px-N)`) outranked the inner slot's own `px-0`, so slot content sat inset by `p-N + px-N` while bare-`<p>` siblings sat at only `p-N`. Two sources of inline padding for one container is one source too many.

  Fix: outer `Card` keeps `p-N` as the single source of inline padding; slot descendant variants now zero out (`[&_[data-slot=card-header]]:px-0` etc.). Slots and bare children both inset to the same x = `p-N` from the card edge.

  Codified in a `SLOT_PX_ZERO` constant + a doc-comment explicitly naming the alignment contract: "outer Card owns inline padding via `p-N`; slots are zeroed; don't reintroduce slot px without removing `p-N` from the same row." Cascades to every consumer — `/foundations` Card variants, the 25 `<CardHeader />` instances across `/foundations` (Buttons, Form fields, Switches, Sliders, Avatars, Skeletons, Spinners, Tabs, etc.), and the 49 `<Card padding=…>` usages spanning `/landing`, `/saas`, `/tool`, `/ecommerce`, `/mobile`, `/library`.

### Verification

- ✅ `audit-dashboard` `next build` — TypeScript clean, all 12 static pages prerender.
- ✅ Single point of fix: only `card.tsx` changes; no consumer needs to update markup.
- ✅ Defensive `px-0` on Lumen `CardHeader`'s inner div is preserved as belt-and-braces — protects if the primitive is ever used inside a non-Lumen Card wrapper.

---

## [0.10.0] — 2026-05-03 — Satoshi-only typography · single-typeface system

User directive: **"I only want Satoshi as the font in the dashboard and in the design system."** v0.10 collapses Lumen to a single typeface. Through v0.9 the system shipped four families — Satoshi (UI/display), JetBrains Mono (numerics/code), Source Serif 4 (editorial), and Plan-B Inter (hostile-rendering swap). Each had a defensible job, but four families is one more discipline than the brutalist-leaning aesthetic actually wanted, and the JetBrains Mono codepath alone added ~40 KB to every page. v0.10 retires the mono, serif, and alt-sans slots; numeric, code, editorial, and metric moments now ride Satoshi separated by weight, size, tracking, and OpenType feature flags (`tnum`, `lnum`, `zero`, `calt`, `liga`, `ss01–ss04`, `case`, `pnum`).

See [ADR 0017](./_meta/decisions/0017-satoshi-only-typography-v010.md) for the decision, the verification work against Satoshi's GSUB inventory, and the migration path. [ADR 0006](./_meta/decisions/0006-satoshi-jetbrains-pairing.md) is now superseded; [ADR 0010](./_meta/decisions/0010-typography-v05.md) (the v0.5 scale + curves + presets + italic policy + modern-CSS techniques) stays in force, partially amended.

### Changed

- **Single primitive `font.family.sans`** — `design-system/01-tokens/primitives/typography.tokens.json` collapses the `font.family` group to one entry: Satoshi Variable + the metric-aligned `Satoshi-Fallback` Arial alias for zero-CLS swap. Every semantic preset's `fontFamily` now resolves to `{font.family.sans}`.
- **Semantic preset family slots redirect to Satoshi** — `design-system/01-tokens/semantic/type.tokens.json` — every preset that previously bound `{font.family.mono}` (`eyebrow.mono`, `kbd`, `data.{lg,md,sm}`, `metric.{xl,lg,md,sm}`, `code.{inline,block,terminal}`) or `{font.family.serif}` (`prose.{body,lead,title,subtitle}`) now resolves to `{font.family.sans}`. Class names and preset names preserved for component-API stability; they signal a feature-flag bundle (calt/liga/tnum/lnum/zero/case/pnum) rather than a separate family.
- **`audit-dashboard/src/app/layout.tsx`** — `JetBrains_Mono` import from `next/font/google` removed; the `${jetbrains.variable}` className gone from the `<html>` tag. Only Satoshi Variable + Italic VF self-hosted via `next/font/local` survives.
- **`audit-dashboard/src/app/globals.css`** — root `:root { … }` block now defines only `--font-sans`. The `--font-mono`, `--font-serif`, `--font-alt-sans` CSS variables are removed; the `[data-font="inter"]` Plan-B override block is removed. The Tailwind v4 `@theme` republish drops `--font-mono` (so the `font-mono` utility is no longer emitted). Every `font-family: var(--font-mono)` and `font-family: var(--font-serif)` declaration in the file (~24 occurrences across `.lumen-mono*`, `.lumen-mono-cap`, `.lumen-kbd`, `.lumen-field [data-slot="addon"]`, `.lumen-field[data-mono="true"]`, `.text-eyebrow-mono`, `.text-data-*`, `.text-metric-*`, `.text-code-*`, `.text-prose-*`, `.lumen-cmd-button-kbd`) now targets `var(--font-sans)`. The `.prose-lumen` body switches `onum` (silent no-op against Satoshi) for `pnum` (Satoshi ships proportional figures).
- **SVG chart text** — `audit-dashboard/src/components/primitives/charts.tsx` axis and tick labels now carry `fontFamily="var(--font-sans)" style={{ fontVariantNumeric: "tabular-nums" }}` so they keep column alignment under proportional Satoshi.
- **Design-system component examples** — every `examples/*.tsx` that previously baked `font-[var(--font-mono)]` (Stat, RateTicker, Table, OtpInput, NumberInput, PasswordInput, TimePicker, DatePicker) now relies on `font-variant-numeric` + `font-feature-settings` for tabular alignment without naming a family.
- **Component contracts** — `design-system/02-components/{stat,rate-ticker}/component.json` token-consumption lists swap `font.family.mono` for `font.family.sans` and add a v0.10 changelog entry. `input/component.json` and `field.tsx` update the `mono` prop docstring: it no longer switches typeface, it toggles the OpenType feature stack.
- **Platform READMEs** — `web-react`, `desktop-windows`, `react-native`, `bigcommerce-stencil`, `woo-wordpress` updated to drop JetBrains Mono / `LumenMono` / `$mono-font` / `Mono` font family entries. Web-React performance budget restated as ≤90 KB Satoshi-only.
- **Foundations docs** — `00-foundations/typography.md` rewritten end-to-end for the single-typeface system (sections 1, 6, 9, 10, 12, 13 substantively updated; scale + leading + tracking curves + italic policy + numbers contract unchanged). `00-foundations/forms-and-inputs.md` Plan-B Inter section replaced with "Typography in forms (v0.10)". `00-foundations/spacing.md` `size.reading.narrow` description updated. `01-tokens/README.md` `lumen-mono-cap` row updated to reflect Satoshi carrier + feature flags.
- **Lint** — `scripts/lint-no-arbitrary-typography.mjs` allowlist restricted to `--font-sans` only. Arbitrary references to `--font-mono` / `--font-serif` / `--font-alt-sans` / `--font-jetbrains` in product code now flag.
- **Glossary** — `_meta/glossary.json` JetBrains Mono / Source Serif 4 / Inter / Plan-B Inter entries updated to "Retired by ADR 0017" with feature-flag carrier guidance. ETA description swapped from "tabular monospace" to "tabular numerics (Satoshi tnum + lnum + zero)".

### Removed

- **JetBrains Mono webfont** — no longer loaded via `next/font/google`. ~40 KB saved per page that previously hit the mono codepath.
- **Source Serif 4 references** — no longer wired in `globals.css` or in the primitive token. Editorial routes (`/blog`, `/changelog`, `/press`) now render in Satoshi at editorial scale (18–22 px body, 1.65 leading, 60–65 ch measure).
- **Plan-B Inter `[data-font="inter"]` override** — removed from `globals.css`. The `--font-alt-sans` variable and the Inter primitive token are gone. Future hostile-rendering scenarios require a new ADR rather than a silent CSS-attribute toggle.
- **`--font-jetbrains` CSS variable** — removed (was set by the dropped `next/font/google` import).
- **Tailwind `font-mono` utility** — no longer emitted (the `--font-mono` republish in the `@theme` block is gone). Any consumer that used `<className="font-mono">` should replace with `[font-variant-numeric:tabular-nums_lining-nums]` or reach for a semantic preset like `.lumen-mono` / `.text-data-md` / `.text-metric-md`.
- **`LumenMono` XAML resource** — removed from `03-platforms/desktop-windows/README.md`. Same single-typeface story on Windows.
- **`JetBrainsMono-Regular`** — removed from the `expo-font` `useFonts` example in `03-platforms/react-native/README.md`.

### Deprecated

- **`font.family.mono`, `font.family.serif`, `font.family.alt-sans` token references** — these tokens no longer exist in v0.10; references in external consumer code will resolve to UA defaults. Migration: rebind to `font.family.sans` and add the relevant feature-flag bundle (`tabular-nums lining-nums slashed-zero` for numerics; `calt 0, liga 0, tnum 1, zero 1` for terminal output; `calt 1, liga 1, zero 1` for code prose). Internal consumers (audit-dashboard + design-system component examples) are migrated in this commit.
- **`mono` prop semantics on `<Field>` / `<Input>`** — the prop name persists for API stability but no longer switches typeface. It now toggles the feature-flag stack only. Code that depended on a typeface visual difference between `mono={true}` and `mono={false}` will see only the alignment shift.

### Verification

- ✅ **`pnpm lint:no-arbitrary-typography`** — exits 0 ("No arbitrary-value typography. ✓") with the v0.10 allowlist (`--font-sans` only).
- ✅ **`ajv validate -s _schema/component.schema.json -d 'design-system/02-components/*/component.json'`** — every component contract (Button, Field, Input, Stat, RateTicker, Table, Form, OtpInput, PasswordInput, NumberInput, TimePicker, DatePicker, etc.) validates against the schema after the v0.10 token-consumption changes.
- ✅ **`audit-dashboard` `next build`** — TypeScript clean, all 12 static pages prerender (`/`, `/foundations`, `/landing`, `/library`, `/desktop`, `/ecommerce`, `/mobile`, `/saas`, `/tool`, `/_not-found`).
- ✅ **No live `var(--font-mono)`, `var(--font-serif)`, `var(--font-alt-sans)`, or `var(--font-jetbrains)` references** survive in `audit-dashboard/src/` or in design-system component examples. Remaining mentions are intentional retirement-narrative in foundations docs, ADR 0017, and the CHANGELOG.

### Known issues (pre-existing, out of scope for v0.10)

- **`pnpm build` (Style Dictionary)** fails with a circular reference between `color.action.primary.glow` and `shadow.accent-glow` — the `shadow.accent-glow` token aliases itself in `design-system/01-tokens/semantic/shadow.tokens.json:72`. This break predates v0.10 (introduced in v0.9 button rebuild) and is unrelated to typography. Track separately; v0.10's typography changes are correctly reflected in the source DTCG JSON and will flow through once the cycle is resolved.
- **`pnpm lint`** (full suite) exits non-zero with 20 hardcoded-pixel and hardcoded-hex-color violations across `audit-dashboard/src/components/primitives/{feedback,inputs,mobile,motion-demo,nav,progress,rate-ticker,stat,swatch,templates}.tsx`. Verified pre-existing (present at the v0.9 HEAD with v0.10 changes stashed). Track separately.

### Migration

External consumers binding to retired tokens:

| Was | Now |
|---|---|
| `var(--font-mono)` | `var(--font-sans)` + `font-variant-numeric: tabular-nums lining-nums` |
| `var(--font-serif)` | `var(--font-sans)` + larger size + 1.65 leading for editorial |
| `var(--font-alt-sans)` | `var(--font-sans)` (no fallback wired post-v0.10) |
| `font.family.mono` token reference | `font.family.sans` + feature-flag bundle |
| Tailwind `className="font-mono"` | `[font-variant-numeric:tabular-nums_lining-nums]` or `.lumen-mono` / `.text-data-*` semantic class |
| `html[data-font="inter"]` toggle | Remove. Raise an ADR if a non-Satoshi family is genuinely required. |

Internal app code in `audit-dashboard/src/` is migrated in this release; design-system component examples are migrated; foundations docs and platform READMEs reflect the new state.

---

## [0.9.0] — 2026-05-03 — Button rebuild · 5×8×3 surface · CSS-class implementation

A user-reported visual regression on `<Button intent="primary">` (white text on lime, ~1.66:1 contrast — same defect as v0.8.1) revealed a deeper issue: **the Vercel preview is stuck at v0.5.0**, four versions behind the source. The v0.8.1 fix was correct in source but never deployed. A four-agent investigation surveyed 20+ peer button systems (Material 3 Expressive May 2025, IBM Carbon v11, Atlassian, Polaris, Vercel Geist, Stripe, Apple HIG iOS 26 Liquid Glass, Linear, Notion, GitHub Primer, Tailwind UI, Radix Themes, Anthropic, OpenAI Platform) plus the two SuperDesign references (Glassmorphism / Neon Velocity), audited every button-shaped surface in the repo, and proposed a comprehensive v0.9 rebuild grounded in nine decisions.

See [ADR 0016](./_meta/decisions/0016-button-rebuild-v09.md) for the full audit + rationale and [00-foundations/buttons.md](./design-system/00-foundations/buttons.md) for the canonical reference.

### Added

- **5 explicit size tiers**: xs 24 / sm 32 / md 40 (default) / lg 48 / xl 56 px. Mapped onto `size.control.{xs,sm,md,lg,xl}` semantic tokens (`size.control.xs = 24` is NEW). Mobile primaries floor at lg to clear the 44 px touch target. xs is desktop-density only (table-row inline, chip-close).
- **8 intents (role)** × **5 surfaces (chrome)** as orthogonal axes:
  - **`primary`** — lime fill + obsidian-fg + three-state glow ladder
  - **`secondary`** — raised surface + hairline border (existing v0.4 pattern)
  - **`outline`** — transparent + 1 px ink hairline (Glassmorphism reference's secondary)
  - **`tertiary`** — alias of ghost (kept for backwards compat; deprecated for v1.0)
  - **`ghost`** — no chrome, hover-only feedback
  - **`danger`** — red.600 fill + white text (was red.500 → AA fail; now 5.2:1 AA pass)
  - **`danger-soft`** — Carbon's `danger-ghost` pattern; transparent + ink-red text for tight contexts
  - **`ai`** — tonal lime + sparkle leading icon + idle 1 px shimmer border (paused on hover)
  - **`glass`** — translucent + `backdrop-filter: blur(12px)` for floating overlays
  - **`link`** — inline text-link styled as button
- **3 shapes** orthogonal to size:
  - **`rect`** (default) — `radius.control.md` (~6 px); operator pages
  - **`pill`** — full radius + 50% extra horizontal padding; hero / AI / marketing
  - **`round`** — square + full radius; IconButton / FAB
- **Three-state glow ladder** for `intent="primary"` only:
  - rest: `0 0 16px rgba(lime, 0.25)`
  - hover: `0 0 24px rgba(lime, 0.40)` (Glassmorphism's hover-doubling pattern)
  - active: `0 0 8px rgba(lime, 0.20)` paired with `filter: brightness(0.92)`
  Other intents and surfaces ship zero glow at all states. Single-accent rule preserved.
- **Dual-ring focus indicator** for lime accent surfaces (Atlassian 2024 pattern). Inner 2 px canvas-color separator + outer 4 px lime ring. `shadow.focus.dual.stack` token. Other intents continue with `shadow.focus` (single 3 px lime alpha at 32%). Closes WCAG 2.4.13 against same-color focus rings on brand surfaces.
- **`success` state** (NEW prop, transient): when set, the button shows a checkmark + tonal-lime surface + verb-confirmed label ("Saved", "Booked", "Quoted") for 1.6 s, then auto-clears. Live-region announce. Pairs with React 19's `useOptimistic`.
- **`pressed` state** (NEW prop): renders the lime-tinted selected surface; sets `aria-pressed=true`. For ToggleButton / Segmented option / split-button menu trigger.
- **`shape` prop** (NEW): explicit rect / pill / round on Button. `pill` legacy alias preserved.
- **Five new component contracts** (full md + json + canonical example for each):
  - **IconButton** (`02-components/icon-button/`) — formal primitive with required `aria-label`. Five sizes + rect/round shapes.
  - **ButtonGroup** (`02-components/button-group/`) — joined-button row, `role="group"`, focus-visible z-index lift.
  - **SplitButton** (`02-components/split-button/`) — primary action + dropdown caret with hairline divider, `aria-haspopup="menu"` on trigger, required `menuLabel`.
  - **CommandPaletteButton** (`02-components/command-palette-button/`) — search-styled trigger with platform-aware kbd chip (⌘K on macOS, Ctrl K elsewhere).
  - **FAB** (`02-components/fab/`) — round, fixed-position primary action; required `aria-label`; lg/xl sizes (Material 3 floor 56).
- **`00-foundations/buttons.md`** (NEW canonical doc) — anatomy, sizes, intents, shapes, states, motion, focus, voice, accessibility, implementation pattern.
- **ADR 0016** — durable record of the v0.9 audit + 9-decision rationale.
- **Action-surface CSS bridge** in `globals.css` — `--color-action-{intent}-{bg|fg|border}-{rest|hover|press}` per-state vars for both dark and light themes. The vendor cva button consumes these via direct refs (one var() hop, dev-stable in Tailwind v4).
- **`.lumen-btn-*` defensive class family** in `globals.css` — single-class shorthand for every intent (`primary`, `secondary`, `outline`, `ghost`, `tertiary`, `danger`, `danger-soft`, `ai`, `success`, `selected`, `glass`), every size, every shape. Exposes the v0.9 button system to consumers outside the Button primitive (raw `<a>` CTAs, templated buttons, custom action surfaces).
- **`.lumen-button-group`, `.lumen-split-button`, `.lumen-cmd-button`, `.lumen-icon-button`, `.lumen-fab`** CSS scaffolding for the new composites.
- **Loading vs. disabled — visually distinct** at last. Loading keeps color, swaps icon to spinner, sets `aria-busy=true`. Disabled drops to opacity 0.4. No more "is the button waiting or unavailable?" ambiguity.
- **AI shimmer keyframe** (`@keyframes lumen-btn-ai-shimmer`) — 1 px lime border pulse, 1.6 s ease-in-out, paused on hover/focus, dropped under `prefers-reduced-motion`.
- **Success-checkmark keyframe** (`@keyframes lumen-btn-success-check`) — 240 ms scale-in entrance, holds 1.6 s, exits 80 ms.
- **`prefers-reduced-motion` overrides** — every Button transition zeroed; AI shimmer paused; resting glow stays steady (it's a halo, not motion).
- **`tab-nav` and `bottom-nav` `aria-current="page"`** added in `audit-dashboard/src/components/primitives/nav.tsx`. WCAG-compliant active-state announcement for screen readers.
- **5 new color primitives**: `color.status.danger.600` (`#dc2626`, 5.13:1 white-on-bg), `color.status.danger.700` (`#c92626`, 5.20:1 — used by danger.bg.rest), `color.status.danger.800` (`#a31b1b`, 7.07:1 — danger.hover/press). Plus `color.alpha.{ink,paper}.{04,08,10,16,24}` filling gaps in the alpha ladder needed by orthogonal action surfaces.

### Changed

- **Implementation pattern**: vendor button moved from inline Tailwind utilities (`bg-[var(...)] text-[var(...)] hover:bg-[var(...)] ...`) to **CSS-class composition**. The cva variants now compose `.lumen-btn-{intent}` / `.lumen-btn-{size}` / `.lumen-btn-{shape}` classes declared in `globals.css`. This eliminates Tailwind v4's content-scanner fragility (which v0.8.1 patched per-primitive) and guarantees dev/prod parity for every Button surface. See ADR 0016 § "Why CSS classes."
- **Press feedback dropped `translate-y(1px)`** — replaced with `filter: brightness(0.92)` + glow ladder shrink. Apple HIG / Linear / Vercel / Notion / GitHub all converge on no-transform press for operator UI. Decelerate-not-bounce.
- **Vendor `cva` rename: `variant` → `intent`** in `audit-dashboard/src/components/ui/button.tsx`. Aligns the vendor primitive with the Lumen wrapper API. No external callers used the `variant` name directly (verified by grep), so this is non-breaking in the audit-dashboard.
- **Danger background deepened** `red.500 (#e23b3b, 3.94:1 AA fail)` → `red.600 (#c92626, ~5.2:1 AA pass)`. Hover deepens further to `red.700`. Matches Linear / Stripe / GitHub red-button conventions.
- **`color.action.outline.*` and `color.action.ghost.*`** explicitly named (was implicit alias of secondary/tertiary). The orthogonal `surface` axis is now first-class.
- **Button contract** ([design-system/02-components/button/component.json](design-system/02-components/button/component.json)) — full v0.9 rewrite: 8 intents, 5 sizes, shape prop, success/pressed props, 9 expanded `rules.dont`, full WCAG 2.2 AA enumeration including 1.4.13, 2.1.1, 2.4.11, 2.4.13.
- **Canonical Button example** ([design-system/02-components/button/examples/primary.tsx](design-system/02-components/button/examples/primary.tsx)) — rewritten to use the CSS-class pattern; consumers copy a single tsx file and reference the same `.lumen-btn-*` family from globals.css.
- **`color.action.primary.border = transparent`** explicit (was implicit). Other action intents now also have a `border` slot so the orthogonal surface composition is symmetric.

### Fixed

- **Vendor `nav.tsx` FAB** now wraps the formal `FAB` primitive (was inline `<button>` with hardcoded h-14 + glow).
- **Vendor `nav.tsx` SplitButton** now wraps the formal `SplitButton` primitive (was inline two-`<button>` group with hardcoded lime + chevron).
- **`tab-nav` (`primitives/nav.tsx`)** — added `role="tab"`, `aria-selected`, `aria-current="page"` on the active tab. Was visual-only.
- **`bottom-nav` (`primitives/nav.tsx`)** — added `role="navigation"`, `aria-label`, `aria-current="page"` on the active item. Was visual-only.
- **Bottom-nav unread badge** — `bg-[var(--lumen-red-5)]` → `bg-[var(--lumen-red-6)]` to match the v0.9 danger-bg deepening (consistency with Button danger).
- **Loading state collapsed onto disabled** at the visual level (both used `opacity: 0.4`). v0.9 separates them via the spinner-replaces-icon pattern.

### Deprecated

- **`intent="tertiary"`** — alias of `intent="ghost"` in v0.9. Both work; ghost is the new canonical name. Tertiary will be removed in v1.0.

### Deferred

- **Style Dictionary `_build/css/buttons.css`** wiring (carries from v0.7 ADR 0012 / v0.8 ADR 0014 / v0.8.1 ADR 0015). Once wired, the `.lumen-btn-*` block in `globals.css` derives from `01-tokens/components/button.tokens.json`. v0.9.x.
- **`HoldToConfirmButton`** — destructive 2 s mouse-hold + type-to-confirm fallback (Smashing 2024 dangerous-actions panel). v0.9.x.
- **Mono-cap variant** (`<Button variant="mono">EXPORT CSV</Button>`) — uppercase Geist Mono with 2 px tracking, for data-context buttons only. v0.9.x.
- **Loading-with-progress** — bg fill 0% → 100% under label for actions >5 s (Vercel deploy-button pattern). v0.9.x.
- **Density propagation to Button via `data-density`** (v0.8 pattern). v0.9.x.
- **Migrate every raw `<button>`** in `templates.tsx`, `ai.tsx`, `commerce.tsx`, `mobile.tsx` to use Button / IconButton / SplitButton — ~150 inline buttons remain. Tracked as v0.9.x cleanup.
- **`lint:button-conventions`** — extend with banned-phrase detection ("OK", "Submit", "Yes", "No"), Title Case detection, double-icon flagging. v0.9 ships the script foundation; v0.9.x adds the rules.
- **Vercel deploy stuck at v0.5.0** — the auto-deploy hasn't picked up v0.6, v0.7, v0.8, v0.8.1, or v0.9. Either the Root Directory config drifted or SAML re-engaged. Investigation tracked separately; the v0.9 source is shippable independently.

---

## [0.8.1] — 2026-05-03 — Primary-action contrast fix · shadcn bridge ban

A user-reported visual regression on the dashboard's `<Button intent="primary">` — white text on the lime accent surface (~1.66:1 contrast, WCAG AA fail). The token chain on paper was correct (`color.action.primary.fg` → `{color.accent.fg}` = `#0a0a0d`, 12.6:1 AAA). The break was in the shadcn token bridge: the cva `default` variant in `audit-dashboard/src/components/ui/button.tsx` used the shadcn utility names (`bg-primary text-primary-foreground`), which resolve through three `var()` hops at runtime (`:root` → `--primary-foreground` → `--text-on-accent` → `--lumen-accent-fg`). Tailwind v4's content scanner was observed to drop those classes from compiled CSS in this repo's setup, leaving the button to inherit `--text-primary` (near-white in dark theme) on the lime canvas.

The same bridge fragility affected `bg-card / text-card-foreground` (Card), `bg-popover / text-popover-foreground` (Popover), `bg-secondary` (Sheet close hover), and the Badge / Progress / Slider primary variants. All seven vendor primitives are now pinned to direct semantic refs that the arbitrary-value scanner is guaranteed to compile (`bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`, etc.).

See [ADR 0015](./_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md) for the root-cause analysis.

### Added

- **AGENTS.md hard rule #9** — never render white or near-white text on the lime accent surface. Documents both the failing token bridge utilities and the working direct-ref pattern.
- **Foundation doc — `00-foundations/accessibility.md` § "Primary action contrast — explicit"** — explains the 12.6:1 AAA pairing rule, the Tailwind v4 bridge fragility, and the two enforcement layers (direct refs in vendor primitives + lint rule).
- **Lint rule `lint:no-white-on-accent`** ([scripts/lint-no-white-on-accent.mjs](scripts/lint-no-white-on-accent.mjs)) — flags two patterns:
  1. Shadcn bridge utilities (`bg-primary`, `text-primary-foreground`, `bg-card`, `text-card-foreground`, `bg-popover`, `text-popover-foreground`, `bg-destructive`, `text-destructive-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `text-accent-foreground`, `bg-foreground`, `text-foreground`) anywhere in product code.
  2. White-ish text classes (`text-white`, `text-[#fff]`, `text-[#ffffff]`, `text-[var(--text-primary)]`, `text-[var(--lumen-paper-*)]`) paired with a lime background (`bg-[var(--lumen-accent-{3,4,5,6})]` or `bg-primary`) in the same `className` string.
  Wired into the main `pnpm lint` chain. Exempts the four vendor files audited by hand (`VENDOR_REWRITTEN` set). Inline `lumen-lint-allow: white-on-accent` directive supported per existing precedent.
- **`.lumen-btn-primary` defensive class** in [audit-dashboard/src/app/globals.css](audit-dashboard/src/app/globals.css) — single-class shorthand baking in `bg-[var(--lumen-accent-4)] / text-[var(--lumen-accent-fg)]` plus hover, active, disabled, and focus-visible states. For consumers that need the guarantee outside the Button primitive (raw `<a>` CTAs, templated buttons, etc.).

### Fixed

- **`audit-dashboard/src/components/ui/button.tsx`** — `default` variant now `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` (was `bg-primary text-primary-foreground`). `destructive` variant now uses direct red ref. Hover and active states explicitly re-pin the foreground to prevent any inheritance regression.
- **`audit-dashboard/src/components/ui/badge.tsx`** — `default` and `destructive` variants pinned to direct refs.
- **`audit-dashboard/src/components/ui/progress.tsx`** — Indicator now `bg-[var(--lumen-accent-5)]` (was `bg-primary`).
- **`audit-dashboard/src/components/ui/slider.tsx`** — Range fill `bg-[var(--lumen-accent-5)]`; Thumb border `border-[var(--lumen-accent-4)]`.
- **`audit-dashboard/src/components/ui/card.tsx`** — `bg-[var(--surface-raised)] text-[var(--text-primary)]` (was `bg-card text-card-foreground`).
- **`audit-dashboard/src/components/ui/popover.tsx`** — Content surface pinned to direct refs.
- **`audit-dashboard/src/components/ui/sheet.tsx`** — Close button hover state `bg-[var(--surface-sunken)]` and uses `--shadow-focus` for the focus ring (was `focus:ring-ring`, which also depends on the bridge).
- **Button component contract** ([design-system/02-components/button/component.json](design-system/02-components/button/component.json)) — `rules.dont` now explicitly bans white/near-white text on the primary action surface. Changelog entry added.
- **Canonical Button example** ([design-system/02-components/button/examples/primary.tsx](design-system/02-components/button/examples/primary.tsx)) — comment block at top warns consumers off the shadcn bridge for the primary intent. Body unchanged (already used direct semantic refs).

### Deferred

- **Wire Style Dictionary → `_build/tailwind/theme.css` (carried from v0.7 ADR 0012, v0.8 ADR 0014).** Once wired, `--color-action-primary-bg-rest` etc. will exist as real CSS variables and the canonical Button example renders correctly in isolation. v0.8.1's direct-ref fix is forward-compatible: when Style Dictionary lands, vendor primitives can migrate from `--lumen-accent-4` (audit-dashboard internal palette) to `--color-action-primary-bg-rest` (canonical semantic) without any contract change.

---

## [0.8.0] — 2026-05-03 — Spacing rebuild + token-system reconciliation

A repo-wide spacing/whitespace audit at the close of v0.7 found the conceptual model in `spacing.md` was sound but the implementation had **forked from the canonical source in five compounding ways**: source/implementation drift (`globals.css` declared its own non-canonical `--space-*` ladder + radius scale), phantom token references (`--size-control-{sm,md,lg}` and `--space-9` referenced 7+ times but never declared, breaking `.lumen-field` and `.lumen-switch` heights silently), 195 half-step Tailwind violations, 19+ uses of an undocumented "cozy" 36 px tier, and 27 hardcoded container widths. Plus the v0.7 semantic spacing layer (`stack/inline/section/page`) was zero-consumed in audit-dashboard because it had no Tailwind utility access.

A three-agent investigation across 12 peer systems (Linear / Stripe / Vercel Geist / Origin UI / Apple HIG / Material 3 / IBM Carbon / Atlassian / GitHub Primer / Refactoring UI / Apple Sport / superdesign.dev) + 36-issue repo audit + token-shape audit produced the punch list. v0.8 closes every issue.

See [ADR 0014](./_meta/decisions/0014-spacing-rebuild-v08.md) for the full audit + 22-change rationale.

### Added

- **5 primitive scale fillers** in `01-tokens/primitives/dimension.tokens.json`: `dimension.{1_5, 7, 9, 11, 14}` (= 6, 28, 36, 44, 56 px). Closes the gaps that created off-grid inline values across Switch, Segmented, Button.xl. The strict `validate:tokens` from v0.7 caught `{dimension.9}` as an unresolved alias; v0.8 declares it.
- **`size.control.cozy` (36 px)** — ratifies the de facto fourth control tier that appeared 19+ times in v0.7 dashboard as `h-9`. Plus `size.control.xl` (56 px) for hero pill CTAs. Re-binds entire `size.control.*` to dimension primitives (was inline values).
- **`space.inset.*` namespace** — `xs/sm/md/lg/xl/2xl` (4/8/12/16/24/40 px). The canonical token group for "padding inside a container." Components MUST reach here, not into the integer ladder. Plus `space.inset.squish.{sm,md,lg}` (button-style x>y) and `space.inset.stretch.{sm,md}` (textarea-style y>x). Curtis 2016 compositional pattern.
- **`space.section.dense` (24 px)** — operator-dashboard section break. Plus `space.section.hero` (96 px) — Vercel-style marketing hero. Plus semantic aliases `space.section.{operator, marketing}`.
- **`size.container.ultra` (1920 px)** — for 32" ops monitors. Operator-only.
- **`size.reading.{narrow, default, wide}` rename** — was `60ch`/`75ch` (encoding unit in the key was anti-pattern). Adds `default` (65 ch — the typographic sweet spot the `.prose-lumen` wrapper already uses).
- **`radius.4xl` (36 px)** — for `.lumen-frame-brutalist` and mobile-phone bezels. Was inline in dashboard CSS; now declared properly.
- **`size.dot.{sm, md}` and `size.scrollbar`** — small-but-recurring dimensions that had been anonymous.
- **`space.table.cell.{gap, compact}`** — Apple Sport-pattern table column rhythm (16, 12 px). Constant when type scales per the dynamic-type rule.
- **3 modes for density** — `cozy` ratified as the third tier between `comfortable` and `compact`. Plaid + Asana convergence. `<Form density="cozy">` and `data-density="cozy"` work.
- **`@theme inline` extension** in [globals.css](audit-dashboard/src/app/globals.css) — surfaces all v0.7 semantic spacing tokens (`stack/inline/inset/section/page`) plus container widths and control heights as Tailwind utility classes. `gap-stack-md`, `p-inset-xl`, `gap-section-dense`, `max-w-default`, `h-control-cozy` etc. now work natively. The v0.7 semantic ladder was documentation-only; v0.8 makes it consumable.
- **2 new lint scripts**:
  - `scripts/lint-no-off-grid-spacing.mjs` — flags Tailwind half-step utilities (`gap-1.5`, `px-2.5`, etc.) and inline-style off-grid px values. Inline `lumen-lint-allow: off-grid` and block `lumen-lint-allow-block: off-grid` directives for documented exceptions. Wired into `pnpm lint` chain.
  - `scripts/lint-token-naming-kebab.mjs` — flags camelCase tokens (`litEdge`, `valueDisabled`, `labelToControl`). Honors `$deprecated` markers. **Not** in main chain (45 pre-existing tokens need v0.9 sweep).
- **Apple HIG dynamic-type rule** documented in [spacing.md](design-system/00-foundations/spacing.md) §6.5 — "Spacing is constant; type scales into it." Gaps in `space.*` and `field.gap.*` do NOT change with user font-size. Type scales into constant gaps. Apple HIG / Material 3 / Apple Sport convergence.
- **Marketing-vs-operator surface mode** documented in [spacing.md](design-system/00-foundations/spacing.md) — first-class concept. Operator pages default to 24 px section breaks; marketing defaults to 64-96 px.
- **`.lumen-field[data-padding="none"]`** and **`.lumen-field[data-variant="chips"]`** shell modifiers in globals.css — replace the inline `style={{ paddingInline: ... }}` overrides on OTP cells, NumberInput steppers, TagsInput.
- **ADR 0014** — durable record of the v0.8 audit + 22-change rationale.

### Changed

- **`field.gap.*` renamed for kebab-case + `groupToGroup` value reduced 20 → 16 px**: `labelToControl` → `label`, `controlToHelp` → `help`, `groupToGroup` → `field` (and value 20 → 16 — Apple HIG / Linear / Stripe convergence), `fieldsetToFieldset` → `fieldset`. Old names ship as deprecated aliases per ADR 0009; removal in v0.9.
- **`space.section.sm` reduced 40 → 32 px** to converge with Linear's tighter operator rhythm.
- **`button.tokens.json` `padding.{sm,md,lg}` migrated to semantic refs.** Was hardcoded 12/16/20 px — violated AGENTS.md hard rule #2 inside the token system itself. Now `{space.3}`, `{space.4}`, `{space.5}`. Plus added `padding.xl` (32 px = `{space.8}`).
- **`button.tokens.json` `height.cozy/xl`** added — Button now ships sm/cozy/md/lg/xl tiers.
- **`card.tokens.json` `padding` API expanded 4 → 7 sizes** (none/xs/sm/md/lg/xl/hero) to match `card.tsx` implementation. Includes new `padding.xs` (8 px) and `padding.hero` (40 px).
- **`switch.tokens.json` `track.width`** changed from inline `36 px` value to `{dimension.9}` reference — now uses the v0.8 primitive properly.
- **Radius primitive scale reconciled** with the live audit-dashboard values that had been shipping since v0.4 (the JSON had different smaller values; v0.8 trusts the implementation): `xs:2→3, sm:4→6, md:6→8, lg:10→12, xl:14→16`.
- **`globals.css` reconciled with canonical JSON**: dropped forked half-step entries (`--space-0_5/2_5/3_5/14`); declared the 5 v0.8 primitive fillers (`--space-1_5/7/9/11`); declared `--size-control-{sm,cozy,md,touch,lg,xl}` (was phantom); declared `--size-container-*`, `--size-reading-*`, `--size-dot-*`, `--size-scrollbar`. Now matches `01-tokens/primitives/dimension.tokens.json` 1:1.
- **13/25 silent component contracts migrated** to declare consumed spacing tokens. Net token-references in contracts: ~440 → 569.
- **Section.tsx redundant margin removed** (`mb-16 md:mb-24`). Per principle 5: "Whitespace lives inside sections, not between them." Top border + `pt-12 md:pt-16` does the work.
- **`foundations/page.tsx` prose rewritten** to fix three contradictions: said "8pt soft grid base 8" (contradicts spacing.md "4-pt base, 8-pt soft"); listed canonical 4/12/20 as "soft exceptions" (they're on-grid); declared xs/xl/touch heights as if tokenized (only `touch` was in v0.7). v0.8 expanded to the 6-tier control ladder.
- **23 canonical example files cleaned** for grid-cleanliness. Half-step plague killed in shadcn-distributable code.
- **27 hardcoded container widths replaced** with `max-w-default`/`max-w-max`/`max-w-wide` Tailwind utilities (resolved via the new `--container-*` declarations).
- **18 `h-9` cozy violations** replaced with `h-control-cozy`.
- **158 of 195 half-step Tailwind violations migrated** in audit-dashboard. Remainder: 18 in shadcn vendor `ui/*` (out of scope) + 5 documented optical exceptions with `lumen-lint-allow: off-grid` directives.
- **`spacing.md` updated** to v2.0.0: documents `space.inset.*`, `space.section.dense`/`.hero`, the 3-mode density story, marketing-vs-operator surface modes, Apple HIG dynamic-type rule, the v0.8 expanded control ladder, the `@theme inline` Tailwind utility surface.
- **`density.md` updated** — third mode (cozy) ratified, no longer "deferred to v0.7+." Plaid + Asana convergence cited.
- **`.lumen-kbd { padding: 1px 5px }` fixed** — 5 px off-grid → `padding: 1px var(--space-1)` (4 px).
- **`mobile.tsx` phone-frame inline padding fixed** — `padding: "10px"` → `padding: "var(--space-3)"` (12 px).
- **`mobile.tsx` touch targets fixed** — `h-11` and `h-7` on touch surfaces → `h-control-touch` (44 px).
- **`landing/page.tsx` section rhythm fixed** — `py-10` and `py-14` outliers → `py-section-xl` (matches surrounding `py-20`).

### Fixed

- **Phantom `--size-control-{sm,md,lg}` references** — `.lumen-field` `height: var(--size-control-md)` resolved to `auto` (CSS unset-var fallback). Field heights were silently broken across the entire form layer. v0.8 declares the variables in `:root`.
- **Phantom `--space-9` reference** — `.lumen-switch { --_w: var(--space-9) }` resolved to `auto`. Switch width was broken. v0.8 declares `--space-9: 36px` (was the missing primitive that surfaced in v0.7's strict `validate:tokens`).
- **Source/implementation fork** between `01-tokens/*.tokens.json` and `globals.css` — four parallel spacing dialects now collapsed to one canonical source. The dashboard CSS is no longer a fork.
- **Radius scale fork** — `globals.css` and `01-tokens/README.md` cheatsheet had `xs:3, sm:6, md:8, lg:12, xl:16` while `primitives/radius.tokens.json` had `xs:2, sm:4, md:6, lg:10, xl:14`. v0.8 reconciled by trusting the live values; JSON updated.
- **5 inline px stragglers** in audit-dashboard primitives that the migration agent missed (avatar badge offset, commerce pricing pill + toggle thumb, feedback tooltip arrow, nav stepper rail). All annotated with `lumen-lint-allow: off-grid` directives + rationale.
- **Section.tsx + foundations/page.tsx contradicting principle 5.** Whitespace between sections compounded redundantly with top borders; foundations doc taught the wrong grid model.
- **`button.tokens.json` violating AGENTS.md hard rule #2 inside the token system itself** — hardcoded `padding.sm/md/lg` as raw px instead of semantic refs.
- **Card padding API drift** — implementation shipped 7 sizes; contract had 4. Reconciled.
- **`h-4.5` invented Tailwind class in stat/examples/primary.tsx** — wouldn't resolve at runtime. Replaced with `h-5`.

### Deprecated

- **`field.gap.{labelToControl, controlToHelp, groupToGroup, fieldsetToFieldset}`** — renamed to `field.gap.{label, help, field, fieldset}` (kebab-case) in v0.8. Old names ship as deprecated aliases per ADR 0009. Will be removed in v0.9.
- **`field.label.colorDisabled`, `field.helper.colorDisabled`** — renamed to `color-disabled` (kebab-case). Aliases retained; removal v0.9.
- **`size.reading.60ch`, `size.reading.75ch`** — renamed to `size.reading.narrow`, `size.reading.wide`. v0.7 names not aliased (zero in-repo consumers).

### Deferred

- **Sweep the 45 pre-existing camelCase tokens** to kebab-case (mostly in `input.tokens.json`, `time-picker.tokens.json`, `tags-input.tokens.json`, `textarea.tokens.json`, `color.{light,dark}.tokens.json`). Move `lint:token-naming` into `pnpm lint` chain. v0.9.
- **Address the 22 pre-existing `lint:no-primitives` violations** in `audit-dashboard/src/components/{primitives,dashboard-shell,tab-nav}.tsx`. Mostly icon dimensions (use `size={16}` prop) and chart palettes (move to a `chart.tokens.json` file). v0.8 introduced 0 new ones; cleanup deferred to v0.9.
- **`lint-no-integer-space-in-component-tokens` rule** — forbid `{space.0..space.32}` in component-token files; force `space.inset.*`/`space.inline.*`/`space.stack.*` semantic refs. v0.9.
- **Style Dictionary → `_build/tailwind/theme.css` wiring** — derive `globals.css`'s `:root` block from JSON. Eliminates the manual sync v0.8 just did by hand. Carried from ADR 0012 v0.7 deferred follow-ups.
- **Fluid spacing tokens** (Carbon-style `clamp()`) for ≥1280 viewports if the ultra container surfaces ship.
- **Scalar `--space-unit` override** for sectional density rescale (Stripe Elements / Geist UI pattern).
- **Density propagation to Card / Table / Stat / Badge.** Currently only `.lumen-field` reads `data-density`. Per density.md §4, Card and Table should subscribe.
- **18 half-step violations in shadcn vendor `ui/*`.** Decide: patch them or accept vendor drift.
- **Real DatePicker / TimePicker logic** (still deferred from v0.7 ADR 0012).
- **PasswordStrength dedicated contract** (still deferred from v0.7 ADR 0012).
- **Vercel deployment SAML protection** blocked the v0.8 visual audit. The three-agent code+research path replaced what would have been a fourth (visual) audit agent.

---

## [0.7.0] — 2026-05-03 — Distribution surface completion + RHF binding

A repo-wide audit at the close of v0.6 found the contracts were sound but the **distribution surface — the layer that lets consumers actually use Lumen — was deeply broken.** The shadcn registry was missing 8 sidecars (every v0.6 component would 404 on `npx shadcn add`), 11 v0.1 components had broken example references, the glossary was two releases stale, four foundation docs were missing, all 9 platform READMEs were unaware of v0.6, and the v0.6 Form primitive's promised react-hook-form binding was unshipped. v0.7 closes every gap.

See [ADR 0012](./_meta/decisions/0012-distribution-surface-v07.md) for the full audit + decision rationale, [ADR 0013](./_meta/decisions/0013-form-rhf-binding-v07.md) for the RHF binding decision.

### Added

- **10 deferred-form component contracts** (full md + json + example + sidecar trio for each, all `status: "beta"`):
  - **Combobox** (`02-components/combobox/`) — searchable single-choice dropdown with portaled listbox and keyboard nav.
  - **NumberInput** (`02-components/number-input/`) — stepper-flanked numeric with min/max/step/suffix; `aria-controls` wires steppers to the input.
  - **PasswordInput** (`02-components/password-input/`) — password entry with show/hide toggle + Caps Lock detection in a polite live region.
  - **OtpInput** (`02-components/otp-input/`) — 6-cell pattern, auto-advance on type, paste-distribute (paste "492781" → fills all six cells), Backspace-erases-previous on empty.
  - **TagsInput** (`02-components/tags-input/`) — wrapping chip-row tag entry; Comma + Enter both add; live-region announce on remove.
  - **DatePicker** (`02-components/date-picker/`) — calendar-portal scaffold (real `react-day-picker` integration deferred to v0.8); SHELL contract is canonical.
  - **TimePicker** (`02-components/time-picker/`) — hours/minutes/am-pm; 12h vs 24h auto-detected via `Intl.DateTimeFormat` on `navigator.language`; hidden `<input name>` always serializes 24h `HH:MM`.
  - **Segmented** (`02-components/segmented/`) — 2-4 mutually exclusive options with toolbar-pattern keyboard (Arrows move focus AND change value).
  - **RangeSlider** (`02-components/range-slider/`) — single + dual-handle modes with discriminated-union types so consumers can't accidentally pass `value: number` to dual mode at compile time.
  - **FileDropzone** (`02-components/file-dropzone/`) — drag-and-drop file input with client-side `accept` and `maxSize` validation; live-region announces selected file count.
- **8 missing registry sidecars** for v0.5-beta and v0.6 components: `_registry/{checkbox,field,form,radio-group,select,switch,textarea,validation-message}.json`. Each carries hand-curated `dependencies` (Radix packages, lucide-react), `registryDependencies` (cross-component refs), `cssVars`, `meta.platforms`, `meta.specPath`, `meta.docsPath`, `meta.warpSignature`.
- **11 missing example files for v0.1 components** at `02-components/{badge,card,dialog,empty-state,input,live-dot,rate-ticker,stat,table,toast,toggle}/examples/primary.tsx`. Each is standalone (inline `cn` helper, no `@/lib/utils` import), uses semantic tokens via `var(--…)`, honors `prefers-reduced-motion`. The 3 Warp signatures (Stat, LiveDot, RateTicker) preserve their distinctive behaviors. **Examples coverage: 1/20 → 30/30.**
- **react-hook-form binding for Form primitive** (v0.7 dual-mode). Pass `schema` (Zod) and `defaultValues`; nested `<Field name="…">` from `form-rhf` auto-registers and surfaces `formState.errors[name]`. Native v0.6 mode preserved exactly — no deps for the simple path.
  - **`audit-dashboard/src/components/primitives/form.tsx`** (243 lines) — dual-mode Form. Discriminated-union typing prevents mixing `validate` with `schema` at compile time.
  - **`audit-dashboard/src/components/primitives/form-rhf.tsx`** (199 lines) — convenience surface. Re-exports `Form`; exports a `Field` bridge that detects `useFormContext()`. Inside FormProvider it uses RHF's `Controller`; outside it falls through to the native v0.6 Field. Includes dotted-path error reader for nested schemas (`address.zip`), checkbox vs value coercion, and a dev-mode warning when manual `error` is passed inside RHF context.
  - **`design-system/02-components/form/examples/web-react-rhf.tsx`** — standalone 4-field example: email + min-2 name + age (z.coerce.number.min(18)) + boolean terms (z.literal(true)).
  - **Deps added to `audit-dashboard/package.json`**: `react-hook-form ^7.54.2`, `@hookform/resolvers ^3.9.1`, `zod ^3.24.1`.
- **4 missing foundation docs** at `00-foundations/`:
  - **`color.md`** (310 lines) — mood model, three-layer color, light/dark parallel, Warp lime accent discipline, accent glow, status palette, contrast.
  - **`spacing.md`** (310 lines) — 4-point base, 8-point soft grid, primitive scale, semantic ladder (inline/stack/inset/section), form-specific gaps, container widths, touch target floor.
  - **`density.md`** (244 lines) — comfortable vs compact, density mode hook, convergence pattern (Linear/Plaid/Notion/Asana), per-component density behavior, ARIA implications.
  - **`elevation.md`** (250 lines) — three depth modalities (hairline / shadow / lit edge), shadow ladder, lit-edge dark-mode trick, accent glow, focus shadow, surface ladder.
- **`scripts/validate-tokens.mjs`** — strict v0.7 replacement for the v0.6 `ajv-cli + || true` mask. Walks all `*.tokens.json` files, verifies every `{x.y.z}` alias resolves, verifies every `tokens.consumed` reference in every `component.json` resolves. Caught two real bugs the v0.6 mask was hiding (now fixed).
- **`## Forms & inputs (v0.6 mapping)` section** added to all 9 platform READMEs (`03-platforms/{web-react,react-native,ios-native,android-native,desktop-mac,desktop-windows,shopify-liquid,bigcommerce-stencil,woo-wordpress}/README.md`). Each maps the field shell + token table + density mode + validation timing + read-only-vs-disabled to platform-native equivalents. Honest about per-platform compromises (React Native lacks `:has(:focus-visible)` equivalent; Material 3 `OutlinedTextField` is the wrapper-paints-focus pattern by construction; SwiftUI `.shadow` is gaussian where CSS `box-shadow` is sharp).
- **10 component-token files** for the deferred contracts at `01-tokens/components/`. Token count: 521 → 694 (+173).
- **READMEs for the 4 placeholder dirs** (`notes/`, `reports/`, `assets/`) so they're documented purpose, not mute clutter.
- **Schema sub-version `radius.popover`** in `01-tokens/semantic/radius.tokens.json` (=`{radius.lg}`) — added to resolve a v0.6 alias that the silent-pass mask had been hiding.
- **ADR 0012** — durable record of the v0.7 distribution-surface audit + 16 changes.
- **ADR 0013** — RHF binding decision (peer-system survey: RHF vs Formik vs TanStack Form vs Conform; Zod vs Yup vs Valibot vs Joi; tradeoffs not chosen).

### Changed

- **`Form` contract bumped 0.6.0 → 0.7.0**. New props: `schema` (Zod), `defaultValues`, `resolver`, `mode`. Summary rewritten to describe dual-mode. New `a11y.rule`, new do/don't entries about RHF semantics. Backward compatible — native mode unchanged.
- **`scripts/build-registry.mjs` rewritten with MERGE semantics.** The v0.6 script clobbered hand-curated `dependencies`, `registryDependencies`, `cssVars`, and produced broken paths like `design-system/02-components/checkbox/../../../audit-dashboard/...`. The v0.7 script reads existing sidecars, preserves curated fields, and resolves example paths to repo-relative form via `path.resolve` + `path.relative`. Field/Form/ValidationMessage targets land at `components/lumen/{name}.tsx` to avoid colliding with consumer's shadcn `components/ui/`.
- **`registry.json.items[]` sorted semantically** — by component family (v0.1 baseline → v0.6 forms layer → v0.7 deferred-form completion), not alphabetically. Helps human readers + orders shadcn registry index pages logically.
- **`primitives/elevation.tokens.json` renamed → `primitives/shadow.tokens.json`.** The file's top-level token namespace is `shadow`, not `elevation`. Misnamed filename made `elevation.*` lookups fail silently. References updated in `00-foundations/{elevation.md, color.md}`, `01-tokens/README.md`, `research/system-architecture.md`. Foundation doc keeps the elevation name (user-facing concept); token file holds the implementation values.
- **`switch.tokens.json` `track.width`** changed from `{dimension.9}` (a primitive that doesn't exist) to inline `{ "value": 36, "unit": "px" }` with rationale: switch-specific (thumb 16 + travel 16 + padding 4 = 36), off-grid relative to the 4-multiple primitive scale. The strict `validate:tokens` caught this; v0.6 mask had been hiding it.
- **`02-components/README.md`** — components table reorganized to reflect all 30 components grouped by release (v0.1 baseline / v0.6 forms / v0.7 deferred-form completion). Validation script docs updated for the v0.7 strict gates.
- **`_meta/glossary.json`** extended 33 → 54 terms. Added v0.5 typography vocabulary (Major Third, semantic typography presets, leading curve, tracking curve, Plan B Inter, ss01–ss04, Satoshi-Fallback, tabular-nums, fluid hero, italic policy) and v0.6 forms vocabulary (field shell, single focus surface, .lumen-field, .lumen-checkbox, .lumen-radio, .lumen-switch, lit edge, density mode, error wins focus weakens, read-only, validation timing, ValidationMessage, slot, autofill recipe, field-sizing auto-grow). Plus Obsidian Lime as a recognized term.
- **`CLAUDE.md`** — removed stale "globals.css is a placeholder" guidance. New text frames `globals.css` as the de-facto source of truth for built CSS (~1900 lines, carries v0.4 token mappings + v0.5 typography utilities + v0.6 forms shell). When Style Dictionary's `_build/tailwind/theme.css` is wired, the goal is to derive the `:root` token block from it; v0.5+ utility classes and v0.6 shells continue as authored CSS.
- **`button/component.json` `examples`** — dropped 4 broken platform refs (`primary.rn.tsx`, `primary.swift`, `primary.kt`, `primary.liquid`) that pointed to nonexistent files. Only `web-react: "./examples/primary.tsx"` remains. Other platforms re-add when their example files actually exist.
- **`forms-and-inputs.md`** — added "react-hook-form binding (v0.7)" section before "Plan B: Inter" with a 12-line code snippet and a link to ADR 0013.

### Fixed

- **`validate:tokens` silent-pass** — v0.6's `package.json` ended `validate:tokens` with `|| true`, masking every failure. v0.7 swaps to `node scripts/validate-tokens.mjs` (strict, no mask). Removing the mask immediately surfaced two real bugs:
  - **`select.listbox.radius` referenced unresolved alias `{radius.popover}`** — fixed by adding `radius.popover` (= `{radius.lg}`) to `semantic/radius.tokens.json`.
  - **`switch.track.width` referenced unresolved alias `{dimension.9}`** — fixed by inlining the value with a rationale comment.
- **30 broken `_registry/` example file paths.** v0.6 sidecars resolved relative paths through the component dir, producing nonsense like `design-system/02-components/checkbox/../../../audit-dashboard/src/components/ui/checkbox.tsx`. v0.7 resolves via `path.resolve` + `path.relative` so paths are clean repo-relative.
- **8 missing v0.6 sidecars** (every Form/Field/Checkbox/Radio/Select/Switch/Textarea/ValidationMessage component). Without these, `registry.json.items[]` stopped at 12 — consumers running `npx shadcn add <url>/checkbox` would 404.
- **11 broken `examples/primary.tsx` references** in v0.1 component contracts (badge, card, dialog, empty-state, input, live-dot, rate-ticker, stat, table, toast, toggle). The `examples` field declared a path that didn't exist on disk.
- **Glossary staleness.** Two releases of vocabulary missing.
- **All 9 platform READMEs** lacked any reference to the v0.6 forms shell, density modes, or `:has(:focus-visible)` pattern. CHANGELOG v0.6 tracked this as `Deferred`; v0.7 closes the thread.
- **Hardcoded px values in 10 deferred-contract example files** (`combobox/examples/web-react.tsx` etc.) — the deferred-contract authoring agent inlined `style={{ fontSize: "14px" }}` instead of using semantic typography utilities. Cleaned: 11px → `text-overline`, 12px → `text-micro font-mono`, 13px → `text-body-xs` / `text-label-sm`, 14px → `text-body-sm` / `text-label-md`, 18px → `text-body-lg`. Removed `var(--…, 14px)` fallback patterns so missing tokens surface as bugs instead of silently degrading.
- **Misleading filename** `primitives/elevation.tokens.json` (top-level namespace was `shadow`). Renamed.

### Deferred

- **22 pre-existing `lint:no-primitives` violations** in `audit-dashboard/src/components/{primitives,dashboard-shell,tab-nav}.tsx`. Mostly icon dimensions (use `size={16}` prop instead of `style={{ width: "16px" }}`) and chart palettes (move to a `chart.tokens.json` file). v0.7 introduced zero new violations; cleanup deferred to v0.8.
- **Style Dictionary → `_build/tailwind/theme.css` wiring.** `pnpm build` runs Style Dictionary but `audit-dashboard/globals.css` doesn't consume the output. Deferred to v0.8.
- **`registry.dependencies` field on `component.schema.json`.** Currently the build-registry script's MERGE depends on existing sidecars carrying `dependencies`. Promoting deps to component.json itself eliminates the dependency on existing sidecars. Deferred to v0.8.
- **Real DatePicker / TimePicker logic.** v0.7 ships visual scaffolds; v0.8 wires `react-day-picker` (or first-party logic).
- **PasswordStrength dedicated contract.** Currently a sub-primitive in `primitives/inputs.tsx`. Promote in v0.8.
- **`space.inset.*` semantic namespace.** A `space.inset.{xs,sm,md,lg}` ladder (matching `space.stack.*` / `space.inline.*`) for inset-padding lint cleanliness.
- **`size.control.cozy` (36 px)** for a future `cozy` density mode (between comfortable and compact).
- **Lit-edge naming normalization.** `shadow.input.lit-edge` (kebab) vs `input.ring.litEdge` (camel) — cosmetic but worth a sweep.
- **Vercel deployment** still dead (`DEPLOYMENT_NOT_FOUND` from v0.6). Blocks `pnpm cls` + visual-audit re-loop.
- **v1.0 cut criteria.** When `_build/tailwind/theme.css` ships + Vercel is alive + 3 v0.7 betas promote to stable, v1.0 is the natural next bump.

---

## [0.6.0] — 2026-05-03 — Forms & input fields rebuild

A user-reported double-focus-ring bug on the foundations Form fields demo triggered a full audit of the forms layer. The audit found the bug was symptomatic of deeper drift: three parallel input chrome systems, two parallel Selects, two parallel Radios, 17 form primitives without contracts, no Form/RHF integration, hardcoded rgba/hex chains. v0.6 collapses the architecture: ONE shell (`.lumen-field`), ONE focus surface, ONE ring. Plus 9 new component contracts, foundation doc, lint script, ADR.

See [ADR 0011](./_meta/decisions/0011-forms-and-inputs-v06.md) for the full rationale and [forms-and-inputs.md](./design-system/00-foundations/forms-and-inputs.md) for the canonical guide.

### Added

- **Single-shell field architecture.** `.lumen-field` is the focusable surface for every text-entry control. Wrapper observes inner focus via `:has(:focus-visible)` (Tailwind v4 `has-focus-visible:`) with `:focus-within` fallback. Inner `<input>`/`<textarea>`/`<select>` renders bare; the global `:focus-visible` rule is explicitly gated for descendants of `.lumen-field` so the double-ring class is impossible.
- **9 new component contracts:**
  - **Field** (`02-components/field/`) — composition wrapper. Slot bonding, single focus surface.
  - **Form** (`02-components/form/`) — semantic `<form>` wrapper; owns blur-validation orchestration, focus-on-first-error, density mode hook.
  - **Textarea** (`02-components/textarea/`) — multiline input with field-sizing auto-grow.
  - **Select** (`02-components/select/`) — Radix-based; collapses the v0.5 dual-implementation drift (custom native + unused Radix).
  - **Checkbox** (`02-components/checkbox/`) — `.lumen-checkbox` shell; `--radius-xs` (replaces `rounded-[4px]` lint violation).
  - **RadioGroup** (`02-components/radio-group/`) — `.lumen-radio` shell; collapses v0.5 dual-implementation drift.
  - **Switch** (`02-components/switch/`) — `.lumen-switch` shell; separated from Toggle (Toggle = button-style on/off, Switch = pill toggle).
  - **ValidationMessage** (`02-components/validation-message/`) — promoted from a buried atom in `feedback.tsx` to a dedicated form-composition primitive.
  - **Input** (`02-components/input/`) — rewrite for v0.6. Bare element semantic; readOnly distinct from disabled.
- **Foundation doc** at `design-system/00-foundations/forms-and-inputs.md` — 200-line canonical guide covering anatomy, focus model, sizing scale, density modes, states matrix, slot semantics, validation timing, required vs optional, form layout & rhythm, modern flourishes.
- **6 new component-token files** at `01-tokens/components/`: `field.tokens.json`, `textarea.tokens.json`, `select.tokens.json`, `checkbox.tokens.json`, `radio.tokens.json`, `switch.tokens.json`.
- **`input.tokens.json` expanded.** New keys: `padding.x.{sm,md,lg}` and `padding.y.{sm,md,lg}` ramps, `gap.slot`, `background.{rest,hover,focus,readOnly,disabled}`, `border.{rest,hover,focus,error,success,warning,disabled,readOnly}`, `foreground.{value,valueDisabled,valueReadOnly,placeholder,iconLeading,iconTrailing,addon,label,helper,error,success,warning}`, `ring.{focus,error,success,litEdge}`, `transition`.
- **Semantic color tokens (light + dark):**
  - `color.text.error`, `color.text.success`, `color.text.warning`, `color.text.placeholder` — explicit roles for form text states (previously product code reached into primitives like `--lumen-red-5`).
  - `color.border.error`, `color.border.success`, `color.border.warning`, `color.border.disabled`.
  - `color.surface.input.{rest,hover,focus,readOnly,disabled}` — input-specific surfaces; light mode shifts to sunken-cream for the inset feel.
- **Primitive alpha tokens:** `color.alpha.danger.{12,24,32}` and `color.alpha.warning.{12,24}` — error/warning halos via `box-shadow`.
- **Semantic shadow tokens:** `shadow.input.{focus,error,success,lit-edge}`. Lit-edge inset on dark mode steals the glassmorphism "glass-pane reflection" trick.
- **`v0.6 — FORMS & INPUT FIELDS`** section in `globals.css` — ~350 lines. `.lumen-field` shell with size/density variants, hover/focus/error/success/warning/disabled/readonly states, slot bonding, autofill recipe, native quirks (number spinners, search clear-x). Plus `.lumen-checkbox`, `.lumen-radio`, `.lumen-switch` shells with composed indicators via `::before`/`::after`. Plus `.lumen-form-field`, `.lumen-form-stack`, `.lumen-fieldset` composition helpers.
- **Density modes.** `<Form density="compact">` sets `data-density="compact"` on the form root; nested `.lumen-field` shells without explicit `data-size` adopt 32 px height + reduced padding. Linear/Plaid/Notion convergence pattern.
- **Autofill recipe.** `-webkit-box-shadow: inset 0 0 0 1000px var(--surface-input-rest)` defeats Chrome's yellow autofill flash. The 5000 s transition outlasts the flash so the override never blinks visible.
- **Read-only state.** Distinct from disabled — full contrast, in tab order, copyable, no caret. `aria-readonly="true"` on the shell.
- **`scripts/lint-no-arbitrary-form-values.mjs`** — flags raw `focus-within:shadow-[...]`, `aria-invalid:focus-visible:shadow-[...]` arbitrary recipes; direct primitive reach for error colors (`bg-[var(--lumen-red-N)]` etc.); hardcoded pixels in form primitives. Wired as third stage of `pnpm lint`.
- **ADR 0011** — durable record of the v0.6 audit, decisions, consequences, tradeoffs not chosen.

### Changed

- **`Input` contract rewrite (v0.1.0 → v0.6.0).** Adopts the field shell. Drops the v0.5 `text-base md:text-sm` (16 px → 14 px) font-size override that fought Lumen's documented 14 px body floor. The bare `<input>` now renders at `text-body-md` (14 px) consistently.
- **`primitives/field.tsx` rewrite.** Single shell, slot composition, `data-*` attribute hooks for state. Click anywhere on the shell focuses the input. `description` and `optional` and `required` markers normalized to semantic typography presets (`text-caption`, no more `text-[var(--type-12)]` arbitrary values).
- **`primitives/inputs.tsx` refactor.** `INPUT_BASE` constant deleted. SearchInput / Combobox / NumberInput / PasswordInput / OtpInput / TagsInput / DatePicker / TimePicker / ColorPicker all adopt `.lumen-field` shell with slot patterns. Eight different transition recipes collapsed to one (the shell's).
- **shadcn `ui/input.tsx`, `ui/textarea.tsx`, `ui/select.tsx`** refactored. Removed `text-base md:text-sm` font override. Removed `bg-transparent` clobber on Select trigger that was overriding the field-shell bg. Reconciled `aria-invalid:focus-visible:shadow-[...]` recipes — all three now use `var(--shadow-input-error)` semantic token instead of hand-typed near-but-not-identical rgba values.
- **shadcn `ui/checkbox.tsx`, `ui/radio-group.tsx`, `ui/switch.tsx`** refactored. Adopt `.lumen-checkbox`, `.lumen-radio`, `.lumen-switch` shell classes. Inner indicators composed via CSS `::before`/`::after`.
- **shadcn `ui/label.tsx`** normalized to `text-label-sm` (Lumen 13 px medium secondary) by default — was `text-sm leading-none font-medium` raw.
- **`--shadow-focus`** reconciled. Was `0 0 0 3.5px var(--lumen-lime-a40)` in CSS while `shadow.focus` token JSON declared `0 0 0 3px lime-a32`. Both now agree on `0 0 0 3px var(--lumen-lime-a32)`. Style Dictionary will emit consistent values across web/iOS/Android/Liquid.
- **Light mode `--surface-input-rest`** shifted from `--surface-raised` (paper white) to `--lumen-cream-1` (sunken cream). Inputs now read as inset on the paper canvas, with focus popping to paper-white. Visually noticeable on /landing in light mode.
- **`pnpm lint`** is now a three-stage composite (`lint:no-primitives && lint:no-arbitrary-typography && lint:no-arbitrary-form-values`).

### Fixed

- **Double-ring focus bug.** v0.5 painted two green focus halos on every Field with a leading icon or trailing addon — one from the wrapper's `focus-within:shadow-[var(--shadow-focus)]`, one from the global `:focus-visible { box-shadow: var(--shadow-focus) }` rule on the inner `<input>`. The leading icon and trailing addon fell outside the inner ring, reading as separate components. v0.6 gates the global rule for inputs nested in `.lumen-field` and the wrapper paints exactly one ring via `:has(:focus-visible)`.
- **Error+focus stack fight.** v0.5 had two different rgba recipes (`rgba(237,94,94,0.20)` in `field.tsx`, `rgba(226,59,59,0.32)` in `ui/input.tsx`) for the same conceptual error+focus halo. Both replaced with the `--shadow-input-error` semantic token.
- **Trailing addon outside the focus ring.** The "STD" / "lb" chips rendered as wrapper siblings outside the inner `<input>` focus boundary. v0.6 makes the wrapper itself the focus surface, so all slots are inside by construction.
- **`bg-transparent` clobber on Select trigger.** `ui/select.tsx` declared `bg-[var(--surface-raised)]` then later `bg-transparent` — Tailwind last-class-wins made every Select transparent (visually different from Input). Removed.
- **`rounded-[4px]` lint violation on Checkbox.** Replaced with `--radius-xs` token. The `lint-no-primitives` script now passes on `ui/checkbox.tsx`.
- **`text-base md:text-sm` font-size fight.** Bare shadcn Input/Textarea rendered at 16 px on mobile and 14 px on desktop, fighting Lumen's documented 14 px body floor and creating a different text size than the same Input inside a Field. Removed; now consistent at `text-body-md` (14 px).
- **Eight different transition recipes** across the four primitives (Input, Textarea, Select, Checkbox, RadioGroup, Switch, INPUT_BASE, Field wrapper). Collapsed to one (`color, box-shadow, border-color, background-color` at `--motion-fast` with `--easing-standard`).
- **Disabled state** was opacity-50 only across all primitives. v0.6 adds bg + border + cursor changes.
- **Read-only state** was undocumented and unstyled — now first-class with full contrast, no caret, in tab order.
- **Autofill yellow flash** painted over `--surface-raised`. Recipe added; bg pinned via inset-shadow trick + 5000 s transition.

### Deferred

- **Per-platform docs** (`03-platforms/{ios-native,android-native,react-native,desktop-mac,desktop-windows,shopify-liquid,bigcommerce-stencil,woo-wordpress}/`) need updates mapping the new field-shell tokens to platform-native input components. Tracked for v0.6.x.
- **Dedicated component contracts** for Combobox / NumberInput / PasswordInput / OtpInput / TagsInput / FileDropzone / Segmented / RangeSlider / DatePicker / TimePicker — primitives adopt the new shell in v0.6.0 but their `component.json` contracts ship in v0.6.x and v0.7.
- **react-hook-form binding** — Form primitive in v0.6 is a thin native wrapper. v0.7 adds RHF binding (Zod resolver, `useFormContext`).
- **Manual visual verification on the Vercel deploy** — Chrome extension was unreachable during the v0.6 build; tracked as deploy-blocked.

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
