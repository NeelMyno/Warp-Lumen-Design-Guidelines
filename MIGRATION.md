# Migration guide

> Per-minor consumer-action notes for Lumen. Each section lists: what tokens were added or aliased, what defensive classes landed, what lints to enable, and what to re-sync from `audit-dashboard/src/app/globals.css` into your consumer app's CSS.

Lumen's integration model is **wholesale CSS re-sync** from the audit-dashboard's `globals.css` (the runtime SSoT). Consumer apps typically:

```bash
cp <lumen-repo>/audit-dashboard/src/app/globals.css <your-app>/src/styles/lumen.css
```

…and then surgically fix the 5-or-so non-cascading surfaces (`@theme inline` overrides, fonts, paths to local SVGs). When Lumen ships a new minor, the wholesale re-sync stays the right pattern — but the diff matters, and a per-minor breakdown of what to look for makes the upgrade non-anxious.

---

## v0.14 → v0.15 — token canonicalization + defensive-class expansion (R16)

**Re-sync `globals.css`.** v0.15 ships ~70 new `:root` aliases (the universal `--color-*` namespace) + 4 new defensive-class families (`.lumen-pill-*`, `.lumen-kpi-*`, `.lumen-empty-state`, `.lumen-page-header`). All additive; nothing retired.

**New tokens you can now reference** (every one is an alias of a v0.14 semantic token — same resolved value, intuitive consumer-facing name):

| Family | Pattern | Aliased target |
|---|---|---|
| Text-on-accent (THE canonical) | `--color-text-on-accent` | `--text-on-accent` |
| Text | `--color-text-{primary,secondary,tertiary,placeholder,disabled,inverse,accent,link,error,success,warning,on-avatar}` | `--text-*` |
| Surface | `--color-surface-{canvas,page,raised,sunken,popover,overlay,glass,glass-strong,scrim,inverse,tint-accent,tint-strong,input-*}` | `--surface-*` |
| Border | `--color-border-{hairline,subtle,default,strong,frame,focus,accent,error,success,warning,input-disabled}` | `--border-*` |
| Status | `--color-status-{success,warning,danger,info,neutral}-{bg,fg,border,500}` | `--status-*` + new `-500` tier |
| Accent ladder | `--color-accent-{400,500,600,fg}` | `--lumen-accent-{4,5,6,fg}` |
| Avatar palette | `--color-avatar-bg-{1..8}` | `--lumen-{accent,cream,amber,red,obsidian}-N` |
| Chart palette extension | `--color-chart-{6,7,8}` | `--lumen-{cream,amber,obsidian}-3` |
| Alpha namespace | `--color-alpha-{accent,ink,paper}-{N}` | `--lumen-{lime,ink,paper}-aN` |
| Action tertiary alias | `--color-action-tertiary-{bg-hover,fg}` | `--color-action-ghost-*` |

**Why this matters:** the v0.14 audit caught that consumer authors reach for the longer `--color-*` namespace (matching Tailwind v4 `@theme` convention) but only a subset was defined. The TMS consumer (chat 36-A) wrote `text-[var(--color-text-on-accent,white)]` 11+ times — `--color-text-on-accent` didn't exist, Tailwind dropped the comma-fallback, and the cascade painted `#E6E6E6` text on Spring Green (1.66:1 AA fail). v0.15 closes the entire `--color-*` alias namespace so the var() lookup always succeeds.

**New defensive classes** (all in the trailing `LUMEN · v0.15 R16 — DEFENSIVE-CLASS EXPANSION` block of `globals.css`):

- `.lumen-pill-strip` / `.lumen-pill` / `.lumen-pill-active` / `.lumen-pill-inactive` / `.lumen-pill-count` — filter chips, segments, mode pickers. Replaces the inline `bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,white)]` bug class.
- `.lumen-kpi-tile` / `.lumen-kpi-label` / `.lumen-kpi-value` / `.lumen-kpi-delta` / `.lumen-kpi-context` — single-metric tiles. Tone-gates at zero via `data-value-zero="true"` (warning at zero retires to neutral).
- `.lumen-empty-state` / `.lumen-empty-state-icon` / `.lumen-empty-state-headline` / `.lumen-empty-state-supporting` / `.lumen-empty-state-actions` — type-led zero-state.
- `.lumen-page-header` / `.lumen-page-header-content` / `.lumen-page-header-title` / `.lumen-page-header-tagline` / `.lumen-page-header-actions` — one-CTA-per-view. CTA hides on `data-cta-suppressed="true"`; tagline drops on `data-onboarding="false"`.

**New lints to enable in CI** (both wired into `pnpm lint` umbrella):

```bash
pnpm lint:no-inline-accent-text     # Catches the inline accent BG + text-arbitrary-class WITH comma-fallback bug class.
pnpm lint:no-undefined-token-vars   # Asserts every var(--color-*) / var(--lumen-*) reference is defined in :root.
```

If you vendor a copy of `scripts/lint-no-inline-accent-text.mjs` + `scripts/lint-no-undefined-token-vars.mjs` into your consumer app, they catch the same bug class against your own source tree.

**Migration checklist for consumer apps**:

1. ☐ Re-sync `globals.css` from `audit-dashboard/src/app/globals.css` (or cherry-pick the `:root` alias block + the v0.15 R16 defensive-class block at the file's tail).
2. ☐ Audit your code for inline `bg-[var(--color-accent-*)] text-[var(--something,fallback)]` patterns. Replace with `.lumen-btn-primary` (button) or `.lumen-pill-active` (chip).
3. ☐ Audit your KPI tiles for "warning at zero" patterns. Wrap with `.lumen-kpi-tile` + `data-value-zero` on the value span.
4. ☐ Audit your empty states for the type-led contract — `.lumen-empty-state` if you don't already wrap with the `<EmptyState>` primitive.
5. ☐ Audit your page headers for the one-CTA-per-view contract — `.lumen-page-header` with `data-cta-suppressed` when an empty state owns the action.
6. ☐ Vendor the two new lints into your CI.

**Read more**:
- [ADR 0035](./_meta/decisions/0035-r16-tms-consumer-friction-closure-v015.md) — full rationale for the v0.15 ship.
- [defensive-classes.md](./design-system/00-foundations/defensive-classes.md) — the enumerated defensive-class family with worked examples.
- [page-header.md](./design-system/05-patterns/page-header.md) — the new PageHeader pattern.
- [empty-state-flow.md](./design-system/05-patterns/empty-state-flow.md) — the empty-state pattern (now backed by `.lumen-empty-state`).
- [CHANGELOG.md](./CHANGELOG.md) — the granular per-file diff.

---

## v0.13 → v0.14 — omnibus systemic-gap closure

**Re-sync `globals.css`.** v0.14 ships large additions:
- v0.14 R8c — `<LazyMount>` primitive (`audit-dashboard/src/components/lazy-mount.tsx`)
- v0.14 R8d — italic Satoshi family split (`var(--font-satoshi-italic)` family fallthrough in `--font-sans` chain)
- v0.14 R9 — three new `@media` blocks: `(prefers-contrast: more)`, `(forced-colors: active)`, `print`
- v0.14 R10 — print stylesheet + `[data-export="image"]` attribute pattern
- v0.14 R11 — i18n / RTL scaffold (`[dir="rtl"] [data-rtl-flip]`, `[data-numeric]`, `[data-lumen-sidebar]`, `[data-lumen-drawer="end"]`)
- v0.14 R11 (separate axis) — **green removed from every box-shadow**. Hero-CTA glow ladder retired in favor of neutral elevation (`shadow.accent-glow` now aliases `shadow.lg`). Focus ring is `outline + box-shadow` with both halves theme-aware neutral. AI shimmer pulses border-frame ↔ border-strong.

**Lints added**:
- `lint:shadow-no-accent` — renamed from `lint:elevation-no-accent`, broadened to scan EVERY shadow token (not just the elevation subset).
- `lint:docs-no-retired-tokens` (v0.14.3 R14) — walks `.md` / `.txt` for prescriptive uses of retired tokens.
- `lint:tsx-no-retired-prose` (v0.14.4 R15) — walks `.tsx` / `.ts` for retired phrases (lime-glow ladder, spring-green ambient, etc.).

**Migration checklist for consumer apps**:

1. ☐ Re-sync `globals.css`.
2. ☐ If your consumer app uses `lumen-lime-aXX` or `lumen-accent-*` inside any `box-shadow` value, replace with neutral alpha (`paper-aN` for dark theme, `ink-aN` for light) per `shadow.tokens.json`.
3. ☐ If your consumer app's docs reference the "spring-green glow ladder" / "lime halo" / "primary glow ladder", retune to neutral elevation.
4. ☐ Vendor the three new lints into your CI.
5. ☐ Wrap below-the-fold sections on DOM-heavy routes (>1500 nodes / >30 primitive showcases) in `<LazyMount placeholderHeight={240}>` — see AGENTS.md hard rule 17.
6. ☐ Read the three new foundation docs: `os-modes.md`, `print.md`, `internationalization.md`.

---

## v0.12 → v0.13 — LLM-docs version lockstep + responsive safety net + LLM-docs SSoT

**Re-sync `globals.css`.** v0.13 closes:
- v0.13.1 (R5, ADR 0024) — `html, body { overflow-x: clip }` at the system layer. Closes the layout-viewport inflation issue at <768 px viewports.
- v0.13.2 (R6, ADR 0025) — `lint:token-naming-kebab` wired into the `pnpm lint` umbrella; primitive-layer a11y cascade (Switch + Checkbox `label` prop now generates ariaLabelledby properly; Field children pattern now injects id / ariaLabelledby / ariaDescribedby on first valid child).
- v0.13.3 (R7, ADR 0026) — SD pipeline + lint hygiene + pre-commit SSoT regen via simple-git-hooks.
- v0.13.4 (R8a, ADR 0027) — Satoshi VF re-subset (Latin-1 + design-glyph coverage; 230 codepoints, 303 glyphs — saves 25 KB on the LCP critical path).
- v0.13.5 (R8b, ADR 0028) — `experimental.inlineCss: true` in audit-dashboard's `next.config.ts` — replaces every prerendered page's `<link rel="stylesheet">` with a `<style data-precedence="next">` block inline.

**Migration checklist for consumer apps**:

1. ☐ Re-sync `globals.css`.
2. ☐ Audit your version labels — read from `audit-dashboard/src/lib/version.ts` (LUMEN_VERSION / LUMEN_VERSION_MAJOR_MINOR / LUMEN_VERSION_MAJOR_MINOR_UPPER), never hardcode the literal. See AGENTS.md hard rule 13.
3. ☐ If your consumer app self-hosts Satoshi: re-subset using `scripts/subset-satoshi.mjs` — assume Latin-1 coverage only.
4. ☐ For Next.js apps: read [ADR 0028](./_meta/decisions/0028-inline-css-mobile-perf-v0135.md) trade-off matrix before enabling `experimental.inlineCss: true`. Right for single-visit + atomic-CSS regimes; wrong for multi-page apps with high returning-visitor traffic.

---

## v0.11 → v0.12 — Obsidian recolor + corner-clip + glow-ladder retune

**Re-sync `globals.css`.** v0.12 ships:
- v0.12.0 (ADR 0020) — **canvas recolor from `#171A18` Obsidian-Mint to `#0D0D0D` neutral Obsidian**. Brand still spring green `#00FA8A`; only the canvas / inverse / scrim shifts neutral. Light anchor stays `#E6E6E6`.
- v0.12.1 (ADR 0021) — `Card padding="none"` composes `overflow-hidden` (the corner-clip contract). Children get the parent's rounded shape.
- v0.12.2 (ADR 0022) — primary-button hover bloom retuned (less aggressive). The three-state glow ladder lands here pre-R11; R11 then retired it in v0.14.
- v0.12.3 — Tailwind arbitrary translate retired in favor of inline style.left / style.transform.
- v0.12.4 — three primitive-layer fixes: InlineTabs pill `overflow-hidden`, Combobox dropdown portaled, global `:focus-visible` outline + box-shadow.
- v0.12.5 — version constant SSoT; iconography accent-on-hover; pricing card peak-end lift; privacy scrub (real names retired from fixtures).

**Migration checklist for consumer apps**:

1. ☐ Re-sync `globals.css`.
2. ☐ **Audit any hardcoded `#171A18` references** — they should now be `#0D0D0D` (or better: `--surface-canvas`).
3. ☐ Audit your `<Card padding="none">` wrappers — anything that was relying on the child overflowing the parent's radius will now clip.
4. ☐ Audit your translate-based position math — replace `translate-x-[Npx]` with inline `style.left` / `style.transform`. See AGENTS.md hard rule 12.
5. ☐ Replace real-person names in your fixtures with synthetic operator names (`Avery Mercer`, `Kai Morgan`, etc.). See CLAUDE.md "synthetic names only" rule.

---

## Versioning policy

Lumen follows **semver discipline**:
- **MAJOR** — system-wide breaking changes (token retirement that has no alias, canvas-color shift, primitive contract break).
- **MINOR** — additive (new tokens, new primitives, new defensive classes, new lints), or contract-internal (focus-ring color retune that maintains contrast).
- **PATCH** — bug fixes, performance, docs sync.

v0.14 R11 was a MINOR (shadow-color contract changed but `shadow.accent-glow` alias preserved value-shape backwards compat). v0.15 R16 is a MINOR (additive — every old token name still works, but the new canonical names land alongside).

## Long-term roadmap (consumer-visible)

- **v0.16** — retirement of the green-outline-hollow active-chip pattern across `/carriers` + `/quote` (per defensive-classes.md). Will require consumer migration to `.lumen-pill-active`.
- **v0.17** — full primitive coverage for native platforms (SwiftUI / Compose / React Native have prose docs + JSON contracts; v0.17 will ship verified-render examples).
- **v1.0** — deprecated-token-alias removal (`--color-fg-on-accent`, `--color-primary-foreground` retired in favor of `--color-text-on-accent`). MAJOR bump; MIGRATION.md will name every removal.
