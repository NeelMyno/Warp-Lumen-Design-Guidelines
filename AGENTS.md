# AGENTS.md — Lumen Design System

> Universal agent rules for any AI coding agent working in this repo (Cursor, Claude Code, Codex, Devin, Copilot, etc.). Read this before doing anything. If you are Claude, also read [CLAUDE.md](./CLAUDE.md). If your tool has its own rules format (Cursor's `.cursor/rules/`, Warp's `.warp/`), they mirror this file.

## What this repo is

Lumen is the source of truth for Warp's UI. It contains design tokens (DTCG JSON), component contracts (Markdown + JSON sidecars), and platform consumption guides. It does NOT contain shipped product code — product code lives in consumer repos and pulls Lumen via shadcn registry / Swift Package / Compose module / etc.

> [!note]
> **v0.12.4 — Three primitive-layer fixes — InlineTabs pill corner-clip + Combobox portal + global focus-ring outline backstop (current).** Brand anchors unchanged from v0.12.0: accent `#00FA8A` (Spring Green), dark `#0D0D0D` (neutral obsidian, replaces v0.11's `#171A18` obsidian-mint per [ADR 0020](_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md)), light `#E6E6E6` (neutral light, also primary text on dark). v0.12.1 added the Card corner-clip contract ([ADR 0021](_meta/decisions/0021-card-corner-clip-contract-v0121.md)). v0.12.2 dialed the primary-button hover bloom down ([ADR 0022](_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)). v0.12.3 retired Tailwind v4 arbitrary-translate fragility on PricingToggle + SwipeAction (cascade-fix to ADR 0015/0016 — position math via inline `style.left` / `style.transform`, not arbitrary `translate-x-[Npx]` classes). v0.12.4 ships three primitive-layer fixes that close the v0.12.1 ADR-0021 trade-offs and extend its corner-clip pattern at smaller scale: (1) InlineTabs pill `TabsList` gains `overflow-hidden`; (2) Combobox dropdown migrates to `createPortal` + `position: fixed` so it escapes ancestor overflow contexts; (3) global `:focus-visible` rule gains `outline: 2px solid lime-a64; outline-offset: 1px;` on top of the existing soft `box-shadow` halo, so focus rings remain structurally visible inside corner-clipped containers (closes the v0.12.1 pagination-focus regression). The `.lumen-btn-primary:focus-visible` dual-ring is unaffected — it declares `outline: none` and wins via specificity. The three v0.11 foundations ([hierarchy.md](design-system/00-foundations/hierarchy.md), [first-impression.md](design-system/00-foundations/first-impression.md), [micro-interactions.md](design-system/00-foundations/micro-interactions.md)) still apply; the seven principles encoding 50ms halo + cognitive fluency + peak-end rule still apply. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md) for the v0.11 recolor rationale (amended by ADR 0020). v0.12.3 + v0.12.4 ship without new ADRs by design — they're consequential follow-ups to ADRs 0007 + 0015/0016 + 0021. The CHANGELOG entries carry the architectural notes.

Repo root tree (orient yourself):

```
.
├── AGENTS.md                ← you are here
├── CLAUDE.md
├── llms.txt
├── README.md
├── CHANGELOG.md
├── VERSION
├── style-dictionary.config.ts
├── package.json
├── design-system/
│   ├── 00-foundations/      ← principles, voice, a11y, motion-language
│   ├── 01-tokens/           ← DTCG JSON (primitives → semantic → component)
│   ├── 02-components/       ← component.md + component.json per component
│   ├── 03-platforms/        ← per-platform consumption guides
│   └── 04-content/          ← imagery, illustration, microcopy, errors
├── _registry/               ← shadcn-compatible registry.json + sidecars
├── _meta/                   ← glossary, ADRs, prompt fragments
├── _build/                  ← gitignored. Style Dictionary outputs.
├── audit-dashboard/         ← Next.js 16 reference implementation
└── research/                ← brand DNA, inspiration, typography, architecture
```

## Hard rules (MUST follow, no exceptions)

1. **Never invent tokens.** If you need a value not in `01-tokens/semantic/`, the answer is to ADD a semantic alias (with a PR + ADR), NOT to import a primitive directly or hardcode a value. Hardcoding hex codes, pixel sizes, or font stacks anywhere in component code is a violation.

2. **Always reference SEMANTIC tokens, never primitives.** `color.surface.default`, NOT `color.warm.50`. `space.4`, NOT `dimension.4`. `radius.card.default`, NOT `radius.lg`. Lint enforces this.

3. **Every component contract MUST validate against `/design-system/02-components/_schema/component.schema.json`.** Missing required fields blocks merge.

4. **Every component MUST ship a `component.json` machine contract before any code template.** The JSON is what LLMs and the MCP server read.

5. **Accessibility is WCAG 2.2 AA, hard floor.** Every interactive element needs visible focus, ≥ 4.5:1 text contrast (≥ 3:1 for large text), keyboard reachability, and an accessible name. AAA where it doesn't add cost.

6. **Use the platform-appropriate code template** from `02-components/{name}/examples/`. Do not invent new patterns when one exists.

7. **The Spring Green accent (`color.accent.500` = `#00FA8A`) plays exactly ONE role**: action / live / success. Never decorative. Never as a second accent. Never on non-action chrome. Adding a second loud color to the system is a brand violation. (v0.11 evolved the accent from lime `#4ade80` to spring green `#00FA8A`; the single-accent discipline is unchanged. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md).)

8. **Honor `prefers-reduced-motion`** in everything that animates. Motion that doesn't respect this fails CI.

9. **Never render white or near-white text on the Spring Green accent surface.** The accent foreground is bound to `color.accent.fg` (`#07120D`, ~14.7:1 AAA on `#00FA8A`). White on spring green is ≈1.4:1 — a WCAG AA fail. Specifically:
   - Do NOT use the shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`, `bg-card`, `text-card-foreground`, `bg-popover`, `text-popover-foreground`, etc.) in product code. They resolve through `:root` → `--primary-foreground` → `--text-on-accent` → `--lumen-accent-fg`, and Tailwind v4's content scanner has been observed to drop those classes, leaving the element to inherit `--text-primary` (near-white).
   - DO use the v0.9 `.lumen-btn-*` defensive class family (declared in `audit-dashboard/src/app/globals.css`) for any button surface — `.lumen-btn-primary`, `.lumen-btn-secondary`, `.lumen-btn-ghost`, etc. compose statically and ship every time.
   - DO use direct semantic refs for one-off surfaces: `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` (audit-dashboard) or `bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]` (canonical via the v0.9 action-surface bridge).
   - Lint rule `lint:no-white-on-accent` enforces both halves automatically. Vendor `audit-dashboard/src/components/ui/*` files are audited by hand; only files listed in the lint's `VENDOR_REWRITTEN` set are exempt from the bridge ban.
   - For the comprehensive button language — sizes, intents, shapes, states, motion, voice — read [`design-system/00-foundations/buttons.md`](design-system/00-foundations/buttons.md). For the rationale read [ADR 0016](_meta/decisions/0016-button-rebuild-v09.md).

10. **Floating UI portals to `document.body` — never render a floating panel as an inline `<div absolute>`** (v0.12.4 — closes ADR 0021 trade-off). Combobox / Select / DropdownMenu / Popover / Tooltip / Calendar dropdowns must escape every ancestor's overflow context. The portal pattern: `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Outside-click dismiss must exempt the portaled list (clicks on options would otherwise close the dropdown before the option handler fires). Inline `<div absolute>` panels look correct in isolation but get clipped by Showcase frames, by `<Card padding="none">` (per ADR 0021 — composes `overflow-hidden`), by glass-strong surfaces, by scroll containers, by any nested flex/grid cell with overflow-clip. Lumen `Switch`, `Tooltip`, `DropdownMenu`, `Popover`, `Dialog` already portal via Radix; v0.12.4 brought the hand-rolled Combobox in line. **Rule:** any new floating panel portals from day one. Don't bet on the consumer never embedding it inside an overflow-clipped ancestor.

11. **Focus rings ride `outline + box-shadow`, never box-shadow alone** (v0.12.4 — closes the v0.12.1 ADR-0021 pagination-focus regression). The global `:focus-visible` rule paints both: `outline: 2px solid var(--lumen-lime-a64); outline-offset: 1px;` PLUS the existing soft `box-shadow: var(--shadow-focus)` glow halo. Box-shadow paints into the element's own painting context which DOES respect ancestor `overflow: hidden` — so a box-shadow-only focus ring on a button inside `<Card padding="none">` is partially clipped, producing visible "underline + vertical bar" fragments at the card's bottom edge. Outline is painted outside the layout box and is structurally immune to ancestor overflow. Modern browsers (Chrome 94+, Firefox 88+, Safari 16.4+) follow `border-radius` for outline when `outline-style` is not `auto`. The `.lumen-btn-primary:focus-visible` rule already declares `outline: none` and overrides via CSS specificity, so the dual-ring brand visual on primary buttons stays as ADR 0016 designed it. **Rule:** when authoring any new `:focus-visible` rule, include `outline` for structural visibility, then layer `box-shadow` for the brand halo. Box-shadow alone fails inside corner-clipped ancestors; outline alone loses the soft brand character.

12. **Position math via inline `style`, not Tailwind arbitrary classes — for thumbs, swipes, handles, calendar nav, anywhere the math is exact and the consumer has to be exactly right** (v0.12.3 cascade-fix to ADRs 0015/0016). Tailwind v4's content scanner has been observed to drop arbitrary `translate-x-[Npx]` / `top-[Npx]` / `left-[Npx]` utilities (intermittent, scanner-dependent — `getComputedStyle` reports `none` despite the className carrying the utility). For thumb / swipe / handle / popover anchor position math, use inline `style={{ left: N }}` (or `style={{ transform: 'translateX(...)' }}`) with a native `transition` declaration (default easing `cubic-bezier(0.2, 0, 0, 1)`). Inline style is scanner-independent; explicit `left` overrides the static-position fallback (no `auto`, no centering surprise on `<button>` elements with default `text-align: center`). The defensive `.lumen-btn-*` and `.lumen-field` class families per ADRs 0015/0016 remain the canonical pattern for component STYLING; rule 12 is specifically about position MATH on toggles, switches, swipe rows, calendar nav, etc. **Rule:** never hand-roll a `translate-x-[Npx]` arbitrary class for position math; either use inline `style.{left,transform}` or build a `.lumen-{primitive}` defensive CSS class system.

## Setup commands

- Install dev deps: `pnpm install`
- Build tokens: `pnpm build` (runs Style Dictionary, outputs to `_build/`)
- Validate: `pnpm validate` (JSON schemas + DTCG lint + WCAG contrast)
- Generate registry: `pnpm registry` (rewrites `_registry/*.json` from component sources)
- Run audit dashboard: `cd audit-dashboard && pnpm dev`

## Where things live

| Need | Path |
|---|---|
| Tokens (source) | `design-system/01-tokens/` |
| Tokens (built) | `_build/` (gitignored — read from CDN or `lumen-dist`) |
| Component contracts | `design-system/02-components/{name}/component.json` |
| Component prose | `design-system/02-components/{name}/component.md` |
| Platform guides | `design-system/03-platforms/{platform}/README.md` |
| shadcn registry | `_registry/registry.json` and `_registry/{name}.json` |
| ADRs | `_meta/decisions/` |
| Prompt fragments | `_meta/prompts/` |
| Glossary | `_meta/glossary.json` |
| Reference implementation | `audit-dashboard/` |

## Code style

- TypeScript strict, no `any`.
- React: function components, hooks, no class components.
- Tailwind v4 only — no v3 config files. Theme lives in `_build/tailwind/theme.css` via `@theme`.
- iOS: SwiftUI for new code.
- Android: Jetpack Compose.
- Token references in code: `var(--color-surface-page)`, NOT `#fafaf7`.
- File naming: kebab-case for component folders (`live-dot/`, `empty-state/`); PascalCase for component names in code (`LiveDot`, `EmptyState`).

## Changelog & PR conventions

- Conventional Commits: `feat(button): add loading prop`, `fix(tokens): correct accent.fg contrast`, etc.
- Add a CHANGELOG entry under the matching Keep-a-Changelog category (Added/Changed/Deprecated/Removed/Fixed/Security).
- Token changes: minor or patch decided by deprecation rules below.
- Component changes: minor (new prop) or patch (bug fix).
- Breaking changes: major. Open an ADR.

## Deprecation policy

- Mark tokens deprecated by setting `"$deprecated": "Replaced by {new.token.path} in v0.2.0. Will be removed in v1.0.0."` on the token.
- Mark components deprecated by setting `"deprecated": true` and `"deprecationNotice": "..."` and `"removedIn": "1.0.0"` in `component.json`.
- A deprecation lives ≥ 1 minor release before removal.
- Removal happens in the next major.

## Trust levels (for autonomous agents)

| Level | Action | Examples |
|---|---|---|
| AUTOMERGE | Cosmetic, low-risk | Typo fixes in MD, dead-link fixes, missing alt text on SVGs |
| DRAFT-PR | Reviewable | New components matching the schema, new platform examples, new prompt fragments, token additions (no removals) |
| HUMAN-REVIEW | Always reviewed | Token rename or removal, schema changes, breaking changes to `component.json`, anything that bumps major version, license-affecting changes |

## When in conflict

- User instructions in chat override these rules where they conflict (the user is in control).
- These rules override your training memory of how design systems "usually" work.
- Lint and CI override your assumptions of what's valid.
- The `lumen-brief.md` is the source-of-truth for "why" decisions were made — read it when a rule feels arbitrary.

## What to do if you're stuck

1. Read the relevant `component.md` AND `component.json` together.
2. Check `_meta/decisions/` for an ADR on the topic.
3. Check `_meta/prompts/` for a workflow fragment that matches.
4. Search `research/` for the underlying evidence.
5. If still stuck, surface the question. Do not guess.
