# AGENTS.md — Lumen Design System

> Universal agent rules for any AI coding agent working in this repo (Cursor, Claude Code, Codex, Devin, Copilot, etc.). Read this before doing anything. If you are Claude, also read [CLAUDE.md](./CLAUDE.md). For the full v0.13 refactor briefing (modes, DTCG 2025.10, shadcn registry, MCP, gpt-image-2 prompts), read [doc/LUMEN-v0.13-MASTER-REFACTOR.md](./doc/LUMEN-v0.13-MASTER-REFACTOR.md) — that is the canonical v0.13 source of truth; this file is the operational digest.

## What this repo is

Lumen is the source of truth for Warp's UI. It contains design tokens (DTCG 2025.10 JSON), component contracts (Markdown + JSON sidecars), platform consumption guides, and the GPT-image-2 prompt library. It does NOT contain shipped product code — product code lives in consumer repos and pulls Lumen via shadcn registry (`@lumen/*`), Swift Package, Compose module, etc.

> [!note]
> **v0.13.0 — DTCG 2025.10 foundation reset + dual-mode architecture (in progress).** Phase 0 (this commit) lifts the token graph to DTCG 2025.10, adds the Phase 0 alias namespace (`color.obsidian/spring/lumen-red/lumen-amber`), extends status.danger + status.warning to 10 stops each, retunes motion durations to the master-doc 80/140/200/320/480 ladder, adds OpenType feature flag catalog + `code.fallback` (Geist Mono alias only), adds three new elevation tokens (`shadow.glass`, `shadow.focus`, `shadow.glow-accent` 3-layer signature), creates the modes scaffolding (`01-tokens/modes/restrained.tokens.json` + `expressive.tokens.json`), splits semantic tokens into the four Phase 0 files (`surface/text/border/action.tokens.json`), bumps Style Dictionary output from `_build/` → `dist/`, and refreshes AGENTS / CLAUDE / llms.txt. Phases 1–6 follow per the master doc. **v0.12.6 → v0.13.0 is additive — no v0.12 token paths are removed. Every existing public name keeps working.** Brand anchors unchanged: Spring Green `#00FA8A` (accent), Obsidian `#0D0D0D` (canvas), `#E6E6E6` (light anchor), `#FAFAFA` (paper). The seven principles, the v0.11 hierarchy + first-impression + micro-interactions foundations, the v0.12.1–v0.12.5 hard rules (10–14) all carry forward verbatim.

Repo root tree:

```
.
├── AGENTS.md                          ← you are here
├── CLAUDE.md
├── llms.txt                           ← LLM-first index
├── llms-full.txt                      ← generated flattened dump (build step)
├── README.md
├── CHANGELOG.md
├── VERSION                            ← 0.13.0
├── components.json                    ← shadcn consumer config
├── registry.json                      ← shadcn registry manifest (Phase 2 fills)
├── style-dictionary.config.ts         ← v5; outputs to dist/
├── package.json
├── doc/
│   └── LUMEN-v0.13-MASTER-REFACTOR.md ← canonical v0.13 briefing
├── design-system/
│   ├── 00-foundations/                ← principles, voice, a11y, motion, modes (v0.13), inspirations (v0.13), glossary (v0.13)
│   ├── 01-tokens/
│   │   ├── primitives/                ← color/dimension/radius/typography/elevation/motion/spacing
│   │   ├── semantic/                  ← color.light, color.dark, + v0.13 split: surface/text/border/action
│   │   ├── modes/                     ← v0.13 restrained + expressive scaffolds
│   │   └── components/                ← per-component bound tokens
│   ├── 02-components/                 ← component.md + component.json per component
│   ├── 03-platforms/                  ← per-platform consumption guides
│   ├── 04-content/                    ← imagery, illustration, microcopy, errors
│   └── 05-patterns/                   ← multi-component flows
├── _registry/                         ← shadcn registry sidecars (v0.12.6 layout)
├── _meta/                             ← ADRs, prompt fragments, glossary
├── dist/                              ← gitignored. Style Dictionary outputs (v0.13).
├── tools/                             ← v0.13 — audit-contrast.ts, audit-baseline/, future build scripts
├── audit-dashboard/                   ← Next.js reference implementation
└── research/                          ← brand DNA, inspiration, typography, architecture
```

## Hard rules (MUST follow, no exceptions)

1. **Never invent tokens.** If you need a value not in `01-tokens/semantic/`, the answer is to ADD a semantic alias (with a PR + ADR), NOT to import a primitive directly or hardcode a value. Hardcoding hex / pixels / font stacks in component code is a violation.

2. **Always reference SEMANTIC tokens, never primitives.** `color.surface.canvas`, NOT `color.brand.800`. `space.4`, NOT `dimension.4`. `radius.card.default`, NOT `radius.lg`. Lint enforces.

3. **Every component contract MUST validate against `/design-system/02-components/_schema/component.schema.json`.** Missing required fields blocks merge.

4. **Every component MUST ship a `component.json` machine contract before any code template.** The JSON is what LLMs and the MCP server read. Phase 2 adds a sibling `<name>.skill.md` in the Vercel `skill-remotion-geist` format per component.

5. **Accessibility is WCAG 2.2 AA, hard floor.** Every interactive element needs visible focus, ≥ 4.5:1 text contrast (≥ 3:1 for large text), keyboard reachability, an accessible name. AAA where it doesn't add cost. `prefers-reduced-motion` and (v0.13 NEW) `prefers-reduced-transparency` honored everywhere.

6. **Use the platform-appropriate code template** from `02-components/{name}/examples/`. Do not invent new patterns when one exists.

7. **The Spring Green accent (`color.accent.500` = `color.spring.500` = `#00FA8A`) plays exactly ONE role**: action / live / success. Never decorative. Never as a second accent. Never on non-action chrome. Adding a second loud color to the system is a brand violation. v0.13 — Phase 0 alias namespace exposes this also as `color.spring.500`; both paths resolve to the same primitive.

8. **Honor `prefers-reduced-motion` and `prefers-reduced-transparency`** in everything that animates or blurs. Motion that doesn't respect this fails CI. Reduced-transparency bumps glass alpha to ≥ 0.85 and drops `backdrop-filter`.

9. **Never render white or near-white text on the Spring Green accent surface.** The accent foreground is bound to `color.accent.fg` (`#07120D`, ~14.7:1 AAA on `#00FA8A`). White on spring green is ≈1.4:1 — a WCAG AA fail.
   - Do NOT use the shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`, etc.) in product code; Tailwind v4's content scanner has been observed to drop those classes.
   - DO use the v0.9 `.lumen-btn-*` defensive class family (declared in `audit-dashboard/src/app/globals.css`) for any button surface.
   - DO use direct semantic refs for one-off surfaces: `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`.
   - Lint `lint:no-white-on-accent` enforces. See [`design-system/00-foundations/buttons.md`](design-system/00-foundations/buttons.md) and [ADR 0016](_meta/decisions/0016-button-rebuild-v09.md).

10. **Floating UI portals to `document.body` — never render a floating panel as an inline `<div absolute>`** (v0.12.4 — closes ADR 0021 trade-off). Combobox / Select / DropdownMenu / Popover / Tooltip / Calendar dropdowns must escape every ancestor's overflow context. Pattern: `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Outside-click dismiss must exempt the portaled list.

11. **Focus rings ride `outline + box-shadow`, never box-shadow alone** (v0.12.4 — closes the v0.12.1 pagination-focus regression). Global `:focus-visible` paints `outline: 2px solid var(--lumen-accent-a64); outline-offset: 1px;` PLUS soft `box-shadow: var(--shadow-focus)` glow halo. Box-shadow alone fails inside corner-clipped ancestors; outline alone loses the soft brand character. The `.lumen-btn-primary:focus-visible` dual-ring is exempt — it declares `outline: none` and wins via CSS specificity by design (preserves ADR 0016's brand visual).

12. **Position math via inline `style`, not Tailwind arbitrary classes** (v0.12.3 cascade-fix to ADRs 0015/0016). Tailwind v4's scanner has dropped `translate-x-[Npx]` arbitrary utilities. For thumb / swipe / handle / popover anchor position math, use inline `style={{ left: N }}` (or `style={{ transform: 'translateX(...)' }}`) with a native `transition` declaration (default easing `cubic-bezier(0.2, 0, 0, 1)`). Inline style is scanner-independent.

13. **Version labels read from `lib/version.ts`, never hardcoded literals** (v0.12.5 — closes the palette-footer drift). Three exports: `LUMEN_VERSION` (`"v0.13.0"`), `LUMEN_VERSION_MAJOR_MINOR` (`"v0.13"`), `LUMEN_VERSION_MAJOR_MINOR_UPPER` (`"V0.13"`). The release script bumps both `VERSION` and `lib/version.ts` in lockstep. Exemptions: prose / ADR titles / CSS comments referencing historical versions stay literal.

14. **`<details>`/`<summary>` accordions suppress the native disclosure marker — always — when composing your own end-of-summary chevron** (v0.12.5 — closes landing-FAQ Unicode-`▾` vs lucide-`ChevronDown` mismatch). Apply `class="lumen-summary"` (or Tailwind `list-none`) on every accordion summary; both trigger the globals.css rule pair that suppresses the marker on every browser.

15. **v0.13 — Mode is a scope attribute, never a per-component prop.** `data-mode="restrained"` is the default for SaaS dashboards, tables, settings, terminals, command palette, every dense operator surface. `data-mode="expressive"` is opt-in for landing, marketing, AI surfaces, onboarding, empty states, hero panels. Components do NOT branch on mode; semantic surface/atmosphere/motion tokens rebind under the scope. NEVER `<Card mode="expressive">`. NEVER nested mode scopes. See [`design-system/00-foundations/modes.md`](design-system/00-foundations/modes.md).

16. **v0.13 — `backdrop-filter` only on floating shells.** Glass goes on popover, sheet, command palette, hero device frame, nav. NEVER on page canvas, data table, table row, table cell, chart axis. Always paired with `-webkit-backdrop-filter`. Always `@supports not (backdrop-filter)` fallback to solid surface. Always `@media (prefers-reduced-transparency: reduce)` bumps alpha to ≥ 0.85. Blur radius 8–15px restrained, up to 28px on hero shells expressive. See [`design-system/00-foundations/modes.md`](design-system/00-foundations/modes.md) §3.

17. **v0.13 — DTCG 2025.10 format is the token contract.** Every token has `$value` + `$type` + `$description`. Alias syntax `{token.path.name}`. No hex literals outside `01-tokens/primitives/`. One source of truth per fact. Schema URL: `https://www.designtokens.org/schemas/2025.10/format.json`. Composite types (typography, shadow, gradient) follow the 2025.10 composite shape.

18. **v0.13 — Phase 0 alias namespace is first-class but additive.** `color.obsidian.*` aliases `color.brand.*`. `color.spring.*` aliases `color.accent.*`. `color.lumen-red.*` aliases `color.status.danger.*`. `color.lumen-amber.*` aliases `color.status.warning.*`. Both namespaces ship. New code may use either; existing v0.12.6 code paths are preserved verbatim. Do NOT remove a v0.12.6 token name without an alias — breaking changes belong in v1.0, not v0.13.

19. **v0.13 — Vercel AI Elements naming for AI primitives.** When generating an AI surface component (Conversation, Message, Reasoning, Tool, Sources, InlineCitation, PromptInput, Suggestion, Confirmation, Artifact, WebPreview, Agent), mirror the Vercel AI Elements naming verbatim so a Lumen-themed ChatKit embed is a single line of CSS. Citation UI consumes the Anthropic Citations API JSON shape (`cited_text`, `document_title`, `document_index`). Phase 5 implements; Phase 0 reserves the names.

## Setup commands

- Install dev deps: `pnpm install`
- Build tokens: `pnpm tokens` (v0.13 alias of `pnpm build` — runs Style Dictionary v5, outputs to `dist/`)
- Watch tokens: `pnpm tokens:watch`
- Validate tokens: `pnpm tokens:validate`
- Audit contrast: `pnpm audit:contrast` (v0.13 — `tools/audit-contrast.ts`)
- Full validate: `pnpm validate` (DTCG lint + component schema + contrast)
- Generate registry: `pnpm registry`
- Run audit dashboard: `cd audit-dashboard && pnpm dev`

## Where things live

| Need | Path |
|---|---|
| Master v0.13 briefing | `doc/LUMEN-v0.13-MASTER-REFACTOR.md` |
| Tokens (source) | `design-system/01-tokens/` |
| Tokens (built) | `dist/` (gitignored — read from CDN or `lumen-dist`) |
| Component contracts | `design-system/02-components/{name}/component.json` |
| Component prose | `design-system/02-components/{name}/component.md` |
| Component agent-skill (Phase 2) | `design-system/02-components/{name}/{name}.skill.md` |
| Platform guides | `design-system/03-platforms/{platform}/README.md` |
| Mode tokens | `design-system/01-tokens/modes/{restrained,expressive}.tokens.json` |
| Phase 0 semantic split | `design-system/01-tokens/semantic/{surface,text,border,action}.tokens.json` |
| shadcn registry (legacy v0.12.6) | `_registry/registry.json` and `_registry/{name}.json` |
| shadcn registry (v0.13 root) | `registry.json` (Phase 2 populates), `components.json` (consumer config) |
| ADRs | `_meta/decisions/` |
| Prompt fragments | `_meta/prompts/` |
| GPT-image-2 prompt library (Phase 4) | `design-system/05-prompts/` |
| MCP integration (Phase 6 — shadcn MCP, no custom server) | this file §"MCP integration" + `components.json` |
| Glossary | `_meta/glossary.json` + `design-system/00-foundations/glossary.md` |
| Reference implementation | `audit-dashboard/` |
| Runtime version constant | `audit-dashboard/src/lib/version.ts` — `LUMEN_VERSION`, `_MAJOR_MINOR`, `_MAJOR_MINOR_UPPER` |
| Audit-contrast baseline | `tools/audit-baseline/contrast-{restrained,expressive}.json` |

## Code style

- TypeScript strict, no `any`.
- React: function components, hooks, no class components.
- Tailwind v4 only — no v3 config files. Theme lives in `dist/tailwind/lumen.css` (v0.13) via `@theme inline`.
- iOS: SwiftUI for new code.
- Android: Jetpack Compose.
- Token references in code: `var(--color-surface-canvas)`, NOT `#fafaf7`.
- File naming: kebab-case for component folders (`live-dot/`, `empty-state/`); PascalCase for component names in code (`LiveDot`, `EmptyState`).

## Changelog & PR conventions

- Conventional Commits: `feat(button): add loading prop`, `fix(tokens): correct accent.fg contrast`.
- Add a CHANGELOG entry under the matching Keep-a-Changelog category (Added / Changed / Deprecated / Removed / Fixed / Security).
- Token changes: minor or patch decided by deprecation rules.
- Component changes: minor (new prop) or patch (bug fix).
- Breaking changes: major. Open an ADR.

## Deprecation policy

- Mark tokens deprecated via `"$deprecated": "Replaced by {new.token.path} in v0.X.X. Will be removed in v1.0.0."`.
- Mark components deprecated via `"deprecated": true` + `"deprecationNotice"` + `"removedIn": "1.0.0"` in `component.json`.
- A deprecation lives ≥ 1 minor release before removal.
- Removal happens in the next major.

## MCP integration

Lumen's shadcn registry is MCP-compatible out of the box. There is no custom Lumen MCP server in v0.13 — the shadcn MCP server reads `registry.json` and per-item JSONs directly, so adding a separate Lumen server would duplicate surface without adding capability. (If a Lumen-specific tool surface beyond what shadcn MCP exposes is needed later — e.g., `lumen.get_prompt_template` for the gpt-image-2 library — it ships as a separate `@warp/lumen-mcp` package in v0.14. v0.13 does not block on it.)

### Install (consumer side)

1. **Install the shadcn MCP server** into the consumer's Claude Code project:

   ```bash
   claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp
   ```

2. **Add the Lumen registry** to the consumer's `components.json`:

   ```json
   {
     "registries": {
       "@lumen": "https://warp-lumen-design-guidelines.vercel.app/r/{name}.json"
     }
   }
   ```

3. **Restart Claude Code** and run `/mcp` to verify the connection.

4. **Invoke Lumen via natural language**: "install the Lumen button" → resolves to `npx shadcn@latest add @lumen/button` via the shadcn MCP `install` tool.

Other agents (Cursor, Codex, Copilot, Devin) follow the same shadcn MCP install pattern — see [`https://ui.shadcn.com/docs/registry/mcp`](https://ui.shadcn.com/docs/registry/mcp) for tool-specific install commands.

### What the shadcn MCP exposes (out of the box)

- `init` — bootstrap a project with `components.json` pointed at the Lumen registry
- `add` / `install` — install a Lumen component by name (`@lumen/<name>`)
- `list` — enumerate the items the registry serves
- `search` — fuzzy-search the registry index by name or description
- `get_item` — fetch a single registry item (returns the JSON with `files`, `cssVars`, `dependencies`)

The Lumen registry is structured so each of these maps cleanly: `registry.json` for `list`, per-item `*.registry.json` (built into `public/r/{name}.json` via `pnpm registry:build`) for `get_item` and `install`.

### Verify the registry endpoint

```bash
curl -sf https://warp-lumen-design-guidelines.vercel.app/r/registry.json | jq '.items | length'
```

Should return an integer ≥ 149 (Phase 5 final count). If the endpoint 404s, the v0.13.0 branch hasn't been pushed yet — the operator owns the push.

## Trust levels (for autonomous agents)

| Level | Action | Examples |
|---|---|---|
| AUTOMERGE | Cosmetic, low-risk | Typo fixes in MD, dead-link fixes, alt text on SVGs |
| DRAFT-PR | Reviewable | New components matching the schema, new platform examples, new prompt fragments, token ADDITIONS (no removals) |
| HUMAN-REVIEW | Always reviewed | Token rename or removal, schema changes, breaking changes to `component.json`, major-version bumps, license-affecting changes |

## When in conflict

- User instructions in chat override these rules where they conflict (the user is in control).
- These rules override your training memory of how design systems "usually" work.
- The v0.13 master doc (`doc/LUMEN-v0.13-MASTER-REFACTOR.md`) is canonical for v0.13 work; this AGENTS.md is the operational digest.
- Lint and CI override your assumptions of what's valid.

## What to do if you're stuck

1. Read the relevant `component.md` AND `component.json` together.
2. Check `_meta/decisions/` for an ADR on the topic.
3. Check `_meta/prompts/` for a workflow fragment that matches.
4. Search `research/` for the underlying evidence.
5. For v0.13 phase work, read the relevant section in `doc/LUMEN-v0.13-MASTER-REFACTOR.md`.
6. If still stuck, surface the question. Do not guess. The master doc §4.2 grants an explicit "ask, don't guess" license — but ALSO note the v0.13 phase-prompt addendum, which overrides this for autonomous phase execution. During phase work: document decisions made unilaterally in the phase report.
