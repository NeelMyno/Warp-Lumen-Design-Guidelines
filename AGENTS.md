# AGENTS.md — Lumen Design System

> Universal agent rules for any AI coding agent working in this repo (Cursor, Claude Code, Codex, Devin, Copilot, etc.). Read this before doing anything. If you are Claude, also read [CLAUDE.md](./CLAUDE.md). If your tool has its own rules format (Cursor's `.cursor/rules/`, Warp's `.warp/`), they mirror this file.

## What this repo is

Lumen is the source of truth for Warp's UI. It contains design tokens (DTCG JSON), component contracts (Markdown + JSON sidecars), and platform consumption guides. It does NOT contain shipped product code — product code lives in consumer repos and pulls Lumen via shadcn registry / Swift Package / Compose module / etc.

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

7. **The Warp lime green (`color.accent.500` = `#4ade80`) plays exactly ONE role**: action / live / success. Never decorative. Never as a second accent. Never on non-action chrome. Adding a second loud color to the system is a brand violation.

8. **Honor `prefers-reduced-motion`** in everything that animates. Motion that doesn't respect this fails CI.

9. **Never render white or near-white text on the lime accent surface.** The accent foreground is bound to `color.accent.fg` (`#0a0a0d`, ~12.6:1 AAA on `#4ade80`). White on lime is ≈1.66:1 — a WCAG AA fail. Specifically:
   - Do NOT use the shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`, `bg-card`, `text-card-foreground`, `bg-popover`, `text-popover-foreground`, etc.) in product code. They resolve through `:root` → `--primary-foreground` → `--text-on-accent` → `--lumen-accent-fg`, and Tailwind v4's content scanner has been observed to drop those classes, leaving the element to inherit `--text-primary` (near-white).
   - DO use the v0.9 `.lumen-btn-*` defensive class family (declared in `audit-dashboard/src/app/globals.css`) for any button surface — `.lumen-btn-primary`, `.lumen-btn-secondary`, `.lumen-btn-ghost`, etc. compose statically and ship every time.
   - DO use direct semantic refs for one-off surfaces: `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` (audit-dashboard) or `bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]` (canonical via the v0.9 action-surface bridge).
   - Lint rule `lint:no-white-on-accent` enforces both halves automatically. Vendor `audit-dashboard/src/components/ui/*` files are audited by hand; only files listed in the lint's `VENDOR_REWRITTEN` set are exempt from the bridge ban.
   - For the comprehensive button language — sizes, intents, shapes, states, motion, voice — read [`design-system/00-foundations/buttons.md`](design-system/00-foundations/buttons.md). For the rationale read [ADR 0016](_meta/decisions/0016-button-rebuild-v09.md).

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
