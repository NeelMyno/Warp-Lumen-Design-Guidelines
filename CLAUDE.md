# CLAUDE.md — Lumen-specific addenda for Claude

> Read [AGENTS.md](./AGENTS.md) first. Everything in AGENTS.md applies. This file adds Claude-specific instructions on top.

> [!note]
> **v0.12.8 — Interactive variant pickers fix pack — Commerce PDP `Buy` panel extracted to a client island so the color + size pickers wire real `useState` for selection; clicks now move the swatch ring and update the "Color · {name}" label and the size border instead of failing on the first click (current).** Round 2 of the same-day live audit went deeper than round 1 (visual / chrome-bleed) — every clickable, hoverable, expandable primitive across all eight surfaces in both dark and light mode. Most primitives passed; the Commerce variant pickers were the one real interaction defect that surfaced, and it ships fixed in this release. See [CHANGELOG.md](CHANGELOG.md) for the full v0.12.8 entry + the "deliberately not changed" list. v0.12.7 was the **sticky-nav chrome-bleed fix pack** — header swapped to `.lumen-glass-strong` + `saturate(110%)` so primary-CTA lime halos stop tinting the chrome when scrolled close to the header edge; `Radio` primitive falls back to `defaultChecked` when no `onChange` to silence a React "checked-without-onChange" warning on `/library`. Brand anchors unchanged from v0.12.0: Spring Green `#00FA8A` (accent), Obsidian `#0D0D0D` (neutral dark canvas, replaces v0.11's `#171A18` Obsidian Mint), `#E6E6E6` (light anchor / primary text on dark), `#FAFAFA` (paper). v0.12 retunes the brand canvas to neutral near-black ([ADR 0020](_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md)); v0.12.1 — Card corner-clip contract ([ADR 0021](_meta/decisions/0021-card-corner-clip-contract-v0121.md)); v0.12.2 — primary-button hover bloom dialed down ([ADR 0022](_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)); v0.12.3 — Tailwind v4 arbitrary-translate fragility retired (cascade-fix to ADR 0015/0016 — inline `style.left` / `style.transform` for position math); v0.12.4 — three primitive-layer fixes: InlineTabs pill `overflow-hidden`, Combobox dropdown portaled, global `:focus-visible` gains `outline + offset` on top of soft `box-shadow` halo. **v0.12.5** lands five additions caught by a two-round live visual audit (round 1 walks routes statically, round 2 triggers every overlay): (1) new [`audit-dashboard/src/lib/version.ts`](audit-dashboard/src/lib/version.ts) hoists the user-facing version label to a single constant — every consumer (header pill, palette footer, foundations brand-voice samples, library / tool / foundations badges) reads from it; the audit caught the command-palette footer reading `Lumen v0.11.13` three minor versions stale because nobody had grepped the literal — the constant retires that whole class of drift; (2) iconography hover lifts icon glyph to `text-accent` + tile border to `border-accent` (teaches "green appears at action" visually); (3) pricing card peak-end lift on landing (Starter / Enterprise: `shadow-md` + `border-default` + `-translate-y-[1px]`; Operator: soft accent glow); (4) landing FAQ disclosure caret migrates from Unicode `▾` to lucide `ChevronDown`, with the new `.lumen-summary` + `summary.list-none` CSS rule that suppresses the native browser disclosure marker on every browser; (5) privacy scrub — `Sokolovsky` / `Tengariya` retired from 9 sites in 5 files, replaced by synthetic operator names. v0.12.5 ships without a new ADR — five surgical fixes, all consequential follow-ups to ADRs 0007 + 0009 + 0018. Three v0.11 foundations [`hierarchy.md`](design-system/00-foundations/hierarchy.md), [`first-impression.md`](design-system/00-foundations/first-impression.md), [`micro-interactions.md`](design-system/00-foundations/micro-interactions.md) still apply; principles still 7. The single-accent rule (Spring Green only) is unchanged across v0.11 → v0.12.5. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md) (recolor rationale, amended by 0020) and [CHANGELOG](CHANGELOG.md) for the full v0.12.x story (v0.12.3 / v0.12.4 / v0.12.5 ship without new ADRs by design — they're consequential follow-ups, not architectural shifts).

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
- **Privacy — synthetic names only in fixtures and demos.** No real-person names in tokens, comments, fixtures, or examples. Use generic operator names. Carrier names are safe (Sterling LTL, Estes Express, ODFL, Saia, FedEx Freight, ABF, Old Dominion, Yellow are all real carriers — public B2B names, not customer identities). The v0.12.5 audit retired `Daniel Sokolovsky` / `Neel Tengariya` / their initials from 9 sites in 5 files (`ai.tsx` CommentThread, `foundations/page.tsx` Avatar + AvatarGroup demos + caption sample, `saas/page.tsx` AvatarGroup, `commerce/page.tsx` review fixture, `library/client.tsx` Avatar + AvatarGroup + Reaction-bar) — replaced with synthetic `Avery Mercer` (`A Mercer`, `Mercer A.`, `AM`) and `Kai Morgan`. When generating new fixtures, use one of these synthetic operator-name patterns or invent another that doesn't map to a real person referenced in the user's `CLAUDE.md` (the vault). Avatar palette is name-hashed, so deterministic colours follow whatever name you ship.
- **v0.11 hierarchy first.** Before generating any new section, page, or component layout: read [`hierarchy.md`](design-system/00-foundations/hierarchy.md) and apply the three-tier rule + the 1.5–2× weight rule. Equal-weight noise is the most common failure mode of LLM-generated UI; principle 2 is the cure.
- **v0.11 hero first.** Any landing or hero surface flows through [`first-impression.md`](design-system/00-foundations/first-impression.md) — three questions answered (what/who/why), three checks passed (branded chrome, single focal point, no layout shift), in 50ms.
- **v0.11 micro-interaction catalog.** Hover, focus, validation, success — read [`micro-interactions.md`](design-system/00-foundations/micro-interactions.md) before designing any state change. Spend motion budget on functional moments; save it from decoration.
- **v0.12.4 floating-UI portal default.** When generating a Combobox / Select / Popover / Dropdown / Tooltip / Calendar primitive — or any new floating panel — portal to `document.body` from day one via `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Never render the panel as an inline `<div absolute>` — Showcase frames, `<Card padding="none">`, glass surfaces, and scroll containers all clip it. See AGENTS.md hard rule 10. Outside-click dismiss must exempt the portaled list.
- **v0.12.4 focus-ring contract.** When generating any new `:focus-visible` rule, include `outline` for structural visibility (`outline: 2px solid var(--lumen-lime-a64); outline-offset: 1px;`) AND `box-shadow` for the soft brand halo. Box-shadow alone fails inside corner-clipped containers (the regression v0.12.4 closed). Outline alone loses the soft alpha-blended brand character. The `.lumen-btn-primary:focus-visible` dual-ring is exempt — it declares `outline: none` and wins via CSS specificity by design (preserves ADR 0016's brand visual). See AGENTS.md hard rule 11.
- **v0.12.3 inline-style for position math.** When generating a toggle / switch / swipe-row / handle / thumb / calendar-nav primitive, write position math as inline `style.left` (or `style.transform`) with a native `transition` declaration. Do NOT use Tailwind arbitrary `translate-x-[Npx]` classes — Tailwind v4's content scanner has been observed to drop them. See AGENTS.md hard rule 12. Use the system's `cubic-bezier(0.2, 0, 0, 1)` decelerate easing.
- **v0.12.4 corner-clip pattern.** When generating a rounded container (Card, TabsList, Pill track, Capsule frame, Sheet) that hosts children with their own backgrounds and smaller-radius corners, compose `overflow-hidden` on the parent. The Card primitive does this on `padding="none"`; the InlineTabs `pill` variant does this on its `TabsList`. The contract is "child clips to parent's rounded shape," not "child matches parent's radius."
- **v0.12.5 version constant — single source of truth.** When rendering a version label in any new TSX (header pill, footer, palette footer, brand-voice mono-cap, badge), import from [`@/lib/version`](audit-dashboard/src/lib/version.ts) — never hardcode the literal. `LUMEN_VERSION` (`"v0.12.5"`) for patch-level chips; `LUMEN_VERSION_MAJOR_MINOR` (`"v0.12"`) for inline references that don't need the patch; `LUMEN_VERSION_MAJOR_MINOR_UPPER` (`"V0.12"`) for explicitly-uppercased brand-voice tokens (`SYSTEM V0.12 · LIVE`). Comments in CSS / TSX about historical versions stay literal; renderable strings don't. See AGENTS.md hard rule 13.
- **v0.12.5 accordion summary marker contract.** When generating any custom accordion (`<details>`/`<summary>` with a lucide chevron icon at the END of the summary), apply `class="lumen-summary"` on the summary element — this triggers the `globals.css` rule that suppresses the native browser disclosure marker on every browser (Chrome / Safari / Firefox via standard `::marker` + `list-style: none`; pre-2022 webkit via `::-webkit-details-marker { display: none }`). Without the class, the native triangle renders BEFORE the summary text and competes with your custom chevron — two arrows, only one of them on the brand stroke ladder. The Tailwind utility `list-none` triggers the same rule pair. See AGENTS.md hard rule 14.
- **v0.12.5 iconography accent-on-hover.** When generating an interactive icon tile (icon library / quick-action tile / single-icon button card), the hover state must lift icon glyph color to `var(--text-accent)` and tile border to `var(--border-accent)` — this teaches the brand rule "green appears precisely at action" visually. The icon stays neutral at rest; the moment of interaction is when accent appears. See foundations §Color "Accent in context" + the canonical implementation in `app/foundations/page.tsx` iconography section.
- **v0.12.5 pricing card peak-end lift.** When generating an interactive card at a peak moment (pricing tier, plan selection, primary action card, decision tile), apply hover lift via the existing system tokens — non-highlighted cards: `shadow-md` + `border-default` + `-translate-y-[1px]`; highlighted cards: layer `var(--shadow-glow-accent)` on top of the rest-state lifted shadow. 140 ms `motion-fast` + standard easing — decelerate-not-bounce per ADR 0016. The pricing decision is a peak moment per Premium Psychology principle 3 — the card MUST respond. Static pricing cards are an LLM-UI smell (the model knows they exist but doesn't know they're peak moments).

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
