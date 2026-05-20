# Lumen — Warp's Design System

> Lumen is Warp's vertically integrated UI design system. **LLM-first, human-second.** Single source of truth for every UI surface Warp's product/software-builder team ships — web, mobile, native desktop, e-commerce themes.

```
Visual mood:        Obsidian · neutral near-black canvas + cool-neutral paper + radial spring-green aurora
Accent:             Spring Green #00FA8A — action / live / success only
Dark canvas:        Obsidian #0D0D0D — neutral near-black (R = G = B at every dark stop, v0.12 — mint retired)
Light anchor:       #E6E6E6 — neutral light, also used as primary text on dark canvas
Typography:         Satoshi (single typeface — UI, display, body, numerics, code, editorial)
Hierarchy:          Aggressive — one focal point per section, 1.5–2× weight gap to support tier
First impression:   Engineered — 50ms halo contract, three-question hero, restrained chrome
Micro-interactions: Peak-end rule — hover, focus, validation, success — short, decelerating
Shadow color:       NEVER green — every box-shadow neutral (v0.14 R11 — ADR 0030). Primary CTA halo retired entirely: rest=none, hover=shadow.md (neutral), active=none. Brand identity = green BG fill alone.
Card padding=none:  Auto-clips edge-touching children to the rounded corner (v0.12.1 corner-clip contract)
Floating UI:        Combobox / Popover / Dropdown / Tooltip portal to document.body (v0.12.4 — escapes ancestor overflow)
Focus rings:        Outline (border-frame, neutral) + box-shadow halo (paper/ink-alpha-08, neutral) — v0.12.4 pattern + v0.14 R11 colors. Box-shadow alone fails inside corner-clipped ancestors.
Position math:      Inline style.left / style.transform, never Tailwind translate-x-[Npx] (v0.12.3 — scanner fragility retired)
Version SSoT:       Every user-facing version label imports from @/lib/version (v0.12.5 — closes v0.11.13 palette-footer drift)
Accordion marker:   <summary class="lumen-summary"> suppresses native browser disclosure triangle on every browser (v0.12.5)
Icon-tile hover:    Hover lifts icon to text-accent + border-accent — teaches "green at action" visually (v0.12.5)
Peak-card hover:    Pricing tiers + plan pickers lift on hover (shadow-md + border-default + -translate-y-[1px]) (v0.12.5)
Density:            Marketing breathes (96 px hero rhythm) · Operator stays dense (24 px section rhythm)
Distribution:       shadcn registry · npx shadcn add <registry>/<name>
Tokens:             DTCG JSON · Style Dictionary v5 · 9 platform outputs
LLM contract:       llms.txt + AGENTS.md + CLAUDE.md + tool-specific mirrors · 21 hard rules
Status:             v0.14.4 · R14 docs↔tokens drift lint + foundation docs↔code closure (ADR 0033 — closes the four doc surfaces ADR 0030 left out of its R11 sync sweep: buttons.md, USING-LUMEN.md, llms.txt, llms-full.txt — each was still teaching the retired green-glow ladder as the canonical button contract. Plus secondary citations across READMEs, component .md files, platform guides, AGENTS.md, CLAUDE.md, state-matrix.md, forms-and-inputs.md, field/component.md, card/component.md, button/component.md, 01-tokens/README.md. Plus frontmatter added to three v0.13.2-authored foundation docs (data-visualization.md, responsive.md, state-matrix.md) that shipped without it. R14 ships **automation**: scripts/lint-docs-no-retired-tokens.mjs walks every .md/.txt in the repo and fails CI on prescriptive use of retired tokens (data-driven via a RETIRED list; future retirements add an entry instead of grep-replacing across the doc tree); wired into the pnpm lint umbrella as the 9th rule. Pairs with R11's lint:shadow-no-accent (token-source layer) to give the no-green-shadows mandate full coverage: tokens + docs. New AGENTS.md hard rule 21 codifies the contract. R14 methodology contribution: every contract that has a TOKEN layer + a DOCS layer must have a LINT on each layer — the token lint catches tokens, the doc lint catches docs, neither is sufficient alone.) · 7 principles · 33 ADRs
```

## What this repo is

This repo is the **single source of truth** for Lumen. Everything Warp's team ships should pull tokens, components, and rules from here.

It contains:
- Design tokens in DTCG JSON (primitives → semantic → component) — 887 tokens across 32 files. v0.11.13 added 24 new primitives to close the master→child inheritance chain.
- Component contracts (Markdown spec + JSON sidecar) for **98 components** in `_registry/registry.json` — 35 v0.1–v0.11 baseline (12 v0.1 baseline + 8 v0.6 forms layer + 10 v0.7 deferred-form completion + 5 added through v0.8–v0.11), 63 added in v0.12.6 primitive-coverage drop, plus 5 v0.13.1 R5 contract closeouts (icon-button, button-group, split-button, command-palette-button, fab). See [COMPONENT-INDEX.md](./COMPONENT-INDEX.md) for the full enumeration.
- Per-platform consumption guides for 9 platforms (each maps the v0.6 field shell + density modes).
- Content rules (imagery, illustration, motion, voice, microcopy, errors, empty states) — 8 topical files.
- 14 foundation docs in `design-system/00-foundations/` (principles, voice, a11y, motion, hierarchy, first-impression, micro-interactions, etc.).
- An [`/audit-dashboard/`](./audit-dashboard/) — a Next.js 16 reference implementation showing every component pattern across 8 project templates (foundations, landing, saas, tool, ecommerce, mobile, desktop, library).
- A layered LLM contract so any AI coding tool (Cursor, Claude Code, Codex, Copilot, Devin, Warp Terminal AI) can consume Lumen rules natively.

It does NOT contain shipped product code. Product code lives in consumer repos and pulls Lumen via shadcn registry / Swift Package / Compose module / etc.

## Repo layout

```
Warp-Lumen-Design-Guidelines/
├── README.md                       ← you are here
├── llms.txt                        ← LLM discovery index (start here if you're an agent)
├── llms-full.txt                   ← inlined version
├── AGENTS.md                       ← universal agent rules (read first)
├── CLAUDE.md                       ← Claude-specific addenda
├── CONTRIBUTING.md                 ← human contributor guide
├── CHANGELOG.md                    ← Keep-a-Changelog format
├── VERSION                         ← 0.14.4
├── package.json                    ← build / validate / registry scripts
├── style-dictionary.config.ts      ← token build pipeline
├── scripts/                        ← build-registry, check-contrast, lint, release
│
├── design-system/                  ← THE ACTUAL SYSTEM
│   ├── 00-foundations/             ← principles, voice, a11y, motion, hierarchy, first-impression, micro-interactions (× 14)
│   ├── 01-tokens/                  ← DTCG JSON (primitives, semantic, components) — 887 tokens / 32 files
│   ├── 02-components/              ← component.md + component.json per component (× 35)
│   ├── 03-platforms/               ← per-platform consumption guides (× 9)
│   └── 04-content/                 ← imagery, illustration, microcopy, errors (× 8)
│
├── _registry/                      ← shadcn-compatible registry.json + sidecars
├── _meta/                          ← glossary, ADRs (× 22), prompt fragments (× 5)
├── _build/                         ← gitignored. Style Dictionary outputs.
│
├── audit-dashboard/                ← Next.js 16 + Tailwind v4 reference dashboard
│
├── .cursor/rules/lumen.mdc         ← Cursor mirror of AGENTS.md
├── .warp/lumen.mdc                 ← Warp Terminal mirror
├── .github/copilot-instructions.md ← GitHub Copilot mirror
│
└── research/                       ← brand DNA, inspiration, typography, architecture, brief
```

## Getting started

### As a human contributor

```bash
git clone <repo>
cd Warp-Lumen-Design-Guidelines
pnpm install
pnpm build               # Style Dictionary builds _build/
pnpm validate            # JSON schemas + DTCG + WCAG contrast
cd audit-dashboard
pnpm install
pnpm dev                 # http://localhost:3000  ← visual audit dashboard
```

Then open the audit dashboard, switch tabs across the eight project types, toggle dark/light mode, and review the system end-to-end. See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to propose changes.

### As an AI coding agent

1. Read [`llms.txt`](./llms.txt) for the discovery map.
2. Read [`AGENTS.md`](./AGENTS.md) for the hard rules.
3. If you're Claude, also read [`CLAUDE.md`](./CLAUDE.md).
4. When generating code, use only **semantic tokens** (`color.surface.page`, never `color.warm.50`).
5. When creating a new component, follow [`_meta/prompts/new-component.md`](./_meta/prompts/new-component.md).
6. When in doubt, look at [`audit-dashboard/src/`](./audit-dashboard/src/) for working examples of every primitive.

### As a consumer (a Warp project that wants to use Lumen)

Web (Next.js + Tailwind v4 + shadcn):
```bash
# Pull the built theme
curl -o src/styles/lumen.css <cdn>/lumen/v0.1.0/tailwind/theme.css

# Install a component (copies into your repo)
pnpm dlx shadcn@latest add <cdn>/lumen/registry/button.json
```

iOS (SwiftUI):
```swift
.package(url: "https://github.com/warp/lumen-ios.git", from: "0.1.0")
```

Android (Compose):
```kotlin
implementation("dev.warp:lumen-compose:0.1.0")
```

See [`/design-system/03-platforms/`](./design-system/03-platforms/) for the full per-platform setup guide.

## What makes Lumen different

- **Apple discipline + Warp substance + premium psychology.** Apple typographic rigor (1.25 scale, hairlines, decelerate motion) + the v0.11 psychology principles (50ms halo, aggressive hierarchy, cognitive fluency, peak-end rule) on Warp's material (cool-neutral paper / neutral obsidian canvas — v0.12 retired the mint tilt, the spring-green accent has the hue stage to itself / contextual density).
- **One disciplined accent.** Spring Green `#00FA8A` plays exactly one role across the entire system: action / live / success. Adding a second loud color is a brand violation.
- **Three Warp-signature primitives.** `Stat` (big tabular number), `LiveDot` (pulsing 8px green dot), `RateTicker` (scrolling lane rates). These three carry the operator-console mood.
- **LLM-first, human-second.** Two-file-per-component contract (md for humans, json for agents). Layered LLM contract surfaces (llms.txt, AGENTS.md, CLAUDE.md, tool-specific mirrors). Lint enforces semantic-only token references.
- **No stock anything.** No stock photography, no AI-generated images, no character mascots, no isometric scenes. Product screenshots first, documentary second, monoline diagrams for abstract concepts.
- **Dense, not airy.** Long-scroll pages, 1100 px primary content, compact 32 px table rows. Whitespace lives inside sections.

## The audit dashboard

The single best way to evaluate Lumen is to open the audit dashboard:

```bash
cd audit-dashboard && pnpm dev
```

Eight tabs:
1. **Foundations** — color, type, spacing, radius, elevation, motion, iconography, live-data primitives.
2. **Marketing & Landing** — type-led hero, live ticker, trust strip, stat band, features, pricing, FAQ, CTA, footer.
3. **SaaS Dashboard** — Warp's actual product type. Sidebar nav, KPI grid, shipments table, side panel.
4. **Web Tool** — single-purpose utility (quote builder), focused canvas, control panel, output panel.
5. **E-commerce** — Shopify-style product detail with gallery, buy panel, ratings, related grid.
6. **Mobile** — iOS and Android frames side-by-side. Same Lumen visual language, platform-native chrome.
7. **Native Desktop** — macOS and Windows frames side-by-side. Vibrancy / Mica titlebar.
8. **Library** — full component gallery + every primitive in every state.

Use the mood switcher (top right) to compare the four moods (Quiet Industrial recommended; Soft Luminous, Mono Editorial, Premium Glass as alternatives).

## What's new — v0.14.4

### v0.14.3 (2026-05-20) — R14: docs↔tokens drift lint + foundation docs↔code closure (ADR 0033)

R14 closes the gap [ADR 0030](./_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md) (v0.14 R11) left in its docs↔code sync sweep. R11 retired green from every box-shadow color value system-wide and named three foundation docs it updated. The R14 audit walked the rest of the doc tree and found **four more doc surfaces** ADR 0030 missed — each still teaching the retired green-glow ladder as the canonical button contract:

1. **`design-system/00-foundations/buttons.md`** — preamble still said "signature spring-green glow ladder on the primary action"; lines 121–137 published the entire retired three-state ladder as canonical brand contract.
2. **`USING-LUMEN.md`** — defensive-primitive-contracts table listed the v0.12.2 glow ladder as a contract to encode; focus-ring quick-reference prescribed `outline: 2px solid var(--lumen-lime-a64)`.
3. **`llms.txt`** — listed ADR 0022 as the current button-shadow contract; ADR count stuck at 24 (now 33).
4. **`llms-full.txt`** — D-002 Action section published the full lime ladder; D-016 focus-ring section prescribed `var(--lumen-lime-a64)` as outline.

Pre-R14, an LLM agent reading `buttons.md` → writing `box-shadow: 0 0 16px var(--lumen-lime-a25)` literally would have passed `lint:shadow-no-accent` because the offending value was *inlined as text*, not *token-referenced* — that's the historical bug class R14 closes. The token-source layer was R11-compliant; the doc-prose layer wasn't.

**The structural fix:** [`scripts/lint-docs-no-retired-tokens.mjs`](./scripts/lint-docs-no-retired-tokens.mjs) — a 9th rule in the `pnpm lint` umbrella. Walks every `.md` / `.txt` in the repo (excluding the retirement ADR, CHANGELOG, audit logs, lint scripts) and fails CI when a retired token (or retired recipe like a focus-ring outline color) appears in a *prescriptive* context — i.e., a paragraph that does NOT contain a retirement marker (`retired`, `superseded`, `historical`, `pre-R11`, `was X`, etc.). Data-driven via a `RETIRED` list; future retirements add an entry instead of grep-replacing across the doc tree.

**New AGENTS.md hard rule 21** codifies the contract — pairs with hard rule 20 (R11 — no green in shadows, token-source layer) to give R11's mandate full coverage: tokens + docs.

**Methodology contribution:** *Every contract that has a TOKEN layer + a DOCS layer must have a LINT on each layer. The token lint catches tokens; the doc lint catches docs; neither lint is sufficient alone. The R11 → R14 gap was that R11 had the token lint but not the doc lint — and an LLM agent reading the docs would faithfully reconstruct the retired contract, bypassing the token lint entirely. The two-lint pattern is the right architecture for any future contract retirement.*

Files retuned in R14 (16 surfaces total): `buttons.md`, `USING-LUMEN.md`, `llms.txt`, `llms-full.txt`, `AGENTS.md` (hard rule 11 + new hard rule 21), `CLAUDE.md`, `README.md`, `state-matrix.md`, `forms-and-inputs.md`, `data-visualization.md` + `responsive.md` + `state-matrix.md` (frontmatter added), `card/component.md`, `field/component.md`, `button/component.md`, `01-tokens/README.md`, four platform READMEs. ADR 0033 captures the audit + the lint architecture + the methodology rule.

### v0.14.2 (2026-05-20) — R13: LazyMount paint-flash fix + Elevation perceptual lift + synthetic-names cleanup (ADR 0032)

Second multi-route audit through Claude in Chrome MCP (R12 was the first). R13 closes three real-world bugs that R12 either introduced or left in place:

- **R13-001 (P0) — LazyMount paint-flash on fast scroll.** R12's pure-CSS `content-visibility: auto` migration correctly closed the SSR contract gap AND preserved the R8c LCP win, but `content-visibility: auto` skips paint **every frame, indefinitely**. During fast scroll the browser's paint-prediction lagged behind viewport movement; the user landed on positions where multiple lazy sections filled the viewport, none painted yet → black void. Reproduced 7+ times across `/library`. R13 swaps to first-paint-only deferral via `useEffect` + `requestAnimationFrame`: SSR + initial render apply content-visibility (preserves R8c LCP win + R12 SSR contract); after hydration, a single RAF flips the style to `{}`, removing content-visibility from every LazyMount. **Subsequent scrolls have no paint-defer, no black voids.** Default `placeholderHeight` reduced from 600 → 240; 23 `/library` wraps updated from `{500}` → `{240}`. Live MCP probe: all 23 LazyMounts show `data-lazy-mount="ready"` post-hydration.
- **R13-002 (P1, closes R12-002 deferred) — Elevation showcase perceptual lift on dark canvas.** After R11 retired green from shadow tokens, neutral black shadows blend into the obsidian canvas; xs / sm / md / lg / xl / 2xl cards looked identical. R13 layers a per-card inset top highlight that scales 4% → 9% → 14% → 20% → 26% → 32% white alpha alongside the unchanged ladder shadow. Demo-only treatment — shadow tokens unchanged, consumer apps don't inherit.
- **R13-003 (P1) — Real-person name re-leaks.** `display.tsx:485` Timeline `actor: "Daniel S."` → `"Avery M."`; `ai.tsx:214` TypingIndicator default `name = "Daniel"` → `"Avery"`. Continues v0.12.5 synthetic-only cleanup.

**Methodology contribution:** *A fix that ships in round N may surface a new bug class in round N+1 — that's the audit-via-MCP ladder working as designed. R12 correctly closed an SSR contract gap AND correctly preserved an LCP perf win, but introduced a paint-defer UX flash. R13 closes the flash without giving up either prior fix, by combining the SSR-complete DOM + first-paint-only deferral into a hybrid that's strictly better than either prior implementation.*

**Validation:** `pnpm validate:tokens` → 956 tokens valid · `pnpm lint` → all 8 rules pass · `pnpm exec tsc --noEmit` (audit-dashboard) → PASS · `pnpm build` → 12 routes prerender · `pnpm exec playwright test` → 56 / 58 pass (2 skipped on axe-core).

### v0.14.1 (2026-05-20) — R12: dark text-ladder + LazyMount SSR-completeness (ADR 0031)

First multi-route audit through Claude in Chrome MCP. Fixed the dark-mode 3-tier text ladder (`--text-tertiary` was collapsing to `--text-secondary` at the runtime layer despite the DTCG spec separating them); migrated LazyMount from React-state IntersectionObserver to pure CSS `content-visibility: auto` to close the SSR-completeness gap (R8c had shipped 23 empty placeholder divs in SSR). R13 closes the residual paint-flash this introduced.

### v0.14.0 (2026-05-19) — Omnibus systemic-gap closure (ADR 0029)

First MINOR-version bump since v0.12.0. Chat 42's "what's missing from chat 39" audit surfaced 9 systemic gaps; v0.14 closes them in one cycle. Each item shipped + tested:

**Perf round (R8c + R8d):**
- [R8c — `/library` DOM weight reduction via Intersection Observer](audit-dashboard/src/components/lazy-mount.tsx) — new `<LazyMount>` wraps 23 below-the-fold sections; first 2 stay eager. `/library.html` shrinks 1044 KB → 575 KB (−45%). LCP 3634 → 1815 ms (−1819 ms / −50%) — R8b regression fully closed.
- [R8d — italic font-display: optional](audit-dashboard/src/app/layout.tsx) — next/font split into regular + italic; italic gets `preload: false` + `display: "optional"`, dropped from LCP critical path. globals.css `--font-sans` chain extended with `var(--font-satoshi-italic)` for italic fallback.

**OS-mode contracts (R9):**
- [`os-modes.md`](design-system/00-foundations/os-modes.md) — `prefers-reduced-motion`, `prefers-contrast: more`, `forced-colors: active` contracts (8-check verification matrix).
- New CSS blocks in globals.css: `@media (prefers-contrast: more)` thickens borders + focus outline; `@media (forced-colors: active)` adds structural `1px solid CanvasText` borders + uses OS-controlled Highlight for focus.

**Print + export (R10):**
- [`print.md`](design-system/00-foundations/print.md) — print stylesheet + `data-export="image"` + CSV export + Web Share API contracts (10-check verification matrix).
- New `@media print` block in globals.css — forces light theme, retires dashboard chrome, collapses grids, prints URLs after links, honors page-breaks at sections.

**i18n / RTL foundation:**
- [`internationalization.md`](design-system/00-foundations/internationalization.md) — direction (LTR/RTL), `Intl.*` locale formatters, font-subset script coverage interaction with R8a, text expansion budget, message-catalog externalization.
- CSS scaffold in globals.css: `[dir="rtl"] [data-rtl-flip]` mirrors directional icons, `[data-numeric]` pins LTR inside RTL paragraphs, `[data-lumen-sidebar]` uses inset-inline-* logical positioning.

**Templates layer:**
- 3 new pattern docs: [`error-pages.md`](design-system/05-patterns/error-pages.md), [`email-layout.md`](design-system/05-patterns/email-layout.md), [`empty-state-flow.md`](design-system/05-patterns/empty-state-flow.md).
- [PATTERN-INDEX.md](PATTERN-INDEX.md) — auto-generated catalog (10 patterns total). Generator: `pnpm pattern-index`.
- Lumen-branded 404 + 500 templates at `audit-dashboard/src/app/{not-found,global-error}.tsx`.

**Cross-platform examples — 9 new files:**
- Button + Card + Field × ios-native (SwiftUI) + android-native (Compose) + react-native — 9 example files. Each mirrors the web-react contract. Updated component.json `examples` field to declare 4 platforms each.

**MCP server (closes USING-LUMEN.md hard rule 4 lie):**
- [`mcp/server.mjs`](mcp/server.mjs) — stdio JSON-RPC 2.0 server, pure-Node, zero new deps. 9 tools (list/get for components/tokens/ADRs/patterns + free-text search) + resource URIs.
- [`mcp/README.md`](mcp/README.md) — wiring docs for Claude Desktop / Claude Code / Cursor.
- Smoke-tested: 98 components + 29 ADRs + 10 patterns enumerable via the MCP protocol.

**Testing infrastructure:**
- [Playwright config](audit-dashboard/playwright.config.ts) + [smoke tests](audit-dashboard/tests/smoke.spec.ts) (10 per-route smoke) + [a11y baseline](audit-dashboard/tests/a11y.spec.ts) (8 per-route + 1 axe-core-skipped).
- [Storybook scaffold](audit-dashboard/.storybook/main.ts) + first Button story (R12 candidate for full enablement).
- 18/19 tests pass. New `pnpm` scripts: `test`, `test:mobile`, `test:smoke`, `test:a11y`.

**Distribution package:**
- [`packages/lumen-tokens/`](packages/lumen-tokens/) — npm package scaffold. Re-exports `_build/{ts,json,css}/`. Closes USING-LUMEN.md's `@warp/lumen-tokens` reference. Publish gated on registry credentials.

**Cumulative Lighthouse R7 → v0.14:** LCP geo-mean 3030 → 2068 ms = −962 ms / −31.7%. /library 3328 → 1815 ms (−45%). CLS 0.000 every route every config. Methodology: *omnibus minor when ≥ 5 independent gaps + structural-completeness theme.*

### v0.13.5 (2026-05-19) — R8b critical-CSS inlining for LCP round-trip elimination (ADR 0028)

Ninth round of the same-day live-audit cycle. R8a (v0.13.4) cut 25.6 KB off the font payload on the LCP critical path and dropped LCP geo-mean 169 ms. R8b closes the next-largest lever R8a's audit explicitly named: the 26 KB Tailwind utility chunk that wasted 462–635 ms per route per Lighthouse's `render-blocking-resources` audit. The lever is one config line — Next.js 16's `experimental.inlineCss: true` in [`audit-dashboard/next.config.ts`](./audit-dashboard/next.config.ts). At build time, Next.js replaces every prerendered page's `<link rel="stylesheet">` with a `<style data-precedence="next">` block carrying the same CSS content. The browser receives styles inline with the HTML so the render-blocking waterfall collapses.

**3-run-median results across 9 audit-dashboard routes at the Moto G4 4G profile:**
- LCP geo-mean: **3001 → 2706 ms (−295 ms, −9.8%)**
- Perf score geo-mean: 94 → 95
- CLS: 0.000 on every route, both configs (the metric-aligned `Satoshi-Fallback` contract from ADR 0010 holds)
- TBT geo-mean: 10 → 13 ms (still 15× under the 200 ms Good threshold)
- Speed Index: dramatic wins on heavy routes — `/` SI 2614 → 1483 ms (−1131 ms), `/library` SI 2575 → 1648 ms (−927 ms)

**Per-route LCP standouts:** `/landing` 2954 → 1825 ms (−1129 ms), `/commerce` 2948 → 1898 ms (−1050 ms), `/desktop` 2813 → 2572 ms (−241 ms), `/mobile` 2809 → 2575 ms (−234 ms). Marginal moves on `/`, `/saas`, `/tool` (within noise envelope).

**The one regression: `/library` LCP +184 ms median.** LCP element selector is identical to R8a (the article header `<p>`); root cause is main-thread CSS parse cost. Under external CSS, the network thread parses 26 KB of utility rules in parallel with HTML download. Under inline CSS, the same parse cost lands on the main thread before computing styles against `/library`'s 4684-node DOM. R8b's diagnostic on `/library`: main-thread work breakdown 3138 → 6283 ms (2×), bootup time 332 → 1029 ms (3×). The regression is bounded: the R8c carry-forward (lazy-render the 98 primitive showcases via Intersection Observer) is the root-cause fix; once `/library`'s above-the-fold DOM is ~200 nodes instead of 4684, the inlineCss main-thread cost stops dominating.

**The CLS contract holds end-to-end.** Both `@font-face` blocks Lumen depends on — the handcoded `Satoshi-Fallback` from globals.css per ADR 0010 + next/font's auto-generated `satoshi Fallback` with size-adjust 109.35% + ascent-override 92.36% + descent-override 21.95% — are preserved verbatim in the inlined CSS. The metric overrides are font-table-derived (next/font reads hhea + OS/2 at build time), not glyph-derived; inlining moves the bytes but doesn't perturb the CLS-critical values. Verified `grep -c "size-adjust"` on the produced HTML: 4 hits per route, all inline.

**Cumulative across R8a + R8b: LCP geo-mean 3030 → 2706 ms = −324 ms / −10.7% from the R7 baseline.**

**Plus two process improvements bundled with R8b:**
- New [`scripts/lighthouse-mobile-baseline.mjs`](./scripts/lighthouse-mobile-baseline.mjs) — re-runnable Lighthouse CLI. Factors the chat 41 inline bash recipe into a single script supporting `--tag`, `--port`, `--routes` flags; writes per-route JSON + aggregate markdown table to `.audit-runs/<date>-round-<tag>/`.
- `scripts/release.mjs --banner-only` flag — closes the chat 41 friction. With the flag, the script uses the CURRENT VERSION as authoritative (skips the bump + the CHANGELOG mutation + the `[next]`-already-exists guard). Use for pre-authored CHANGELOG flows; the default `release.mjs patch` flow is unchanged.

**Methodology contribution:** *byte-level levers also have shape — moving bytes between the network thread and the main thread changes WHERE the cost lands, not just WHETHER it lands. A round can be a clean win in aggregate while regressing on the heaviest route in the surface set; that regression is a signal for the NEXT lever, not a veto on the current one.*

R8c+ candidates rank by expected LCP impact ÷ architectural-risk: (1) **R8c — `/library` DOM weight reduction** (Intersection Observer lazy-render of the 98 primitive showcases — projected 300–500 ms LCP win, compensates R8b's `/library` main-thread regression); (2) **R8d — italic font-display: optional** (brand call); (3) **R8e — real iOS Safari + real Android Chrome verification** (BrowserStack or SauceLabs); (4) **R9 — reduced-motion + high-contrast OS-mode contracts** (separate axis); (5) **R10 — print + export contracts**; (6) **R11 — native pipeline render verification** (Swift / Compose / Flutter); (7) **R12 — Storybook + a11y-tree per-state probes** across all 98 primitives.

Audit baseline at [`.audit-runs/2026-05-19-round-8b/LIGHTHOUSE.md`](./.audit-runs/2026-05-19-round-8b/LIGHTHOUSE.md). Raw 3-run R8a + R8b at [`.audit-runs/2026-05-19-round-r8a-run-{1,2,3}/`](./.audit-runs/) and [`.audit-runs/2026-05-19-round-r8b-fresh-{1,2,3}/`](./.audit-runs/).

### v0.13.4 (2026-05-19) — R8a Satoshi subset for LCP critical-path bytes (ADR 0027)

Eighth round. R7 (v0.13.3) captured the first mobile Lighthouse baseline; LCP emerged as the only Needs-Improvement metric (3030 ms geo-mean). R8a moves it. Both Satoshi VF woff2 files re-subset to drop unused codepoints + glyphs while preserving every Lumen-referenced OpenType feature + the full wght 300–900 variable axis. Total bytes saved on the critical path: 25,628. **LCP geo-mean: 3030 → 2861 ms (−169 ms, −5.6%);** `/foundations` standout: 3300 → 2728 ms (−572 ms — drops out of Needs Improvement). CLS contract holds — next/font's size-adjust + ascent-override + descent-override are font-table-derived, not glyph-derived. Codepoint keep set codified in [`scripts/subset-satoshi.mjs`](./scripts/subset-satoshi.mjs); pre-subset originals preserved in [`.audit-runs/_font-backups/`](./.audit-runs/_font-backups/).

### v0.13.2 (2026-05-18) — R6 senior-UX audit pass: LLM-docs SSoT additions + drift cleanup + a11y closeout cascade (ADR 0025)

Sixth round of the same-day live-audit cycle. R1–R5 walked the rendered UI (chrome bleed → v0.12.7, variant pickers → v0.12.8, contract-comparison → v0.12.9, meta-contract integrity → v0.13.0, mobile-viewport metrics → v0.13.1). R6 pivots one rung below: **the contracts authoring agents read against** — documentation drift, primitive-layer a11y cascade, tooling-script hygiene, token-validation closure. [ADR 0025](./_meta/decisions/0025-audit-cycle-ladder-r6-llm-docs-ssot-v0132.md) formalizes the now-six-round audit-cycle ladder as a methodology contract.

**Six new SSoT documents for LLM discoverability** — auto-generated [`COMPONENT-INDEX.md`](./COMPONENT-INDEX.md) (98 components, categorized table, `pnpm component-index` to regenerate from `component.json` summaries), auto-generated [`TOKEN-INDEX.md`](./TOKEN-INDEX.md) (~750 semantic + component-bound tokens, `pnpm token-index` to regenerate; primitives intentionally omitted per AGENTS.md hard rule 2), [`audit-dashboard/README.md`](./audit-dashboard/README.md) (replaces the stock create-next-app stub with proper onboarding), [`audit-dashboard/ROUTES.md`](./audit-dashboard/ROUTES.md) (per-route map of the 9 routes — purpose / audience / primitives / audit-cycle cross-reference), [`design-system/00-foundations/data-visualization.md`](./design-system/00-foundations/data-visualization.md) (chart-type selection table, axes / legend / color rules with the single-green-series brand contract, accessibility, empty / loading / error / stale states, KPI composition), [`design-system/00-foundations/responsive.md`](./design-system/00-foundations/responsive.md) (breakpoint table, layout-viewport contract codifying ADR 0024 for consumers, sub-768 px authoring rules per-area, audit-cycle viewport ladder), [`design-system/00-foundations/state-matrix.md`](./design-system/00-foundations/state-matrix.md) (13 canonical states, primitive-by-primitive tier matrix).

**87 `validate:tokens` errors → 0** via 6 new/extended semantic token files. New `design-system/01-tokens/semantic/size.tokens.json` declares 30 component-bound size aliases for avatar / banner / bottom-nav / calendar / drawer / kanban / list / navbar / phone / popover / sidebar / slider / table / tree. New `design-system/01-tokens/semantic/color.invariant.tokens.json` declares theme-invariant `color.text.{on-action,on-avatar}` + `color.status.{tone}.border` aliases. Extensions to `motion`, `shadow`, `type`, `color.dark`, `color.light` semantic files add `motion.duration.{shimmer,spin}`, `shadow.{elevation,glow.accent,kbd}`, `type.{tabular.nums,code.{sm,md}}`, `color.chart.1–8`, `color.avatar.bg.1–8`.

**`pnpm exec tsc --noEmit` (audit-dashboard) → PASS** — 4 stale `.next/types/validator.ts` errors resolved by `.next` cleanup mid-cycle.

**`scripts/release.mjs` widened** to bump root `package.json` `"version"` (was missed by v0.13.0 script — drifted to `0.12.4` by v0.13.1), README plain-`Status:` block (multi-space format, not the bold-chip format the v0.13.0 regex caught), USING-LUMEN.md install URL `<cdn>/lumen/vX.Y.Z/registry/{name}.json`, README `## What's new — vX.Y.Z` section heading. Plus a **safety guard** that refuses to run if `[next]` is already in `CHANGELOG.md` (closes the 0.13.1 → 0.13.2 over-bump trap session 38 hit when `release.mjs` was run on an already-hand-bumped VERSION).

**Primitive-layer a11y cascade** — six fixes propagate R5's R5-006 fix (sibling-label SwitchRow pattern) through the unfixed primitive paths:
- `Switch` + `Checkbox` — when `label` prop is provided, the primitive generates `{controlId}-label`, assigns it as `id` on the `<Label>`, and wires `aria-labelledby` to it on the Radix `<button role="switch|checkbox">`. (HTML's implicit `<label htmlFor>` doesn't propagate to a button-role element — same root cause as R5-006, different code path.)
- `Field` children pattern — `<Field label="X"><TextInput /></Field>` was dropping htmlFor→id linkage because the inner control rendered its own `<input>` with its own id. Fix: when children + label are provided, primitive uses `Children.toArray` + `cloneElement` to inject `id` / `aria-labelledby` / `aria-describedby` / `aria-invalid` on the first valid React-element child.
- `NumberInput` + `TagsInput` — now accept `id` + `aria-label` + `aria-labelledby` props and forward them to the inner `<input>`.
- `RangeSlider` — two `<input type="range">` thumb inputs now ship `aria-label` per thumb (`Range: minimum (val)` / `Range: maximum (val)`); new `label` prop for the prefix.
- `TypeToConfirm` — wires `<label htmlFor>` via `useId`, plus `aria-describedby` to the help text + `aria-invalid` toggle.

**Post-fix a11y probe: 714 interactive elements across all 8 routes at 320 × 568 px (chrome-devtools-mcp emulate, mobile, touch), 0 nameless.** Session 38's R5 closeout was 0 on 7 of 8 routes; R6 closes /library's 14 → 0.

**Naming-collision cleanup** — `nav.tsx` showcase exports `FAB` / `SplitButton` / `CommandPalette` renamed to `FABDemo` / `SplitButtonDemo` / `CommandPaletteDemo` to retire the export-name collision with the canonical primitives in `fab.tsx` / `split-button.tsx` / `command-palette.tsx`. Matches the established `*Demo` convention (NavbarDemo, SidebarDemo, FooterDemo). Single consumer `audit-dashboard/src/app/library/client.tsx` updated.

**LLM-docs drift cleanup** — CHANGELOG deduped (removed spurious `## [0.13.2]` empty stub session 38 left in place); USING-LUMEN.md `all 35 components` → `all 98 components` across 6 sites (TOC entry, ASCII art, §5 heading + body, §12 totals, three-sentence summary); install URL `v0.12.4` → `v0.13.1` (then bumped to `v0.13.2`); §1 status tagline rewritten; `llms.txt` + `llms-full.txt` narrative taglines hand-rewritten to lead with R6 content; root `package.json` bumped 0.12.4 → 0.13.2.

**Methodology contribution** — R6 adds **LLM-docs SSoT + tooling-script hygiene** as the sixth axis to the audit-cycle ladder. Each round ramps the tooling along with the surface coverage. The methodology rule extends from R5's *a carried blocker is a tooling hypothesis, not a fact* to R6's ***the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be.*** Audit log at [`.audit-runs/2026-05-18-round-6/ISSUES.md`](./.audit-runs/2026-05-18-round-6/ISSUES.md).

**Carried forward** — Style Dictionary `pnpm build` token collisions (now 93, was 88 — my new `semantic/size.tokens.json` adds 5 due to top-level namespace overlap with `primitives/dimension.tokens.json`'s `size.*`; the validator path passes); `pnpm lint` 57 hardcoded-px / hex violations (all pre-existing, mix of real bugs + intentional brand fixtures); Lighthouse perf gate at mobile (R7 candidate).

### v0.13.1 (2026-05-18) — R5 responsive safety net + a11y closeout + R4-deferred primitive coverage gap (ADR 0024)

R5 of the same-day audit cycle. R4 (v0.13.0) explicitly carried forward the sub-768 px responsive sweep as blocked: `claude-in-chrome`'s `resize_window` MCP couldn't propagate to `window.innerWidth`. R5's first move was a tooling swap to `chrome-devtools-mcp emulate` (CDP-level viewport, propagates correctly). The unblocked mobile walk surfaced a systemic bug: at 320 px and 375 px viewports, every Lumen route was reporting `innerWidth = 509` with `(max-width: 639px)` and `(max-width: 767px)` media queries inactive — every `sm:` and `md:` Tailwind utility broken silently because the matcher reads the inflated viewport, not the device viewport. Root cause: descendants whose intrinsic min-content exceeded the device viewport (foundations typography "Stop re-designing." at 128 px needs ~440 px; library showcase Cards need ~484 px) inflated the layout viewport per the CSS Working Group spec. [ADR 0024](./_meta/decisions/0024-responsive-safety-net-v0131.md) ships the root-layer fix: `html, body { overflow-x: clip }` in [`audit-dashboard/src/app/globals.css`](./audit-dashboard/src/app/globals.css). `clip` (not `hidden`) is chosen because it doesn't establish a new scroll container — the v0.12.6 sticky-header chrome continues to anchor to the document scroll root. Verified at 320 px: `innerWidth=320`, `sm:` + `md:` fire correctly. Per-element defense-in-depth at `TypeRow` grid cells (`minmax(0, 1fr) min-w-0 overflow-hidden`) and `dashboard-shell.tsx` (3 sites swap `max-w-max` → `max-w-screen-2xl`).

The mobile walk also caught **10 a11y findings** the desktop walk missed:
- **Switch + Checkbox primitives** now accept `aria-label` / `aria-labelledby` — HTML's implicit-label association does NOT propagate the accessible name to a `<button role="switch">` (Radix overrides the host element role), so the `SwitchRow` wrapper pattern on `/library` was shipping nameless to screen readers.
- **ProgressRing** drops the empty `role="img"` and ships `aria-hidden` when no label is provided; labelled instances announce the full value ("Capacity 72%").
- **DatePickerCalendar** 12 spacer cells per calendar become passive `<span aria-hidden>` instead of nameless disabled `<button>`. Day cells gain `aria-label` with the full date string.
- **ProductGallery** thumbs ship the `role="tab"` + `aria-selected` + `aria-label="View image N of M"` tablist pattern.
- Four more nameless icon buttons retired: **PricingToggle** (`Toggle billing period (currently monthly)`), Kanban column **+** (`Add card to {column.title}`), **ChatComposer +** (`Add attachment`), mobile-inbox search (`Search inbox`).

**R5 primitive coverage closeout** — R4 had flagged that 5 v0.1 baseline button-family primitives (icon-button, button-group, split-button, command-palette-button, fab) had `component.json` + examples but no `component.md` prose; and 7 form primitives (field, textarea, select, checkbox, radio-group, switch, validation-message) had `component.md` + `component.json` but no `examples/primary.tsx`. R5 closes both gaps with 12 new content files in `design-system/02-components/`.

**Two new theme-invariant semantic tokens** — `--label-overlay-strong` + `--label-overlay-fg` for labels-on-arbitrary-color (SwatchRamp step-number chip is the canonical consumer; both themes resolve to the same `var(--lumen-ink-a60)` / `var(--lumen-paper-pure)` because the overlay rests on swatch color, not theme canvas).

**Color-literal hygiene** retires three legacy hex literals: SwatchRamp inline `rgba(0,0,0,0.55)` → `var(--label-overlay-strong)`; ColorPicker `#171A18` (the v0.11 obsidian-mint retired per ADR 0020) → `#0D0D0D`; commerce ColorSwatchSelector "Brick" `#e23b3b` (v0.9-retired AA-failing red, 3.94:1 contrast) → `#a8403a` (deeper brick, AA-pass).

**Methodology contribution** — R5 adds small-viewport metrics as the fifth axis to the audit-cycle ladder (R1 static @ desktop → R2 interaction @ desktop → R3 contract-comparison @ desktop → R4 meta-contract integrity @ desktop → R5 mobile-viewport metrics @ mobile). Each round ramps the tooling along with the surface coverage; *a carried blocker is a tooling hypothesis, not a fact*.

Full audit log at [`.audit-runs/2026-05-18-round-5/ISSUES.md`](./.audit-runs/2026-05-18-round-5/ISSUES.md).

### v0.13.0 (2026-05-18) — LLM-docs version lockstep + R4 comprehensive audit (ADR 0023)

v0.13.0 closes the LLM-discovery layer's version-drift class. The v0.12.5 single-source-of-truth contract (D-018 in USING-LUMEN.md) retired *runtime-UI* version-label drift by routing every rendered version through `audit-dashboard/src/lib/version.ts`. But the LLM-facing *prose* banners in `llms.txt`, `llms-full.txt`, `README.md`, `USING-LUMEN.md`, and `PRIMITIVE-COVERAGE.md` kept their own per-file "Status: v0.X.Y" chips — and through v0.12.6 → v0.12.9 those chips drifted up to four patches stale (e.g. `llms.txt` advertising v0.12.6 while VERSION read 0.12.9). This is exactly the v0.11.13 palette-footer drift class repeating one architectural layer up.

[ADR 0023](./_meta/decisions/0023-llm-docs-version-lockstep-v013.md) extends the lockstep mechanism. `scripts/release.mjs` now rewrites the version chip in those five files in lockstep with `VERSION` and `lib/version.ts` on every `pnpm release {patch|minor|major}`. The pattern matching is INTENTIONALLY narrow — each regex includes enough context (`**Status:`, `> **`, `VERSION ←`, `Generated YYYY-MM-DD for Lumen vX`, `Last reviewed against actual repo state`) to disambiguate the current-version banner from historical-version prose. Casual `v0.12.9` mentions inside CHANGELOG narrative, ADR titles, or prose body will NOT match — the script demonstrates this by leaving the 200+ historical-version mentions across the same files untouched while updating only the seven listed banner sites.

`AGENTS.md` and `CLAUDE.md` top callouts are EXEMPT from the script. They carry per-release narrative prose (the "v0.12.9 — Round 3 fix pack — three real bugs fixed" paragraph) that needs human authorship per cycle; contributors hand-rewrite those as part of the release PR.

The other half of v0.13.0 is the **same-day Round 4 comprehensive live audit**. Every route walked top-to-bottom in both dark + light mode at 1501×812 px against the Edge browser on Personal Mac via the Claude in Chrome MCP. R1 (v0.12.7 — chrome bleed), R2 (v0.12.8 — Commerce PDP variant pickers), and R3 (v0.12.9 — Calendar dynamic / iOS StatusBar / Tool preset client island) had already shipped the visual / interaction surface fixes. R4 confirmed the system is now in a clean steady state — no new bugs requiring component-level fixes surfaced; the major architectural finding was the LLM-docs drift R4 itself ships the contract for. Full audit log at [`.audit-runs/2026-05-18-round-4/ISSUES.md`](./.audit-runs/2026-05-18-round-4/ISSUES.md).

Brand canvas, single-accent rule (background/border/text/aurora only — **not** shadows, per R11), focus-ring contract (theme-aware neutral as of R11), corner-clip contract, version-constant contract, accordion-marker contract — preserved verbatim. The hover-glow ladder per ADR 0022 was retired by ADR 0030 (R11) — primary CTAs no longer cast a green halo; the brand identity lives in the green BG fill alone.

### v0.12.5 (2026-05-07) — Live-audit fix pack (single-source version constant + iconography accent-on-hover + pricing card peak-end lift + FAQ chevron unified + privacy scrubs)
A two-round live visual audit against the deployed Vercel site (round 1 walks all 8 routes statically; round 2 triggers every interactive overlay — ⌘K palette, accordions, dropdowns, hover states) caught five issues that the static walk missed. v0.12.5 ships them as five surgical fixes at five different cascade depths, plus a release-script change to keep the new infrastructure in lockstep:

- **Infrastructure band — single source of truth for the runtime version label.** New [`audit-dashboard/src/lib/version.ts`](./audit-dashboard/src/lib/version.ts) exports `LUMEN_VERSION` (`"v0.12.5"`), `LUMEN_VERSION_MAJOR_MINOR` (`"v0.12"`), and `LUMEN_VERSION_MAJOR_MINOR_UPPER` (`"V0.12"`) for the three rendering contexts. Wired into `dashboard-shell.tsx` (header pill + footer line), `command-palette.tsx` (palette footer — was reading `Lumen v0.11.13` three minor versions stale, the audit's signature catch), `foundations/page.tsx` (hero badge + two `SYSTEM V0.11 · LIVE` brand-voice samples), `library/client.tsx` (hero pill + "End of library — last refreshed" footer), `tool/page.tsx` (page header + Quote Builder titlebar), and `landing/page.tsx` (hero "system v0.12 live" eyebrow). The release script (`scripts/release.mjs`) now bumps `lib/version.ts` in lockstep with the root `VERSION` file. The whole class of cross-file version drift is retired.
- **Micro-interaction band — iconography hover lifts to accent.** Foundations §08 Iconography demo tile hover state was tinting the background only; the icon glyph stayed neutral, so the brand rule "green appears precisely at action" was taught only in prose. v0.12.5 adds `hover:text-[color:var(--text-accent)]` and `hover:border-[var(--border-accent)]` on top of the existing `hover:bg-[var(--surface-tint-accent)]` — three-property hover transition on the 140 ms `motion-fast` curve. The icon now lifts to spring green at the moment of interaction; the rule is felt, not read.
- **Micro-interaction band — pricing card peak-end lift.** Pricing tier cards on landing rendered static — no peak-end micro-interaction at the moment of decision. v0.12.5 adds hover lift via the existing system tokens. Non-highlighted tiers (Starter / Enterprise): `shadow-md` + `border-default` + `-translate-y-[1px]`. Highlighted tier (Operator): layer `var(--shadow-glow-accent)` on top of the rest-state lifted shadow. 140 ms standard easing, decelerate-not-bounce per ADR 0016. Per Premium Psychology principle 3 (peak-end rule), the pricing decision IS a peak moment — the cards now respond.
- **Globals band — `<details>`/`<summary>` marker contract.** Landing FAQ disclosure caret was Unicode `▾` (U+25BE BLACK DOWN-POINTING SMALL TRIANGLE) while commerce + tool used lucide `<ChevronDown />`. v0.12.5 unifies on lucide and adds a new `globals.css` rule (`.lumen-summary` / `summary.list-none`) that suppresses the native browser disclosure marker — `list-style: none` covers modern Chrome / Safari / Firefox via the standard `::marker`, `::-webkit-details-marker { display: none }` covers the pre-2022 webkit fallback. Without the rule, browsers render the native triangle PLUS the custom lucide icon — two arrows compete. With the rule applied (any new accordion summary gets `class="lumen-summary"`), the lucide icon is the sole disclosure cue on every browser.
- **Fixtures band — privacy scrub.** Real-person names (`Daniel Sokolovsky` / `Neel Tengariya` / their initials) appeared in 9 sites across 5 files (`ai.tsx` CommentThread, `foundations/page.tsx` Avatar + AvatarGroup demos + caption sample, `saas/page.tsx` AvatarGroup, `commerce/page.tsx` review fixture, `library/client.tsx` Avatar + AvatarGroup + Reaction-bar). v0.12.5 retires both — replaced with synthetic operator names (`Avery Mercer` / `A Mercer` / `Mercer A.` for Sokolovsky, `Kai Morgan` for Tengariya). The avatar palette is name-hashed, so deterministic colours follow whatever name ships. Carrier names (Sterling LTL, ODFL, Saia, FedEx Freight, ABF, Old Dominion) stay — public B2B identities are safe; customer / contact names aren't.

The fix doesn't ship a new ADR — these are consequential follow-ups to ADRs 0007 (component contract), 0009 (versioning), and 0018 (brand voice / Premium Psychology). The CHANGELOG entry for `[0.12.5]` carries the full architectural notes the would-be ADRs would have held. Brand canvas (v0.12.0), Card corner-clip (v0.12.1), the v0.12.3 inline-style position math, the v0.12.4 InlineTabs / Combobox / focus-ring fixes (focus-ring colors retuned to neutral in v0.14 R11 per ADR 0030), and the single-accent rule (now scoped to background/border/text/aurora only — not shadows — per R11) are all preserved. The v0.12.2 hover-glow ladder retune ([ADR 0022](_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)) was superseded by [ADR 0030 (v0.14 R11)](_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md) which retired the green halo entirely.

### v0.12.4 (2026-05-06) — Three primitive-layer fixes (cascade-fix at the right architectural depth)
User-reported screenshots caught three structural UI bugs in the same session: (1) `/foundations` "Inline tabs · pill" — the active "Day" pill's `bg-raised` square corners poked past the parent `rounded-lg` track at the bottom-left, the same v0.12.1-style corner-clip pattern as Card but at smaller-control scale; (2) `/library` Combobox autocomplete — the dropdown rendered as inline `<div absolute>` and was clipped by the Showcase demo frame's `overflow: hidden` (the same trap applies inside `<Card padding="none">` per ADR 0021); (3) Pagination focus rings inside `<Card padding="none">` were partially clipped by the v0.12.1 `overflow-hidden` corner-clip — the global `:focus-visible` rule used `box-shadow` only, which paints into the element's own painting context and respects ancestor overflow. v0.12.4 fixes all three at the primitive layer:
- **InlineTabs pill** — `TabsList` for `variant="pill"` gains `overflow-hidden`. Active pill's smaller-radius corners clip cleanly to the parent's larger curve.
- **Combobox** dropdown migrates from inline `<div absolute>` to `createPortal(<div fixed>, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Escapes every ancestor's overflow context — works inside `Showcase`, inside `<Card padding="none">`, anywhere.
- **Global `:focus-visible`** retunes from box-shadow-only to `outline 2px solid lime-a64; outline-offset: 1px;` PLUS the existing soft box-shadow glow. Outline is painted outside the layout box — structurally immune to ancestor overflow. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected (declares `outline: none` and wins via specificity per ADR 0016).

The fix doesn't ship a new ADR — these are consequential follow-ups to ADRs 0007 + 0015/0016 + 0021 that close the final trade-offs ADR 0021 left open. Brand canvas (v0.12.0), Card corner-clip (v0.12.1), and the single-accent rule (scoped to non-shadow surfaces per R11) are preserved. The v0.12.2 hover-glow ladder retune was superseded by [ADR 0030 (v0.14 R11)](_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md) which retired the green halo entirely; the focus-ring outline-backstop pattern v0.12.4 introduced still applies, just with theme-aware neutral colors now.

### v0.12.3 (2026-05-06) — PricingToggle thumb-escape · Tailwind v4 arbitrary-translate fragility retired
A user-reported screenshot of the `/library` PricingToggle ("Monthly | toggle | Yearly −2 mo") caught the toggle thumb escaping the track on the right side and overlapping the "Y" of "Yearly". DOM inspection confirmed two layered bugs: Tailwind v4's content scanner intermittently drops the `translate-x-[22px]` arbitrary class (the same scanner fragility ADR 0015 / 0016 retired for the Button primitive — `getComputedStyle(thumb).transform` reported `none` despite the className carrying the utility); and the `<button>` element's browser-default `text-align: center` produced a non-zero static-position `left` for the absolute-positioned thumb, which compounded with the (sometimes-firing) translate to push the thumb past the inner-right edge.

v0.12.3 retires the Tailwind arbitrary-translate dependency on both remaining callers (PricingToggle + SwipeAction) by migrating position math to inline `style.left` + a native `transition: left 120ms cubic-bezier(0.2, 0, 0, 1)`. Inline style is scanner-independent; explicit `left` overrides the static-position fallback. Cascade-fix to ADR 0015/0016 in toggle/swipe territory; no new ADR (the pattern is exactly the one ADRs 0015/0016 already established).

### v0.12.2 (2026-05-06) — Primary-button hover bloom dialed down
User screenshot caught the `/library` LoginCard "Send magic link" button blooming ~40 px past its edge on hover — read as "little too much." The bloom came from a three-layer halo recipe stacked on `.lumen-btn-primary:hover` that was system-dialed-up, not button-specific. Token-level fix:
- `--shadow-button-glow-hover` retuned `0 0 24px lime-a40` → `0 0 20px lime-a28` (v0.12.2). **Superseded in v0.14 R11** ([ADR 0030](./_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md)): now resolves to `var(--shadow-md)` (neutral elevation). Cascades into base `:hover` only — the layered atmospheric halo is retired in R11.
- Layered halo middle layer (the "lit boost") trimmed `24px lime-a20` → `20px lime-a14`.
- Layered halo wide outer layer (the "bloom" edge) trimmed `48px lime-a10` → `32px lime-a08`.
- `.lumen-glow-cta:hover` (hero CTAs) trimmed in lockstep so the standard-vs-hero hierarchy stays intact (hero still ~1.5× the standard primary, just both quieter).

Rest (`16px lime-a25`), active (`8px lime-a20`), `--shadow-glow-accent-strong`, every `--lumen-lime-aXX` alpha primitive, the spring-green hex, and the dual-ring focus indicator are unchanged on purpose. Per [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md), the rest-state halo is the always-present brand signal — that's the brand voice, not the dial-down target. See [ADR 0022](./_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) for the full rationale.

### v0.12.1 (2026-05-06) — Card corner-clip contract
User screenshot caught the `/saas` pagination "Next" button stair-stepping past the rounded bottom-right corner of its `<Card padding="none">` — a square nub of the inner pagination footer's `bg-[var(--surface-raised)]` poked out from behind the curved card border because the Card had `border-radius: 16px` but `overflow: visible`. Primitive-layer fix:
- `<Card padding="none">` now composes `overflow-hidden`. Edge-touching children (table headers, pagination footers, full-bleed product images, list rows) auto-clip to the rounded shape.
- Other padding tiers (`xs`/`sm`/`md`/`lg`/`xl`/`hero`) unchanged — their `p-N` insets float children off the curved edge entirely.
- Radix-portaled popovers, dropdowns, and tooltips render outside the Card subtree and are unaffected.

Cascade benefits: `/saas` Pagination footer (top-right + bottom-right) clean, `/foundations` Satoshi typeface card clean, `/commerce` related-product Cards lose their hand-added `className="overflow-hidden"` workaround. While in the neighborhood, `DatePickerCalendar` month-nav glyphs upgraded from literal `‹` / `›` to `<ChevronLeft size={12} />` / `<ChevronRight size={12} />` (last remaining literal arrow glyphs in the system, completing the v0.11.15 navigation-chrome cleanup). See [ADR 0021](./_meta/decisions/0021-card-corner-clip-contract-v0121.md).

### v0.12.0 (2026-05-06) — Obsidian recolor (mint retired)
User feedback flagged the v0.11 Obsidian Mint canvas (faint G+2 channel undertone, anchored at `#171A18`) as "weird green" — the canvas read as a hue rather than as a confident dark plate, and the spring-green accent had to share the hue stage with it. v0.12 retunes the brand dark anchor to `#0D0D0D` (true neutral, R = G = B at every dark stop) and strips residual G drift from cool/cream/neutral mid-stops. Mood id renamed `obsidian-mint` → `obsidian` with a localStorage migration. The single-accent rule (Spring Green only) is preserved verbatim — only the canvas underneath moved.

Cascade hits 11 brand-ramp primitive token values + the runtime `--lumen-obsidian-N` ramp + cream/ink/void alpha anchors + 30+ on-screen badge/footer copy updates (all describing the mood). 16/16 contrast pairs continue to pass; the contrast-checker pair list itself was extended from 4 dark-mode pairs to 7. See [ADR 0020](./_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md) (amends [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md)).

## Open questions (post-v0.13.1)

1. **Mood lock-in.** Obsidian (neutral, `#0D0D0D`) as system default — confirmed v0.12.0.
2. **Accent calibration.** `#00FA8A` is the user-fixed brand value. AAA contrast verified. Locked.
3. **Component coverage.** Through v0.13.1 the cascade has retired primitive-layer bugs across canvas (v0.12.0), corner-clip (v0.12.1), hover bloom (v0.12.2), arbitrary-translate fragility (v0.12.3), three structural bugs (v0.12.4: corner-clip extension + floating-UI portal + focus-ring outline backstop), version-label SSoT + micro-interactions (v0.12.5), the primitive-coverage drop (v0.12.6 — 63 new contracts), chrome bleed (v0.12.7), Commerce variant pickers (v0.12.8), Calendar / iOS StatusBar / Tool preset client island (v0.12.9), LLM-docs version lockstep + R4 audit (v0.13.0), and the responsive safety net + R5 audit + a11y closeout + R4-deferred coverage gap (v0.13.1 — ADR 0024). Component coverage is at 98 in the shadcn registry. Remaining: full content-doc parity (per-component a11y notes, state matrices for the v0.12.6 additions).
4. **Photography policy.** No photography at all (current default), or accept documentary photography for marketing? — open.
5. **E-commerce template direction.** Aspirational (future Warp merch shop) or for client work? — open.
6. **Mobile mood.** Obsidian, or Premium Glass for the mobile operator app? — open.
7. **ADR-less patches as architectural pattern.** v0.12.3 / v0.12.4 / v0.12.5 / v0.12.6 / v0.12.7 / v0.12.8 / v0.12.9 explicitly ship without new ADRs because the underlying patterns (defensive primitives over Tailwind scanner fragility per ADRs 0015/0016, corner-clip contract per ADR 0021, two-file component contract per ADR 0007, single semver per ADR 0009, brand voice per ADR 0018) are already established. v0.13.0 and v0.13.1 DID ship new ADRs (0023 + 0024) because each introduced a new architectural contract (LLM-docs version lockstep at the build-script layer; root-layer responsive safety net via `overflow-x: clip`). The ADR floor stays at "every new architectural decision"; cascade-fixes stay in CHANGELOG.
8. **Live-audit cadence.** The audit-cycle ladder is now five rounds (R1 static @ desktop, R2 interaction @ desktop, R3 contract-comparison @ desktop, R4 meta-contract integrity @ desktop, R5 small-viewport metrics @ mobile). Each round ramps the tooling along with the surface coverage. v0.13.1 codifies the meta-rule: *a carried blocker is a tooling hypothesis, not a fact* — re-test the tooling before each round. Cadence: ad-hoc per release vs. quarterly vs. CI-automated visual diff? — open. Plausible R6 axis: Lighthouse perf gate at mobile.

See [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md) (premium-psychology recolor, amended by 0020), [ADR 0020](./_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md) (obsidian recolor — mint retired), [ADR 0021](./_meta/decisions/0021-card-corner-clip-contract-v0121.md) (Card corner-clip contract), [ADR 0022](./_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) (hover-glow ladder retune — **historical**, superseded by ADR 0030), [ADR 0023](./_meta/decisions/0023-llm-docs-version-lockstep-v013.md) (LLM-docs version lockstep), [ADR 0024](./_meta/decisions/0024-responsive-safety-net-v0131.md) (responsive safety net), [ADR 0029](./_meta/decisions/0029-v014-omnibus-systemic-gap-closure.md) (v0.14 omnibus), [ADR 0030](./_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md) (**v0.14 R11 — no green shadows + docs↔code sync mandate**), [ADR 0031](./_meta/decisions/0031-r12-dark-text-ladder-and-lazy-mount-ssr-v0141.md) (v0.14.1 R12 — dark text-ladder + LazyMount SSR), [ADR 0032](./_meta/decisions/0032-r13-lazy-mount-paint-flash-elevation-lift-v0142.md) (v0.14.2 R13 — LazyMount paint-flash + Elevation lift), [ADR 0033](./_meta/decisions/0033-r14-docs-tokens-drift-lint-v0143.md) (**v0.14.3 R14 — docs-tokens drift lint** — closes the 4 doc surfaces ADR 0030 left out of its sync sweep), [CHANGELOG entries](./CHANGELOG.md) (per-version detail and the structural fixes that don't have their own ADRs), and [`/research/lumen-brief.md`](./research/lumen-brief.md) for older open questions.

## License

Lumen itself is internal to Warp.

Bundled fonts:
- **Satoshi** — Indian Type Foundry Free Font License (ITF-FFL). Free for personal + commercial use; must self-host; **must NOT be redistributed in a public repo**. See [`/audit-dashboard/src/fonts/SATOSHI-LICENSE.txt`](./audit-dashboard/src/fonts/SATOSHI-LICENSE.txt).
- **JetBrains Mono** — SIL Open Font License 1.1.

Pre-launch action item: have legal archive a PDF copy of the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl`.

## Credits

Lumen is built by Warp's product/software-builder team, in-house. The visual identity inherits Warp's actual brand DNA observed from production CSS at wearewarp.com. Inspiration draws from Apple's Human Interface Guidelines, Dieter Rams's Ten Principles of Good Design (Vitsoe), Jony Ive's body of work, and best-in-class systems by Linear, Stripe, Vercel, Figma, Notion, Things, Bear, Arc, Polaris, Carbon, Material 3, and Primer.
