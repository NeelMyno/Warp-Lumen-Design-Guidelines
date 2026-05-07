# CLAUDE.md — Lumen-specific addenda for Claude

> Read [AGENTS.md](./AGENTS.md) first. Everything in AGENTS.md applies. This file adds Claude-specific instructions on top.

> [!note]
> **v0.12.2 — Obsidian (mint retired) + corner-clip + hover-bloom dial-down (current).** Brand anchors: Spring Green `#00FA8A` (accent), Obsidian `#0D0D0D` (neutral dark canvas, replaces v0.11's `#171A18` Obsidian Mint), `#E6E6E6` (light anchor / primary text on dark), `#FAFAFA` (paper). v0.12 retunes the brand canvas to neutral near-black ([ADR 0020](_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md)); v0.12.1 ships the Card corner-clip contract — `<Card padding="none">` auto-clips edge-touching children to the rounded shape ([ADR 0021](_meta/decisions/0021-card-corner-clip-contract-v0121.md)); v0.12.2 dials the primary-button hover bloom down at the token + layered-halo level — rest stays at the brand-defining `0 0 16px a25`, hover trims to `0 0 20px a28` plus quieter mid/outer layers ([ADR 0022](_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)). Three v0.11 foundations [`hierarchy.md`](design-system/00-foundations/hierarchy.md), [`first-impression.md`](design-system/00-foundations/first-impression.md), [`micro-interactions.md`](design-system/00-foundations/micro-interactions.md) still apply; principles still 7. The single-accent rule (Spring Green only) is unchanged across v0.11 → v0.12.2. See [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md) (recolor rationale, amended by 0020) and [CHANGELOG](CHANGELOG.md) for the full v0.12.x story.

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
