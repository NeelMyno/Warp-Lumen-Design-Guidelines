# CLAUDE.md — Lumen-specific addenda for Claude

@AGENTS.md

> Everything in [AGENTS.md](./AGENTS.md) applies. This file adds Claude-specific instructions on top. For the full v0.13 refactor briefing read [doc/LUMEN-v0.13-MASTER-REFACTOR.md](./doc/LUMEN-v0.13-MASTER-REFACTOR.md).

> [!note]
> **v0.13.0 (in progress).** Phase 0 lifts the token graph to DTCG 2025.10, adds the Phase 0 alias namespace (`color.obsidian/spring/lumen-red/lumen-amber`), retunes motion durations to 80/140/200/320/480, adds 3 new elevation tokens (`shadow.glass`, `shadow.focus`, `shadow.glow-accent` 3-layer), creates the modes/ scaffolding, splits semantic tokens into the four Phase 0 files, switches the build output from `_build/` → `dist/`, and refreshes the agent docs. v0.12.6 token names are preserved verbatim (additive, not destructive). Phases 1–6 follow per the master doc. Brand anchors unchanged from v0.12.0: Spring Green `#00FA8A`, Obsidian `#0D0D0D`, `#E6E6E6` light anchor, `#FAFAFA` paper.

## MCP — shadcn registry

When Phase 2 ships the `@lumen` shadcn registry, the consumer install pattern is:

```bash
# Install shadcn MCP for the current Claude Code project
claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp

# Then in conversation, ask Claude to install a Lumen component
# Example: "Install @lumen/button"
# Claude will call shadcn's MCP `install` tool with the registry URL configured in components.json.
```

For Lumen-specific MCP introspection (Phase 6), the Lumen MCP server installs as:

```bash
# Phase 6 — Lumen-native MCP for direct token/component/skill queries
claude mcp add --transport http lumen https://lumen.warp.dev/mcp
# Tools: list_components, get_component, get_tokens, search, install, get_prompt_template
```

Use `/mcp` to debug MCP server connection state.

## Skill priority for this repo

When working in this repo, use these skills (when available):

- **`ui-styling`** — for Tailwind / shadcn / Radix work. The Lumen system is built on this stack.
- **`design`** / **`design-system`** — when extending tokens or components.
- **`engineering:code-review`** — before merging any PR that touches a component or token.
- **`engineering:testing-strategy`** — when adding test coverage to a component.
- **`vercel:react-best-practices`** — for any Next.js / React work in `/audit-dashboard/`.

## Token query workflow

When a user asks "what does X look like" about a Lumen component:

1. **Read three files in parallel:**
   - `design-system/02-components/{name}/component.json` (the contract)
   - `design-system/02-components/{name}/component.md` (the prose)
   - `design-system/02-components/{name}/examples/{platform}.{ext}` (the code)
2. Cite token paths with backticks: `color.surface.canvas` or `color.obsidian.800` — never copy raw values into prose.
3. If the user is on a specific platform, prioritize that platform's example.

## Naming + voice

- Use Lumen's voice: short, declarative, numerate. See `design-system/00-foundations/voice-and-tone.md`.
- When generating button labels, helper text, or any UI copy, run them through the rules in `design-system/04-content/ui-writing-style.md`.
- Avoid the banned phrase list in `design-system/04-content/microcopy.md` §"Banned phrases".

## Generating new components

When asked to create a new component:

1. Check if a similar component already exists (search `design-system/02-components/`).
2. If new, follow the prompt fragment in `_meta/prompts/new-component.md`.
3. Create `./{name}/component.md` and `./{name}/component.json`.
4. JSON must validate against `_schema/component.schema.json`.
5. Add at least one `web-react` example.
6. Add a registry sidecar at `_registry/{name}.json`.
7. Add to `_registry/registry.json` items array.
8. (Phase 2) Add a `<name>.skill.md` in the Vercel `skill-remotion-geist` format.
9. (Phase 2) Add to root `registry.json` items array.
10. Add a CHANGELOG entry.
11. Surface the work for human review (DRAFT-PR trust level).

## Cross-cutting concerns

- **License.** Satoshi is ITF-FFL — free for commercial use, must self-host, must NOT redistribute the font files in any public repo. Don't commit the font files to a public git repo.
- **Vault context.** This is a Warp internal repo, not the user's Obsidian vault. The vault rules in user's global CLAUDE.md don't apply unless the user explicitly invokes a vault skill.
- **Privacy — synthetic names only in fixtures and demos.** No real-person names in tokens, comments, fixtures, or examples. Use generic operator names (`Avery Mercer`, `Kai Morgan`). Carrier names are safe (Sterling LTL, Estes Express, ODFL, Saia, FedEx Freight, ABF, Old Dominion, Yellow are real B2B carriers).
- **v0.11 hierarchy first.** Read [`hierarchy.md`](design-system/00-foundations/hierarchy.md) before generating any new section. Apply the three-tier rule + 1.5–2× weight rule. Equal-weight noise is the most common failure mode of LLM-generated UI.
- **v0.11 hero first.** Any landing or hero surface flows through [`first-impression.md`](design-system/00-foundations/first-impression.md) — three questions answered (what/who/why), three checks passed (branded chrome, single focal point, no layout shift), in 50ms.
- **v0.11 micro-interaction catalog.** Read [`micro-interactions.md`](design-system/00-foundations/micro-interactions.md) before designing any state change.
- **v0.12.4 floating-UI portal default.** When generating a Combobox / Select / Popover / Dropdown / Tooltip / Calendar primitive, portal to `document.body` via `createPortal` + `position: fixed` + `getBoundingClientRect()` tracking. Never render the panel as inline `<div absolute>`. See AGENTS.md hard rule 10.
- **v0.12.4 focus-ring contract.** When generating any new `:focus-visible` rule, include both `outline` for structural visibility AND `box-shadow` for the soft brand halo. Box-shadow alone fails inside corner-clipped containers. See AGENTS.md hard rule 11.
- **v0.12.3 inline-style for position math.** When generating a toggle / switch / swipe-row / handle / thumb / calendar-nav primitive, write position math as inline `style.left` (or `style.transform`) with a native `transition` declaration. Do NOT use Tailwind arbitrary `translate-x-[Npx]` classes. See AGENTS.md hard rule 12.
- **v0.12.4 corner-clip pattern.** When generating a rounded container (Card, TabsList, Pill track, Sheet) that hosts children with their own backgrounds and smaller-radius corners, compose `overflow-hidden` on the parent.
- **v0.12.5 version constant — single source of truth.** Import from [`@/lib/version`](audit-dashboard/src/lib/version.ts) — never hardcode the literal. `LUMEN_VERSION` for patch-level chips; `_MAJOR_MINOR` for inline references; `_MAJOR_MINOR_UPPER` for `SYSTEM V0.13 · LIVE` brand-voice tokens.
- **v0.12.5 accordion summary marker contract.** Every custom accordion (`<details>`/`<summary>` with a lucide chevron at the END of the summary) gets `class="lumen-summary"` (or Tailwind utility `list-none`). See AGENTS.md hard rule 14.
- **v0.12.5 iconography accent-on-hover.** Interactive icon tiles hover to `text-accent` + `border-accent` — teaches "green appears precisely at action" visually.
- **v0.12.5 pricing card peak-end lift.** Cards at peak moments (pricing tier selection) gain hover lift via system tokens — non-highlighted: `shadow-md` + `border-default` + `-translate-y-[1px]`; highlighted: layer `var(--shadow-glow-accent)`.
- **v0.13 — dual-mode is a scope attribute, never a prop.** `data-mode="restrained"` is default; `data-mode="expressive"` opt-in. NEVER `<Card mode="...">`. NEVER nested. See AGENTS.md hard rule 15 and [`modes.md`](design-system/00-foundations/modes.md).
- **v0.13 — glass surfaces only on floating shells.** backdrop-filter on popover/sheet/command-palette/hero-device-frame/nav. NEVER on canvas, data table, row, cell. See AGENTS.md hard rule 16.
- **v0.13 — Phase 0 alias namespace is additive.** `color.obsidian.800` and `color.brand.800` both resolve to `#0D0D0D`. New code may use either; both are first-class. Do NOT remove a v0.12.6 name. See AGENTS.md hard rule 18.
- **v0.13 — DTCG 2025.10 is the token contract.** $value + $type + $description on every token. Alias syntax `{token.path}`. Schema URL is `https://www.designtokens.org/schemas/2025.10/format.json`. See AGENTS.md hard rule 17.
- **v0.13 — Vercel AI Elements naming for AI primitives.** When generating AI surface components, mirror Vercel AI Elements names verbatim. Citation UI consumes Anthropic Citations API JSON shape. See AGENTS.md hard rule 19.

## Working with the audit dashboard

The audit dashboard at `/audit-dashboard/` is the live reference implementation.

- Run with `cd audit-dashboard && pnpm dev`.
- DO NOT run the dev server during heavy file-editing work — Turbopack + many open files can OOM the kernel.
- The dashboard's [globals.css](audit-dashboard/src/app/globals.css) is the de-facto source of truth for built CSS — it carries all v0.4 token mappings, the v0.5 typography utility classes, and the v0.6 `.lumen-field` shell system. When Style Dictionary's `dist/tailwind/lumen.css` (v0.13 — was `_build/tailwind/theme.css` pre-v0.13) is wired, the goal is to derive `globals.css`'s `:root` token block from it.
- Treat `globals.css` as edit-with-care, not a placeholder.

## When asked to ship a brand voice

The user occasionally invokes `/!boil-the-ocean` or `/!claude-ai-research`. These are personal user skills:
- `/!boil-the-ocean` = do the comprehensive thing, no shortcuts, ship the whole task.
- `/!claude-ai-research` = research deeply, source-grounded, write to `research/` or `notes/` as Markdown.

Honor them.

## v0.13 phase work

When executing one of the seven v0.13 phase prompts (Phase 0 through Phase 6):

1. Read `doc/LUMEN-v0.13-MASTER-REFACTOR.md` end-to-end before touching code.
2. Each phase ships its report into `design-system/06-claude-code-briefings/phase-{N}-report.md` per master doc §10.3.
3. The phase-prompt addendum overrides master doc §4.2: make every decision unilaterally, document in the phase report, do not pause to ask.
4. Hard rules in §3 of the master doc and AGENTS.md still apply. If a step would violate them, choose a different path.
5. After the phase commit lands, STOP. Do not auto-chain to the next phase. Wait for the operator to paste the next phase prompt.
