# Lumen — Warp's Design System

> Lumen is Warp's vertically integrated UI design system. **LLM-first, human-second.** Single source of truth for every UI surface Warp's product/software-builder team ships — web, mobile, native desktop, e-commerce themes.

```
Visual mood:        Obsidian Mint · cool-neutral paper + obsidian-mint canvas + radial spring-green aurora
Accent:             Spring Green #00FA8A — action / live / success only
Dark canvas:        Obsidian Mint #171A18 — warm-cool near-black, faint green undertone
Light anchor:       #E6E6E6 — neutral light, also used as primary text on dark canvas
Typography:         Satoshi (single typeface — UI, display, body, numerics, code, editorial)
Hierarchy:          Aggressive — one focal point per section, 1.5–2× weight gap to support tier
First impression:   Engineered — 50ms halo contract, three-question hero, restrained chrome
Micro-interactions: Peak-end rule — hover, focus, validation, success — short, decelerating
Density:            Marketing breathes (96 px hero rhythm) · Operator stays dense (24 px section rhythm)
Distribution:       shadcn registry · npx shadcn add <registry>/<name>
Tokens:             DTCG JSON · Style Dictionary v5 · 9 platform outputs
LLM contract:       llms.txt + AGENTS.md + CLAUDE.md + tool-specific mirrors
Status:             v0.11.13 · DTCG inheritance audit pass · master→child token chain rewired · 7 principles
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
├── VERSION                         ← 0.11.13
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
├── _meta/                          ← glossary, ADRs (× 18), prompt fragments (× 5)
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

- **Apple discipline + Warp substance + premium psychology.** Apple typographic rigor (1.25 scale, hairlines, decelerate motion) + the v0.11 psychology principles (50ms halo, aggressive hierarchy, cognitive fluency, peak-end rule) on Warp's material (cool-neutral paper / obsidian-mint canvas, spring-green accent, contextual density).
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

## What's new in v0.11.13

v0.11.13 (2026-05-05) closed a DTCG inheritance audit — the master→child token chain was rewired across primitives, semantic, component, and runtime layers. Three problems closed:

- **Shadow regression.** `shadow.tokens.json` had inlined v0.4 lime `rgba(74,222,128,X)` literals despite the v0.11 spring-green retune. Shadows now reference `color.alpha.accent.*` and inherit any future accent change.
- **Semantic-layer leaks.** 18 hardcoded hex/rgba literals in the dark + light semantic colour files were rewired to reference primitives. New `color.absolute.{white,black}` primitives now back every theme-invariant white or black.
- **Runtime drift.** 30+ inline literals in `audit-dashboard/src/app/globals.css` (pills, status surfaces, glass, button glow ladder, AI shimmer, hero halos, mark-link rings, error/warning text) were rewired to consume tokens.

Net: changing one primitive (`color.accent.500`, `color.status.danger.500`, etc.) now cascades through every alpha, shadow, focus ring, glow, pill, and status surface automatically. Token count grew from 694 to 887. See [CHANGELOG.md](./CHANGELOG.md) v0.11.13 entry for the full breakdown.

## Open questions (post-v0.11.13)

These are the decisions left open after the v0.11 Premium Psychology recolor and the v0.11.13 inheritance-audit pass:

1. **Mood lock-in.** Quiet Industrial — Obsidian Mint as system default — confirmed.
2. **Accent calibration.** `#00FA8A` is the user-fixed brand value. AAA contrast verified. Locked.
3. **Component coverage.** v0.11 retuned colour across all 35 components; v0.11.13 finished the token-inheritance side. Visual regression sweep against the audit dashboard remains.
4. **Photography policy.** No photography at all (current default), or accept documentary photography for marketing? — open.
5. **E-commerce template direction.** Aspirational (future Warp merch shop) or for client work? — open.
6. **Mobile mood.** Quiet Industrial — Obsidian Mint, or Premium Glass for the mobile operator app? — open.

See [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md) for the full v0.11 rationale and [`/research/lumen-brief.md`](./research/lumen-brief.md) for older open questions.

## License

Lumen itself is internal to Warp.

Bundled fonts:
- **Satoshi** — Indian Type Foundry Free Font License (ITF-FFL). Free for personal + commercial use; must self-host; **must NOT be redistributed in a public repo**. See [`/audit-dashboard/src/fonts/SATOSHI-LICENSE.txt`](./audit-dashboard/src/fonts/SATOSHI-LICENSE.txt).
- **JetBrains Mono** — SIL Open Font License 1.1.

Pre-launch action item: have legal archive a PDF copy of the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl`.

## Credits

Lumen is built by Warp's product/software-builder team, in-house. The visual identity inherits Warp's actual brand DNA observed from production CSS at wearewarp.com. Inspiration draws from Apple's Human Interface Guidelines, Dieter Rams's Ten Principles of Good Design (Vitsoe), Jony Ive's body of work, and best-in-class systems by Linear, Stripe, Vercel, Figma, Notion, Things, Bear, Arc, Polaris, Carbon, Material 3, and Primer.
