# ADR 0033 — Docs ↔ tokens drift lint + foundation docs↔code closure (v0.14.3 R14)

**Status.** Accepted.
**Date.** 2026-05-20.
**Authors.** Neel Tengariya (mandate); Claude Opus 4.7 (implementation).
**Cascades from.** [ADR 0023 v0.13.0 LLM-docs version lockstep](0023-llm-docs-version-lockstep-v013.md), [ADR 0025 v0.13.2 LLM-docs SSoT additions](0025-audit-cycle-ladder-r6-llm-docs-ssot-v0132.md), [ADR 0030 v0.14 R11 no green shadows + docs↔code sync mandate](0030-no-green-shadows-and-docs-code-sync-v014-r11.md).
**Supersedes.** Nothing — extends.

## Context

[ADR 0030](0030-no-green-shadows-and-docs-code-sync-v014-r11.md) (v0.14 R11) shipped two things:

1. **A token-layer change.** Every `box-shadow` color in Lumen was retuned to a neutral — `var(--border-frame)`, `paper-alpha-*`, `ink-alpha-*`, or `none`. The lime/spring-green halo around primary CTAs, focus rings, AI shimmer, command palette active rows, brand-mark hover, and input focus all went away.
2. **A meta-rule.** "Documentation and dashboard implementation must stay in sync at all times. This is non-negotiable." Codified in project-level `CLAUDE.md` at the top of the R11 callout.

R11 named three foundation docs it updated to reflect the token change: `elevation.md` §3/§6/§7, `accessibility.md` Focus-ring section, `micro-interactions.md` button + input rows.

The R14 audit (this ADR) walked every prose surface that prescribed the retired contract and found **four more doc surfaces** R11's "docs-code-sync" sweep missed:

1. **`design-system/00-foundations/buttons.md`** — the canonical foundation doc for the button language. Preamble still said *"signature spring-green glow ladder on the primary action"* and *"v0.12.2 dialed the primary-hover bloom down (rest unchanged at the brand-defining `0 0 16px lime-a25`, hover trims to `0 0 20px lime-a28` per ADR 0022)."* Lines 121–137 published the entire retired three-state ladder verbatim as the canonical brand contract, including the layered `@media (hover: hover)` 3-stop atmospheric halo, the `.lumen-glow-cta` hero recipe, and the Weber-Fechner rationale for *why those numbers were the right numbers*. Lines 139–157 documented the dual-ring focus indicator with `var(--lumen-accent-4)` as the outer ring.

2. **`USING-LUMEN.md`** — the master consumption manual. Defensive-primitive-contracts table still listed the v0.12.2 glow ladder as a contract to encode. Focus-ring quick-reference table still prescribed `outline: 2px solid var(--lumen-lime-a64)`. Anti-pattern table at the bottom told consumers "DO use `--shadow-button-glow-hover`" without noting that the token's resolved value had been retuned from a lime atmosphere to `var(--shadow-md)` neutral. Version history table presented v0.12.2 hover-bloom retune as the current contract.

3. **`llms.txt`** — the LLM-discovery index. Listed ADR 0022 (hover-glow ladder retune) in the "Core (read first)" list as if it were the current button-shadow contract; no mention of ADR 0030. Buttons foundation summary line said *"v0.12.2 dialed the primary-hover glow ladder down: rest 16px a25 → hover 20px a28 (was 24px a40) → active 8px a20."* ADR count read "24 Architecture Decision Records (ADRs 0001–0024)" — there are now 33.

4. **`llms-full.txt`** — the inlined twin. D-002 Action section published the full lime ladder values. D-012 hover-glow ladder retune section described the retune as if it were the current contract. D-016 focus-ring section prescribed `var(--lumen-lime-a64)` as the outline color.

The drift class is exactly the same as the one ADR 0023 (v0.13.0) closed at the **version-chip** layer — except here the drift is in **contract content**, not in version numbers. ADR 0023 codified `release.mjs` to rewrite the `Status: vX.Y.Z` chip across five SSoT files in lockstep with `VERSION`; ADR 0030 codified the docs↔code sync mandate as a social rule. R14 finds that a social rule wasn't enough — the four doc surfaces above sat stale for 8+ weeks between when R11 shipped and when R14 caught them. The fix is **automation** — a lint that walks every `.md` / `.txt` in the doc tree and fails CI when a retired token appears in a prescriptive context.

The pattern matches the v0.11.13 → v0.12.4 palette-footer drift class that ADR 0023 closed at the runtime UI layer:

| Layer | Drift class | Closed by |
|---|---|---|
| Runtime UI (TSX `<span>`) | Hardcoded version literal drifts cross-file | ADR 0009 + v0.12.5 `lib/version.ts` SSoT constant |
| LLM-facing prose (.md / .txt chips) | "Status: v0.X.Y" chip drifts cross-file | ADR 0023 + `release.mjs` lockstep rewrite |
| DTCG JSON token sources | Accent color leaks into shadow `$value` | ADR 0030 + `lint:shadow-no-accent` |
| **LLM-facing prose (.md / .txt contract claims)** | **Retired token names cited as current contract** | **ADR 0033 + `lint:docs-no-retired-tokens` (this round)** |

Each layer needs its own enforcement. The token lint catches token-source drift; it does NOT catch prose drift because the offending value in the doc is *inlined as text*, not *token-referenced*. An LLM agent reading `buttons.md` after R11 shipped would have written `box-shadow: 0 0 16px var(--lumen-lime-a25)` literally and passed `lint:shadow-no-accent` because the offending value never touched a token JSON file.

## Decision

### Part A — Close the four doc surfaces ADR 0030 missed

The four doc surfaces above were rewritten in this round to reflect the R11 contract:

1. **`buttons.md`** — preamble, intent table (primary row "Glow" column), the entire former "Glow ladder — primary intent only" section (now "Primary halo — retired in R11"), and the focus indicator section (dual-ring now neutral both rings). Front-matter `version` bumped from 0.12.2 → 0.14.2; `last_updated` bumped to 2026-05-20. ADR 0030 added to `related` list. A warning callout pinned at the top references ADR 0030 + AGENTS.md hard rule 20.
2. **`USING-LUMEN.md`** — six edits: defensive-primitive-contracts table (Glow ladder row → Shadow color row), version-history v0.12.2 entry (marked superseded), focus-rings paragraph (lines around 764), primary-button hover anti-pattern table row, focus-visible quick-reference table row.
3. **`llms.txt`** — ADR 0022 marked "historical, superseded by ADR 0030"; ADR 0030 added to the Core list; buttons foundation summary line rewritten; ADR count updated 24 → 33; v0.14.x ADRs (0029, 0030, 0031, 0032, 0033) added to the ADR-list paragraph.
4. **`llms-full.txt`** — D-002 Action section (rewrote the bullet list around `shadow.button.glow.*`); D-012 hover-glow ladder retune (retitled "Hover-glow ladder retune (v0.12.2) → retired wholesale in R11 (v0.14)"); D-016 focus-ring section (colors retuned to neutral; rule extended to "lime on either fails R11's no-green-in-shadows rule").

Additional sweeps caught and closed in the same round (beyond the 4 ADR 0030 missed):

5. **`AGENTS.md`** — Hard rule 11 colors retuned (`var(--border-frame)` outline + `var(--shadow-focus)` halo, both neutral); added new **hard rule 21** that establishes the `lint:docs-no-retired-tokens` contract.
6. **`CLAUDE.md`** — v0.12.4 focus-ring contract callout retuned to neutral colors.
7. **`README.md`** — five hover-glow citations marked superseded; ADR 0030 + 0033 added to the "See also" reference list.
8. **`design-system/02-components/card/component.md`** — three focus-ring references retuned to neutral; `elevation="glow"` description retuned to "no longer casts spring-green halo"; changelog gains a `0.14 R11` entry.
9. **`design-system/02-components/field/component.md`** — focus / error states retuned (neutral halo on focus; validation tones still exempt for red error halo per R11 carve-out).
10. **`design-system/02-components/button/component.md`** — ADR 0022 reference annotated with R11 superseded callout; "Don't override `--shadow-button-glow-hover`" guidance rewritten to reflect new neutral resolved value.
11. **`design-system/00-foundations/state-matrix.md`** — Buttons primary-CTA rows for default / hover / focus / active retuned; frontmatter added (closes the v0.13.2-authored docs frontmatter gap).
12. **`design-system/00-foundations/forms-and-inputs.md`** — focus state "lime halo" → "neutral halo (R11)"; error row clarified that validation tones (red) are R11-exempt.
13. **`design-system/00-foundations/data-visualization.md`** — frontmatter added.
14. **`design-system/00-foundations/responsive.md`** — frontmatter added.
15. **`design-system/01-tokens/README.md`** — `shadow.glow-accent` / `shadow.glow-accent-strong` descriptions retuned to reflect their R11 aliases (`shadow.lg` / `shadow.xl` neutral).
16. **Platform READMEs** — `android-native`, `react-native`, `desktop-mac`, `desktop-windows` all updated to note R11 retirement of the spring-green halo. Code-comment cross-references annotated.

### Part B — Build the structural enforcement: `lint:docs-no-retired-tokens`

[`scripts/lint-docs-no-retired-tokens.mjs`](../../scripts/lint-docs-no-retired-tokens.mjs) — wired into `pnpm lint` umbrella as the 9th rule. Companion to `lint:shadow-no-accent`. Where that lint polices the token-SOURCE layer (DTCG JSON), `lint:docs-no-retired-tokens` polices the docs-PROSE layer.

**Architecture.** Three data structures drive the script:

1. **`RETIRED`** — list of patterns to ban + the retirement metadata. Each entry has:
   - `id` — short identifier (e.g., `R11-lime-shadow`)
   - `pattern` — RegExp (global flag) to match retired token name(s) / recipe(s)
   - `context` — what kind of prescriptive use is banned (e.g., "box-shadow color value")
   - `retiredIn` — version + ADR (e.g., "v0.14 R11 / ADR 0030")
   - `replacement` — what to write instead (rendered in the error message)
   - `contextHints` — paragraph-level keywords that allow the match (e.g., "background", "border", "text" for lime alphas — they're allowed in those contexts, banned in shadows)

2. **`RETIREMENT_MARKERS`** — RegExps that mark a paragraph as *historical citation* rather than *prescriptive use*. If any marker matches the paragraph containing the retired token name, the lint allows it. Markers: `retired`, `superseded`, `historical`, `deprecated`, `pre-Rxx`, `was X`, `no longer`, `ADR 0030`, `v0.14 R11`, etc. This is the lint's primary mechanism for distinguishing "the doc *teaches* the retired thing" (banned) from "the doc *documents that the retired thing was retired*" (allowed).

3. **`EXEMPT_FILES`** + **`EXEMPT_DIRS`** — file-level skips. The retirement ADR itself (0030), the CHANGELOG (per-release history), audit logs under `_meta/audits/` + `.audit-runs/`, the lint scripts themselves (need the strings to ban), and the audit-dashboard's `node_modules` / `.next` cache are all skipped entirely.

**Walk.** The script reads every `.md` and `.txt` under the repo root, skipping exempt dirs/files. For each file, for each retired-pattern entry, for each regex match: it computes the match's line index, extracts the surrounding paragraph (blank-line delimited), and checks for retirement markers + context hints. If neither matches, the violation is reported.

**Output.** On violation, the script prints file:line, the matched text, what it was retired in, what context the match counted as, and what to write instead. Exit code 1.

**Extending.** Future retirements add an entry to `RETIRED`. The data-driven design means no source-file diffs other than appending a single object literal. The contract for adding an entry:

```js
{
  id: "R-N-token-name",
  pattern: /regex/g,                          // global flag required
  context: "what kind of use is banned",
  retiredIn: "vX.Y / ADR 00NN",
  replacement: "what to write instead",
  contextHints: ["allowed", "in", "these", "contexts"], // optional; empty array = no exceptions
}
```

### Part C — Codify the rule

**[AGENTS.md hard rule 21](../../AGENTS.md)** — new rule. The text:

> **Docs surface must stay in sync with token contracts — automated, not vigilant** (v0.14.3 — R14, ADR 0033). When a token (or token-equivalent rule like a focus-ring recipe) is retired or retuned, every prose surface that prescribed the old contract must update in the same change. R11 (ADR 0030) shipped the docs↔code sync mandate as a meta-rule and updated three foundation docs. R14 (ADR 0033) found four more doc surfaces ADR 0030 missed — `buttons.md`, `USING-LUMEN.md`, `llms.txt`, `llms-full.txt` — each still teaching the retired green-glow ladder as canonical contract. R14 closed them and shipped automation: [`scripts/lint-docs-no-retired-tokens.mjs`](scripts/lint-docs-no-retired-tokens.mjs) walks every Markdown file and fails CI on prescriptive use of retired tokens. Three carve-outs for historical narrative + ADR + CHANGELOG. **Rule:** never grep-replace your way through a token retirement — extend the lint's retire-list, run it, fix the diff it produces.

## Consequences

### Producer-side (system layer)

- `pnpm lint` umbrella now runs 9 rules (was 8). Adds ~200 ms to the umbrella run on a 214-doc tree.
- Pre-commit hook (`simple-git-hooks` → `scripts/precommit-regen-indices.mjs`) keeps its current scope; the new lint is on the `pnpm lint` umbrella, not on the per-commit fast-path (it touches every doc on every run and is best-suited to CI / PR-review time, not per-commit).
- Adding a future retirement is two steps: (1) update the token / runtime CSS; (2) append a `RETIRED` entry. The script then enforces docs are updated in lockstep — first PR after the retirement that drifts gets a CI fail.

### Consumer-side (audit-dashboard + downstream apps)

- No runtime change. The lint policed prose only; the audit-dashboard CSS was already R11-compliant via `lint:shadow-no-accent`.
- LLM agents reading `buttons.md` / `USING-LUMEN.md` / `llms.txt` / `llms-full.txt` from this commit forward see the **correct R11 contract** (neutral focus rings, no green halo) and write code that matches it.

### Trade-offs accepted

- **Lint maintenance cost.** Every retirement now needs a `RETIRED` entry, not just a CHANGELOG note. This is the cost of automation — it's the right cost; vigilance is the wrong currency for a 200+ file design system.
- **False-positive risk.** Paragraph-level retirement-marker matching is fuzzy. A long paragraph could mix a prescriptive use with an unrelated retirement marker and skip the lint. Mitigation: keep paragraphs focused (one topic per paragraph is good prose anyway).
- **Code-fence false-positive risk.** Retired token names INSIDE a code fence in a paragraph without a retirement marker fire the lint. This is intentional — code fences are where most LLM agents pattern-copy from, and code-fence drift is the highest-impact class. If a code fence genuinely needs to show the retired value (e.g., "the old recipe was `0 0 16px var(--lumen-lime-a25)`"), the paragraph must include a retirement marker like "was" or "pre-R11" — which all of the in-repo legitimate uses already do.

### What was NOT changed

- The token primitives `--lumen-lime-a08..a64` stay defined — still used for backgrounds, borders, text, leading dots, the aurora gradient, the LumenMark core fill. The lint doesn't ban their DEFINITION; it bans their PRESCRIPTIVE USE in shadow-color contexts in docs.
- ADR 0022 (the v0.12.2 hover-glow retune) stays in place — historical record of an intermediate state. Marked "superseded by ADR 0030" wherever cited.
- The CHANGELOG.md narrative is allowed to cite retired token names with full historical fidelity. CHANGELOG is a record, not a contract.
- The audit-dashboard's `node_modules` / `.next` / source code is not walked by this lint (it would be wrong tool — runtime CSS drift is what `lint:shadow-no-accent` + `lint:no-primitives-in-components` are for).

## Methodology contribution

R14 contributes a fourth axis to the audit-cycle ladder's docs-discipline ramp:

| Round | Tooling axis | What it catches |
|---|---|---|
| R4 (v0.13.0 / ADR 0023) | `release.mjs` rewrites version chips in 5 SSoT files | "Status: v0.X.Y" chip drift |
| R6 (v0.13.2 / ADR 0025) | Six new SSoT documents + auto-regenerated indices | Catalog drift (35 vs. 98 components) |
| **R11 (v0.14 / ADR 0030)** | **Docs↔code sync mandate** (social rule + 3 docs updated) | **Two-layer mismatch (token resolves to X, doc says Y)** |
| **R14 (v0.14.3 / ADR 0033)** | **`lint:docs-no-retired-tokens` (automation)** | **PRESCRIPTIVE drift in ANY doc when ANY token retires** |

The R11 → R14 step is the same shape as the v0.12.5 → v0.13.0 step: *a manual sync rule (memorize what to update on each release) becomes a build-script lockstep (automate what gets updated, fail CI when it doesn't).* The class of bug being closed isn't "ADR 0030 was wrong"; it's "ADR 0030's social rule was the right contract, but social rules don't scale across 200+ files and 32 weeks between when the rule is set and when it next ships a hard change." Automation scales; vigilance doesn't.

**R14 methodology rule.** *Every contract that has a TOKEN layer + a DOCS layer must have a LINT on each layer. The token lint catches tokens; the doc lint catches docs; neither lint is sufficient alone. The R11 → R14 gap was that R11 had the token lint but not the doc lint — and an LLM agent reading the docs would faithfully reconstruct the retired contract, bypassing the token lint entirely. The two-lint pattern (token-layer + doc-layer) is the right architecture for any future contract retirement.*

## References

- AGENTS.md hard rule 11 (amended for R11 + R14)
- AGENTS.md hard rule 20 (R11 — original token-layer mandate)
- AGENTS.md hard rule 21 (R14 — new — docs-layer mandate + lint contract)
- `scripts/lint-docs-no-retired-tokens.mjs` (new)
- `scripts/lint-shadow-no-accent.mjs` (companion — token-layer)
- `_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md` (predecessor)
- `_meta/decisions/0023-llm-docs-version-lockstep-v013.md` (sibling — version-chip layer)
- `design-system/00-foundations/buttons.md` (now R11-compliant)
- `USING-LUMEN.md` (now R11-compliant)
- `llms.txt` + `llms-full.txt` (now R11-compliant)
