# CLAUDE.md — Lumen-specific addenda for Claude

> Read [AGENTS.md](./AGENTS.md) first. Everything in AGENTS.md applies. This file adds Claude-specific instructions on top.

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

## Working with the audit dashboard

The audit dashboard at `/audit-dashboard/` is the live reference implementation. It uses every token, every primitive, every component pattern.

- Run with `cd audit-dashboard && pnpm dev`.
- DO NOT run the dev server during heavy file-editing work — Turbopack + many open files can OOM the kernel. Run dev server when actively viewing; kill it before doing batch edits.
- The dashboard's `globals.css` is a placeholder — when Style Dictionary outputs `_build/tailwind/theme.css`, replace the dashboard's tokens with that file.

## When asked to ship a brand voice

The user occasionally invokes `/!boil-the-ocean` or `/!claude-ai-research`. These are personal user skills:
- `/!boil-the-ocean` = do the comprehensive thing, no shortcuts, ship the whole task.
- `/!claude-ai-research` = research deeply, source-grounded, write to `research/` or `notes/` as Markdown.

Honor them.
