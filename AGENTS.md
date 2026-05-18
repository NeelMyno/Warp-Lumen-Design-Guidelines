# AGENTS.md — Lumen Design System

> Universal agent rules for any AI coding agent working in this repo (Cursor, Claude Code, Codex, Devin, Copilot, etc.). Read this before doing anything. If you are Claude, also read [CLAUDE.md](./CLAUDE.md). If your tool has its own rules format (Cursor's `.cursor/rules/`, Warp's `.warp/`), they mirror this file.

## What this repo is

Lumen is the source of truth for Warp's UI. It contains design tokens (DTCG JSON), component contracts (Markdown + JSON sidecars), and platform consumption guides. It does NOT contain shipped product code — product code lives in consumer repos and pulls Lumen via shadcn registry / Swift Package / Compose module / etc.

> [!note]
> **v0.12.7 — Sticky-nav chrome-bleed fix pack — header swapped to `.lumen-glass-strong` + `saturate(110%)` to seal the chrome from lime-halo bleed; `Radio` primitive switched to `defaultChecked` fallback when no `onChange` to clean a console warning on `/library` (current).** A two-round live visual audit (Edge on macOS) walked all eight surfaces — foundations / library / saas / landing / tool / commerce / mobile / desktop — clicking every overlay, hovering every interactive primitive, scrolling top-to-bottom, reading the console after every mount. Two real defects surfaced. (1) The sticky-header `.lumen-glass` chrome (62 % opacity + saturate 140 %) was ingesting lime-halo bleed from primary CTAs — `--shadow-glow-accent-strong`'s outer layer reaches 72 px from the button in every direction (`0 24px 72px -12px var(--lumen-lime-a24)`), so a CTA at y=140 painted a halo from y=68 to y=212, and the header's lower edge sat at y=119; 38 % transparency × 1.4 saturate amplified the bleed into a visible green wash. Fix: `[audit-dashboard/src/components/dashboard-shell.tsx]` swap header from `.lumen-glass` → `.lumen-glass-strong` (86 % opacity + blur 28 px), and `[audit-dashboard/src/app/globals.css]` dial `.lumen-glass-strong` from `saturate(160%)` → `saturate(110%)`. The chrome now stays single-toned across every scroll position — even directly above Landing's "Light mode preview · same tokens, inverted surfaces" inverse band where it used to wash to muddy gray. (2) The `Radio` primitive at `[audit-dashboard/src/components/primitives/inputs.tsx]` forwarded `checked` to the native input without a paired `onChange` for static showcases, and `<input type="radio">` can't take `readOnly`, so React warned on every `/library` mount. Fix: when `onChange` is omitted, fall back to `defaultChecked` and let the underlying input run uncontrolled. Controlled-mode usages with `onChange` are unchanged. v0.12.7 ships without a new ADR — both fixes are consequential follow-ups to ADR 0007 (component contract) + 0016 (motion ladder) + 0018 (premium psychology). Audit log preserved at `.audit-runs/2026-05-18-comprehensive/`. v0.12.6 was the **primitive coverage drop** — 63 new component contracts (Toolbar, Sidebar, AISuggestion, InventoryStatus, Kanban, DataGrid, Calendar, TreeView, ChatBubble, CartDrawer, PricingCard, …) close the LLM-facing gap against the Apple HIG / Material / Polaris / Atlassian feature surface; every primitive now ships `component.md` + `component.json` + `examples/primary.tsx` + a `_registry/{name}.json` sidecar (`_registry/registry.json` now lists 98 items). v0.12.5 was the **live-audit fix pack** — single-source-of-truth version constant + iconography accent-on-hover + pricing card peak-end lift + FAQ chevron unified to lucide + privacy scrubs. Brand anchors unchanged from v0.12.0: accent `#00FA8A` (Spring Green), dark `#0D0D0D` (neutral obsidian, replaces v0.11's `#171A18` obsidian-mint per [ADR 0020](_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md)), light `#E6E6E6` (neutral light, also primary text on dark). v0.12.1 — Card corner-clip contract ([ADR 0021](_meta/decisions/0021-card-corner-clip-contract-v0121.md)). v0.12.2 — primary-button hover bloom dialed down ([ADR 0022](_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)). v0.12.3 — Tailwind v4 arbitrary-translate fragility retired (cascade-fix to ADR 0015/0016 — position math via inline `style.left` / `style.transform`). v0.12.4 — three primitive-layer fixes: InlineTabs pill `overflow-hidden`, Combobox dropdown portaled, global `:focus-visible` gains `outline + offset` on top of soft `box-shadow` halo. **v0.12.5 — five additions:** (1) new [`audit-dashboard/src/lib/version.ts`](audit-dashboard/src/lib/version.ts) hoists the user-facing version label to a single constant (`LUMEN_VERSION`) — every consumer (header pill, footer line, palette footer, foundations brand-voice samples, library / tool / foundations badges) now reads from it; the v0.11.13 → v0.12.4 audit caught a stale palette footer three minor versions behind because no one had grepped the literal — the constant retires that whole class of drift; (2) iconography hover state lifts icon glyph to `text-accent` + tile border to `border-accent` so the brand rule "green appears precisely at action" is taught visually, not just in prose; (3) pricing cards on landing gain peak-end hover lift (non-highlighted: `shadow-md` + `border-default` + `-translate-y-[1px]`; highlighted Operator: soft accent glow `--shadow-glow-accent`) — pricing decision is a peak moment per Premium Psychology principle 3, the cards now respond; (4) landing FAQ disclosure caret migrates from Unicode `▾` (U+25BE) to lucide `<ChevronDown />` for consistency with commerce + tool accordions; new `.lumen-summary` + `summary.list-none` CSS rule suppresses the native browser disclosure marker so the lucide icon is the sole disclosure cue on every browser (Chrome / Safari / Firefox via `list-style: none`, pre-2022 webkit via `::-webkit-details-marker`); (5) privacy hygiene — real-person names (`Sokolovsky` / `Tengariya`) retired from 9 sites in 5 files in favour of synthetic operator names (`Avery Mercer` / `Kai Morgan`) per the no-customer-names rule. v0.12.5 ships without a new ADR — five surgical fixes, all consequential follow-ups to existing ADRs (0007 component-contract, 0009 versioning, 0018 brand voice). The seven principles still encode 50ms halo + cognitive fluency + peak-end rule. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md) (amended by ADR 0020) for the recolor rationale. The full v0.12.x story (v0.12.0 → v0.12.5) is in the CHANGELOG; v0.12.3 / v0.12.4 / v0.12.5 are intentionally ADR-less — consequential follow-ups, not architectural shifts.

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

13. **Version labels read from `lib/version.ts`, never hardcoded literals** (v0.12.5 — closes the v0.11.13 → v0.12.4 palette-footer drift). Every user-facing version label — header pill, footer line, command-palette footer, foundations brand-voice samples, library / tool / foundations badges, the "End of library — last refreshed" line — must read from [`audit-dashboard/src/lib/version.ts`](audit-dashboard/src/lib/version.ts). Three exports for three contexts: `LUMEN_VERSION` (`"v0.12.5"`) for patch-level chips; `LUMEN_VERSION_MAJOR_MINOR` (`"v0.12"`) for inline mono-cap references that don't need the patch; `LUMEN_VERSION_MAJOR_MINOR_UPPER` (`"V0.12"`) for explicit uppercased brand-voice signals (`SYSTEM V0.12 · LIVE`). The release script (`scripts/release.mjs`) now bumps both the root `VERSION` file and `lib/version.ts` in lockstep; do not let them drift. **Exemptions:** prose descriptions referencing historical versions (e.g. "v0.10 retired JetBrains Mono", "v0.11 retired the warm-cream ramp") stay literal — those are immutable historical annotations. ADR titles, filenames, CSS comments documenting when a rule landed all stay literal. The constant is for *current-version labels rendered in the runtime UI*, not for *prose history*. **Rule:** before rendering a version string in any TSX, import from `@/lib/version`; before adding a new TSX file that ships a version label, audit the existing imports in `dashboard-shell.tsx` / `command-palette.tsx` / `foundations/page.tsx` for the canonical wiring.

14. **`<details>`/`<summary>` accordions suppress the native disclosure marker — always — when composing your own end-of-summary chevron** (v0.12.5 — closes the landing-FAQ Unicode-`▾` mismatch with the commerce + tool lucide-`ChevronDown` pattern). When you write a Lumen accordion that paints its own affordance icon at the END of the summary (the canonical pattern: lucide `ChevronDown size={14}` rotating 180° via `group-open:rotate-180` on the summary), the native browser-default disclosure triangle (▶/▼ in webkit, ▾/▸ in firefox) STILL renders before the summary's text content, which means two arrows compete for affordance — one of them off the brand stroke ladder. The `globals.css` `.lumen-summary` + `summary.list-none` rule suppresses both: `list-style: none` covers modern Chrome / Safari / Firefox via the standard `::marker`; `::-webkit-details-marker { display: none }` covers the pre-2022 webkit fallback. Apply the class on every accordion summary. **Rule:** every new `<summary>` that composes a custom chevron icon gets `class="lumen-summary"` (or the Tailwind utility `list-none` — both trigger the same rule pair). Never let the native marker double up with a custom icon.

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
| Runtime version constant (v0.12.5+) | `audit-dashboard/src/lib/version.ts` — `LUMEN_VERSION`, `LUMEN_VERSION_MAJOR_MINOR`, `LUMEN_VERSION_MAJOR_MINOR_UPPER`. Every user-facing version label imports from here. |

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
