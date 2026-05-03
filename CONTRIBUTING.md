# Contributing to Lumen

> If you are an AI coding agent, the rules in [AGENTS.md](./AGENTS.md) take precedence over this file. Read AGENTS.md first.

## Welcome

Lumen is Warp's design system. It serves the small in-house product/software-builder team. Contributions of any size are welcome — fixing a typo, adding a missing token, shipping a new component, porting to a new platform.

## Before you start

1. Read [README.md](./README.md) to orient.
2. Read [AGENTS.md](./AGENTS.md) for the hard rules (apply to humans too).
3. Read [`_meta/decisions/`](./_meta/decisions/) for the architectural choices and why they were made.
4. Check open issues in GitHub. If your change is non-trivial, open an issue first.

## Setup

```bash
git clone <repo-url>
cd Warp-Lumen-Design-Guidelines
pnpm install
pnpm build           # Style Dictionary builds tokens into _build/
pnpm validate        # JSON schemas + DTCG lint + WCAG contrast
```

To work on the audit dashboard:
```bash
cd audit-dashboard
pnpm install
pnpm dev             # http://localhost:3000
```

> [!warning]
> Don't keep `pnpm dev` running while doing heavy file edits in the same session — Turbopack memory pressure can cascade. Run dev when actively viewing; kill it before batch edits.

## How to contribute

### Adding a new component

Use the prompt fragment at [`_meta/prompts/new-component.md`](./_meta/prompts/new-component.md) — it walks through the canonical flow (md + json + example + registry entry + CHANGELOG + audit dashboard).

### Adding or modifying a token

Use the prompt fragment at [`_meta/prompts/token-update.md`](./_meta/prompts/token-update.md). Hard rules:
- Engineers and LLMs only consume **semantic** tokens. Hand-edit primitives only.
- Every semantic token must exist in every mode file (light AND dark, etc.).
- Breaking changes require an ADR.

### Porting a component to a new platform

Use [`_meta/prompts/platform-port.md`](./_meta/prompts/platform-port.md). Match the prop names from `component.json`, use the platform's token API (CSS var / Swift / Kotlin / Liquid), honor platform a11y conventions.

### Adding a tab to the audit dashboard

Use [`_meta/prompts/audit-dashboard-tab.md`](./_meta/prompts/audit-dashboard-tab.md).

### Documentation-only fix

Just open a PR. CI will validate any structured changes (frontmatter, JSON schema). Cosmetic fixes can land via the AUTOMERGE trust level (see AGENTS.md).

## Pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org): `feat(button): add loading prop`, `fix(tokens): correct accent.fg contrast`, `docs(motion): add cross-fade recipe`.
- Add a CHANGELOG entry under `[Unreleased]` in the matching category (Added/Changed/Deprecated/Removed/Fixed/Security).
- One logical change per PR.
- Include screenshots for visual changes (run the audit dashboard and capture the relevant tab).

## Testing & validation

Every PR runs:
```bash
pnpm validate          # JSON schemas + DTCG + WCAG contrast
pnpm lint              # No raw hex/px in component code, no primitives in components
pnpm registry          # Regenerate shadcn registry from component sources
pnpm build             # Style Dictionary
```

A failing check blocks merge. To suppress, open an ADR.

## Style guide

- Markdown: sentence-case section headers, no ALL CAPS in body, prefer tables for spec data.
- JSON: 2-space indent, trailing newline, sorted alphabetically where order doesn't carry meaning.
- TypeScript: strict, no `any`, function components, no class components.
- CSS / Tailwind: v4 only, tokens via CSS variables (`var(--color-…)`), no raw hex / px.
- Filenames: kebab-case (`live-dot.json`, `empty-state.md`).
- Component names in code: PascalCase (`LiveDot`, `EmptyState`).

## Versioning & releases

See [ADR 0009](./_meta/decisions/0009-versioning-semver-system-wide.md). Single semver for the whole system, Keep-a-Changelog format.

Releases happen ~ every 4-6 weeks (minor) or as needed (patch). To cut a release:

```bash
pnpm release patch    # or minor / major
```

This bumps `VERSION`, prepends to `CHANGELOG.md`, runs `pnpm build && pnpm validate && pnpm registry`. Then commit, tag, push.

## Code of conduct

Be direct. Be specific. Cite tokens, not vibes. Disagree with reasoning, not personality. The work is what matters.

## Questions

- Architecture question → check `_meta/decisions/`. If not answered, open an issue tagged `architecture`.
- Token question → check `design-system/01-tokens/README.md` and the `glossary.json`.
- Component question → read the `component.md` AND `component.json` together.
- Anything else → ask.
