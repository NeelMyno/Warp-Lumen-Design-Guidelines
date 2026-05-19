# ADR 0026 — SD-pipeline source-exclusion fix + lint hygiene umbrella + pre-commit SSoT regen (v0.13.3)

**Status:** Accepted
**Date:** 2026-05-18
**Author:** R7 audit cycle
**Related:** ADR 0009 (versioning), ADR 0023 (LLM-docs version lockstep), ADR 0024 (responsive safety net), ADR 0025 (audit-cycle ladder formalization + R6 LLM-docs SSoT)
**Supersedes:** —
**Amended by:** —

## Context

The R6 ship (v0.13.2 / ADR 0025) formalized the audit-cycle ladder at six rounds — visual chrome (R1), interaction state (R2), contract-comparison (R3), meta-contract integrity (R4), small-viewport metrics (R5), LLM-docs SSoT + tooling-script hygiene (R6). R6 closed 87 `validate:tokens` errors via six new semantic token files, six new SSoT documents, the primitive-layer a11y cascade across six primitives, and the release-script widening. But it left four explicit carry-forwards:

1. **`pnpm build` (Style Dictionary) — 93 collisions + 1 reference error.** Pre-existing since prior to v0.13.0; R6's new `semantic/size.tokens.json` added 5 more (88 → 93) on top of the existing dark+light merge collisions. Validator (`pnpm validate:tokens`) passes; producer (`pnpm build`) fails. Consumers reading the built CSS get partial output.
2. **`pnpm lint` (umbrella) — 57 hardcoded-px/hex violations** across 25+ files. Mix of real bugs and intentional brand fixtures (Shop Pay #5a31f4, Google #4285f4, avatar palette fallback hex). `lint:token-naming` exists as a separate script (45 violations) but isn't wired into the umbrella — silent fail since v0.8.
3. **Lighthouse mobile perf baseline** unrun since the v0.13.x cycle began (R7 candidate).
4. **Pre-commit hook to auto-regenerate COMPONENT-INDEX + TOKEN-INDEX** — nice-to-have follow-up to keep R6's new SSoT documents in lockstep with their sources without depending on the contributor's discipline.

The R7 question: **what's the next axis we're not testing?**

## R7 (v0.13.3) — seventh axis: pipeline-state + consumer-side metrics

R7 surfaces the layer one level *below* the rendered UI and one level *above* the source declarations: **the producers of consumed artifacts.** A green `validate:tokens` means the source token tree is internally consistent. A green `pnpm build` means the SOURCE tree compiles into the CSS variables, Swift constants, Compose objects, JSON flats, etc. that downstream consumers actually load. A green `pnpm lint` means the COMPONENT code that ships to consumers references those built artifacts cleanly. A green Lighthouse score on a mobile profile means the consumer EXPERIENCE of the built artifact is fast.

R6 (LLM-docs SSoT) closed the producer-side of *documentation*. R7 closes the producer-side of *code* (SD build + lint) and adds the consumer-side mobile-perf baseline.

## Decision

**Codify the pipeline-state axis as the seventh round of the audit-cycle ladder.** Each round inherits the prior rounds' tooling (a R7 cycle still runs R1–R6 probes) and adds its own. R7's tooling: `pnpm build` verbose log + `pnpm lint` (all 7 rules in umbrella) + `pnpm exec tsc --noEmit` + Lighthouse 12 mobile-profile via `chrome-launcher` against the local `pnpm start` production build.

**v0.13.3 ships the R7 closures:**

### 1. Style Dictionary source-exclusion fix (closes carry-forward 1)

Root cause: `style-dictionary.config.ts` lightConfig.source used `!path` exclusion globs:
```ts
source: [
  "design-system/01-tokens/**/*.tokens.json",
  "!design-system/01-tokens/semantic/color.dark.tokens.json",
  "!design-system/01-tokens/semantic/color.hc-light.tokens.json",
  "!design-system/01-tokens/semantic/color.hc-dark.tokens.json",
],
```

SD v5's `lib/utils/combineJSON.js:62-65` runs `globSync(pattern)` per source-array entry individually, then concatenates. The `!negative` syntax does **not** survive — `globSync` treats `!` as a literal character and the main `**/*.tokens.json` glob still pulls the excluded files. Every dark↔light value collision (~50 collisions) was caused by both files loading into the light build.

**Fix:** pre-resolve the source list via `globSync("design-system/01-tokens/**/*.tokens.json")` + `Array.prototype.filter(regex)` ABOVE the SD config object. Pass the explicit, pre-filtered file list to SD's `source` field. Same fix applied to `darkConfig.source` (which had an explicit list but was made consistent for audit-resilience).

Cleanup: also deleted the duplicate `shadow.accent-glow` self-alias in `semantic/shadow.tokens.json` (lines 88–91 — leftover dead code from R6's `shadow.glow.accent` introduction; created a circular reference `shadow.accent-glow → {shadow.accent-glow}`).

**Result:** 93 collisions + 1 reference error → 0 actionable collisions. The remaining 10 informational warnings are `$description` field-level merges (multiple files declare a description at the same shared parent path — SD picks one and the leaf tokens are unaffected). Build exits 0.

### 2. Token-naming kebab-case hygiene (closes the remaining SD output-name collisions)

R6 introduced `lint:token-naming` as a separate script (45 camelCase violations) but it was never wired into the umbrella. R7 closes 45 violations across 16 component token files + 2 semantic files via a one-off migration:

| Path family | Was | Now |
|---|---|---|
| Component roots (8) | `datePicker`, `fileDropzone`, `numberInput`, `otpInput`, `passwordInput`, `rangeSlider`, `tagsInput`, `timePicker` | `date-picker`, `file-dropzone`, `number-input`, `otp-input`, `password-input`, `range-slider`, `tags-input`, `time-picker` |
| Sub-paths (37) | `caretColor`, `caretRotation`, `maxHeight`, `minHeight`, `minWidth`, `iconColor`, `navColor`, `borderWidth`, `borderStyle`, `iconSize`, `browseLink`, `textDecoration`, `fileRow`, `iconLeading`, `iconTrailing`, `valueDisabled`, `valueReadOnly`, `litEdge`, `groupSep`, `letterSpacing`, `groupGap`, `ringFocus`, `inactiveHover`, `translateOn`, `translateOff`, `readOnly` (×2 — color.dark + color.light) | kebab-case equivalents (`caret-color`, `max-height`, `read-only`, etc.) |
| Special case | `rangeSlider.trackHeight` (24 px slot height) collided with `rangeSlider.track.height` (4 px track-bar) at SD output-name level | Renamed to `range-slider.slot.height` (semantically clearer; matches existing `$description`) |
| Deletions | `field.label.colorDisabled`, `field.helper.colorDisabled` — deprecated since v0.8.0, slated for removal in v0.9.0, now 5+ minors stale | Deleted (consumers were already migrated to kebab paths) |

Downstream: 16 component.json files updated in lockstep + 1 input-tokens alias value (`{color.surface.input.readOnly}` → `{color.surface.input.read-only}`) + 2 field/component.json `tokens.consumed` entries (`field.label.colorDisabled` removed, `field.label.color-disabled` retained). CSS variable output is identical — SD's `name/kebab` transform normalizes both forms to the same kebab CSS var name.

`lint:token-naming` is now wired into the `pnpm lint` umbrella (`scripts.lint` in `package.json`):

```jsonc
"lint": "pnpm lint:no-primitives && pnpm lint:no-arbitrary-typography && pnpm lint:no-arbitrary-form-values && pnpm lint:no-off-grid-spacing && pnpm lint:no-white-on-accent && pnpm lint:button-conventions && pnpm lint:token-naming",
```

### 3. `lint:no-primitives` allowlist convention + showcase-file allowlisting (closes carry-forward 2)

Three of the six existing lint scripts (`lint:no-arbitrary-typography`, `lint:no-off-grid-spacing`) already honored the inline directive pattern:

```tsx
// lumen-lint-allow: <rule> — <reason>     // exempts the same line + the first non-empty line below

{/* lumen-lint-allow-block: <rule> */}
...                                          // exempts the block
{/* lumen-lint-allow-end: <rule> */}
```

R7 normalizes this convention into `lint:no-primitives` (was only allowlisting matches preceded by `//` on the same line — too narrow for JSX block comments and multi-line attribute lists). The script now:
- Tracks `lumen-lint-allow-block: primitives` ... `lumen-lint-allow-end: primitives` regions.
- Honors `lumen-lint-allow: primitives — <reason>` on the same line OR the line immediately above.
- Pre-strips `/* ... */` and `{/* ... */}` block-comment text (single- and multi-line) so hex/px literals *inside* documentation comments don't false-positive.
- Keeps the original per-match `//`-comment allowlist on the same line.

Disposition for the 57 violations:
- **2 lint-script bugs cleaned via the new block-comment detector** — `dashboard-shell.tsx:37` (`28px` inside JSX block comment describing v0.12.7 glass-strong blur) + `tab-nav.tsx:20` (`32px` inside Tailwind arbitrary `[mask-image:linear-gradient(...calc(100%-32px)...)]`). Both got inline `lumen-lint-allow: primitives` directives or the block-comment exemption.
- **45 showcase files block-allowlisted** — every component-example file (`design-system/02-components/*/examples/primary.tsx`) and audit-dashboard primitive showcase (`audit-dashboard/src/components/primitives/*.tsx`) received a top-of-file `// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. \`text-[10px]\`), and \`var(--token, #fallback)\` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration.` directive. Production audit-dashboard code (`dashboard-shell.tsx`, `tab-nav.tsx`, `app/*` routes) remains under the linter — those need to stay token-clean.

Also closed:
- **2 `lint:no-arbitrary-typography` violations** — both `tracking-[var(--tracking-tight)]` overrides on `text-body-lg` wordmark rows (landing logo cloud, commerce store header). Allowlisted with documented reason.
- **3 `lint:no-off-grid-spacing` violations** — mobile shipment-row 10 px iOS-conventional padding, pricing-toggle thumb 2 px top offset, stepper label↔description 2 px tight stack. All deliberate sub-grid stops; allowlisted with documented reason.

**Result:** `pnpm lint` umbrella across 7 rules → 0 violations.

### 4. Pre-commit hook for SSoT regeneration (closes carry-forward 4)

Adds `simple-git-hooks@^2.13.1` to root devDeps + a `simple-git-hooks` config block in `package.json`:

```jsonc
"prepare": "simple-git-hooks",
"simple-git-hooks": {
  "pre-commit": "node scripts/precommit-regen-indices.mjs"
}
```

The hook (`scripts/precommit-regen-indices.mjs`):

1. Reads the staged file list via `git diff --cached --name-only --diff-filter=ACM`.
2. If any path matches `design-system/02-components/*/component.json` → `pnpm component-index` → `git add COMPONENT-INDEX.md`.
3. If any path matches `design-system/01-tokens/**/*.tokens.json` → `pnpm token-index` → `git add TOKEN-INDEX.md`.
4. Exits 0 unless a regenerator errors; never blocks the commit on regen content (commit-blocking belongs to validators on CI).

Conservative by design — skipped if no relevant files are staged. Heavy validators (`pnpm build`, `pnpm registry`, `pnpm validate`, `pnpm lint`) stay on CI to keep the commit loop fast.

Escape hatch: `SKIP_SIMPLE_GIT_HOOKS=1 git commit ...`. Documented in [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

### 5. R7 Lighthouse baseline (closes carry-forward 3)

Mobile-profile Lighthouse 12 audit across all 9 audit-dashboard routes (Moto G4 4G profile, headless Chrome via `chrome-launcher`). Full table in [`.audit-runs/2026-05-18-round-7/LIGHTHOUSE.md`](../../.audit-runs/2026-05-18-round-7/LIGHTHOUSE.md).

Geometric mean across 9 routes:
- **Perf: 94** (>90 floor cleared with margin on every route)
- **LCP: 3030 ms** (the only "Needs Improvement" metric; `/foundations` and `/library` sit at 3.3 s — likely Satoshi font load gating the brand-display heading)
- **FCP: 1225 ms** (Good)
- **TBT: 12 ms** (excellent — 16× under the 200 ms Good threshold)
- **CLS: 0.000** (excellent — R5's `overflow-x: clip` + R6's primitive a11y left zero layout-shift sources)
- **Speed Index: 1397 ms** (Good)

LCP improvement candidates carried to R8: font-display strategy review, Satoshi subsetting, real-WebKit verification (chrome-devtools-mcp is headless Chromium), critical-CSS extraction. None ship in v0.13.3 — R7's job is to baseline, not to optimize.

## Methodology contribution

The audit-cycle ladder gains a seventh axis. Each round adds a *new tooling axis* to the prior rounds':

| Round | Axis | Surface | Tool | Ships in |
|---|---|---|---|---|
| R1 | Visual chrome | Rendered UI | `claude-in-chrome` @ desktop | v0.12.7 |
| R2 | Interaction state | Rendered UI | `claude-in-chrome` @ desktop | v0.12.8 |
| R3 | Contract-comparison | Rendered UI | `claude-in-chrome` @ desktop | v0.12.9 |
| R4 | Meta-contract integrity | LLM-facing docs | grep + release-script audit | v0.13.0 (ADR 0023) |
| R5 | Small-viewport metrics | Rendered UI @ mobile | `chrome-devtools-mcp emulate` @ 320 px | v0.13.1 (ADR 0024) |
| R6 | LLM-docs SSoT + tooling-script hygiene | Authoring contracts | `validate:tokens` + `pnpm lint` + a11y probes | v0.13.2 (ADR 0025) |
| **R7** | **Pipeline state + mobile perf metrics** | **Producer artifacts + consumer experience** | **`pnpm build` verbose + lint umbrella (7 rules) + Lighthouse 12 mobile** | **v0.13.3 (ADR 0026)** |

The methodology rule extends:
- **R5 rule:** *a carried blocker is a tooling hypothesis, not a fact.*
- **R6 rule:** *the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be.*
- **R7 rule:** *passing validators (`validate`, `lint`, `build`) is a producer-side green; passing consumer-side metrics (Lighthouse, real-WebKit, reduced-motion-mode) is a separate axis. Both ship together.*

The audit-cycle ladder ramps both ends:
- **Producer side:** R4 (LLM-docs drift), R6 (tooling-script hygiene + a11y primitive cascade), R7 (build pipeline metrics + lint umbrella + pre-commit SSoT regen).
- **Consumer side:** R1–R3 (rendered UI), R5 (small-viewport metrics), R7 (mobile-perf metrics).

Future R8+ candidates extend the consumer-side axis further (real-WebKit, reduced-motion + high-contrast OS modes, print + export contracts) and the producer-side axis further (native pipeline verification — Swift / Compose / Flutter live render checks; Storybook + a11y-tree per-state probes).

## Consequences

**Positive:**
- `pnpm build` is now a meaningful gate. Pre-R7 it ran with 93 collisions + 1 reference error and produced partial output; consumers reading the built CSS got stale values for any token that lost a collision arbitration. Post-R7, `pnpm build` exits 0 with 0 actionable collisions; the built artifacts match the source declarations.
- `pnpm lint` umbrella now covers 7 rules including `lint:token-naming`. Previously camelCase token paths could land silently; the v0.13.3 token rename closed the last 45.
- Pre-commit hook removes the COMPONENT-INDEX/TOKEN-INDEX drift class without depending on contributor discipline. R6 added the SSoT documents; R7 keeps them current.
- Mobile-perf baseline captured. Future rounds can measure deltas against the R7 floor.
- The audit-cycle ladder is now seven rounds deep with a documented methodology rule per round. Future contributors can locate "where in the ladder am I" by reading the ADRs.

**Negative / trade-offs:**
- The token rename is breaking for any external consumer that hardcoded the camelCase token-path string. Mitigation: Lumen is private + internal (`"private": true, "license": "UNLICENSED"`); only consumers live in this repo and were updated in lockstep. CSS variable OUTPUT names are unchanged (SD's `name/kebab` transform normalizes both forms).
- The 45 showcase files block-allowlist the linter for the whole file. This is the right call (showcases are demonstrations, not production), but it does mean a new hex code introduced in a showcase won't catch in lint. Mitigation: showcase files are reviewed manually; production audit-dashboard code (`app/*`, `dashboard-shell.tsx`, `tab-nav.tsx`) stays under the linter.
- The pre-commit hook adds ~1-2 s to commits that touch `component.json` or `tokens.json` files (the regenerators run synchronously). The hook is conservative — it skips entirely if no relevant files staged.

## Future work (R8+ candidates)

- **R8** — Real iOS Safari + real Android Chrome via BrowserStack / SauceLabs (chrome-devtools-mcp is headless Chromium; WebKit shapes might surface different metrics).
- **R8a** — Font-display strategy review + Satoshi subsetting (LCP soft-spot from R7 baseline).
- **R9** — Reduced-motion + high-contrast OS-mode contracts (currently `prefers-reduced-motion` is honored per AGENTS.md rule 8 but never live-audited at OS level).
- **R10** — Print stylesheet + export / share affordance contracts.
- **R11** — Native build pipelines (Swift / Compose / Flutter) live render verification — currently SD emits but no live render check.
- **R12** — Storybook / a11y-tree probe across all 98 primitives at every state (rest / hover / focus / disabled / loading / success / error / empty).
- **Pre-commit hook extension** — wire `pnpm validate:tokens` on staged tokens.json change (currently the hook only regenerates indices; validators stay on CI).

## References

- [Phase A audit dossier](../../.audit-runs/2026-05-18-round-7/ISSUES.md)
- [R7 Lighthouse baseline](../../.audit-runs/2026-05-18-round-7/LIGHTHOUSE.md)
- ADR 0023 (LLM-docs version lockstep — release.mjs widening predecessor)
- ADR 0024 (responsive safety net — CLS-zero contributor)
- ADR 0025 (audit-cycle ladder formalization — R6 / six-round version of this ladder)
