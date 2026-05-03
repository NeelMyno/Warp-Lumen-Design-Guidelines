---
title: Lumen — Synthesised Design Brief
date: 2026-05-02
type: research
tags: [research, brief, lumen, warp, design-system]
sources_count: 73
status: draft
supersedes: null
---

# Lumen — Synthesised Brief

> Lumen is the working name for the Warp design system. This brief consolidates four parallel research streams (Warp brand DNA, Apple/Ive/Rams inspiration, Satoshi typography, LLM-first architecture) into a single set of decisions the rest of the system is built on.

## TL;DR (read this if nothing else)

1. **Visual mood: Quiet Industrial.** Rams-inflected restraint and Apple typographic discipline rendered on Warp's actual material — paper-warm white in light mode, Warp's own navy ladder (`#131c2a → #1a2332 → #222d3e`) in dark mode.
2. **Accent: Warp lime green (`#4ade80`), one role only.** Action / live / success. Used 788 times in Warp's production CSS — the only loud color in the entire system. Adding a second loud color would dilute the brand.
3. **Type: Satoshi (UI/display) + JetBrains Mono (numerics/code/tables) on a 1.25 modular scale.** Editorial pair is Source Serif 4. Plan B sans is Inter (for Cyrillic/Greek coverage or Windows ClearType escape). All four are free under permissive licenses.
4. **Density is dense, not airy.** Warp's substance is "freight Bloomberg terminal" — long single-column scrolls, ~1100–1200 px content widths, FAQ accordions, multi-section pages. Apple's whitespace lives *inside* sections, not between them. 12+ sections per page is fine if each is typographically composed.
5. **Photography is essentially absent.** No stock warehouses, no mascots, no isometric scenes. The hero is data — live tickers, screenshots of the operator UI, monoline diagrams for abstract concepts. Customer / press logos in muted strips.
6. **Three live-data primitives carry the brand.** `Stat` (big tabular numeric + small mono unit), `LiveDot` (8 px green dot with a 2 px pulsing ring), `RateTicker` (horizontal scrolling lane rates). These three signal "operator console" more than any hero or CTA can.
7. **Architecture: DTCG JSON tokens → Style Dictionary v5 → 8 platform outputs.** Three-layer taxonomy (primitives → semantic → component). Two-file-per-component contract (`component.md` for humans, `component.json` for LLMs). Distribution via shadcn registry, not npm. LLM contract layered: `llms.txt` + `AGENTS.md` + `CLAUDE.md` + `.cursor/rules/` + `.warp/`.

## The synthesis

The user asked for "Apple, clean, minimal, polished, inspired by Jony Ive and Dieter Rams." Warp's actual brand reads as a freight Bloomberg terminal: dense, dark, monospace, instrument-panel green. These two directions are not in tension — they're at different layers. Apple/Ive/Rams is the **discipline** (typographic rigor, spacing intentionality, 1px hairlines, motion that decelerates, color used as supplement and not signal). Warp is the **substance** (dense info, monospace numerics, live data primitives, dark canvas, one disciplined accent). Lumen sits at their intersection.

Concretely:

| Layer | Apple / Ive / Rams contributes | Warp contributes |
|---|---|---|
| Color | Restraint, "color as supplement, not signal," dark/light parity | Specific palette: navy ladder + lime green, used per-role |
| Typography | 1.25 modular scale, tight tracking on display, Dynamic Type / Material 3 mappings | Mono companion for numerics is non-negotiable; near-zero adjectives in copy; tabular alignment for any data |
| Spacing | 8pt grid, generous whitespace | Whitespace inside sections, not between them; long-scroll pages OK |
| Imagery | Documentary > stock; no characters; subtle | None for in-product UI; screenshots first for marketing |
| Motion | Decelerate, ≤200ms for UI, honor Reduce Motion | One signature pulse on the LiveDot |

## Decisions made

These are committed unless the user changes them at audit. They are the source of truth for everything in `/design-system/`.

### D-001 · Visual mood
**Decision:** Quiet Industrial (per inspiration brief). Three alternative moods are documented (`soft-luminous`, `mono-editorial`, `premium-glass`) and exposed in the audit dashboard's mood switcher so the user can compare. They are not eliminated; they remain available as variant moods (e.g. Soft Luminous for editorial / blog templates, Premium Glass for the iOS operator app).
**Why:** Rams's "less but better" + Ive's "care is total" + Warp's actual brand all converge on a paper/navy + one-loud-accent system. The other three moods drift further from at least one of these constraints.
**Source:** `/research/inspiration-brief.md` §"Visual moods for Warp", `/research/warp-brand-dna.md` §"Implications for the design system" item 1.

### D-002 · Color
**Decision:**
- **Accent**: Warp lime green ramp anchored at `#4ade80` (token `accent.500`). Hover at `#34c977` (verified from Warp production CSS), press at `#22c55e`, accent text on light at `#16a34a`, accent FG (text on accent surfaces) at `#071109`.
- **Light mode canvas**: warm-paper white `#fafaf7`. Cards on `#ffffff`. Sunken on `#f1f1ec`. Primary text `#0e1219`.
- **Dark mode canvas**: Warp's actual navy ladder, copied verbatim. Page `#131c2a`, surface 1 `#141c2b`, surface 2 `#1a2332`, surface 3 `#222d3e`, border `#253040`, border-strong `#334155`. Primary text `#f0f2f5`.
- **One accent rule.** The green plays exactly one role — action / live / success. It does not appear in marketing decoration, gradient sweeps, or non-action chrome. Status states use their own muted bg+fg pairs.
- **Status palette.** Info (Warp `#38bdf8` family), success (Warp `#22c55e` family), warning (Warp `#f59e0b` family), danger (Warp `#ef4444` family). Always paired with a label or shape — Apple HIG rule.
**Why:** This palette is Warp's actual production CSS, not invented. Choosing anything else would create a system that doesn't look like Warp. The single-accent discipline is what makes Warp recognisable from across a room — diluting it loses the signature.
**Source:** `/research/warp-brand-dna.md` §"Color system as observed".

### D-003 · Typography
**Decision:**
- **Primary face: Satoshi** (Indian Type Foundry, ITF-FFL, free for commercial use). Variable woff2 for production. Weights used: 300 / 400 / 500 / 700 / 900 — Black reserved for hero impact words.
- **Mono: JetBrains Mono** (OFL). Used wherever numbers appear (KPIs, tables, money, ETAs, weights, code, terminal output). Tabular numerics enabled by default via `font-feature-settings: "tnum" 1`.
- **Editorial pair: Source Serif 4** (Adobe, OFL, variable with `opsz` axis). For longform marketing / blog only — never UI chrome.
- **Plan B sans: Inter** (OFL). Documented as the swap for: ITF licensing change, Cyrillic/Greek market expansion, or Windows ClearType QA failure at 12–14 px.
- **Scale: 1.25 (Major Third) on 16 px base.** Sizes: 12/13/14/15/16/18/20/25/31/39/49/61/76 px.
- **Per-platform maps:** iOS Dynamic Type, Material 3 type roles. Both documented in `/design-system/03-platforms/`.
**Why:** Satoshi is the user's locked choice and is a sensible swap for Warp's Space Grotesk (both geometric sans). JetBrains Mono is the right mono for a terminal-adjacent product like Warp. The 1.25 scale is the sweet spot the typography research validated for cross-platform.
**Source:** `/research/satoshi-typography.md`.
**License action item:** Have legal pull canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build (the live page is JS-rendered).

### D-004 · Spacing & geometry
**Decision:**
- 4-based scale: 0/4/8/12/16/20/24/32/40/48/64/80/96/128 px.
- Radius: 2/4/6/10/14/20/28/9999 px. Inputs at 6, cards 10–14, hero surfaces 20, pills only for status badges and counters.
- Hairline borders (1 px at ~7% on light, ~12% on dark) do most of the surface separation. Shadows are reserved for floating UI (popovers, modals, toasts).
**Why:** Linear / Stripe / Apple all converge here. Warp's own production CSS shows ~12–20 px as the dominant card radius — matches.
**Source:** Inspiration brief, Warp brand DNA §"Border radius scale".

### D-005 · Motion
**Decision:** Decelerate, don't bounce. `easing-standard: cubic-bezier(0.2, 0, 0, 1)`. UI duration `180 ms`; state changes `260 ms`; never longer than `400 ms` outside reduced-motion-exempt sequences. The `LiveDot` pulse is the one signature recurring animation (3 s ease-out infinite). All motion respects `prefers-reduced-motion`.
**Why:** Apple HIG, plus the Warp keyframe `trackPulse` is the one Warp-native motion that makes it into the system intact.
**Source:** `/research/inspiration-brief.md` §"Motion principles", Warp brand DNA §"Motion".

### D-006 · Imagery, illustration, animation
**Decision:**
- In-product UI: **none** (no decorative imagery).
- Marketing: product screenshots first, documentary photography second (real warehouses / ports / trucks, never stock), no illustrated mascots or characters. Abstract concepts use mono-line technical drawings.
- Iconography: 1.5 px stroke, 24 px grid, rounded ends, no fills. Custom logistics set (truck, lane, BOL, dock) sits inside the same drawing language. Linear's icon set + Apple SF Symbols are reference.
- Customer / press logos: muted monoline strips, no photo backgrounds, no logo soup.
**Why:** Warp ships zero stock photography in production today — keeping that constraint preserves the brand. The Apple/Ive lineage actively rejects character mascots and "AI sparkle" gradients.
**Source:** `/research/warp-brand-dna.md` §"Imagery & iconography", inspiration brief §"Imagery, illustration, motion".

### D-007 · Content density
**Decision:** Dense over airy. Long single-column pages with 12+ sections are acceptable as long as each section is typographically composed. Content widths: 1100 px (primary), 1200 px (wide hero), 720 px / 60 ch (reading column). Tables: compact 32 px rows, regular 40 px, cozy 48 px — operator-density for shipments.
**Why:** Warp pages are content-heavy (FAQ accordions, multi-section verticals). Apple's whitespace lives *within* sections; mimicking marketing whitespace at the wrong layer would make the system feel airy in a way that contradicts Warp's substance.
**Source:** `/research/warp-brand-dna.md` §"Layout & rhythm", §"Density".

### D-008 · Live-data signature primitives
**Decision:** Three first-class primitives ship with Lumen as the brand's recurring signature:
1. **`Stat`** — big bold tabular numeric, small mono unit, optional delta/trend. Sizes sm/md/lg/xl. Right-align in tables.
2. **`LiveDot`** — 8 px filled green dot + 2 px pulsing ring (3 s ease-out infinite). Color overrideable for warning/danger states.
3. **`RateTicker`** — horizontal marquee of lane rates (`LAX → SFO  $262`), monospace, `60 s` linear loop, `prefers-reduced-motion` honored.
**Why:** These three are observed verbatim in Warp's production UI and carry the operator-console mood more than any button or card. Without them, Lumen is "another minimal SaaS system."
**Source:** `/research/warp-brand-dna.md` §"Voice/visual signatures unique to Warp" + §"Implications for the design system" item 3.

### D-009 · Architecture
**Decision:**
- **Token format**: DTCG JSON 2025.10. Source-of-truth at `/design-system/01-tokens/{primitives,semantic,components}/`.
- **Build pipeline**: Style Dictionary v5.4. Outputs CSS variables, Tailwind v4 `@theme` block, TypeScript constants, iOS Swift class, Android XML + Compose Kotlin object, Flutter Dart class, Shopify Liquid CSS, flat JSON. Build artifacts in gitignored `_build/`.
- **Three-layer token taxonomy**: primitives (raw, mode-agnostic) → semantic (role-based, mode-aware) → component-bound (only when needed). Engineers and LLMs only consume semantic tokens. Enforced by lint.
- **Component contracts**: `component.md` (frontmatter + canonical sections, MDX-compatible) + `component.json` (machine schema, validated by `_schema/component.schema.json`). CI keeps them in sync.
- **Distribution**: shadcn registry (`/_registry/registry.json`), not npm. Consumers run `npx shadcn add <registry-url>/button`.
- **LLM contract surfaces**: layered, each does one job. `/llms.txt` discovery index → `/AGENTS.md` universal rules → `/CLAUDE.md` Claude-specific addenda → `/.cursor/rules/lumen.mdc` + `/.warp/lumen.mdc` + `/.github/copilot-instructions.md` mirror AGENTS.md (auto-generated).
- **Versioning**: semver on the whole system, Keep-a-Changelog format, deprecations announced one minor ahead.
**Why:** Concrete, current best practice as of May 2026. The architecture research validated each call individually.
**Source:** `/research/system-architecture.md`.

## Open questions for user audit

The dashboard at `/audit-dashboard/` is the place to resolve these visually. Each question maps to a decision above; the dashboard's mood switcher is the audit instrument.

1. **Mood lock-in.** Quiet Industrial is the recommended default. The other three moods (Soft Luminous, Mono Editorial, Premium Glass) are exposed in the dashboard for comparison. Is Quiet Industrial the default for *all* project types, or do specific surfaces (e.g. mobile operator app) want a different mood?
2. **Accent green calibration.** `#4ade80` is verbatim from Warp's production CSS. The dashboard renders it across every page type. Is the intensity right, or should we soften it (e.g. desaturate 8–12% for marketing surfaces while keeping pure for action chrome)?
3. **Mono companion.** JetBrains Mono is the default. Berkeley Mono is the premium upgrade option ($75 personal / ~$200 commercial) — is the brand-mono signature worth the cost for the marketing layer, or is JetBrains Mono enough?
4. **Photography policy.** The Warp brand has no in-product photography. Does Lumen's marketing accept *any* photography (documentary, real warehouses) or stay screenshots-only?
5. **E-commerce direction.** The e-commerce template applies the same design language to a storefront — but Warp itself is not an e-commerce brand. Is this template aspirational (for a future Warp-branded merch shop) or for client work? Affects copy and density choices.
6. **Mobile mood.** Mobile may be a candidate for `premium-glass` (iOS-leaning) rather than Quiet Industrial. Operator app vs. customer app distinction matters here.

## File layout the brief informs

```
Warp-Lumen-Design-Guidelines/
├── README.md
├── llms.txt, llms-full.txt, AGENTS.md, CLAUDE.md, CHANGELOG.md, VERSION
├── style-dictionary.config.ts
├── design-system/
│   ├── 00-foundations/   ← decisions D-005, D-006, D-007 expand here
│   ├── 01-tokens/        ← decisions D-002, D-003, D-004 expand here
│   ├── 02-components/    ← decisions D-008 + every component spec
│   ├── 03-platforms/     ← per-platform consumption guides
│   └── 04-content/       ← decision D-006 + voice-and-tone
├── _registry/            ← shadcn-compatible JSON sidecars
├── _meta/                ← glossary, ADRs (each decision above is an ADR), prompt fragments
├── _build/               ← gitignored, Style Dictionary outputs
├── audit-dashboard/      ← Next.js 16 / Tailwind v4 / Satoshi
└── research/             ← four research reports + this brief
```

## Sources

- `/research/warp-brand-dna.md` — primary, observed from Warp's compiled CSS and product UI.
- `/research/inspiration-brief.md` — Apple/Ive/Rams + best-in-class product references.
- `/research/satoshi-typography.md` — Satoshi specs, pairings, license, scale.
- `/research/system-architecture.md` — DTCG, Style Dictionary, shadcn registry, LLM contract layers.

## Method

This brief was synthesised from four parallel research streams. Each stream wrote its own report; I cross-referenced the four and resolved conflicts in favour of the most evidence-grounded source per topic (production CSS over secondary summaries; canonical specs over summarisers). Where one stream's recommendation contradicted another (e.g. inspiration recommended a slate-blue or Braun-amber accent, Warp's brand demanded lime green), I resolved by preferring the brand-DNA observation, since Warp is the system's actual brand owner.
