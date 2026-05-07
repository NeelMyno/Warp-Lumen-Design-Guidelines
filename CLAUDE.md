# CLAUDE.md — Lumen-specific addenda for Claude

> Read [AGENTS.md](./AGENTS.md) first. Everything in AGENTS.md applies. This file adds Claude-specific instructions on top.

> [!note]
> **v0.12.4 — Three primitive-layer fixes — InlineTabs pill corner-clip + Combobox portal + global focus-ring outline backstop (current).** Brand anchors unchanged from v0.12.0: Spring Green `#00FA8A` (accent), Obsidian `#0D0D0D` (neutral dark canvas, replaces v0.11's `#171A18` Obsidian Mint), `#E6E6E6` (light anchor / primary text on dark), `#FAFAFA` (paper). v0.12 retunes the brand canvas to neutral near-black ([ADR 0020](_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md)); v0.12.1 ships the Card corner-clip contract ([ADR 0021](_meta/decisions/0021-card-corner-clip-contract-v0121.md)); v0.12.2 dials the primary-button hover bloom down ([ADR 0022](_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)). v0.12.3 retires Tailwind v4 arbitrary-translate fragility on PricingToggle + SwipeAction (cascade-fix to ADR 0015/0016 — position math via inline `style.left` / `style.transform`, not arbitrary `translate-x-[Npx]`). v0.12.4 ships three primitive-layer fixes that close v0.12.1's ADR-0021 trade-offs and extend its corner-clip pattern to a smaller scale: (1) InlineTabs pill `TabsList` gains `overflow-hidden`; (2) Combobox dropdown migrates to `createPortal` + `position: fixed` + `getBoundingClientRect()` tracking so it escapes ancestor overflow contexts (Showcase frames, `<Card padding="none">`, glass surfaces); (3) global `:focus-visible` rule gains `outline: 2px solid lime-a64; outline-offset: 1px;` on top of the existing soft `box-shadow` halo, so focus rings remain structurally visible inside corner-clipped containers. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected — `outline: none` wins via specificity. Three v0.11 foundations [`hierarchy.md`](design-system/00-foundations/hierarchy.md), [`first-impression.md`](design-system/00-foundations/first-impression.md), [`micro-interactions.md`](design-system/00-foundations/micro-interactions.md) still apply; principles still 7. The single-accent rule (Spring Green only) is unchanged across v0.11 → v0.12.4. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md) (recolor rationale, amended by 0020) and [CHANGELOG](CHANGELOG.md) for the full v0.12.x story (v0.12.3 + v0.12.4 ship without new ADRs by design — they're consequential follow-ups to ADRs 0007 + 0015/0016 + 0021).

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
2. Cite token paths with backticks: `color.surface.default`, never copy raw values into prose.
3. If the user is on a specific platform, prioritize that platform's example.

## Naming + voice

- Use Lumen's voice: short, declarative, numerate. (See `design-system/00-foundations/voice-and-tone.md`.)
- When generating button labels, helper text, or any UI copy, run them through the rules in `design-system/04-content/ui-writing-style.md`.
- Avoid the banned phrase list in `design-system/04-content/microcopy.md` § "Banned phrases".

## Generating new components

When asked to create a new component:

1. Check if a similar component already exists (search `design-system/02-components/`).
2. If new, follow the prompt fragment in `_meta/prompts/new-component.md`.
3. Create `./{name}/component.md` and `./{name}/component.json`.
4. JSON must validate against `_schema/component.schema.json`.
5. Add at least one `web-react` example.
6. Add a registry sidecar at `_registry/{name}.json`.
7. Add to `_registry/registry.json` items array.
8. Add a CHANGELOG entry.
9. Surface the work for human review (DRAFT-PR trust level).

## Cross-cutting concerns

- **License.** Satoshi is ITF-FFL — free for commercial use, must self-host, must NOT redistribute the font files in any public repo. Don't commit the font files to a public git repo.
- **Vault context.** This is a Warp internal repo, not the user's Obsidian vault. The vault rules in user's global CLAUDE.md don't apply unless the user explicitly invokes a vault skill.
- **Privacy.** No customer names in tokens, comments, or examples. Use generic ones (Sterling LTL, Estes Express are real carrier names; safe to use as examples).
- **v0.11 hierarchy first.** Before generating any new section, page, or component layout: read [`hierarchy.md`](design-system/00-foundations/hierarchy.md) and apply the three-tier rule + the 1.5–2× weight rule. Equal-weight noise is the most common failure mode of LLM-generated UI; principle 2 is the cure.
- **v0.11 hero first.** Any landing or hero surface flows through [`first-impression.md`](design-system/00-foundations/first-impression.md) — three questions answered (what/who/why), three checks passed (branded chrome, single focal point, no layout shift), in 50ms.
- **v0.11 micro-interaction catalog.** Hover, focus, validation, success — read [`micro-interactions.md`](design-system/00-foundations/micro-interactions.md) before designing any state change. Spend motion budget on functional moments; save it from decoration.
- **v0.12.4 floating-UI portal default.** When generating a Combobox / Select / Popover / Dropdown / Tooltip / Calendar primitive — or any new floating panel — portal to `document.body` from day one via `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Never render the panel as an inline `<div absolute>` — Showcase frames, `<Card padding="none">`, glass surfaces, and scroll containers all clip it. See AGENTS.md hard rule 10. Outside-click dismiss must exempt the portaled list.
- **v0.12.4 focus-ring contract.** When generating any new `:focus-visible` rule, include `outline` for structural visibility (`outline: 2px solid var(--lumen-lime-a64); outline-offset: 1px;`) AND `box-shadow` for the soft brand halo. Box-shadow alone fails inside corner-clipped containers (the regression v0.12.4 closed). Outline alone loses the soft alpha-blended brand character. The `.lumen-btn-primary:focus-visible` dual-ring is exempt — it declares `outline: none` and wins via CSS specificity by design (preserves ADR 0016's brand visual). See AGENTS.md hard rule 11.
- **v0.12.3 inline-style for position math.** When generating a toggle / switch / swipe-row / handle / thumb / calendar-nav primitive, write position math as inline `style.left` (or `style.transform`) with a native `transition` declaration. Do NOT use Tailwind arbitrary `translate-x-[Npx]` classes — Tailwind v4's content scanner has been observed to drop them. See AGENTS.md hard rule 12. Use the system's `cubic-bezier(0.2, 0, 0, 1)` decelerate easing.
- **v0.12.4 corner-clip pattern.** When generating a rounded container (Card, TabsList, Pill track, Capsule frame, Sheet) that hosts children with their own backgrounds and smaller-radius corners, compose `overflow-hidden` on the parent. The Card primitive does this on `padding="none"`; the InlineTabs `pill` variant does this on its `TabsList`. The contract is "child clips to parent's rounded shape," not "child matches parent's radius."

## Working with the audit dashboard

The audit dashboard at `/audit-dashboard/` is the live reference implementation. It uses every token, every primitive, every component pattern.

- Run with `cd audit-dashboard && pnpm dev`.
- DO NOT run the dev server during heavy file-editing work — Turbopack + many open files can OOM the kernel. Run dev server when actively viewing; kill it before doing batch edits.
- The dashboard's [globals.css](audit-dashboard/src/app/globals.css) is now the de-facto source of truth for built CSS — it carries all v0.4 token mappings, the v0.5 typography utility classes, and the v0.6 `.lumen-field` shell system (~1900 lines). When Style Dictionary's `_build/tailwind/theme.css` is wired (ADR-0001 follow-up), the goal is to derive `globals.css`'s `:root` token block from it; the v0.5+ utility classes and v0.6 shells continue to live in `globals.css` as authored CSS.
- Treat `globals.css` as edit-with-care, not a placeholder.

## When asked to ship a brand voice

The user occasionally invokes `/!boil-the-ocean` or `/!claude-ai-research`. These are personal user skills:
- `/!boil-the-ocean` = do the comprehensive thing, no shortcuts, ship the whole task.
- `/!claude-ai-research` = research deeply, source-grounded, write to `research/` or `notes/` as Markdown.

Honor them.
