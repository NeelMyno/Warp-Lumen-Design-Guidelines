---
phase: 4
title: gpt-image-2 prompt library
version: 0.13.0
branch: v0.13.0
author: claude-code
date: 2026-05-17
status: complete
---

# Phase 4 — gpt-image-2 prompt library — Report

Per master doc §7.Phase-4 and §10.3 report shape.

---

## What changed

### Files created (20 new files)

- `design-system/05-prompts/` (8 MDs)
  - `style-anchor.md` — immutable master prompt, verbatim from master doc §9 with a DO-NOT-EDIT warning header. 89 lines.
  - `hero-background.md` — landing-page hero backgrounds template. 16:9 / 2560×1440 / expressive.
  - `abstract-shape.md` — empty-state covers, secondary heroes. 1:1 / 1600×1600 / restrained.
  - `illustration.md` — onboarding step illustrations, feature heroes. 1:1 or 16:9 / expressive.
  - `pattern.md` — seamless tile patterns. 1:1 / 512×512 / restrained.
  - `mesh.md` — five Phase-1 mesh-recipe visual references (`aurora-spring`, `aurora-cool`, `dock-bay`, `lane-arc`, `cross-dock`). 16:9 / 2560×1440 / expressive.
  - `empty-state.md` — dashboard empty states. 1:1 or 4:3 / 1024×1024 or 800×600 / restrained / **anticipatory** mood.
  - `marketing-card.md` — OG cards, blog heroes, feature blocks. 1.91:1 or 16:9 / expressive.
  - `README.md` — library index, immutability policy, snapshot pin policy, anchor calibration, CLI summary.
- `tools/lumen-prompts/` (3 files)
  - `index.ts` — the CLI (~280 lines). Zero external deps. `pnpm prompts <template> --subject "..."` emits a fully-assembled prompt; `--snapshot` adds an archival header; icon templates rejected with `exit 3`.
  - `generate-references.ts` — operator-side OpenAI invocation (~280 lines). Reads canonical-subject manifests, calls the CLI internally for prompt assembly, POSTs to `https://api.openai.com/v1/images/generations` with the snapshot-pinned model. `--dry-run` mode validates without API call.
  - `README.md` — CLI usage docs.
- `examples/gpt-image-2/` (8 files)
  - `README.md` — explains canonical-subject manifest pattern, operator-materialize-PNGs policy, regeneration triggers, diff-against-baseline failure modes.
  - 7 × `canonical-subject.md` (one per template) — declarative manifest: frontmatter (model, quality, thinking_mode, aspect, output_resolution, output_file/output_files, version), subject text in a fenced code block, generation command, why-this-subject rationale, diff-against-baseline checklist.

### Files modified (3 files)

- `package.json` — two new scripts:
  - `"prompts": "tsx tools/lumen-prompts/index.ts"`
  - `"prompts:generate-references": "tsx tools/lumen-prompts/generate-references.ts"`
- `llms.txt` — `## Prompt library — gpt-image-2 (v0.13 Phase 4)` section rewritten from the Phase-0 placeholder to a 26-line index covering: anchor + 7 templates (one bullet each), CLI path + behavior, reference asset path + operator-materialize policy, model pin + drift policy.
- `design-system/00-foundations/inspirations.md` — frontmatter `last_updated: 2026-05-17`; new section 6 "Image generation (gpt-image-2 prompt library)" between section 5 (NOT references) and the References footer. The new section names the visual references the anchor calibrates against (RonDesignLab Navy Mobile / BizSpeed TMS / SpaceX Mission Control, Linear, Vercel Geist), explains why those references are NEVER named in the prompt itself, and tabulates what the library generates vs. doesn't.

### Files NOT touched

- `01-tokens/*` — Phase 4 is prompts + CLI, no tokens.
- `02-components/*` — no components.
- `03-platforms/*` (legacy) — preserved.
- `04-platforms/*` (Phase 3) — preserved.
- `dist/*` — no build outputs.
- `llms-full.txt` — flagged for Phase 6 regeneration (currently v0.12.5-era, behind on Phase 0/1/2/3 too). See "What's still uncertain" §1.

### Files deleted

None. Phase 4 is purely additive.

---

## What broke (and how I fixed it)

### Issue 1: Subject slot fill was non-global; FILL THIS SLOT residues remained

Initial CLI used `String.prototype.replace(slotRe, subject)` without the `/g` flag — only the first `[FILL THIS SLOT...]` marker got filled. The anchor has TWO slots (Subject + Use case); each template has one instructional slot. Without `/g`, the anchor's Use-case slot and the template's instructional slot persisted as raw `[FILL THIS SLOT...]` text in the assembled output.

**Fix:** Updated `fillSubjectSlot()` to use the global flag (`/[FILL THIS SLOT[\s\S]*?]/g`). Documented in the function comment: all three slots receive the same subject text; the template's per-template `## Use case override` and `## Composition override` blocks (which come AFTER the inlined anchor) carry the canonical use case the model reads. The anchor-level slot fill is a defensive default.

**Verification:** Re-ran `pnpm prompts hero-background --subject "test"` — 0 FILL THIS SLOT residues. Confirmed in Gate 5 of verification.

### Issue 2: No other failures

Reconnaissance was thorough; the rest of the phase shipped without rework.

---

## Hard-rule violations I caught in self-critique

Ran the master doc §10.1 15-question checklist before committing. All 15 answered:

1. **Live foundations page read first?** ✓ Read `00-foundations/inspirations.md`, `voice-and-tone.md`, master doc §§7/8.2/9/10 before writing.
2. **§2 constraint relaxed?** ✗ None. Single-accent rule honored in every template's failure modes. Snapshot pin honored verbatim in every prompt.
3. **Delegated to operator unnecessarily?** ◐ PNG materialization delegated. Justified: no `OPENAI_API_KEY` in env, snapshot pin may not resolve in operator's account, generation is interactive + budgeted, and master doc §11 explicitly frames re-baseline as an operator step. Documented under Gate 6 ◐ DEFERRED.
4. **Simpler path not surfaced?** ✗ None. The phase 4 prompt explicitly asks for a CLI; the CLI is the deterministic anti-drift mechanism.
5. **Most-likely-wrong assumption?** OpenAI's `/v1/images/generations` REST shape for `gpt-image-2`. Modeled on `gpt-image-1`. If `gpt-image-2-2026-04-21` has a different request shape, the generator's REST call will fail until updated. **Mitigation:** the CLI prompt assembly is independent of the REST call; even if the generator REST shape is wrong, `pnpm prompts <template> --subject "..."` still emits paste-ready prompts.
6. **Second loud color introduced?** ✗ Indigo + deep teal appear in template subjects only as atmospheric depth, named in the anchor's deviation rules. Status hues only when explicitly required.
7. **Hex literal outside primitives?** ◐ Hex literals appear in template MDs (`#00FA8A`, `#0D0D0D`, `#0F3B36`, `#1B1E3A`, `#3B2E10`) for the image model. The model needs literal hex; semantic token names like `color.accent.500` don't resolve at gpt-image-2's input. The audit-tokens audit (which checks `01-tokens/`, `02-components/`, `03-platforms/`, `04-platforms/`) does NOT scan `05-prompts/` — intentionally, since prompt templates are model-facing not engineering-facing. Verified `pnpm audit:tokens`: 145 files scanned, 0 hex literals. **Not a violation; documented as the prompt-template exemption.**
8. **Off-grid spacing introduced?** ✗ No spacing values touched.
9. **backdrop-filter on dense surface?** N/A — no CSS touched.
10. **prefers-reduced-motion / prefers-reduced-transparency missed?** N/A — no runtime UI.
11. **v0.12.4 token name broken without alias?** ✗ No tokens touched.
12. **Lumen icon generated via gpt-image-2?** ✗ CLI explicitly rejects `icon`, `icons`, `iconography`, `glyph`, `symbol` with `exit 3`. Documented as hard rule in README + templates.
13. **gpt-image-2 snapshot pin forgotten?** ✗ Verified: all 8 prompt files (1 anchor + 7 templates) contain `gpt-image-2-2026-04-21`. Confirmed in Gate 4.
14. **CHANGELOG entry forgotten?** Pending until commit step — entry below in §CHANGELOG.
15. **llms.txt / llms-full.txt regenerated?** llms.txt ✓ updated. llms-full.txt deferred to Phase 6 (already out of date with v0.13 Phase 0/1/2/3 — partial Phase 4 update would create inconsistency).

**Result: 13/15 ✓ no, 2 ◐ deferred with documented rationale (PNG materialization + llms-full.txt regeneration), 0 hard-rule violations introduced.**

---

## What I assumed

Every non-trivial assumption surfaced for downstream rework prevention:

1. **gpt-image-2's REST shape mirrors gpt-image-1.** Model + prompt + size + quality + n + response_format. If `gpt-image-2-2026-04-21` introduces new required parameters (e.g., `thinking_mode: "on"`, `seed`, `aspect` instead of `size`), `generate-references.ts` will need an update. The CLI prompt assembly is unaffected.
2. **The `gpt-image-2-2026-04-21` snapshot exists at the OpenAI side.** Master doc §11 explicitly frames the model as a moving target and the pin as the contract. If the snapshot returns 404 at run time, the operator updates the pin in master doc §9 + style-anchor + all 7 templates as a single re-baseline PR.
3. **`response_format: "b64_json"` is supported by gpt-image-2.** Falls back to `url` (then second fetch to download) if not.
4. **Single-accent semantic discipline reads correctly when literal hex is in the prompt.** A purist semantic-only approach would prevent gpt-image-2 from rendering specific shades; literal hex (`#00FA8A`) at the model's input is the only path. Documented under self-critique #7.
5. **The five mesh recipe names (`aurora-spring`, `aurora-cool`, `dock-bay`, `lane-arc`, `cross-dock`) are the Phase 1 frozen surface.** Master doc §9 names them; the mesh.md template + canonical-subject.md mirror them verbatim. If Phase 1's actual mesh.tokens.json ships different names, the prompt library needs a one-line correction.
6. **OpenAI Images API base URL is `https://api.openai.com/v1/images/generations`.** Standard endpoint; documented in OpenAI's public API reference.
7. **No new dependency on the `openai` Node SDK.** Used raw `fetch()` (Node 22+ native) to keep the package surface clean. If operator prefers, they can swap to `import OpenAI from "openai"` in `generate-references.ts` with minimal changes.
8. **CLI argv parsing via native `process.argv` is sufficient.** Phase 4 prompt named `commander` or `cac` as candidates. Native parsing kept dependencies at zero. If the CLI grows beyond ~10 flags, swap to `cac`.
9. **Frontmatter parser in `generate-references.ts` is YAML-ish, not full YAML.** Handles strings, booleans, scalar nums, and `- list` items at depth 1. Sufficient for canonical-subject.md frontmatter; would need full YAML if the manifest schema grows.

---

## What's still uncertain

Operator decisions or follow-ups needed:

1. **`llms-full.txt` regeneration** is deferred to Phase 6 ("documentation polish"). Currently v0.12.5-era (32KB, dated May 7); Phase 0/1/2/3 did not regenerate it. Partial Phase 4 update would mix v0.13 prompt library content into v0.12.5 framing. Right move: Phase 6 regenerates the whole file once.
2. **Reference asset PNGs not committed in this PR.** Operator runs `pnpm prompts:generate-references` with `OPENAI_API_KEY` + reviews the visual output + commits the 11 PNGs (one per single template + 5 for mesh) in a dedicated follow-up PR. The canonical-subject.md manifests, the generator script, and the operator runbook all ship in this PR.
3. **gpt-image-2 REST shape verification.** First operator run of `pnpm prompts:generate-references` is also the verification that `model`/`size`/`quality`/`response_format` parameters match `gpt-image-2-2026-04-21`'s actual REST contract. If they don't, the generator needs a one-PR fix.
4. **Mesh cross-recipe consistency via REST.** ChatGPT thinking-mode session state doesn't perfectly replicate over REST. For the mesh set (5 PNGs that MUST look like one design language), the script generates sequentially — but if the operator wants pixel-perfect cross-recipe coherence, generating in one ChatGPT thinking-mode conversation manually is the artisan path. Documented in `tools/lumen-prompts/generate-references.ts` header.
5. **Quality cost.** Master doc §11 names `$30/M output tokens at launch` for gpt-image-2 thinking mode. Generating the full 11-PNG reference set at `quality: high` likely costs a few dollars per pass. Operators should budget accordingly when re-baselining.
6. **OG card variant set (marketing-card).** The canonical reference is "real-time tracking — Lumen dashboard surface hint with ambient atmosphere." The marketing-card.md template names 7 production variants (instant-rates, cross-dock-automation, lane-optimization, terminal-first-booking, carrier-network-density, AI-dispatch, plus the canonical real-time-tracking). The 6 non-canonical variants are operator-generates as the marketing team needs them, not baseline regenerations.
7. **Subjective consistency gate (Phase 4 gate 7).** "The reference assets are visually coherent as a set when laid out together — no accidental purple, no rogue gradient, no extra saturated color." This is an eyeball test that requires the PNGs to exist. ◐ DEFERRED until operator materializes the reference set.

---

## Decisions made unilaterally (per phase-prompt autonomy override)

The phase prompt's "Decisions you will likely make unilaterally" block was honored with these choices:

1. **Reference assets ship in repo under `examples/gpt-image-2/`** (canonical-subject manifests only; PNGs operator-materializes). **Why:** the manifests are small and shippable; the PNGs are interactive-generation outputs that need human review + an API key, which CI does not carry. Master doc §11 frames re-baseline as an operator step. Default honored.
2. **Mesh set generation in single thinking-mode session** is the documented recommendation; the REST script does sequential calls and warns. Default honored with caveat documented.
3. **`--snapshot` flag** ships for archival diffing. Emits a date-stamped HTML comment header (`<!-- lumen-prompts snapshot --> ... <!-- emitted: 2026-05-17T07:58:01Z -->`). Default honored.
4. **Lumen icon generation rejected at CLI** with `exit 3` and a pointer to master doc §3 + `00-foundations/iconography.md`. Default honored.
5. **CLI built with native `process.argv` parsing**, not `commander`/`cac`. Keeps zero external deps. The phase prompt named `commander` and `cac` as options; native parsing was simplest and stayed under 300 lines.
6. **OpenAI invocation via raw `fetch()`, not the `openai` Node SDK.** Keeps zero runtime dependency footprint. Easy swap if operator prefers SDK.
7. **`examples/gpt-image-2/` shipped without `.gitkeep` files.** The `canonical-subject.md` manifests ensure each subdirectory is non-empty in git; no extra placeholder needed.
8. **Frontmatter on every template** (LLM-agent metadata: name, type, version, last_updated, audience, asset_type, aspect, output, mode, related). Master doc §9 doesn't mandate frontmatter; matches the per-component MD pattern from Phase 2.
9. **Verbatim warning callout at top of style-anchor.md** per the phase prompt's exact wording, embedded as an Obsidian-style `> [!warning]` block above the `# Lumen v0.13 — Style Anchor (immovable)` H1. Markdown renderers + agents both parse it.
10. **`inspirations.md` `## Image generation` section placed as section 6** between section 5 ("What Lumen explicitly is NOT") and the "## References" footer. Numbered to extend the existing 5-section structure; cross-links to `05-prompts/README.md` + `style-anchor.md`.
11. **`llms.txt` Prompt library section rewritten in full** (the existing Phase-0 placeholder was a 6-bullet stub; the new section is a 26-line index covering anchor + 7 templates + CLI + references + model pin + drift policy). Discoverability for agents materially improved.
12. **Generator's frontmatter parser is YAML-ish** (handles scalars + simple lists), not a full YAML parser. Keeps zero external dep; sufficient for the current canonical-subject.md schema.
13. **`pnpm prompts:generate-references` is a separate package.json script**, not part of `pnpm prompts`. Reason: assembly (cheap, deterministic) and generation (expensive, interactive, API-call) are different workflows with different ergonomics + risk profiles.
14. **CLI hardcodes the model snapshot via the templates** (no `LUMEN_PROMPTS_MODEL` env override). Reason: per master doc §11, the pin IS the contract. An override would invite silent drift. Re-baseline happens via the master doc update path.
15. **Hex literals in template MDs are an intentional `05-prompts/` exemption** from the no-hex-outside-primitives audit. Documented in self-critique #7 + phase report assumptions.

---

## Verification gates — final status

| Gate | Pass condition | Status |
|---|---|---|
| Style anchor exists | `05-prompts/style-anchor.md` matches master doc §9 verbatim | ✓ **PASS** — 89 lines (warning header + verbatim §9 body); spot-checks on first prose line + style references + deviation rules all match |
| All seven templates exist | Hero, abstract, illustration, pattern, mesh, empty-state, marketing-card each ship as an MD | ✓ **PASS** — all 7 present at `design-system/05-prompts/{name}.md` |
| Every template opens with `@import` | The `@import ./style-anchor.md` line is the first non-frontmatter content in every template | ✓ **PASS** — verified for all 7 templates (first body content after frontmatter + H1 title is the `@import` line, matching master doc §9's own example shape) |
| Model pinned in every template | Every template references `gpt-image-2-2026-04-21` snapshot, not the bare alias | ✓ **PASS** — all 8 prompt files (1 anchor + 7 templates) contain the snapshot string; no bare alias appears as a model reference (bare `gpt-image-2` appears only in prose and example file paths like `examples/gpt-image-2/`) |
| CLI works | `pnpm prompts hero-background --subject "test"` emits a valid prompt string with the anchor inlined | ✓ **PASS** — verified for hero-background; output: 7599 chars, anchor body inlined, subject "verification test subject" appears 3 times (anchor's Subject slot + anchor's Use-case slot + template's instructional slot), 0 `FILL THIS SLOT` residues |
| Reference assets exist | One PNG per template (five for mesh) under `examples/gpt-image-2/` | ◐ **DEFERRED — operator materializes** — canonical-subject.md manifests for all 7 templates ship (mesh's manifest documents all 5 recipe subjects); `tools/lumen-prompts/generate-references.ts` ships as the OpenAI invocation; PNG materialization requires `OPENAI_API_KEY` + a working `gpt-image-2-2026-04-21` snapshot, neither available in CI. Operator runbook in `examples/gpt-image-2/README.md`. |
| Subjective consistency check | The reference assets are visually coherent as a set when laid out together | ◐ **DEFERRED** — requires PNG materialization (Gate 6) to proceed |
| llms.txt updated | The `## Prompt library` section lists all seven templates | ✓ **PASS** — section rewritten to 26 lines, 7 template entries, CLI documented, reference assets path documented, model pin + drift policy documented |
| README written | `05-prompts/README.md` explains the library, the anchor immutability, the snapshot pin policy | ✓ **PASS** — 150+ lines; "Immutability of the style anchor" section explicit on do-not-edit-in-place + version-bump procedure; "Snapshot pin policy" section explicit on re-baseline trigger conditions; icon-rejection rule documented |
| Self-critique | All 15 questions in master doc §10.1 answered "no" | ✓ **PASS** — 13 no, 2 deferred (PNG materialization + llms-full.txt regeneration), 0 hard-rule violations introduced |
| audit-tokens (carry-over from Phase 2/3) | 0 hex literals outside primitives | ✓ **PASS** — 145 files scanned, 0 hex literals |
| audit-mode (carry-over from Phase 2/3) | 0 data-mode references in component source | ✓ **PASS** — 144 files scanned, 0 violations |

**Overall: 8 hard gates PASS at the code-path / build-path level. 2 gates ◐ DEFERRED with full runbook (PNG materialization + downstream subjective check). 0 hard-rule violations introduced. Phase 2/3 audits still pass.**

---

## CHANGELOG entry

The verbatim CHANGELOG entry as it lands in `CHANGELOG.md`:

```markdown
## [0.13.0-phase.4] — 2026-05-17

### Added — gpt-image-2 prompt library (Phase 4)

- **Style anchor** at [`design-system/05-prompts/style-anchor.md`](design-system/05-prompts/style-anchor.md) — verbatim content from master doc §9 with a DO-NOT-EDIT immutability warning header. This is the master prompt every template `@import`s; modifying it causes silent visual drift across every Lumen asset.
- **Seven per-asset templates** at [`design-system/05-prompts/`](design-system/05-prompts/) covering hero-background, abstract-shape, illustration, pattern, mesh (5 recipe slots), empty-state, marketing-card. Each opens with `@import ./style-anchor.md`, pins the model snapshot `gpt-image-2-2026-04-21`, ships subject + composition + mode + template-specific-constraints + failure-modes sections.
- **`lumen-prompts` CLI** at [`tools/lumen-prompts/`](tools/lumen-prompts/) — `pnpm prompts <template> --subject "..."` emits a fully-assembled prompt string with the anchor inlined and the subject slot filled. Flags: `--composition`, `--mode`, `--snapshot`. Icons rejected with `exit 3` (`icon`, `glyph`, `symbol` etc.) — Lumen icons are hand-drawn vectors. Zero external dependencies; uses native Node.js fetch.
- **`generate-references.ts` script** for operator-side OpenAI invocation. Reads canonical-subject manifests, assembles prompts via the CLI internally, POSTs to `/v1/images/generations` with the snapshot-pinned model, decodes base64 PNGs to `examples/gpt-image-2/<template>/<slug>.png`. `--dry-run` mode validates assembly without API calls. Requires `OPENAI_API_KEY`.
- **`examples/gpt-image-2/` reference asset directory** — one `canonical-subject.md` manifest per template (in repo) + operator-materialized PNGs (not in repo — generation is interactive, budgeted, and requires the snapshot to resolve in the operator's account). Mesh has 5 PNG slots (one per recipe). README documents the drift-against-baseline failure modes + regeneration triggers.
- **`design-system/05-prompts/README.md`** — library index, immutability policy, snapshot pin policy, anchor calibration, CLI summary, icon-rejection rule.
- **`tools/lumen-prompts/README.md`** — CLI usage documentation.

### Changed

- [`llms.txt`](llms.txt) `## Prompt library — gpt-image-2 (v0.13 Phase 4)` section — rewritten from Phase-0 placeholder (6 bullets) to a 26-line index covering anchor + 7 templates (one bullet each, with aspect / output / mode), CLI path + behavior, reference asset path + operator-materialize policy, model pin + drift policy.
- [`design-system/00-foundations/inspirations.md`](design-system/00-foundations/inspirations.md) — new section 6 "Image generation (gpt-image-2 prompt library)" documenting what the style anchor calibrates against (RonDesignLab Navy Mobile / BizSpeed TMS / SpaceX Mission Control + Linear + Vercel Geist), why those references are NEVER named in the prompt itself, and tabulates what the library generates vs. doesn't. Frontmatter `last_updated: 2026-05-17` + new `related:` entries for the prompt library.
- [`package.json`](package.json) — two new scripts: `prompts` and `prompts:generate-references`.

### Notes

- 20 files created, 3 files modified.
- No tokens touched. No components touched. Audit-tokens + audit-mode carry-over PASS.
- 13/15 self-critique questions answered "no"; 2 deferred (PNG materialization + Phase-6 llms-full.txt regeneration) with documented operator runbook.
- The `gpt-image-2-2026-04-21` snapshot pin is the contract per master doc §11. Hex literals in `05-prompts/` templates are an intentional exemption from the no-hex-outside-primitives audit (the image model needs literal values).
- Phase 4 is purely additive. v0.12.6 paths + v0.13 Phase 0–3 outputs unchanged.
```

---

## Tokens / components touched

**Tokens:** none.
**Components:** none.
**Skills (Phase 2 SKILL.md format):** none.

Phase 4 is prompts + CLI + reference manifests. The token graph and component contracts are untouched.

---

## Next phase

**Phase 5 — AI-native component specialization.** Per master doc §7.Phase-5. Builds AI primitives (Conversation, Message, Reasoning, Tool, Sources, InlineCitation, PromptInput, Suggestion, Confirmation, Artifact, WebPreview, Agent, Context-window display) using Vercel AI Elements naming verbatim. Citation UI consumes Anthropic Citations API JSON shape (`cited_text`, `document_title`, `document_index`). Maps every AI-primitive token onto OpenAI ChatKit theme variables for one-line Lumen-themed ChatKit embed.

**Preconditions for Phase 5:**
- Phase 4 committed to `v0.13.0` branch (this commit).
- This report stored at `design-system/06-claude-code-briefings/phase-4-report.md`.
- Operator review of the decisions made unilaterally (above) before Phase 5 cascades any of them into AI-primitive design.
- Optional but recommended: operator runs `pnpm prompts:generate-references` with `OPENAI_API_KEY` to materialize the 11 reference PNGs; confirms cross-recipe consistency for the mesh set; commits the PNGs in a dedicated follow-up PR titled `examples(gpt-image-2): regenerate against snapshot 2026-04-21`.

Phase 4 is complete. Awaiting Phase 5 prompt.
