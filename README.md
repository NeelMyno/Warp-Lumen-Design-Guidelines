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
Glow ladder:        Primary CTA rest 16px a25 → hover 20px a28 → active 8px a20 (v0.12.2 hover dialed down)
Card padding=none:  Auto-clips edge-touching children to the rounded corner (v0.12.1 corner-clip contract)
Density:            Marketing breathes (96 px hero rhythm) · Operator stays dense (24 px section rhythm)
Distribution:       shadcn registry · npx shadcn add <registry>/<name>
Tokens:             DTCG JSON · Style Dictionary v5 · 9 platform outputs
LLM contract:       llms.txt + AGENTS.md + CLAUDE.md + tool-specific mirrors
Status:             v0.12.2 · primary-button hover bloom dialed down · 7 principles · 22 ADRs
```

## What this repo is

This repo is the **single source of truth** for Lumen. Everything Warp's team ships should pull tokens, components, and rules from here.

It contains:
- Design tokens in DTCG JSON (primitives → semantic → component) — 887 tokens across 32 files. v0.11.13 added 24 new primitives to close the master→child inheritance chain.
- Component contracts (Markdown spec + JSON sidecar) for 35 components: 12 v0.1 baseline + 8 v0.6 forms layer + 10 v0.7 deferred-form completion + 5 added through v0.8–v0.11.
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
├── VERSION                         ← 0.12.2
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

## What's new — v0.12.x

### v0.12.2 (2026-05-06) — Primary-button hover bloom dialed down
User screenshot caught the `/library` LoginCard "Send magic link" button blooming ~40 px past its edge on hover — read as "little too much." The bloom came from a three-layer halo recipe stacked on `.lumen-btn-primary:hover` that was system-dialed-up, not button-specific. Token-level fix:
- `--shadow-button-glow-hover` retuned `0 0 24px lime-a40` → `0 0 20px lime-a28`. Cascades into both base `:hover` and the first layer of the layered halo.
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

## Open questions (post-v0.12.2)

1. **Mood lock-in.** Obsidian (neutral, `#0D0D0D`) as system default — confirmed v0.12.0.
2. **Accent calibration.** `#00FA8A` is the user-fixed brand value. AAA contrast verified. Locked.
3. **Component coverage.** v0.12.0 retuned canvas; v0.12.1 fixed corner-clip; v0.12.2 retuned hover bloom. Visual regression sweep against the full audit dashboard at light + dark + both moods remains.
4. **Photography policy.** No photography at all (current default), or accept documentary photography for marketing? — open.
5. **E-commerce template direction.** Aspirational (future Warp merch shop) or for client work? — open.
6. **Mobile mood.** Obsidian, or Premium Glass for the mobile operator app? — open.

See [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md) (premium-psychology recolor, amended by 0020), [ADR 0020](./_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md) (obsidian recolor — mint retired), [ADR 0021](./_meta/decisions/0021-card-corner-clip-contract-v0121.md) (Card corner-clip contract), [ADR 0022](./_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) (hover-glow ladder retune), and [`/research/lumen-brief.md`](./research/lumen-brief.md) for older open questions.

## License

Lumen itself is internal to Warp.

Bundled fonts:
- **Satoshi** — Indian Type Foundry Free Font License (ITF-FFL). Free for personal + commercial use; must self-host; **must NOT be redistributed in a public repo**. See [`/audit-dashboard/src/fonts/SATOSHI-LICENSE.txt`](./audit-dashboard/src/fonts/SATOSHI-LICENSE.txt).
- **JetBrains Mono** — SIL Open Font License 1.1.

Pre-launch action item: have legal archive a PDF copy of the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl`.

## Credits

Lumen is built by Warp's product/software-builder team, in-house. The visual identity inherits Warp's actual brand DNA observed from production CSS at wearewarp.com. Inspiration draws from Apple's Human Interface Guidelines, Dieter Rams's Ten Principles of Good Design (Vitsoe), Jony Ive's body of work, and best-in-class systems by Linear, Stripe, Vercel, Figma, Notion, Things, Bear, Arc, Polaris, Carbon, Material 3, and Primer.
