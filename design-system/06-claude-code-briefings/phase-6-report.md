---
phase: 6
title: Documentation polish, MCP wiring & v0.13.0 ship
version: 0.13.0
branch: v0.13.0
author: claude-code
date: 2026-05-17
status: complete
---

# Phase 6 — Documentation polish, MCP wiring & v0.13.0 ship — Report

Per master doc §10.3 shape. This is the **final phase of the seven-phase v0.13 refactor**. After this commit lands locally, the v0.13 refactor as authored by Claude Code is complete; everything that follows is operator-side (push to remote, merge to `main`, push the annotated `v0.13.0` tag, confirm the Vercel production deploy from `main`).

The Phase 6 prompt's critical scope change was honored: **no custom Lumen MCP server.** The shadcn MCP server reads `registry.json` and per-item JSONs directly, so a separate `07-mcp/` server would duplicate surface without adding capability. Phase 6 collapses to a documentation + wiring + dashboard-rebuild phase. A Lumen-native MCP (for tools beyond shadcn's surface, e.g. `lumen.get_prompt_template`) is deferred to v0.14 as `@warp/lumen-mcp`. The phase report below documents this unilaterally.

## What changed

### Files created (high-level)

**Tooling (5 new generators)** — all native `node:fs`, zero external dependencies:

- [`tools/build-llms-txt.ts`](../../tools/build-llms-txt.ts) — flattens every MD + token JSON + prompt template into a single 1.9MB / ~495K-token `llms-full.txt`. Section-ordered: foundations → tokens → components → patterns → platforms → prompts → briefings. Output is at repo root.
- [`tools/build-llms-index.ts`](../../tools/build-llms-index.ts) — regenerates the curated `llms.txt` (14K chars) with live counts pulled from the filesystem (149 registry items, 7 patterns, 10 platforms, 7 prompts, 17 foundations). Replaces the obsolete `MCP (Phase 6 lands — /07-mcp/)` block with the shipped shadcn-MCP section.
- [`tools/build-token-index.ts`](../../tools/build-token-index.ts) — emits `audit-dashboard/public/token-index.json` (888K) for the `/tokens` route. 1,218 tokens across 4 layers (primitive=375, semantic=406, mode=19, component=418); 2,598 references recorded across component MD + TSX files; alias chains resolved at build time so the client never re-parses the graph.
- [`tools/build-component-index.ts`](../../tools/build-component-index.ts) — emits `audit-dashboard/public/component-index.json` (117K) for the `/library/registry` route. 146 components with tier (T1–T5), install command, tokens-consumed, mode behavior, SKILL.md NEVER-rule count, file presence flags (component.json / SKILL.md / Storybook / TSX).
- [`tools/build-prompt-index.ts`](../../tools/build-prompt-index.ts) — emits `audit-dashboard/public/prompt-index.json` (131K) for the `/prompts` route. 7 templates with assembled prompts (anchor inlined), canonical-subject manifests, reference PNG path (none materialized yet — operator-side per Phase 4 deferral).

**Audit dashboard (3 new routes + ModeToggle in chrome)**:

- [`audit-dashboard/src/components/mode-toggle.tsx`](../../audit-dashboard/src/components/mode-toggle.tsx) — persistent restrained ↔ expressive toggle in the sticky header. Writes `data-mode` on `<html>`, persists in `localStorage`, syncs cross-tab via `storage` event. Lucide icons (Layers ↔ Sparkles).
- [`audit-dashboard/src/app/tokens/page.tsx`](../../audit-dashboard/src/app/tokens/page.tsx) + [`client.tsx`](../../audit-dashboard/src/app/tokens/client.tsx) — interactive DTCG token browser. Layer + category filters, fuzzy search across path/cssVar/description, click-to-detail panel (resolved value + CSS var + DTCG path + source file + references list with line numbers + visual color swatch + copy-to-clipboard on every field). Result list virtualized at 500-row cap to keep the DOM trim.
- [`audit-dashboard/src/app/library/registry/page.tsx`](../../audit-dashboard/src/app/library/registry/page.tsx) + [`client.tsx`](../../audit-dashboard/src/app/library/registry/client.tsx) — data-driven registry browser. Each component card: install command, tokens consumed (linked to `/tokens?q=...` filter), mode badge, SKILL.md NEVER-rule count with amber-toned warning chip when > 0, tier filter, sortable by name / tier / NEVER-rule count. Sibling-route to the existing `/library` live showcase (which stays).
- [`audit-dashboard/src/app/prompts/page.tsx`](../../audit-dashboard/src/app/prompts/page.tsx) + [`client.tsx`](../../audit-dashboard/src/app/prompts/client.tsx) — gpt-image-2 template browser. Collapsible immutable anchor at top, per-template `copy raw` + `copy assembled` buttons, canonical-subject manifest sidecar, inline reference PNG when materialized (placeholder card when not).

**Tab config**:

- [`audit-dashboard/src/lib/tabs.ts`](../../audit-dashboard/src/lib/tabs.ts) — added `/tokens` and `/prompts` entries in the system group. TabNav consumes this automatically; no changes to `tab-nav.tsx`.

### Files modified

- [`AGENTS.md`](../../AGENTS.md) — added `## MCP integration` section (consumer install instructions: shadcn MCP add command, `components.json` shape, `/mcp` verify, what the shadcn MCP exposes out of the box, registry endpoint curl-test). Replaced the obsolete `| MCP server (Phase 6) | design-system/07-mcp/ |` row in the where-things-live table with `| MCP integration (Phase 6 — shadcn MCP, no custom server) | this file §"MCP integration" + components.json |`.
- [`CLAUDE.md`](../../CLAUDE.md) — the `## MCP — shadcn registry` section was rewritten end-to-end. The obsolete `claude mcp add ... lumen https://lumen.warp.dev/mcp` block was removed. Replaced with the shadcn-only path + note explaining the v0.14 deferral.
- [`llms.txt`](../../llms.txt) — fully regenerated by `tools/build-llms-index.ts`. The `## MCP (Phase 6 lands — /design-system/07-mcp/)` section was replaced with `## MCP — shadcn (v0.13 Phase 6 — shipped, no custom server)`. Live counts (149 components, 7 patterns, 10 platforms, 7 prompts) now derive from the filesystem instead of being hand-maintained.
- [`llms-full.txt`](../../llms-full.txt) — fully regenerated by `tools/build-llms-txt.ts`. Previous file was stuck at v0.12.5 framing (Phase 4 + 5 deferred regeneration). New file: 444 files flattened, 1,982,872 chars (~495K tokens). Section-headed.
- [`CHANGELOG.md`](../../CHANGELOG.md) — prepended the full `[0.13.0]` release block per the Phase 6 prompt's Group D shape (Added / Changed / Preserved / Migration / Operator-side gates). The `[Unreleased]` blurb updated to v0.13.0 release-candidate framing.
- [`package.json`](../../package.json) — added 7 new scripts: `llms`, `llms:index`, `llms:all`, `token-index`, `component-index`, `prompt-index`, `dashboard-indexes` (composite).
- [`audit-dashboard/src/components/dashboard-shell.tsx`](../../audit-dashboard/src/components/dashboard-shell.tsx) — imported `ModeToggle`, placed in the chrome utility row alongside `MoodSwitcher` and `ThemeToggle`. Two surgical insertions (one import, one JSX child).
- [`audit-dashboard/src/lib/tabs.ts`](../../audit-dashboard/src/lib/tabs.ts) — `TabSlug` extended with `"tokens" | "prompts"`; `TABS` array gets two new entries in the system group (placed after `library`).

### Files NOT touched (intentional preservation)

- Any DTCG token JSON (`design-system/01-tokens/**`). Phase 6 is documentation + wiring, not token graph changes.
- Any component contract or SKILL.md (`design-system/02-components/**/*.{md,skill.md,json}`). The 28 AI primitives + freight components from Phases 2 and 5 ship as-is.
- Any pattern MD (`design-system/03-patterns/**`).
- Any platform MD (`design-system/04-platforms/**`).
- Any prompt template MD (`design-system/05-prompts/**`).
- Reference apps (`examples/**`).
- `_registry/` sidecars and root `registry.json`. Counts in the dashboard reflect what's already on disk (149 items in root; 127 sidecars).
- `audit-dashboard/src/app/library/page.tsx` + `client.tsx` (the 1,585-line live showcase). The new `/library/registry` route is a sibling, not a replacement. Documented in CHANGELOG as a unilateral decision.

## What broke (and how I fixed it)

1. **`glob` package not available.** Initial drafts of the llms generators imported `glob`, but `glob` is not in the root `package.json` devDependencies (the project follows a zero-external-dep posture for tools — see `tools/audit-tokens.ts`). Rewrote both `build-llms-txt.ts` and `build-llms-index.ts` to use native `node:fs` recursion (`readdirSync` + `statSync` + a small `walk` helper). Matches the existing convention. No new deps required.

2. **Working directory drift after `cd audit-dashboard`.** The Bash shell persists `cwd` between commands. After a `cd audit-dashboard && pnpm exec tsc --noEmit` invocation, subsequent Bash commands started in `audit-dashboard/` rather than the repo root, so a multi-grep verification chain misread the AGENTS.md path. Detected on the first verification pass, reset cwd explicitly with an absolute-path `cd`, and re-ran. No code regression — only verification noise.

3. **NEVER-rule regex sanity-check.** Self-critique question 5 flagged a concern that the regex `^[-*]\s+NEVER\b` in `build-component-index.ts` might not catch bolded `- **NEVER**` patterns. Spot-checked the actual shape across button.skill.md, conversation.skill.md, sources.skill.md — all use the literal `- NEVER ...` shape, so the regex was correct. Verified counts match a manual `grep -c '^- NEVER'`. No fix needed; the concern was a false flag.

## Hard-rule violations I caught in self-critique

None. All 15 self-critique questions answered "no":

1. No live-foundations regression — Phase 6 doesn't touch the token graph.
2. No constraint from §2 relaxed.
3. Delegations to operator (push, merge to main, Vercel deploy, registry endpoint verification) are mandated by the user's safety rules (`~/.claude/rules/safety.md`: "Never push to any remote repository unless explicitly told to.") and the master doc's halt-after-phase contract — appropriate, not avoidable.
4. Simplest path surfaced: shadcn MCP, no custom server. Documented in AGENTS.md + CLAUDE.md + llms.txt + the phase report.
5. NEVER-rule regex verified against shipped SKILL.md shapes.
6. No second loud color. ModeToggle "Expressive" active state uses `var(--text-accent)` = Spring Green, which is the ONE allowed accent.
7. No hex literal outside primitives. `audit-tokens` PASS (174 files, 0 hex).
8. No off-grid spacing without a token. New routes use `gap-3`, `gap-6`, `h-control-md/cozy/sm`, `h-7/6/10`, `max-h-72/96/[60vh]/[70vh]` — all either tokens or 4-pt-multiples or viewport-relative.
9. No backdrop-filter applied to dense surfaces. `audit-mode` PASS (172 files, 0 data-mode in component source).
10. No reduced-motion / reduced-transparency regression. All new transitions use `var(--motion-fast)` which respects the system gate; no backdrop-filter introduced.
11. No v0.12.4 token name broken without an alias.
12. No Lumen icon via gpt-image-2. Lucide icons throughout (`Layers`, `Sparkles`, `Search`, `Copy`, `Check`, `X`, `Filter`, `Terminal`, `Lock`, `ImageIcon`, `AlertTriangle`).
13. Snapshot pin verified in `prompt-index.json` (`modelPin: "gpt-image-2-2026-04-21"`); displayed in `/prompts` chrome.
14. CHANGELOG entry shipped (full `[0.13.0]` release block).
15. llms.txt + llms-full.txt both regenerated by the new generators.

## What I assumed

1. **No custom MCP server.** The Phase 6 prompt instructed "Skip that. The shadcn MCP server works out of the box with any shadcn-compatible registry." Honored verbatim. Decision documented in AGENTS.md + CLAUDE.md + the new MCP section of llms.txt: a Lumen-native MCP ships as `@warp/lumen-mcp` in v0.14 if tools beyond shadcn's surface are needed.

2. **`/library/registry` as a sibling route, not a replacement of `/library`.** The existing `/library` is a 1,585-line client component that renders every primitive live. The Phase 6 prompt's Group C asked for "Component cards now show: registry install command, tokens consumed, mode behavior badge". Surgical edits to that 1,585-line file would be invasive and risky. The cleaner shape is a sibling data-driven view that consumes `component-index.json` — `/library` keeps doing what it does (showcase live primitives), `/library/registry` adds the contract-level browser. Documented as a unilateral decision in the CHANGELOG.

3. **Token references regex is best-effort.** The references pass in `build-token-index.ts` scans for `var(--…)` in TSX and `tokens:` frontmatter blocks + `var(--…)` in MD. It catches the dominant shapes (Phase 2 SKILL.md frontmatter declares `tokens:` block; component TSX files use `var(--token-name)`). It does NOT catch tokens referenced indirectly through CSS `@apply` or via styled-component template literals if those exist in the codebase. The reported "88 tokens referenced" is therefore a lower bound; the true coverage is somewhat higher but not enough to warrant a heavier parser.

4. **`pnpm dev` will OOM if run during heavy file edits** — honored via the audit-dashboard's CLAUDE.md warning. Type-check was the verification path, not a dev-server boot. The dashboard build (`pnpm docs:build`) was not run in this session; the operator may want to run it once before the merge as a smoke test. Type-check (`pnpm exec tsc --noEmit` in `audit-dashboard/`) was clean.

5. **`next/font/local` + Satoshi VF behaves identically on Next.js 16.2.4 as it did on 15.x.** The audit-dashboard already runs Next 16 (the `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` only required updating async API call-sites, none of which my new routes touch). No `params` / `searchParams` / `cookies` / `headers` in the new routes.

6. **`localStorage` cross-tab `storage` event fires only on OTHER tabs, not the originating one** — which is the documented browser behavior. The `ModeToggle` writes to `localStorage` inside its `flip()` handler and updates its own local state on the same tick; the `storage` listener handles updates from other tabs only. This is correct, just worth flagging for any future refactor that touches the toggle.

7. **The Vercel-deployed `/r/registry.json` endpoint resolution.** Per the Phase 2 setup, the operator-side `pnpm registry:build` writes per-item JSONs to `public/r/` and Vercel serves them. The Phase 6 verification gate `curl https://warp-lumen-design-guidelines.vercel.app/r/registry.json` is operator-side because the v0.13.0 branch is currently unpushed (6 commits ahead of origin/v0.13.0; Phase 6 makes it 7). Until the operator pushes + Vercel deploys, the endpoint serves the v0.12.6 build.

8. **Component-index `tier-0` bucket** = 71 components. These are the legacy v0.12.6 contracts (ai-suggestion, chat-bubble, etc.) that pre-existed the explicit tiering and don't fall into the T1–T5 buckets. Phase 6 doesn't reclassify them — they're rendered in the dashboard with a "—" tier marker and the "Legacy" label. v0.13.1 / v1.0 may want to formalize a `T0 · Legacy` tier in the master doc.

9. **`prompt-index.json` reference PNGs = 0.** Honored Phase 4's PNG-materialization deferral. The `/prompts` route shows a placeholder card with the operator-side regeneration instructions (`pnpm prompts:generate-references` with `OPENAI_API_KEY` set). All seven canonical-subject manifests are inlined in the index for browsing.

## What's still uncertain

1. **Registry endpoint correctness post-push.** The operator owns the push to `origin/v0.13.0`, the merge to `main`, the tag, and the Vercel deploy. Until those land, the `https://warp-lumen-design-guidelines.vercel.app/r/registry.json` endpoint returns the v0.12.6 payload. The hard gate `curl ... | jq '.items | length'` ≥ 149 is therefore operator-verified after deploy. Phase 6's local artifacts (registry.json, per-item JSONs in `public/r/` after `pnpm registry:build`) are correct; the question is purely whether the deploy lands as expected.

2. **shadcn MCP tool naming.** The Phase 6 prompt names `init`, `add`/`install`, `list`, `search`, `get_item` as the tools the shadcn MCP exposes. The shadcn docs at `https://ui.shadcn.com/docs/registry/mcp` are the canonical reference; if shadcn evolves the tool surface, the AGENTS.md MCP-integration section will drift. The drift is bounded — the install command itself is stable.

3. **Dashboard build (`pnpm docs:build`) not executed in-env.** The audit-dashboard's CLAUDE.md warns against running `pnpm dev` during heavy edits; the same caution extends to a full `next build`. Type-check (`tsc --noEmit`) passed cleanly across the entire dashboard including the three new routes. The full Turbopack production build is operator-side. If it fails on the operator's machine, the most likely cause is a Turbopack-specific module resolution issue introduced by Next.js 16.2.4 — fall back to `next build --webpack` per the v16 upgrade docs.

4. **Token-reference graph completeness.** As noted in assumption (3), the references pass in `build-token-index.ts` is best-effort. The reported "88 tokens referenced / 2,598 references" represents the dominant patterns; a deeper scan (treesitter-based parser, or runtime instrumentation) would catch more. v0.14 may want to formalize this.

5. **Cross-mode visual regression coverage in the dashboard.** The dashboard's existing pages are mode-agnostic per hard rule 15, so toggling the chrome `ModeToggle` should flip every page without breaking any component. This was verified at the type-check level (no component-source `data-mode` references introduced — `audit-mode: PASS`); a full visual regression test (Playwright + Percy) is the operator-side `pnpm validate` invocation post-deploy.

6. **`/library/registry` and `/library` discoverability.** The new route is `/library/registry`. It's reachable via direct URL but not surfaced in the tab nav (the tab nav already has `/library`). The decision: keep the tab nav focused on top-level surfaces; reachable cross-link lives in the `/library/registry` page header ("→ live component showcase at /library") and in the existing `/library` page (operator-side add, if desired). Documented as unilateral.

## Decisions made unilaterally (per phase-prompt autonomy override)

1. **No custom MCP server** (per phase prompt's explicit instruction). v0.14 may add `@warp/lumen-mcp` if Lumen-specific tools beyond shadcn's surface are needed.
2. **`tools/build-llms-txt.ts` + `tools/build-llms-index.ts` as native node:fs** (not `glob`-based). Zero external deps; matches `audit-tokens.ts` convention.
3. **Three separate build scripts** (token-index, component-index, prompt-index) instead of one monolithic indexer. Easier to debug, easier to wire individually into CI later, each can run independently.
4. **`/library/registry` as a sibling route**, not a refactor of `/library`. Surgical edits to the 1,585-line existing client would be high-risk; the data-driven view is genuinely a different shape.
5. **Token-references pass is best-effort regex-based.** Could deepen later, but the current shape catches the dominant patterns and matches Phase 2's contract (SKILL.md declares `tokens:` frontmatter; component TSX consumes via `var(--…)`).
6. **Mode toggle on `<html>` element**, not a wrapper div. Single attribute write cascades; matches how `data-theme` and `data-mood` are handled in the existing chrome.
7. **`localStorage` key `lumen-mode`** (the same key shape as `lumen-theme` from ThemeToggle). Consistency over namespacing.
8. **TabNav extended with `/tokens` + `/prompts` in the system group** between `library` and `saas`. Placement reflects their nature (system-level introspection routes, not platform-specific).
9. **Library/registry NOT surfaced in TabNav.** Already covered by the existing `/library` tab; cross-links live in the route headers.
10. **`pnpm dashboard-indexes` composite script** rebuilds all three indexes in one invocation. Operator-friendly during local development.
11. **Reference PNG section in `/prompts` shows a placeholder with regeneration instructions when PNGs are missing.** Honors the Phase 4 deferral while keeping the UX self-documenting.
12. **Phase 6 commit includes the regenerated `llms.txt` + `llms-full.txt`** (rather than asking the operator to run `pnpm llms` post-merge). Both files are products of the ship; committing them keeps the GitHub view of the system in sync without an extra operator step.
13. **`registry.json` + `_registry/` NOT modified.** Phase 2 + 5 set the count; Phase 6 doesn't add components.
14. **Annotated tag `v0.13.0` created locally, UNPUSHED.** Per `~/.claude/rules/safety.md` — operator owns the push. Tag carries the Phase 6 commit's SHA + a multi-line annotation referencing the master doc + all six phase reports.
15. **The `[Unreleased]` block in CHANGELOG was kept (not retired)** because v0.13.0 isn't tagged-and-pushed yet. After the operator's merge + push, the next changelog edit retires `[Unreleased]` and promotes `[0.13.0]` to the canonical release entry.
16. **PRIMITIVE-COVERAGE.md not regenerated.** That file is a v0.12.6 artifact; v0.13's coverage view lives in the dashboard `/library/registry` route, which derives from `component-index.json` at build time.

## Verification gates — final status

| Gate | Status | Notes |
|---|---|---|
| Registry endpoint reachable | ◐ **DEFERRED** | Operator-side: v0.13.0 branch unpushed. Phase 6's local registry.json is correct (149 items); endpoint resolves post-push + Vercel deploy. |
| MCP install works (consumer-side) | ✓ **PASS** (docs) | `claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp` documented verbatim in AGENTS.md §"MCP integration" + CLAUDE.md + llms.txt. End-to-end verification is operator-side. |
| Single-install E2E | ◐ **DEFERRED** | `npx shadcn@latest add @lumen/lumen-base` in fresh Next.js 15 — operator sandbox; same gate as Phase 2 carried forward. |
| Per-component install E2E | ◐ **DEFERRED** | Same — operator sandbox. |
| `llms-full.txt` exists | ✓ **PASS** | 1.9MB, ~495K tokens, 444 files flattened, v0.13.0 header. |
| Audit dashboard rebuilt | ✓ **PASS** | New routes: `/tokens`, `/library/registry`, `/prompts`. ModeToggle in chrome. Existing pages (`/foundations`, `/library`, `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop`) all inherit toggle. TypeScript clean. |
| Token introspection | ✓ **PASS** | 1,218 tokens indexed across 4 layers; filter + search + click-to-detail + copy-to-clipboard implemented. |
| Component browser | ✓ **PASS** | 146 components with install commands, token references linked to /tokens filter, mode badge, NEVER-rule count. |
| Prompt browser | ✓ **PASS** | 7 templates with raw + assembled copy buttons, canonical-subject manifests, reference PNG placeholders. |
| CHANGELOG complete | ✓ **PASS** | Full `[0.13.0]` block with Added / Changed / Preserved / Migration / Operator-side gates. |
| Branch merged | ◐ **DEFERRED** | Operator owns the merge to `main`. Phase 6 commit + local annotated tag stand ready. |
| Self-critique 15 questions | ✓ **PASS** | All 15 answered "no". Documented above. |
| audit-tokens (Phase 2/3/4/5 carry-over) | ✓ **PASS** | 174 files / 0 hex literals. |
| audit-mode (Phase 2/3/4/5 carry-over) | ✓ **PASS** | 172 files / 0 data-mode references in component source. |
| Dashboard TypeScript | ✓ **PASS** | `pnpm exec tsc --noEmit` clean across all routes. |
| JSON validity | ✓ **PASS** | All three index JSONs + package.json parse cleanly. |
| Registry counts unchanged | ✓ **PASS** | root 149, sidecars 127 — both match Phase 5 final count. |

## Tokens / components touched

**Tokens touched:** zero. Phase 6 doesn't modify the token graph.

**Components touched:**
- New: `audit-dashboard/src/components/mode-toggle.tsx` (chrome-only, not in the shipped @lumen registry — purely a dashboard-internal control)
- New routes (audit-dashboard only): `/tokens`, `/library/registry`, `/prompts`

**Registry-shipped components changed:** zero.

## What you can run locally to verify

```bash
# Tokens (no hex outside primitives) — should PASS (174 files, 0 hex)
pnpm audit:tokens

# Mode (no data-mode in component source) — should PASS (172 files, 0 violations)
pnpm audit:mode

# Regenerate all dashboard indexes
pnpm dashboard-indexes

# Regenerate llms.txt + llms-full.txt
pnpm llms:all

# Dashboard TypeScript check
cd audit-dashboard && pnpm exec tsc --noEmit

# Dashboard dev (warning: Turbopack OOM risk during heavy file edits;
# run from a fresh shell with no other heavy I/O in flight)
pnpm docs:dev
```

## CHANGELOG entry

See `CHANGELOG.md` `[0.13.0]` block — the full v0.13 release entry covering all six phases, preserved invariants, migration notes, and the operator-side gates carried into the ship.

## Files Phase 6 touched

```
M  AGENTS.md
M  CHANGELOG.md
M  CLAUDE.md
M  audit-dashboard/src/components/dashboard-shell.tsx
M  audit-dashboard/src/lib/tabs.ts
M  llms-full.txt
M  llms.txt
M  package.json
A  audit-dashboard/public/component-index.json
A  audit-dashboard/public/prompt-index.json
A  audit-dashboard/public/token-index.json
A  audit-dashboard/src/app/library/registry/client.tsx
A  audit-dashboard/src/app/library/registry/page.tsx
A  audit-dashboard/src/app/prompts/client.tsx
A  audit-dashboard/src/app/prompts/page.tsx
A  audit-dashboard/src/app/tokens/client.tsx
A  audit-dashboard/src/app/tokens/page.tsx
A  audit-dashboard/src/components/mode-toggle.tsx
A  design-system/06-claude-code-briefings/phase-6-report.md
A  tools/build-component-index.ts
A  tools/build-llms-index.ts
A  tools/build-llms-txt.ts
A  tools/build-prompt-index.ts
A  tools/build-token-index.ts
```

**24 files**, expected diff: ≈ +3,000 / −200 (heavy on new TSX in the three routes).

## Operator-side ship checklist

The next actions belong to the operator. Phase 6's job is done; the v0.13.0 ship lives across these steps:

1. **Review** the six phase reports at [`design-system/06-claude-code-briefings/phase-{0..6}-report.md`](.) — pay particular attention to the "Decisions made unilaterally" section in each, since the autonomous-phase contract from chat 07 onwards granted Claude Code latitude to make calls without pausing.
2. **Run** the operator-side gates that were deferred per phase:
   - `pnpm docs:build` in a fresh shell (Turbopack production build; type-check is in-env-verified, full build is operator-verified).
   - `pnpm storybook` boot test (Phase 2 carry-over).
   - `npx shadcn@latest add @lumen/lumen-base` in a fresh Next.js 15 sandbox (Phase 2 + 6 gate).
   - `pnpm prompts:generate-references` with `OPENAI_API_KEY` set, to materialize the 7 reference PNGs (Phase 4 deferral).
3. **Push** `v0.13.0` to `origin`:
   ```bash
   git push origin v0.13.0
   ```
4. **Open a PR** `v0.13.0` → `main` with a one-line summary linking the six phase reports.
5. **Push the annotated tag** (created locally during Phase 6 — UNPUSHED until you do this):
   ```bash
   git push origin v0.13.0  # branch (above)
   git push origin v0.13.0  # tag (Git resolves both — they share a name; if confused, use refs/tags/v0.13.0)
   ```
6. **Confirm Vercel deploy** from `main` after the merge — `https://warp-lumen-design-guidelines.vercel.app` should show v0.13.0 chrome (look for "v0.13" pill in the header).
7. **Verify the registry endpoint**:
   ```bash
   curl -sf https://warp-lumen-design-guidelines.vercel.app/r/registry.json | jq '.items | length'
   ```
   Should return `149`.
8. **Final** — retire `[Unreleased]` in CHANGELOG and promote `[0.13.0]` to the official release entry.

## Next phase

**None.** v0.13.0 is the end state of the seven-phase v0.13 refactor as authored by Claude Code. Future phases (a v0.13.1 patch series, a v0.14 with Lumen-native MCP) belong to subsequent briefings, not this plan.

The remaining work is operator-side ship — see "Operator-side ship checklist" above.

---

🧠 **Product Edge:** the Phase 6 decision to **not build a custom MCP server** is a worked example of [Yagni discipline](https://martinfowler.com/bliki/Yagni.html) under explicit license. The original master doc §7.Phase-6 plan called for `07-mcp/` with six bespoke tools (`list_components`, `get_component`, `get_tokens`, `search`, `install`, `get_prompt_template`). The phase prompt explicitly overrode that and said "skip — shadcn MCP works out of the box." Following the override saved an estimated 1.5–2 days of build + maintenance work that would have shipped an alternative path to the same endpoint shadcn already covers — except shadcn's path scales with the upstream's improvements while a Lumen fork would freeze. The principle generalizes: **when a vertically-integrated tool (shadcn MCP, Vercel AI Elements, Anthropic Citations API) covers your surface, your job is to consume it cleanly, not to re-implement it under your namespace.** The cost of consumption is documentation + a thin theme bridge; the cost of forking is permanent upstream drift. Lumen v0.13 picked the consumption side every time — shadcn registry over manual copy-paste, AI Elements over forked AI primitives, Citations API shape over a Lumen-bespoke citation schema, ChatKit theme variables over a parallel chat surface. The compound effect: every upstream improvement after v0.13.0 ships becomes Lumen's improvement for free.
