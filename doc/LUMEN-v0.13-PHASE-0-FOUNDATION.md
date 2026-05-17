# PHASE 0 — Foundation Reset & DTCG Conversion

Execute master doc §7.Phase-0. Ensure `design-system/AGENTS.md` is loaded into your context before you begin; that file is your single source of truth. This phase prompt only adds execution-level detail not already in the master doc.

## What this phase ships

The token graph in DTCG 2025.10 format, the build pipeline that emits it to five platform artifacts, the agent-readable docs layer (`AGENTS.md`, `CLAUDE.md`, `llms.txt`), the foundation MD files in `00-foundations/`, and the contrast audit baseline. After this phase, every downstream phase consumes tokens by name and never by hex literal.

## Read first (do this in order, do not skip)

1. Fetch `https://warp-lumen-design-guidelines.vercel.app/foundations`. This page is the **authoritative source** for every v0.12.4 token value. The 11 obsidian stops, 10 neutral stops, 10 spring stops, 10 lumen-red stops, 10 lumen-amber stops, the 8 surface roles, the 6 text roles, the 6 border roles, the 9 radius stops, the 6 control heights, the 5 motion durations, the 8 elevation tokens including `shadow.glass`, `shadow.glow-accent`, `shadow.focus` — all of these are on that page. Match every value verbatim.
2. Fetch `https://warp-lumen-design-guidelines.vercel.app/library`. Skim — you'll mine this in Phase 2, not now. Just confirm you can reach it.
3. Clone the repo. You should already be on the `v0.13.0` branch. Confirm with `git branch --show-current`. Note what currently exists in the repo; don't modify anything yet.

## Technical pins (use these exact versions)

| Tool | Version | Why this pin |
|---|---|---|
| Style Dictionary | `^5.0.0` | Full DTCG 2025.10 support, OKLCH color space, dimension object type, modern color module |
| Node | `>=22.0.0` | Style Dictionary v5 minimum |
| TypeScript | `^5.5.0` | Style Dictionary v5 type definitions |
| `tinycolor2` | `^1.6.0` | Color space conversions for OKLCH ↔ hex fallback |

Add Style Dictionary v5 via `pnpm add -D style-dictionary@^5`. Pin in `package.json` with explicit caret range, not `latest`.

## Work to do (parallelize freely within each group)

### Group A — DTCG token primitives (write all in parallel)

Create `01-tokens/primitives/` with these files. Every token gets `$value`, `$type`, `$description`. Use `.tokens.json` extension. Media type per file is `application/design-tokens+json`.

**`color.tokens.json`** — five 10–11 stop ramps. Each stop carries `$value` as a hex string, `$type: "color"`, `$description` naming the role from the foundations page. Match the foundations-page hex values **exactly**. Note that obsidian.10 is the canvas at `#0D0D0D` and obsidian.0 is paper at the lightest stop. Spring.500 is the accent at `#00FA8A`.

**`spacing.tokens.json`** — the 10-stop structural ladder (8, 16, 24, 32, 40, 48, 64, 80, 96, 128) as `$type: "dimension"` with object form `{ "value": 8, "unit": "px" }` per DTCG 2025.10 spec. Add the named off-grid exceptions (`space.1_5: 6px`, `radius.xs: 3px`, `dot.md: 19px`, `focus-ring: 3px`) as separate tokens in this file with explicit descriptions naming why they exist.

**`radius.tokens.json`** — 9 stops xs through 4xl plus full. Same dimension object form. `full` is `{ "value": 9999, "unit": "px" }` semantically — describe in `$description` that it means "pill-fully-rounded."

**`typography.tokens.json`** — composite tokens per DTCG 2025.10 composite type spec. Each role (`display.xxl`, `display.xl`, `display.lg`, `display.md`, `heading.h1`, `heading.h2`, `heading.h3`, `body.lg`, `body.md`, `body.sm`, `caption`, `mono.cap`) gets a composite with `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight`. Family is always `["Satoshi Variable", "system-ui", "sans-serif"]` except `code.fallback` which adds `"Geist Mono"` before the system fallback. Add OpenType feature flags as a `$extensions.lumen.features` object (`tnum`, `lnum`, `zero`, `case`, `pnum`, `ss01–ss04`, `italic`) per role.

**`elevation.tokens.json`** — shadows as DTCG composite shadow type. Six standard shadows (xs through 2xl) plus three signature shadows (`shadow.glass`, `shadow.glow-accent`, `shadow.focus`). Each shadow uses the composite shape with `offsetX`, `offsetY`, `blur`, `spread`, `color`. Multi-layer shadows are arrays. `glow-accent` is a three-layer lime ambient per the foundations page; reproduce all three layers.

**`motion.tokens.json`** — 5 durations (`micro: 80ms`, `fast: 140ms`, `base: 200ms`, `slow: 320ms`, `slower: 480ms`) as `$type: "duration"`. Add 6 easing tokens as `$type: "cubicBezier"`: `decelerate (0.2, 0, 0, 1)`, `accelerate (0.4, 0, 1, 1)`, `standard (0.4, 0, 0.2, 1)`, `emphasized (0.2, 0, 0, 1)`, `linear (0, 0, 1, 1)`, `bounce (0.34, 1.56, 0.64, 1)`. Add 2 spring tokens under `$extensions.lumen.spring`: `default (damping 28, stiffness 280)` and `gentle (damping 32, stiffness 200)`.

### Group B — Semantic token layer (write after Group A primitives exist)

Create `01-tokens/semantic/` with these files. Every semantic token is an alias to a primitive — no values, only `{token.path}` references.

**`surface.tokens.json`** — the 8 surface roles from the foundations page (`canvas`, `raised`, `sunken`, `popover`, `glass`, `tint-accent`, `tint-strong`, `inverse`). Each aliases to a primitive. `surface.glass` carries `$extensions.lumen` with `alpha: 0.5`, `blur: "20px"`, `saturate: "140%"`, `fallback: "{color.obsidian.10}"`. Add `surface.glass-strong` for modal/sheet use with `blur: "28px"`, `saturate: "160%"`.

**`text.tokens.json`** — `primary`, `secondary`, `tertiary`, `accent`, `inverse`. Each aliases to a primitive color.

**`border.tokens.json`** — `hairline`, `default`, `strong`, `frame`, `accent`, `focus`. `border.frame` is the brutalist hairline; `$description` should name this voice element explicitly.

**`action.tokens.json`** — button intent semantic tokens (`primary`, `secondary`, `tertiary`, `ghost`, `danger`) and their hover/active/disabled state variants. Each aliases to primitives.

### Group C — Style Dictionary v5 build pipeline

Create `tools/style-dictionary.config.ts`. Configure five outputs:

1. **CSS variables** (`dist/css/lumen.css`) — root scope, `:root[data-mode="restrained"]` and `:root[data-mode="expressive"]` blocks for mode-rebound tokens. Use the `css/variables` formatter from Style Dictionary v5 core.
2. **Tailwind preset** (`dist/tailwind/lumen.preset.ts`) — export a Tailwind preset object with `theme.extend` populated from semantic tokens. Tailwind 4 `@theme` block format if Tailwind 4 is already in the repo, classic preset format otherwise.
3. **SwiftUI extension** (`dist/swift/Lumen+Colors.swift`, `Lumen+Spacing.swift`, `Lumen+Typography.swift`) — `extension Color`, `extension CGFloat`, `extension Font` with each token as a static property. Use the v5 `color/oklch` transformer for color tokens so SwiftUI gets the modern color space.
4. **Compose Kotlin** (`dist/compose/LumenColors.kt`, `LumenSpacing.kt`, `LumenTypography.kt`) — Kotlin `object` per category with `val` constants. Compose `Color(0xFF...)` for colors, `Dp` for spacing, `TextStyle` for typography.
5. **JSON dump** (`dist/json/tokens.json`) — flattened key→value map for any consumer that doesn't speak DTCG natively.

Add npm scripts in `package.json`:
- `"tokens": "style-dictionary build --config tools/style-dictionary.config.ts"`
- `"tokens:watch": "style-dictionary build --config tools/style-dictionary.config.ts --watch"`
- `"tokens:validate": "style-dictionary validate --config tools/style-dictionary.config.ts"`

### Group D — Foundation MD files (write in parallel)

Create `00-foundations/` with these MD files. Each one is for human + LLM consumption — start with one-paragraph summary, then content. Keep each under 2K tokens.

- **`principles.md`** — Restate the 7 principles from the foundations page verbatim. Add a one-line "why this exists" under each. No editorial expansion.
- **`voice-and-tone.md`** — The brutalist frame, the italic accent on one word per hero, the mono-uppercase tracked label, the instrument-panel mood. Include the specific examples from the foundations page ("STOP RE-DESIGNING," "SYSTEM V0.11 · LIVE," etc.).
- **`accessibility.md`** — WCAG 2.2 AA rules, prefers-reduced-motion routing, prefers-reduced-transparency routing, focus-ring rule, control-height ladder, color-alone prohibition.
- **`motion.md`** — Easing curves, spring constants, stagger guidance, reduced-motion fallback policy (collapse durations to `0ms`, replace transforms with opacity fades). LiveDot pulse spec (3s loop). RateTicker marquee spec (linear, infinite, pausable on hover).
- **`modes.md`** — The routing table for `data-mode`. Restrained for: dashboards, tables, settings, terminals, command palette, every dense operator surface. Expressive for: landing, marketing, AI surfaces, onboarding, empty states, hero panels. Fallback rules when prefers-reduced-transparency or prefers-reduced-motion fires (drop blur, drop animated mesh, raise alpha to ≥85%).
- **`inspirations.md`** — Three Dribbble shots by name: *RonDesignLab Navy Mobile – Truck Management Dashboard*, *RonDesignLab BizSpeed TMS – Logistics Web Dashboard*, *RonDesignLab SpaceX App – Space Mission Control*. The Linear "calmer interface for a product in motion" quote with link. The Vercel `skill-remotion-geist` SKILL.md as the agent-readable component-skill format reference. Nordhealth's `llms.txt` as the discoverability reference.
- **`glossary.md`** — Freight domain terms (lane, cross-dock, LTL, FTL, OTD, line haul, last mile, middle mile, pallet, dock bay, parcel, BOL, POD, ETA, OTR, tender) plus system terms (token, primitive, semantic, mode, scope, surface, registry item, MCP, manifest, skill).

### Group E — Root agent files (write last in this phase)

- **`AGENTS.md`** — The full master doc as committed to repo root. If it's already at `design-system/AGENTS.md`, leave it. Otherwise, the operator pastes it; you ensure the file exists.
- **`CLAUDE.md`** — One line: `@AGENTS.md`. Plus a Claude-specific MCP hint section listing the shadcn MCP install command: `claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp`. Plus a hint that `/mcp` debugs the connection.
- **`llms.txt`** at repo root — Use the template in master doc §8.2. Generate the `## Components` section as an empty placeholder for now (Phase 2 fills it).
- **`components.json`** at repo root — shadcn registry config. Set `registries["@lumen"]` to a placeholder URL like `https://warp-lumen-design-guidelines.vercel.app/r/{name}.json` for now; Phase 2 wires the actual endpoint.
- **`registry.json`** at repo root — Empty `items: []` array shadcn registry schema scaffold; Phase 2 populates it.

## Decisions you will likely make unilaterally (log all of these in the phase report)

- Where to put the contrast audit baseline output. Default: `tools/audit-baseline/contrast-restrained.json` and `contrast-expressive.json` (the expressive one will fail until Phase 1 builds the mode primitives; that's expected, snapshot it now).
- How to handle the existing `--lumen-neutral-N → --lumen-cream-N` alias mentioned on the foundations page. Default: preserve the alias as a primitive in `color.tokens.json` with an explicit `$description` noting the legacy mapping.
- Whether to use OKLCH or hex as the canonical primitive `$value`. Default: **hex** for the primitive, with `$extensions.lumen.oklch` carrying the OKLCH equivalent for the Style Dictionary OKLCH transformer to consume. This keeps the foundations-page values exactly matchable by string comparison.
- How to handle Satoshi font file hosting. Default: assume self-hosted `.woff2` files at `dist/fonts/satoshi/` and reference them via `@font-face` in `dist/css/lumen.css`. If the existing repo has a different font hosting setup, match what's there.

## Verification gates for Phase 0

| Gate | Pass condition |
|---|---|
| Token build | `pnpm run tokens` exits 0 |
| Token validation | `pnpm run tokens:validate` reports 0 schema errors |
| Hex parity | Resolved CSS variable values match foundations-page values **exactly** for: `--color-spring-500`, `--color-obsidian-10`, `--color-obsidian-0`, `--space-1_5`, `--size-control-cozy`, `--radius-xs` |
| Contrast baseline | `tools/audit-contrast.ts` runs against `dist/css/lumen.css` and reports 100% pass on body text (≥4.5:1) and large UI (≥3:1) in restrained mode |
| Five platform outputs | `dist/css/`, `dist/tailwind/`, `dist/swift/`, `dist/compose/`, `dist/json/` all exist and contain non-empty files |
| AGENTS.md length | Under 300 lines (if the master doc itself is longer, reference it from a shorter AGENTS.md instead of inlining it) |
| llms.txt structure | Validates against the llmstxt.org structure spec (H1, blockquote summary, then `##` sections with bullet links) |
| Self-critique | All 15 questions in master doc §10.1 answered "no" in the phase report |

## Stop condition

When Group A through Group E are complete and all verification gates are green, write the phase report into `design-system/06-claude-code-briefings/phase-0-report.md` following the exact structure in master doc §10.3. Include a "decisions made unilaterally" section listing every call you made without operator input. Commit everything with the message `feat(lumen): phase 0 — DTCG foundation and build pipeline`.

Then **stop**. Do not start Phase 1. Do not produce any more output. Wait for the operator to paste the Phase 1 prompt.
