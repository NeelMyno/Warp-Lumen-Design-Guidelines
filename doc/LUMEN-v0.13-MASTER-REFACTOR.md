# LUMEN v0.13 — Master Refactor Briefing for Claude Code

> Single-source briefing for an "unhinged refactor" of Warp's Lumen design system, from v0.12.4 → v0.13.0. Hand this file to Claude Code as the root prompt. Everything Claude Code needs to start work — context, constraints, architecture, file layout, hard rules, verification gates, paste-ready templates — lives in this document or in files it tells you to create.

**Author:** Neel (product designer, Warp / wearewarp.com)
**Target system:** github.com/NeelMyno/Warp-Lumen-Design-Guidelines
**Live preview:** https://warp-lumen-design-guidelines.vercel.app
**Operator surface for this work:** Claude Code, agentic, with `/init` + AGENTS.md + per-skill SKILL.md context.

---

## 0. Mission

Lumen is a 250+ component, single-typeface, single-accent design system that already ships discipline and taste at v0.12.4. The refactor is not about replacing that. It is about three things:

1. **Making Lumen LLM-first as a distributed system, not just as docs.** Tokens become DTCG 2025.10 JSON, components become a shadcn registry under `@lumen/*`, agent context lives in AGENTS.md and per-component SKILL.md files, and a Lumen MCP server exposes the whole graph to Claude Code, Cursor, Codex, and Copilot via the standard `npx shadcn add @lumen/<name>` flow.
2. **Adding a parallel Expressive mode without forking a single component.** Restrained stays the default for dense operator surfaces (dashboards, tables, terminals, settings). Expressive turns on for landing, AI surfaces, onboarding, marketing, hero panels, and empty states. Mode switching is a single `data-mode` attribute on a scope root; primitives, semantics, and components are shared.
3. **Building a freight-domain visual language that ChatGPT image generation can produce on-brand.** A single canonical style anchor file feeds a library of paste-ready prompts for `gpt-image-2`. Engineers fill in one subject line, get an on-brand asset.

You have wide latitude on internal architecture, file names, naming conventions, and code-level decisions. You do not have latitude on the hard rules in §6 or the verification gates in §10. When in doubt, **pause and ask** — see §4.

---

## 1. Read-first context

Before writing a single line of code, do these reads in this order. Do not skip any.

1. **The live foundations page.** Fetch `https://warp-lumen-design-guidelines.vercel.app/foundations` and read everything between the H1 and the footer. This is the ground truth for v0.12.4 tokens, surfaces, typography, motion, and voice. Treat the values on that page as authoritative — match every existing hex, every existing token name, every existing scale stop. The page lists 11 obsidian stops, 8 surface roles, 9 radius stops, 6 control heights, and 5 motion durations. Reproduce them in DTCG format exactly.
2. **The other six surface pages.** Fetch `/library`, `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop`. Map every component you see by visual inspection to a registry item. The site reports v0.12.4 with ~250 components; produce an inventory CSV under `tools/inventory.csv` with columns `name,surface,observed_at_path,proposed_registry_name,priority,notes`.
3. **The existing GitHub repo.** Clone `github.com/NeelMyno/Warp-Lumen-Design-Guidelines`. Read the README, the top-level folder structure, and any `design-system/` folder contents. Do not modify anything yet. Note what currently exists vs. what this briefing introduces.
4. **The freight-domain context.** Warp (wearewarp.com) is a middle-mile freight network — pallets, lanes, cross-docks, LTL carriers, on-time delivery, real-time tracking, 98.2% OTD. Lumen's voice ("instrument-panel", "operator-density", "stop re-designing", lane codes like `LAX→SFO`, mono-uppercase tracked labels) is freight-native. The Expressive mode should evoke logistics infrastructure — route arcs, lane heat-maps, container yards, dock bays, network graphs — not generic SaaS abstraction.
5. **The four named inspiration anchors.** Open and study these in a browser tab:
   - `https://dribbble.com/RonDesignLab` — specifically the *Navy Mobile – Truck Management Dashboard*, *BizSpeed TMS – Logistics Web Dashboard*, and *SpaceX App – Space Mission Control* shots. These are the dark-mission-control variants; they are the relevant references, not the Cargo TMS case (which is light-canvas with Urbanist).
   - `https://linear.app/now/behind-the-latest-design-refresh` — Linear's most recent UI refresh blog, quote *"a calmer interface for a product in motion"*. Lumen's restrained mode shares this DNA.
   - `https://github.com/vercel-labs/skill-remotion-geist/blob/main/skills/create-remotion-geist/SKILL.md` — the canonical shape for an agent-readable design-system skill file. Lumen's per-component SKILL.md files copy this format.
   - `https://nordhealth.design/llms.txt` and `https://nordhealth.design/ai/skills/` — the canonical shape for design-system `llms.txt` + Agent Skills delivery.
6. **The two upstream specs.** Skim these enough to know the schema shapes:
   - DTCG Design Tokens Format Module 2025.10 — `https://www.designtokens.org/tr/drafts/format/`. The spec stabilized on October 28, 2025; this is the format the token graph must conform to. Note the 13 token types, `$value`/`$type`/`$description` shape, alias syntax `{token.name}`, OKLCH support, and composite types (typography, shadow, gradient).
   - shadcn registry schema — `https://ui.shadcn.com/docs/registry/registry-json` and `/docs/registry/registry-item-json`. Note `$schema`, `name`, `type`, `cssVars.theme|light|dark`, `registryDependencies`, `files[].type` types.

---

## 2. Constraints that don't move

The user has named these. They are not optional. Every recommendation you make must clear all six.

1. **Dual-mode, leaning bold-expressive.** Restrained for dense surfaces (dashboards, tables, settings, terminals). Expressive for landing, marketing, AI surfaces, onboarding, empty states, hero panels. Mode is a `data-mode="restrained"|"expressive"` scope on a container, never a per-component prop. Primitives and components are shared; only semantic surface/background/motion tokens rebind under expressive.
2. **LLM-first, MD-driven, no Figma.** Every artifact must be discoverable and parseable by Claude Code, Codex, Cursor, and Copilot without a designer in the loop. Source of truth is markdown + JSON, not a Figma library.
3. **66 products across 9+ platforms.** Web SaaS, iOS native, Android native, macOS native, Windows native, Shopify embedded, browser extensions, CLI / TUI, MCP servers, landing pages, responsive web. The token graph must translate to all of these; the component graph translates to the subset each platform can render.
4. **GPT-image-2 native image pipeline.** Engineers should be able to copy a paste-ready prompt and produce on-brand assets. Snapshot-pin the model to `gpt-image-2-2026-04-21` in every prompt to prevent drift when OpenAI rolls forward the alias.
5. **Vibe-coded with Claude Code as the primary engineering surface.** The system must be optimized for retrieval by an agent with ~200K context window, not for human browsing. Layer: `llms.txt` → `AGENTS.md` → per-component `SKILL.md` → registry JSON → component source. Smallest correct context for the current task wins.
6. **Preserve v0.12.4 brand DNA verbatim.** Satoshi everywhere. `#00FA8A` as the only loud color. `#0D0D0D` obsidian canvas. Hairline frames. Mono-uppercase tracked-out labels. Italic accent on one signature word per hero. LiveDot, RateTicker, Stat as signature primitives. Brutalist hairline frame voice element. 4-point base / 8-point soft grid. WCAG 2.2 AA contrast. These are immovable.

---

## 3. What you are NOT allowed to break

If you find yourself about to do any of these, stop and ask the operator first.

- **Do not change `#0D0D0D` to anything else.** No warmer-gray drift, no `oklch(0.141 0 0)` "equivalent" that's actually different by 0.5%. Token alias is fine; the resolved color stays #0D0D0D.
- **Do not introduce a second loud color.** No purple, no blue, no orange, no cyan. Spring Green `#00FA8A` is the only accent. Status palettes (lumen-red, lumen-amber) exist as 10-stop ramps; they stay polite, never decorative.
- **Do not abandon Satoshi.** No Inter, no Geist Sans, no system font fallback as a primary. Satoshi covers UI, display, numerics, code, editorial — separated by weight, size, and OpenType features (`tnum`, `lnum`, `zero`, `case`, `pnum`, `ss01–ss04`, italic VF). Geist Mono may be added *only* as an explicit alternate numeric face under a `code.fallback` token, never as the default.
- **Do not promote glass/mesh/aurora onto the dashboard canvas.** Expressive mode is scoped. Inside a `data-mode="restrained"` block — which is every SaaS dashboard, every table, every settings panel — `backdrop-filter` is reserved for floating shells (popover, sheet, command palette, hero device frame). It does not touch the page canvas, the data table, the row, or the cell. Ever.
- **Do not delete v0.12.4 token names without an alias.** The repo's existing public token names (`--lumen-neutral-N` resolves to `--lumen-cream-N` is the documented pattern) must keep their aliases through v0.13. Breaking changes belong in v1.0, not v0.13.
- **Do not add new "true exceptions" to the 4/8-point grid without a token.** The current exceptions (`--space-1_5: 6px`, `--size-control-cozy: 36px`, `--radius-xs: 3px`, `--size-dot-md: 19px`, `--shadow-focus-ring: 3px`) are documented and named. New off-grid values must be added as named tokens or rejected.
- **Do not regress WCAG 2.2 AA.** Body text ≥ 4.5:1, large/bold UI ≥ 3:1. On glass surfaces this means alpha ≥ 50% over the canvas plus a contrast probe — see §6.
- **Do not generate Lumen icons via gpt-image-2.** Icons stay vector, hand-drawn, 1.5px stroke, 24px grid. gpt-image-2 generates atmosphere (heroes, illustrations, abstract shapes, mesh backgrounds, pattern fields). Not iconography that ships in product chrome.

---

## 4. Operating principles for Claude Code

These are how you should behave during the refactor, not what to build. Internalize them before reading §7.

1. **Read before writing. Every time.** Do not generate a new component MD file before reading the existing `/foundations` token and the most recent equivalent component on the live site. Drift from established v0.12.4 vocabulary is the single highest-cost failure mode.
2. **Ask, don't guess, on ambiguity.** Research from ICLR 2026 (AMBIG-SWE) found that coding agents default to silent non-interactive behavior, which dropped resolve rates from 48.8% to 28%. You are explicitly licensed to pause and surface a one-question clarification to the operator when:
   - A v0.12.4 token name conflicts with the new DTCG name you'd generate.
   - A visual decision (e.g., "should this card be glass in expressive mode?") isn't determined by the existing rules.
   - A platform translation forces a trade-off (e.g., "Compose can't replicate this blur cheaply, fall back to solid?").
   Pose the question, give two or three concrete options, wait for an answer before proceeding.
3. **Self-critique before each commit.** Before staging a phase as done, run the §10 self-critique checklist against your own work. Surface what changed, what you assumed, what's still uncertain. One wrong assumption usually invalidates more than one downstream decision.
4. **Parallel where possible, sequential only when blocked.** Phases 2 through 5 (see §7) contain many independent files. Generate them in parallel. Phase 0 → 1 is the only mandatory sequential edge.
5. **Token specificity is cheap; missing detail is expensive.** Err on the side of more named tokens, more `$description` fields, more per-component SKILL.md hard-rules. The marginal cost is small. The cost of an agent guessing a value next week is hours of rework.
6. **Never sequentially what can be done in parallel.** When generating per-component MD files, batch them. When converting tokens, batch them. When writing platform translations, do all three (iOS / Android / Web) in one pass.
7. **One source of truth per fact.** If a hex value lives in `01-tokens/primitives/color.tokens.json`, it does not also live in a component's CSS as a literal. Components reference the token by name (`var(--color-spring-500)` or `{color.spring.500}` alias). No hex literals anywhere except inside the primitives layer.
8. **Document the why, not the what.** SKILL.md and MD files should explain *why* a constraint exists, not just state it. "Glass only on floating shells **because** dense data tables fail contrast at AA on a busy backdrop" — not "use glass sparingly."
9. **Output is for retrieval, not browsing.** Write component MD files assuming an agent will load one at a time with a 50K context budget, not a human scrolling. Lead with frontmatter, then a one-line summary, then anatomy, then do/don't, then code. Keep each under 4K tokens unless the component is genuinely complex.

---

## 5. Target architecture (the shape v0.13 takes)

You will produce this folder structure. Anything not listed gets deleted unless preserved by `.lumenkeep` (see §6 hard rule on preservation).

```
design-system/
├── AGENTS.md                       # 250-line agent briefing (root)
├── CLAUDE.md                       # @AGENTS.md + Claude-specific MCP hints
├── README.md                       # human-facing (links to AGENTS.md)
├── llms.txt                        # 5–10K-token index for AI consumption
├── llms-full.txt                   # generated flattened dump (build step)
├── components.json                 # shadcn registry config
├── registry.json                   # shadcn registry entry point
├── package.json                    # @warp/lumen workspace root
│
├── 00-foundations/
│   ├── principles.md               # the 7 principles, restated
│   ├── voice-and-tone.md
│   ├── accessibility.md            # WCAG 2.2 AA + reduced-motion + reduced-transparency
│   ├── motion.md                   # easing, springs, stagger, reduced-motion
│   ├── modes.md                    # restrained vs expressive routing rules
│   ├── inspirations.md             # Navy Mobile, BizSpeed TMS, Linear, Geist, refs
│   └── glossary.md                 # freight domain + system terminology
│
├── 01-tokens/
│   ├── primitives/
│   │   ├── color.tokens.json       # 11 obsidian + 10 neutral + 10 spring + 10 red + 10 amber
│   │   ├── spacing.tokens.json     # 4-pt base, 8-pt soft, named exceptions
│   │   ├── typography.tokens.json  # Satoshi roles, OpenType feature flags
│   │   ├── radius.tokens.json      # 9 stops, xs through 4xl + full
│   │   ├── elevation.tokens.json   # 6 shadows + glass + glow-accent + focus
│   │   ├── motion.tokens.json      # 5 durations + 6 easings + 2 springs
│   │   ├── glass.tokens.json       # blur, saturate, alpha, border
│   │   ├── mesh.tokens.json        # 5 mesh recipes (expressive only)
│   │   ├── noise.tokens.json       # 3 grain variants (expressive only)
│   │   └── gradient.tokens.json    # ambient atmosphere, hero scrim (expressive only)
│   ├── semantic/
│   │   ├── surface.tokens.json     # canvas, raised, sunken, popover, glass, tint-accent…
│   │   ├── text.tokens.json        # primary, secondary, tertiary, accent, inverse
│   │   ├── border.tokens.json      # hairline, default, strong, frame, accent, focus
│   │   └── action.tokens.json      # button intents, link, focus
│   └── modes/
│       ├── restrained.tokens.json  # default rebind set
│       └── expressive.tokens.json  # mesh/gradient/glass rebind set
│
├── 02-components/
│   └── <name>/                     # one folder per registry item
│       ├── <name>.md               # human-readable + LLM frontmatter
│       ├── <name>.skill.md         # Vercel-format SKILL.md, hard rules verbatim
│       ├── <name>.tsx              # React canonical implementation
│       ├── <name>.swift            # SwiftUI translation (where applicable)
│       ├── <name>.kt               # Compose translation (where applicable)
│       ├── <name>.test.tsx
│       ├── <name>.stories.tsx      # Storybook 10.3 manifest contributor
│       └── <name>.registry.json    # shadcn registry-item.json
│
├── 03-patterns/                    # multi-component flows
│   ├── chat-thread.md
│   ├── citation-card.md
│   ├── agent-approval-flow.md
│   ├── command-palette-flow.md
│   ├── lane-search.md              # freight-native
│   ├── shipment-timeline.md        # freight-native
│   └── quote-builder.md            # freight-native
│
├── 04-platforms/
│   ├── web.md
│   ├── ios.md
│   ├── android.md
│   ├── macos.md
│   ├── windows.md
│   ├── shopify.md
│   ├── extension.md
│   ├── cli.md
│   ├── mcp-host.md
│   └── responsive.md
│
├── 05-prompts/                     # GPT-image-2 prompt library
│   ├── style-anchor.md             # immovable master prompt
│   ├── hero-background.md
│   ├── abstract-shape.md
│   ├── illustration.md
│   ├── pattern.md
│   ├── mesh.md
│   ├── empty-state.md
│   └── marketing-card.md
│
├── 06-claude-code-briefings/       # one-MD-per-phase, paste-ready
│   ├── phase-0-foundation.md
│   ├── phase-1-expressive.md
│   ├── phase-2-components.md
│   ├── phase-3-platforms.md
│   ├── phase-4-prompts.md
│   ├── phase-5-ai-native.md
│   └── phase-6-mcp-and-docs.md
│
├── 07-mcp/                         # Lumen MCP server
│   ├── server.ts
│   ├── tools/
│   │   ├── list_components.ts
│   │   ├── get_component.ts
│   │   ├── get_tokens.ts
│   │   ├── get_prompt_template.ts
│   │   ├── search.ts
│   │   └── install.ts
│   └── README.md
│
├── tools/                          # build, conversion, validation
│   ├── style-dictionary.config.ts  # DTCG → CSS / Tailwind / Swift / Kotlin
│   ├── build-registry.ts
│   ├── build-llms-txt.ts
│   ├── inventory.csv
│   ├── audit-contrast.ts           # WCAG verifier
│   └── audit-motion.ts             # reduced-motion verifier
│
└── audit-dashboard/                # the Next.js Vercel app (existing)
    └── …                           # keep, but rebuild against new token graph
```

---

## 6. Hard rules (verbatim — copy into AGENTS.md)

These are the rules an agent should follow without rethinking. Copy them, do not paraphrase them.

```
HARD RULES — LUMEN v0.13

# Color
- NEVER introduce a second loud color beyond Spring Green #00FA8A.
- Obsidian canvas is #0D0D0D. Resolved value never drifts.
- Status palettes (lumen-red, lumen-amber) are pair-only (bg/fg on badges, banners, toasts).
- Never use color alone to convey meaning — always paired with label or shape.

# Typography
- Default typeface = Satoshi. Always. UI, display, numerics, code, editorial.
- One italic word per hero, in accent color. Never two. Never on body.
- Numerics use Satoshi with tnum + zero on, calt off (.lumen-mono class).
- Mono-uppercase tracked label = Satoshi + 0.16em tracking + uppercase + tnum.
- Geist Mono allowed as code.fallback token only, never default.

# Layout
- 4-point base, 8-point soft grid. Structural pixels are multiples of 4 (preferring 8).
- True off-grid exceptions are tokenized: --space-1_5 (6), --size-control-cozy (36), --radius-xs (3), --size-dot-md (19), --shadow-focus-ring (3). No new exceptions without a token.

# Modes
- data-mode="restrained" is default for: SaaS dashboards, tables, settings, terminals, command palette, every dense operator surface.
- data-mode="expressive" only for: landing, marketing, AI surfaces, onboarding, empty states, hero panels.
- Mode is a scope attribute on a container. Never a per-component prop.
- Components do not branch on mode; semantic tokens rebind under mode.

# Glass / Backdrop-Filter
- backdrop-filter only on floating shells (popover, sheet, command palette, hero device frame, nav).
- NEVER on page canvas, data table, table row, table cell.
- Always paired with `-webkit-backdrop-filter`.
- Always `@supports not (backdrop-filter)` fallback to solid surface.
- Always `@media (prefers-reduced-transparency: reduce)` bumps alpha to ≥ 85%.
- Blur radius 8–15px restrained, up to 28px on hero shells expressive.

# Motion
- Default easing = cubic-bezier(0.2, 0, 0, 1) (decelerate, no bounce).
- LiveDot pulse = 3s loop. RateTicker = linear marquee. Aurora fade-in = expressive only.
- Spring tokens: --motion-spring-default (damping: 28, stiffness: 280).
- ALWAYS honor prefers-reduced-motion via @media at :root, plus per-animation fallback.

# Accessibility
- Body text contrast ≥ 4.5:1 (WCAG 2.2 AA). Large/bold UI ≥ 3:1.
- Focus ring always visible — --shadow-focus, 3.5px lime alpha-40, every surface.
- All interactive controls hit one of the six tokenized heights (sm 32, cozy 36, md 40, touch 44, lg 48, xl 56).

# Tokens
- DTCG 2025.10 format. Every token has $value + $type + $description.
- Alias syntax: {token.path.name}. Never duplicate values.
- One source of truth per fact. Components reference tokens by name. No hex literals outside primitives.

# Components
- Mirror Vercel AI Elements naming for AI primitives (Conversation, Message, Reasoning, Tool, Sources, InlineCitation, PromptInput, Suggestion, Confirmation, Artifact, WebPreview, Agent).
- Anthropic Citations API JSON shape for citation UI: cited_text, document_title, document_index.
- Public React props stable with v0.12.4 unless a breaking change is justified and noted in CHANGELOG.
- Every component MUST consume tokens. NEVER hardcode color / spacing / radius.

# Imagery
- gpt-image-2 generates atmosphere. Icons stay vector hand-drawn.
- Every image prompt opens with @import 05-prompts/style-anchor.md.
- Pin the model: snapshot gpt-image-2-2026-04-21 in every prompt.
- Output budget: 1 hero per landing surface, 1 illustration per onboarding step, 1 abstract shape per empty state. Don't paste images decoratively.

# AI-Agent Behavior (for Claude Code)
- Read the live foundations page before writing tokens.
- Read the existing component's MD file before regenerating it.
- Ask, don't guess, on ambiguity (see Operating Principles §4).
- Self-critique before each phase commit (see Verification Gates §10).
- One CHANGELOG entry per registry item touched. No silent edits.
```

---

## 7. Phased work breakdown

Seven phases, sequenced as labeled. Phases 2–5 contain independent files and should be parallelized internally. Each phase has a `done =` definition; do not advance until the gate clears.

### Phase 0 — Foundation reset & DTCG conversion

Convert the v0.12.4 token reality (visible on `/foundations`) into DTCG 2025.10 JSON. This is the most load-bearing phase; everything downstream consumes its output.

**Tasks (parallel where listed):**
- [parallel] Generate `01-tokens/primitives/color.tokens.json` with the 11 obsidian stops, the 10 neutral stops, the 10 spring stops, the 10 lumen-red stops, the 10 lumen-amber stops. Each token `$type: "color"`, `$value` as hex in primitives. Add `$description` referencing the role.
- [parallel] Generate `spacing.tokens.json`, `radius.tokens.json`, `typography.tokens.json`, `motion.tokens.json`, `elevation.tokens.json`. Mirror the values from `/foundations` exactly.
- [parallel] Generate `semantic/surface.tokens.json` with all 8 surface roles (canvas, raised, sunken, popover, glass, tint-accent, tint-strong, inverse), each as an alias to a primitive.
- [parallel] Generate `semantic/text.tokens.json`, `border.tokens.json`, `action.tokens.json`.
- [sequential] Install Style Dictionary v4 with DTCG support. Configure `tools/style-dictionary.config.ts` to emit five platform outputs: CSS variables, Tailwind preset (`tailwind.preset.ts`), SwiftUI extension (`Lumen+Colors.swift`), Compose Color object (`LumenColors.kt`), JSON dump.
- Write `00-foundations/principles.md`, `voice-and-tone.md`, `motion.md`, `modes.md`. Restate v0.12.4's seven principles verbatim from the live site.
- Write `AGENTS.md` (root, under 300 lines, see §8 template) and `CLAUDE.md` (single line: `@AGENTS.md` plus Claude-specific MCP hint).
- Write `llms.txt` (5–10K tokens, Nord pattern, see §8 template).

**Done =** `npm run tokens` emits five platform artifacts. Resolved CSS variable values exactly match the values on `/foundations`. The contrast audit (`tools/audit-contrast.ts`) reports 100% pass on body text and 100% pass on large UI. AGENTS.md is under 300 lines.

**Risks:** Style Dictionary v4 does not yet fully support DTCG 2025.10 (full support is a v5 in-progress per the Style Dictionary docs). Use the DTCG-compatible subset that works in v4 and pin the dependency. Do not block on v5.

### Phase 1 — Expressive mode primitives

Introduce the mode-switching architecture and the expressive-only token sets. No existing component changes yet.

**Tasks (parallel where listed):**
- [parallel] Generate `01-tokens/primitives/glass.tokens.json`, `mesh.tokens.json`, `noise.tokens.json`, `gradient.tokens.json`. Mesh defines 5 named recipes (e.g., `mesh.aurora-spring`, `mesh.aurora-cool`, `mesh.dock-bay`, `mesh.lane-arc`, `mesh.cross-dock`). Noise defines 3 variants (subtle 6%, default 8%, strong 12%).
- [parallel] Generate `01-tokens/modes/restrained.tokens.json` (the default rebind set) and `expressive.tokens.json` (the rebind set that swaps `surface.hero`, `surface.canvas-ambient`, `motion.atmosphere` to mesh + grain + animated gradient).
- [parallel] Build `<ModeScope>` React primitive in `02-components/mode-scope/` that sets `data-mode` on a div. Default `restrained`. Accept `expressive` to switch.
- Write `00-foundations/modes.md` documenting the routing rules: which routes use which mode, which surfaces use which mode, what falls back when `prefers-reduced-transparency` or `prefers-reduced-motion` fires.
- Implement a single landing-page hero in expressive mode end-to-end, in a new `examples/landing-hero/` folder. This is the proof-of-concept and the contrast/perf benchmark.
- Run Lighthouse on the hero. Performance must clear 90 on mid-range mobile. CLS must be under 0.1.

**Done =** Switching `<ModeScope>` from `restrained` to `expressive` on the landing hero example flips the visual without changing any component code. `prefers-reduced-transparency` and `prefers-reduced-motion` correctly fall back. Lighthouse perf ≥ 90.

### Phase 2 — Component library refactor → shadcn registry

Convert the existing 250 components into a namespaced shadcn registry under `@lumen/*`. Add per-component SKILL.md files.

**Tasks (run priority order, parallel within tier):**

Tier 1 — primitives (do first, depended on by everything):
- Button, Input, Card, Sheet, Popover, Tooltip, Toast, Badge, Tag, Avatar, Skeleton, Spinner, Tabs, Breadcrumb, Switch, Checkbox, Radio, Slider, Progress

Tier 2 — composed (depend on Tier 1):
- DataTable, CommandPalette, Drawer, Modal, DropdownMenu, Combobox, Calendar, DatePicker, FilterBuilder, FilterChip, SavedView, Sidebar, TopBar, Breadcrumb, Pagination

Tier 3 — Lumen signatures (the existing brand primitives — Stat, LiveDot, RateTicker):
- Preserve current behavior. Add registry JSON. Add SKILL.md. Translate to Swift / Kotlin.

Tier 4 — freight-domain composites (new or formalized):
- LaneCode, LaneArc, ShipmentTimeline, RouteMap, DockBay, CrossDockGrid, CarrierBadge, PalletTile, OTRTruckIso, QuoteBuilder

For each component:
1. Read its current visual state on the live site.
2. Generate `<name>/<name>.md` with frontmatter (see §8 template).
3. Generate `<name>/<name>.skill.md` in Vercel format with verbatim hard rules.
4. Generate `<name>/<name>.tsx` (React, token-driven, no hex literals).
5. Generate `<name>/<name>.registry.json` (shadcn schema).
6. Generate `<name>/<name>.stories.tsx` (Storybook 10.3 Manifest contributor).
7. Add to root `registry.json` items array.

**Done =** `npx shadcn add @lumen/button` installs Button in a fresh Next.js 15 app and renders correctly with Lumen tokens. Every component MD file is under 4K tokens. Storybook MCP queries return token bindings per component.

### Phase 3 — Platform translations

Generate per-platform translation guides and reference implementations. Three platforms in parallel: iOS, Android, Web (already done). Remaining platforms (macOS, Windows, Shopify, extension, CLI, MCP, responsive) follow.

**Per-platform deliverable:**
- `04-platforms/<platform>.md` documenting: which Lumen tokens map to which platform API, what's lost in translation, what's added (platform-specific affordances), the identity budget for that surface.
- A reference app or playground per platform (where feasible).

**Specific translation rules:**
- **iOS / SwiftUI:** `surface.glass` → `.regularMaterial`; `surface.glass-strong` → `.thickMaterial`. Honor Reduce Transparency via `accessibilityReduceTransparency`. Honor Reduce Motion via `accessibilityReduceMotion`.
- **Android / Compose:** Native `Modifier.blur()` blurs the element, not the backdrop, and is API 31+. Use `dev.chrisbanes.haze` library: `Modifier.hazeSource(state)` on the backdrop, `Modifier.hazeEffect(state) { blurEffect { blurRadius = 20.dp } }` on the foreground.
- **macOS / AppKit:** Bridge `NSVisualEffectView` via `NSViewRepresentable`. Map `surface.glass` → `material: .hudWindow` or `.popover` depending on context.
- **Windows / WinUI:** `AcrylicBrush` for native; Electron uses web tokens with `vibrancy: 'acrylic'` BrowserWindow option.
- **Shopify:** Polaris is GA as of October 1, 2025. App Bridge surfaces (title bar, nav, save bar, modals, toasts) are Shopify-rendered and unstylable. Budget brand identity at ≤ 15% of pixel surface: brand voice, iconography, accent on chips/badges, onboarding illustration.
- **Browser extension:** Scope every Lumen rule under a shadow root. `:host { all: initial; }` reset to prevent host-page CSS bleed.
- **CLI / TUI:** Use Charm's Lipgloss for Go or Ink for Node. Adaptive color via `AdaptiveColor{Light, Dark}` and `CompleteColor` for ANSI 256 / Truecolor downsampling. RoundedBorder = card surface. Hierarchy via Bold / Italic / Underline / Dim / Reverse only.
- **MCP server:** No UI, but tone and voice still matter. Tool names, parameter descriptions, error messages follow Lumen voice.

**Done =** Each platform has a reference implementation that ships a button, a stat, and a glass surface (where applicable). Each platform MD file names the API mapping and documents the trade-offs.

### Phase 4 — GPT-image-2 prompt library

Build the paste-ready prompt system for image generation.

**Tasks:**
- Write `05-prompts/style-anchor.md` — the immovable master prompt. See §9 for the verbatim content.
- Write per-asset-type templates: `hero-background.md`, `abstract-shape.md`, `illustration.md`, `pattern.md`, `mesh.md`, `empty-state.md`, `marketing-card.md`. Each opens with `@import ./style-anchor.md` and adds slot-specific subject / constraints.
- Snapshot-pin the model to `gpt-image-2-2026-04-21` in every prompt to prevent drift.
- Generate one reference asset per template at gpt-image-2 quality `high`. Store them under `examples/gpt-image-2/` so future runs can compare against canonical output.
- Add a `tools/lumen-prompts` CLI that emits a prompt string given a template name and subject — single-line invocation for engineers who don't want to open the MD file.

**Done =** Two engineers running the same prompt produce visually consistent output (subjectively — eyeball test, not automated). Reference assets exist for every template type.

### Phase 5 — AI-native component specialization

Build the AI primitives. These are new components, not refactors of existing ones.

**Components to add (mirror Vercel AI Elements naming verbatim):**
- `Conversation`, `ConversationContent` (auto-scrolling, virtualized)
- `Message`, `MessageContent`, `MessageResponse` (streaming-optimized markdown, shimmer on partial tokens)
- `Reasoning` (collapsible "Thinking" block, fades when complete)
- `Tool` with `ToolHeader`, `ToolInput`, `ToolOutput`
- `Confirmation` (Lumen brand: brutalist hairline frame around destructive approvals)
- `Sources` + `InlineCitation` — JSON shape from the Anthropic Citations API: `cited_text`, `document_title`, `document_index`
- `PromptInput` + `PromptInputSelect` (model selector), `Suggestion` chips, slash-command palette
- `Artifact`, `WebPreview`, `CodeBlock` (CodeBlock already exists — formalize)
- `Agent` state indicator: idle / thinking / running tool / awaiting approval / done / error
- `Context` window display (token usage bar) — `Stat` + progress meter composition

**Cross-cutting:**
- Map every AI-primitive token onto the OpenAI ChatKit theme variables (`theme.color.accent.primary`, `theme.color.accent.level`, `theme.radius`, `theme.density`, `theme.typography.fontFamily`) so a Lumen-themed ChatKit embed is a single line of CSS.

**Done =** A Lumen-themed chat surface ships in `examples/ai-surface/`. A ChatKit embed at `examples/chatkit/` inherits Lumen tokens with no per-component overrides.

### Phase 6 — Documentation polish, MCP server, dashboard rebuild

Final wiring.

**Tasks:**
- Build the Lumen MCP server (`07-mcp/`) exposing: `list_components`, `get_component`, `get_tokens`, `search`, `install`, `get_prompt_template`. Local stdio + HTTP transport. Publish as `@warp/lumen-mcp` on npm.
- Generate `llms-full.txt` build step that flattens every component MD, every token JSON, every prompt template into one file. Build via `tools/build-llms-txt.ts`.
- Rebuild the audit dashboard at `/library` against the new token graph. Add a mode toggle (restrained / expressive). Add live token introspection (click a token, see its value, where it's used, which components depend on it).
- Final CHANGELOG entry: `v0.13.0`. Document every breaking change, every alias preserved, every new token, every new component.

**Done =** Claude Code can `/mcp` add `@warp/lumen-mcp`, then run "build me a glass AI hero with a lane-arc background for the landing page" and produce correct, on-brand React + tokens output without further prompting.

---

## 8. Paste-ready templates

### 8.1 AGENTS.md (root, ≤ 300 lines, ≤ 4K tokens)

```markdown
# Lumen Design System — Agent Context

Lumen is Warp's design system. v0.13.0. Dark-first, operator-density, freight-native.

## At a glance
- Typeface: Satoshi (everywhere, every weight, every role).
- Accent: Spring Green #00FA8A — the only loud color.
- Canvas: Obsidian #0D0D0D.
- Grid: 4-point base, 8-point soft.
- Modes: restrained (default, dense surfaces) | expressive (landing, AI, marketing).
- Spec: DTCG 2025.10 tokens. Shadcn registry. Vercel AI Elements naming for AI primitives.

## Build & install
- `npm install` at repo root.
- `npm run tokens` rebuilds DTCG → CSS / Tailwind / Swift / Kotlin.
- `npm run registry` rebuilds shadcn registry payload.
- `npm run llms` rebuilds llms.txt and llms-full.txt.
- `npm run test` runs Vitest + Playwright + axe-core.
- `npm run audit` runs contrast + motion + token-coverage audits.

## How to add a component
1. `npx shadcn add @lumen/<name>` from any consumer project (after publishing).
2. To author a NEW component inside this repo:
   - Create `02-components/<name>/` folder.
   - Generate `<name>.md`, `<name>.skill.md`, `<name>.tsx`, `<name>.registry.json`, `<name>.stories.tsx`, `<name>.test.tsx`.
   - Add the item to root `registry.json`.
   - Run `npm run registry` and `npm run llms`.
3. Read `02-components/_TEMPLATE/` for the canonical shape.

## How to add a token
1. Add to `01-tokens/primitives/<category>.tokens.json` in DTCG format.
2. Alias from semantic layer if needed.
3. Run `npm run tokens`.
4. NEVER hardcode hex / spacing / radius in component source.

## Hard rules
[Paste the full §6 hard-rules block here, verbatim.]

## File map
- 00-foundations/ — principles, voice, accessibility, motion, modes.
- 01-tokens/ — DTCG JSON, primitives + semantic + modes.
- 02-components/ — one folder per registry item.
- 03-patterns/ — multi-component flows.
- 04-platforms/ — per-platform translation guides.
- 05-prompts/ — gpt-image-2 prompt templates.
- 07-mcp/ — Lumen MCP server.

## Where to ask
- Visual ambiguity → operator (Neel).
- Token naming conflict → operator (Neel).
- Platform fallback decision → operator (Neel).
- Don't guess. Don't proceed silently.

## Done = what
- Tests pass: `npm run test`.
- Audits pass: `npm run audit` (contrast 100%, reduced-motion fallback 100%, token coverage 100%).
- Visual regression CI green in both modes.
- CHANGELOG entry exists for every registry item touched.
- llms.txt and llms-full.txt regenerated.
```

### 8.2 llms.txt (root)

```markdown
# Lumen Design System

> Warp's design system for freight logistics SaaS. Dark-first, operator-density,
> Spring Green (#00FA8A) on obsidian (#0D0D0D), Satoshi typeface, dual-mode
> (restrained | expressive), LLM-first MD-driven, DTCG 2025.10 tokens.

## Foundations
- https://warp-lumen-design-guidelines.vercel.app/foundations.md
- 00-foundations/principles.md
- 00-foundations/voice-and-tone.md
- 00-foundations/accessibility.md
- 00-foundations/motion.md
- 00-foundations/modes.md

## Tokens (DTCG 2025.10)
- 01-tokens/primitives/color.tokens.json
- 01-tokens/primitives/typography.tokens.json
- 01-tokens/primitives/spacing.tokens.json
- 01-tokens/primitives/radius.tokens.json
- 01-tokens/primitives/elevation.tokens.json
- 01-tokens/primitives/motion.tokens.json
- 01-tokens/primitives/glass.tokens.json
- 01-tokens/primitives/mesh.tokens.json
- 01-tokens/primitives/noise.tokens.json
- 01-tokens/primitives/gradient.tokens.json

## Components
[Generated list, one bullet per registry item, link to its MD file.]

## Patterns
- 03-patterns/chat-thread.md
- 03-patterns/citation-card.md
- 03-patterns/agent-approval-flow.md
- 03-patterns/lane-search.md
- 03-patterns/shipment-timeline.md
- 03-patterns/quote-builder.md

## Platforms
- 04-platforms/web.md
- 04-platforms/ios.md
- 04-platforms/android.md
- 04-platforms/macos.md
- 04-platforms/windows.md
- 04-platforms/shopify.md
- 04-platforms/extension.md
- 04-platforms/cli.md
- 04-platforms/mcp-host.md

## Prompt library (gpt-image-2)
- 05-prompts/style-anchor.md
- 05-prompts/hero-background.md
- 05-prompts/abstract-shape.md
- 05-prompts/illustration.md
- 05-prompts/pattern.md
- 05-prompts/mesh.md
- 05-prompts/empty-state.md
- 05-prompts/marketing-card.md

## MCP
- 07-mcp/README.md
- Install: `npx shadcn mcp add @warp/lumen-mcp`

## Hard rules (must follow)
- [Paste the full §6 hard-rules block here, verbatim.]
```

### 8.3 Per-component SKILL.md (Vercel format)

```markdown
---
name: lumen-prompt-input
description: Use when generating an AI prompt input surface in a Lumen-themed React app. Returns a token-driven PromptInput component matching Vercel AI Elements naming, with model selector, suggestion chips, slash-command palette, and reduced-motion / reduced-transparency fallbacks.
---

# Lumen PromptInput

Token-driven prompt input matching the Lumen AI surface contract. Mirrors Vercel AI Elements naming so a Lumen-themed ChatKit embed is one line of CSS.

## Use when
- Building any AI chat surface inside a Lumen app.
- Replacing an ad-hoc textarea with a brand-correct prompt input.
- Adding a model selector or suggestion chips to an existing chat.

## NEVER
- NEVER hardcode color / spacing / radius. Always reference tokens via CSS variables.
- NEVER add a second accent color. Spring Green #00FA8A is the only accent.
- NEVER apply backdrop-filter to the input itself — glass goes on the floating slash-command palette, not the input row.
- NEVER use emoji as affordance. Use Lumen icons (lucide-react + custom 1.5px-stroke set).
- NEVER drop focus ring. --shadow-focus is required on every focusable element.

## Tokens consumed
- surface.raised (input background)
- surface.popover (slash-command palette)
- text.primary, text.secondary
- border.default, border.focus
- accent.text (suggestion chip hover)
- motion.fast (chip appearance)
- shadow.focus

## Anatomy
1. Composer row: text input + slash trigger + suggestion strip + model selector + send action.
2. Model selector: dropdown above the composer, default model preselected.
3. Suggestion chips: 2–4 chips above the composer, dismissible.
4. Slash-command palette: floating popover surface, glass in expressive mode, solid in restrained.

## API
- `value`, `onChange`, `onSubmit` — standard controlled input.
- `model`, `onModelChange`, `models[]` — for the selector.
- `suggestions[]`, `onSuggestionPick` — for the chip strip.
- `tools[]` — pinned slash commands (mirrors OpenAI ChatKit shape).

## Modes
- Restrained: solid `surface.raised`, no glass anywhere.
- Expressive: slash-palette becomes `surface.glass`. Composer row stays solid for legibility.

## Accessibility
- Composer is a `<textarea>` with `aria-label="Prompt"`.
- Slash palette is a `<menu role="menu">` with arrow-key navigation.
- Suggestion chips are `<button>` elements, not divs.
- Focus management: open palette → first item focused; escape → return to composer.

## Code (canonical)
```tsx
// 02-components/prompt-input/prompt-input.tsx
import { useState } from "react";
import { PromptInputSelect } from "./prompt-input-select";
// …

export function PromptInput({ value, onChange, onSubmit, ... }) {
  // implementation that consumes tokens via CSS variables.
}
```

## Related
- 02-components/conversation/conversation.md
- 02-components/suggestion/suggestion.md
- 02-components/agent/agent.md
- 03-patterns/chat-thread.md
```

### 8.4 Per-component MD (frontmatter shape)

```yaml
---
name: PromptInput
category: ai
lumen_version: 0.13.0
status: stable
mode: dual
platforms: [web, ios, android, macos]
tokens:
  - surface.raised
  - surface.popover
  - text.primary
  - border.default
  - border.focus
  - accent.text
  - motion.fast
  - shadow.focus
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: [Conversation, Suggestion, PromptInputSelect, Tool, Agent]
ai_naming: vercel-ai-elements
mcp_install: "npx shadcn add @lumen/prompt-input"
---
```

### 8.5 DTCG token example (Spring Green primitive + surface alias)

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "color": {
    "spring": {
      "500": {
        "$value": "#00FA8A",
        "$type": "color",
        "$description": "Lumen single accent — action / live / success only. Never decorative. Never paired with a second loud color."
      }
    },
    "obsidian": {
      "10": {
        "$value": "#0D0D0D",
        "$type": "color",
        "$description": "Canvas. Neutral near-black, no chromatic tilt at any stop on the dark portion (R = G = B). Resolved value never drifts."
      }
    }
  },
  "surface": {
    "canvas": {
      "$value": "{color.obsidian.10}",
      "$type": "color",
      "$description": "Page background."
    },
    "glass": {
      "$value": "{color.obsidian.10}",
      "$type": "color",
      "$description": "Floating shell. blur 20 + saturate 140 + hairline. Reserved for nav, popovers, sheets, hero device shells.",
      "$extensions": {
        "lumen.alpha": 0.5,
        "lumen.blur": "20px",
        "lumen.saturate": "140%",
        "lumen.fallback": "{color.obsidian.10}"
      }
    }
  }
}
```

### 8.6 shadcn registry-item.json example (PromptInput)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "prompt-input",
  "type": "registry:component",
  "title": "Prompt Input",
  "description": "Token-driven AI prompt input. Composer row + model selector + suggestion chips + slash-command palette. Mirrors Vercel AI Elements naming.",
  "registryDependencies": ["@lumen/button", "@lumen/popover", "@lumen/select"],
  "dependencies": ["lucide-react", "react"],
  "files": [
    {
      "path": "02-components/prompt-input/prompt-input.tsx",
      "type": "registry:component"
    },
    {
      "path": "02-components/prompt-input/prompt-input-select.tsx",
      "type": "registry:component"
    },
    {
      "path": "02-components/prompt-input/use-prompt-input.ts",
      "type": "registry:hook"
    }
  ],
  "cssVars": {
    "theme": {
      "font-sans": "'Satoshi Variable', system-ui, sans-serif"
    },
    "dark": {
      "color-canvas": "oklch(0.075 0 0)",
      "color-raised": "oklch(0.105 0 0)",
      "color-accent": "oklch(0.875 0.225 152)"
    }
  },
  "meta": {
    "lumen_version": "0.13.0",
    "mode": "dual",
    "ai_naming": "vercel-ai-elements"
  }
}
```

### 8.7 Root registry.json

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "@lumen",
  "homepage": "https://warp-lumen-design-guidelines.vercel.app",
  "items": [
    { "name": "button", "type": "registry:component", "title": "Button", "description": "Lumen primary control. 5 intents, 5 sizes.", "files": [{ "path": "02-components/button/button.tsx", "type": "registry:component" }] }
    // …one entry per component, generated by tools/build-registry.ts
  ]
}
```

---

## 9. The style anchor (immovable)

This is the single most important file in the prompt library. Every other prompt opens with `@import ./style-anchor.md`. Write it once, never edit it casually.

```markdown
# Lumen v0.13 — Style Anchor (immovable)

Use this anchor at the top of every gpt-image-2 prompt by referencing it as
`@import 05-prompts/style-anchor.md` and then adding your subject-specific slot.

## Model + parameters
- Model: gpt-image-2 (snapshot gpt-image-2-2026-04-21).
- Quality: high.
- Mode: thinking mode ON for hero / multi-frame assets, OFF for single backgrounds.
- Aspect: 16:9 unless specified. Output 2560×1440 for hero, 1600×1600 for square illustration, 1024×1024 for empty-state.

## Scene
Dark obsidian canvas (#0D0D0D). Subtle radial atmosphere of deep teal and
Spring Green (#00FA8A) at 8–12% opacity, drifting in the upper-left and
lower-right thirds. Volumetric fog, no hard edges. Faint film grain at 8%
overlay. Instrument-panel mood.

## Subject
[FILL THIS SLOT in the consuming template. One sentence, freight-domain when
possible — isometric long-haul truck, container yard top-down, route arc on
a lane map, cross-dock cutaway, dock-bay grid, network graph, pallet stack.]

## Details
- Hairline 1px white strokes at 6% opacity.
- Frosted-glass surfaces where appropriate, with subtle grain.
- Minimal type if any: clean geometric sans-serif (Satoshi look-alike).
- Single Spring Green #00FA8A accent on the focal element ONLY.
- No second saturated color anywhere. Status hues (lumen-red, lumen-amber) only
  if explicitly required by the subject.

## Use case
[FILL THIS SLOT — e.g., "SaaS dashboard hero illustration", "landing-page
background", "onboarding step 2 illustration", "empty-state for shipments list".]

## Constraints
- NO photoreal humans unless explicitly requested.
- NO logos.
- NO text labels in image unless explicitly requested by the consuming template.
- NO neumorphism, NO glassmorphism-without-context, NO heavy bevels.
- NO neon glow beyond the Spring Green accent.
- NO stock-photo aesthetic.
- NO emoji-style.
- Must read at 50% size.
- Output must be print-grade at the requested resolution.

## Style references (do not name in the prompt, used for our calibration only)
- RonDesignLab "Navy Mobile – Truck Management Dashboard"
- RonDesignLab "BizSpeed TMS – Logistics Web Dashboard"
- RonDesignLab "SpaceX App – Space Mission Control"
- Linear's blueprint-grid and calmer-interface aesthetic
- Vercel Geist's restrained dark palette

## When to deviate
- Restrained surfaces (dashboards) → lower the atmosphere to 4–6% opacity, drop
  the mesh entirely, keep grain.
- Expressive surfaces (landing) → boost atmosphere to 10–14%, allow one named
  mesh recipe (aurora-spring | aurora-cool | dock-bay | lane-arc | cross-dock).
- Onboarding → narrative illustration allowed, character-light, freight-domain
  prop.
```

### Example consuming template

```markdown
# Hero background — Lumen v0.13

@import ./style-anchor.md

## Subject
An ambient hero background for an AI surface — three soft blurred orbs of
Spring Green #00FA8A (12% opacity max) and one cool indigo orb, drifting
against obsidian #0D0D0D, with a faint perlin grain overlay at 10% opacity.
Suggest depth via volumetric fog. No hard edges anywhere.

## Composition override
16:9, 2560×1440. The orbs occupy the upper-left and lower-right thirds. Clear
focal-area negative space dead-center for headline text.

## Use case override
Landing-page hero background. The headline overlays the center; do not place
visual weight there.

## Mode
Expressive (atmosphere at 12%).
```

---

## 10. Verification gates (run before declaring any phase done)

Pause work and run these before claiming any phase complete.

### 10.1 Self-critique checklist (verbatim)

Run this against your own output before staging the commit.

```
SELF-CRITIQUE — LUMEN v0.13

1. What did I recommend / generate without reading the live /foundations page first?
2. What constraint from §2 did I implicitly relax?
3. What did I delegate to the operator that I could have done myself?
4. What's the simplest path I didn't surface?
5. What assumption am I most likely wrong about?
6. Did I introduce a second loud color anywhere?
7. Did I introduce a hex literal outside the primitives layer?
8. Did I introduce a new off-grid spacing value without naming a token for it?
9. Did I apply backdrop-filter to a dense surface (table, row, cell, canvas)?
10. Did I miss a prefers-reduced-motion or prefers-reduced-transparency fallback?
11. Did I break a v0.12.4 public token name without an alias?
12. Did I generate a Lumen icon via gpt-image-2?
13. Did I forget to pin the gpt-image-2 snapshot in a prompt template?
14. Did I forget the CHANGELOG entry?
15. Did I forget to regenerate llms.txt / llms-full.txt after a token or component change?

If any answer is yes, fix it before committing.
```

### 10.2 Automated gates

These run as CI checks. Don't merge a phase if any are red.

- `tools/audit-contrast.ts` — runs Pa11y over the audit-dashboard mounted in both modes. 100% pass required.
- `tools/audit-motion.ts` — verifies every animation has a `prefers-reduced-motion` fallback.
- `tools/audit-tokens.ts` — verifies no hex literal exists outside `01-tokens/primitives/`.
- `tools/audit-mode.ts` — verifies every component is mode-agnostic (no `data-mode` references in component source; only in scope wrappers).
- Visual regression — Playwright + percy.io against both modes.
- Type check — `tsc --noEmit`.
- Test suite — Vitest + Playwright + axe-core.
- Registry build — `npm run registry` must succeed and emit valid JSON per the shadcn schema.

### 10.3 Final report (Claude Code emits this at the end of every phase)

When a phase is done, emit a report in this exact shape into `06-claude-code-briefings/phase-<n>-report.md`:

```markdown
# Phase <n> — <title> — Report

## What changed
[Bulleted summary of all files added, modified, deleted.]

## What broke (and how I fixed it)
[Anything that hit a verification gate the first time, and the fix.]

## Hard-rule violations I caught in self-critique
[Anything from the §10.1 checklist that came back yes, and how I addressed it.]

## What I assumed
[Every non-trivial assumption. Surfacing assumptions reduces downstream rework.]

## What's still uncertain
[Anything I couldn't resolve. Operator decisions needed.]

## CHANGELOG entry
[Verbatim entry as it should land in CHANGELOG.md.]

## Tokens / components touched
[Full list, for the audit trail.]

## Next phase
[Confirmed next phase, with any preconditions.]
```

---

## 11. Trade-offs and known unknowns (be honest about these)

Some decisions in this refactor have genuine trade-offs. Surface them in the relevant component or platform MD file rather than papering over them.

- **Style Dictionary v4 does not fully support DTCG 2025.10.** Full support is targeted for v5, in progress. The token build pipeline uses the DTCG-compatible subset that works in v4. When v5 ships, we re-evaluate and lift any restrictions. Pin the dependency.
- **Compose blur is hard.** `Modifier.blur()` is API 31+ and blurs the element, not the backdrop. We use `dev.chrisbanes.haze`. On API 30 and below, glass falls back to a solid surface. Document this on every Compose component MD file.
- **Shopify identity budget is small.** Polaris went GA October 1, 2025. App Bridge surfaces (title bar, nav, save bar, modals, toasts) are Shopify-rendered. Realistic identity surface inside an embedded Shopify app is ≤ 15% of pixels: brand voice + iconography + accent on chips/badges + onboarding illustration. Don't promise more in the platform MD.
- **gpt-image-2 thinking mode adds latency.** It maintains consistency across up to 8 images from a single prompt but takes noticeably longer. Use thinking mode for hero / multi-frame assets, not for single backgrounds. Both modes priced at $30/M output tokens at launch.
- **Glass is a contrast cliff on busy backdrops.** Even at blur 20 + saturate 140 + 50% alpha, body text on glass over a mesh fails WCAG AA frequently. The audit-contrast probe catches this. If a glass surface fails on a real backdrop, the answer is to raise alpha to 70–85% (effectively tinted-solid), not to ignore the rule.
- **gpt-image-2 is a moving target.** The model alias `gpt-image-2` may roll forward to a new snapshot silently. Pin every prompt to `gpt-image-2-2026-04-21` until we re-baseline outputs against a newer snapshot.

---

## 12. How to start

Read this entire briefing. Acknowledge each hard rule in §6 by listing it back in your first response, in your own words. Read the §1 read-first context in order. Produce an inventory CSV per §1.2. Surface any questions before touching any code. Then begin Phase 0.

When in doubt, **pause and ask**. Silent guessing is the failure mode this briefing is designed to prevent.
