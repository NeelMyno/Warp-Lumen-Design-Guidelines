# ADR 0023 — LLM docs version lockstep (v0.13.0)

**Status:** Accepted (2026-05-18)
**Supersedes:** none — extends [ADR 0009](./0009-versioning-semver-system-wide.md) and the v0.12.5 SSOT pattern documented as D-018 in [USING-LUMEN.md §12 / llms-full.txt](../../USING-LUMEN.md).

## Context

v0.12.5 retired runtime-UI version-label drift via a single source of truth ([`audit-dashboard/src/lib/version.ts`](../../audit-dashboard/src/lib/version.ts)). The release script ([`scripts/release.mjs`](../../scripts/release.mjs)) bumps `VERSION`, `lib/version.ts`, and `CHANGELOG.md` in lockstep on every `pnpm release {patch|minor|major}`.

The same drift recurred in a different layer through v0.12.6 → v0.12.9: the LLM-facing prose banners in `llms.txt`, `llms-full.txt`, `README.md`, `USING-LUMEN.md`, and `PRIMITIVE-COVERAGE.md` advertise their own "Status:" line (e.g. "Status: v0.12.5 · 2026-05-07"). These banners are the FIRST thing an AI agent sees when discovering the system — `llms.txt` is literally the entry-point file under [llmstxt.org](https://llmstxt.org/). When they go stale, agents fetch incorrect "current state" context.

By v0.12.9 the drift was severe:

| File | Banner version (pre-R4) | Actual VERSION |
|---|---|---|
| `llms.txt` | v0.12.6 | 0.12.9 |
| `llms-full.txt` | v0.12.5 | 0.12.9 |
| `README.md` | v0.12.5 | 0.12.9 |
| `USING-LUMEN.md` | v0.12.5 | 0.12.9 |
| `PRIMITIVE-COVERAGE.md` | v0.12.6 (generated date 2026-05-16) | 0.12.9 |
| `AGENTS.md` (top callout) | v0.12.9 (manual touch by R3) | 0.12.9 ✓ |
| `CLAUDE.md` (top callout) | v0.12.9 (manual touch by R3) | 0.12.9 ✓ |

R1, R2, R3 manually touched the `AGENTS.md` and `CLAUDE.md` top callouts in their commits, so those stayed in sync — but the discovery-tier prose files (the ones LLMs are designed to fetch FIRST) silently fell behind by up to four patches.

This is the v0.12.5 drift class repeating at the LLM-discovery layer instead of the runtime-UI layer. The fix at the runtime-UI layer (v0.12.5 → `lib/version.ts`) doesn't reach the prose layer because the runtime constant is a TypeScript export consumed at render time; prose files are Markdown rendered by GitHub / by hand. They need a separate lockstep mechanism.

## Decision

**The release script extends its lockstep responsibility to every LLM-facing prose banner.**

`scripts/release.mjs` now updates the version chip in five additional files in lockstep with `VERSION` and `lib/version.ts`:

| File | Banner pattern | Updated by release.mjs |
|---|---|---|
| [`llms.txt`](../../llms.txt) | `**Status: v{maj}.{min}.{patch} ({YYYY-MM-DD})**` | ✓ |
| [`llms-full.txt`](../../llms-full.txt) | `> **v{maj}.{min}.{patch} — ...**` | ✓ |
| [`README.md`](../../README.md) | `**Status: v{maj}.{min}.{patch} · ...** ... VERSION                         ← {maj}.{min}.{patch}` | ✓ |
| [`USING-LUMEN.md`](../../USING-LUMEN.md) | `Status: v{maj}.{min}.{patch} · {YYYY-MM-DD}` (line 3, line 51 §1 status block, line 936 last-reviewed footer) | ✓ |
| [`PRIMITIVE-COVERAGE.md`](../../PRIMITIVE-COVERAGE.md) | `> **Generated {YYYY-MM-DD} for Lumen v{maj}.{min}.{patch}.**` | ✓ |

The pattern matching is INTENTIONALLY narrow — only `vX.Y.Z` literals attached to a "Status" / "Generated" / inline-banner phrase get rewritten. Historical-version prose ("v0.10 retired JetBrains Mono", "v0.11 retired the warm-cream ramp", "v0.12.0 — Obsidian recolor") stays literal per [AGENTS.md hard rule 13](../../AGENTS.md#hard-rules) — these are immutable historical annotations, not current-version labels.

**AGENTS.md and CLAUDE.md top callouts are exempt.** Those carry detailed per-release narrative prose (the "v0.12.9 — Round 3 fix pack — three real bugs fixed" paragraph), not just a version chip. They are intentionally hand-rewritten per release with the cycle's story; auto-rewriting them would lose the narrative or get the prose wrong. The release script leaves them alone; contributors update them as part of the release PR.

**CHANGELOG.md keeps its existing v0.12.5 behavior** — the release script prepends a stub entry under `[Unreleased]`; the contributor promotes their `[Unreleased]` notes into it.

## Why a new ADR (and a minor bump) instead of a patch + CHANGELOG note

This is a system-level capability shift. v0.13.0 marks the moment Lumen's LLM-facing prose docs got their own SSoT lockstep cadence — a contract that did not previously exist, and that future agents and contributors will rely on. The pattern is analogous to v0.12.5's runtime-UI SSoT (D-018) and deserves an equivalent permanent record. Patch releases (v0.12.3 / v0.12.4 / v0.12.5 / v0.12.6 / v0.12.7 / v0.12.8 / v0.12.9) carry consequential cascade-fixes; a new system contract for how docs stay current is the next-cycle inflection.

The other half of v0.13.0 is a comprehensive **same-day Round 4 live audit**: every route walked top-to-bottom in both dark + light mode at 1501×812 px against the Edge browser on Personal Mac via the Claude in Chrome MCP. Findings classified as real bugs vs. by-design. The R4 audit log is at [`.audit-runs/2026-05-18-round-4/ISSUES.md`](../../.audit-runs/2026-05-18-round-4/ISSUES.md).

## Implementation

```js
// scripts/release.mjs (v0.13.0 — additions on top of v0.12.5 lockstep)
const llmFacingFiles = [
  "llms.txt",
  "llms-full.txt",
  "README.md",
  "USING-LUMEN.md",
  "PRIMITIVE-COVERAGE.md",
];
const banners = [
  // pattern → replacement (each scoped to the banner phrase, not loose vX.Y.Z)
  [/(\*\*Status: v)\d+\.\d+\.\d+( \(\d{4}-\d{2}-\d{2}\)\*\*)/g, `$1${next}$2`],
  [/(> \*\*v)\d+\.\d+\.\d+( — )/g, `$1${next}$2`],
  [/(\*\*Status: v)\d+\.\d+\.\d+( · )/g, `$1${next}$2`],
  [/(VERSION\s+← )\d+\.\d+\.\d+/g, `$1${next}`],
  [/(> \*\*Generated \d{4}-\d{2}-\d{2} for Lumen v)\d+\.\d+\.\d+(\.\*\*)/g, `$1${next}$2`],
  [/(Status: v)\d+\.\d+\.\d+( · \d{4}-\d{2}-\d{2})/g, `$1${next}$2`],
  [/(Last reviewed against actual repo state: \d{4}-\d{2}-\d{2} \(v)\d+\.\d+\.\d+(\))/g, `$1${next}$2`],
];
for (const f of llmFacingFiles) {
  const p = join(ROOT, f);
  let body = await readFile(p, "utf8");
  for (const [re, rep] of banners) body = body.replace(re, rep);
  await writeFile(p, body);
}
```

The regex set is INTENTIONALLY conservative — each pattern includes enough context (`**Status:`, `> **`, `VERSION    ←`, etc.) to disambiguate the current-version banner from historical prose. A casual `v0.12.9` mention in CHANGELOG narrative will NOT match. The release-script PR demonstrates this: running `pnpm release patch` against v0.12.9 → v0.12.10 touches only the seven listed banner sites, not the 200+ historical-version mentions in the same files.

## Trade-offs considered

**Why not extract banner content into a generated `_meta/status.md` and `{% include %}` it?** Markdown doesn't natively support includes; GitHub doesn't render include directives. Every consumer would need a build step.

**Why not use frontmatter `version:` and let GitHub render it?** Frontmatter is invisible in rendered Markdown — the banner needs to be in the body to greet the LLM at fetch time.

**Why not put banners only in `llms.txt` and have the others link to it?** The first 200 lines of `llms.txt` ARE the agent's working memory after fetch. Stripping the per-file banners to "see llms.txt" adds a fetch round-trip — exactly the friction the LLM contract is designed to eliminate.

**Why not use a Markdown frontmatter + post-process at CI time?** Same as include directives — requires a build step every consumer must run.

**Why not just be more disciplined manually?** v0.12.6 → v0.12.9 demonstrated that "be more disciplined" doesn't survive contact with a four-release patch cascade. The runtime-UI layer learned this lesson in v0.12.5; the LLM-docs layer learns it in v0.13.0.

## Cascade benefits

- Future patch / minor / major releases no longer leak stale banners into the LLM discovery surface.
- The release script is now the single point of truth for "what version is this repo currently at" — `VERSION` + `lib/version.ts` + every LLM-facing prose banner all reconcile from one command.
- The validation gap that let v0.12.6 → v0.12.9 ship with drift gets closed by the release script itself, not by manual checking.

## Open questions (post-v0.13.0)

1. **Add a CI check that fails the build if banner versions don't match `VERSION`?** Would make the drift impossible to ship even for someone who edits a prose file by hand without `pnpm release`. Punted — the release script is sufficient; a CI check is belt-and-braces for later.
2. **Extend the lockstep to AGENTS.md / CLAUDE.md top callouts?** Currently exempt because they carry narrative per-release prose. A possible compromise: auto-bump the version chip inside the callout but leave the narrative untouched. Defer — the manual touch has caught the version chip cleanly through R1, R2, R3.
3. **Should `_meta/decisions/{NNNN}-*.md` filenames participate in the lockstep?** No — ADR filenames are stable historical records by design. The version inside the ADR title (the `(v0.13)` suffix) is set at creation and never auto-rewritten.

## References

- [ADR 0009 — Versioning](./0009-versioning-semver-system-wide.md) — the system-wide single-semver policy this extends
- [USING-LUMEN.md §12 — D-018 single-source-of-truth version constant](../../USING-LUMEN.md) — the v0.12.5 runtime-UI SSOT this mirrors at the prose layer
- [`scripts/release.mjs`](../../scripts/release.mjs) — the lockstep mechanism
- [.audit-runs/2026-05-18-round-4/ISSUES.md](../../.audit-runs/2026-05-18-round-4/ISSUES.md) — the R4 audit that caught the drift
- [llmstxt.org](https://llmstxt.org/) — the discovery convention `llms.txt` follows
