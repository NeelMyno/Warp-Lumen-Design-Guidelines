# ADR 0025 — Audit-cycle ladder formalization + R6 LLM-docs SSoT additions (v0.13.2)

**Status:** Accepted
**Date:** 2026-05-18
**Author:** R6 audit cycle
**Related:** ADR 0009 (versioning), ADR 0023 (LLM-docs version lockstep), ADR 0024 (responsive safety net)
**Supersedes:** —
**Amended by:** —

## Context

By v0.13.1 the Lumen team had run five rounds of the same-day live-audit cycle, each ramping the tooling along with the surface coverage:

| Round | Surface | Tool | Ships in |
|---|---|---|---|
| R1 | Visual chrome (sticky-nav bleed under primary CTAs) | `claude-in-chrome` @ desktop 1500×812 | v0.12.7 |
| R2 | Interaction state (Commerce PDP variant pickers) | `claude-in-chrome` @ desktop 1500×812 | v0.12.8 |
| R3 | Contract-comparison (pinned-date demos vs runtime; iOS carrier truncation; hardcoded-active sidebars) | `claude-in-chrome` @ desktop 1500×812 | v0.12.9 |
| R4 | Meta-contract integrity (LLM-docs version drift across 5 prose files) | grep + release-script audit | v0.13.0 (ADR 0023) |
| R5 | Small-viewport metrics (layout-viewport inflation; 10 a11y findings) | `chrome-devtools-mcp emulate` @ mobile 320 / 375 px | v0.13.1 (ADR 0024) |

R5's methodology lesson was the audit's most valuable contribution to date: *a carried blocker is a tooling hypothesis, not a fact.* R4 had documented sub-768 px responsive sweep as blocked because `claude-in-chrome resize_window` didn't propagate to `window.innerWidth`. R5's first move was to re-test the tooling — not the system — and the 5-minute swap to `chrome-devtools-mcp emulate` immediately unblocked the sweep AND surfaced an entire architectural class of bug.

The R6 question: **what's the next axis we're not testing?**

## R6 (v0.13.2) — sixth axis: LLM-docs SSoT + tooling-script hygiene

R6 surfaces the layer one rung below the rendered UI: **the contracts authoring agents read against.** A v0.12.6 → v0.13.0 audit cycle has shipped 63 new contracts, three new ADRs, two new architectural patterns (sticky-header chrome, responsive safety net), one new build-script lockstep, and ten a11y findings. The agent-facing surface — `llms.txt`, `llms-full.txt`, `README.md`, `USING-LUMEN.md`, `PRIMITIVE-COVERAGE.md`, `AGENTS.md`, `CLAUDE.md` plus the implicit `_registry/registry.json`, `design-system/02-components/*/component.{md,json}`, and `design-system/01-tokens/**/*.tokens.json` — has accumulated drift that v0.13.0's ADR 0023 lockstep only partially closes.

R6 enumerated the drift:

1. **CHANGELOG.md `## [0.13.2] — 2026-05-18`** spurious empty stub above the real v0.13.1 entry. Session 38's `release.mjs patch` on top of an already-bumped VERSION created this; the chip was reverted in LLM docs but the CHANGELOG stub was left in place.
2. **Root `package.json` `"version": "0.12.4"`** — drifted by 7 patch versions while `VERSION` climbed to `0.13.1`. release.mjs only updated `VERSION` + `lib/version.ts`, not root pkg.
3. **README.md `Status:`** line — `v0.13.0 · LLM-docs version lockstep + R4 comprehensive audit ... · 23 ADRs`. release.mjs's regex caught the bold-chip format but not the plain multi-space `Status:` block.
4. **README.md** — no `## What's new — v0.13.1` section. release.mjs only rewrites chips; section headings are hand-authored per release.
5. **`llms.txt` + `llms-full.txt` narrative taglines** — chips were bumped to v0.13.1 (release.mjs lockstep worked) but the narrative *taglines* describing what shipped in the version still said "LLM-docs version lockstep + R4 comprehensive audit" (v0.13.0 content).
6. **USING-LUMEN.md** — 6 sites claiming "all 35 components" (stale by 63 contracts since v0.12.6); install URL hardcoded `v0.12.4` (stale by 7 patches).
7. **USING-LUMEN.md §1 tagline** — chip v0.13.1 but tagline still said R4.
8. **`Switch` + `Checkbox` primitives** — R5 fixed the SwitchRow wrapper-with-sibling-label pattern by accepting `aria-labelledby` props. R6 caught that the in-primitive `label` prop had the **same root cause** — HTML's implicit `<label htmlFor>` does not propagate the accessible name to a `<button role="switch">` because Radix overrides the host element role. Foundations Switch+Checkbox showcase rendered a visible label but the buttons stayed nameless.
9. **`Field` primitive children pattern** — `<Field label="X"><TextInput /></Field>` rendered the `<label htmlFor={inputId}>` but the inner `<TextInput>` rendered its own `<input>` with its own id, so the label-for-id link was broken. Affected ~6 form showcase sites on /library.
10. **`NumberInput` + `TagsInput`** — wrapper primitives that swallowed aria-* props from the parent Field's cloneElement.
11. **`RangeSlider`** dual-thumb inputs — two `<input type="range">` instances ship nameless.
12. **`TypeToConfirm`** — modal-input shipped without `<label htmlFor>` or aria-*.
13. **`nav.tsx` showcase exports `FAB` / `SplitButton` / `CommandPalette`** — export-name collisions with the canonical primitives in `fab.tsx` / `split-button.tsx` / `command-palette.tsx`. An LLM grepping `export function FAB` got two hits and couldn't tell which was canonical.
14. **No top-level component index, token index, route index, data-visualization guide, responsive guide, state matrix** — agents asking "show me all components" / "what's the chart color contract" / "what state must a button support" had to assemble these from scattered sources.
15. **87 `validate:tokens` errors** — component contracts (Alert, Avatar, Banner, BottomNav, Calendar, Chart, etc.) referenced tokens like `type.tabular.nums`, `size.avatar.lg`, `color.chart.1` that didn't exist in any tokens.json. An LLM following the contract's `tokens.consumed` list would try to use tokens that don't resolve.

The pattern across these 15 items: **the things agents read against drift at a different cadence from the things humans see.** Visual UI bugs are caught by `claude-in-chrome` walks (R1-R3). Architectural integrity is caught by R4. Mobile-viewport metrics by R5. But the LLM-facing prose / docs / contracts / token-paths layer needs its own axis. That axis is R6.

## Decision

**Codify the audit-cycle ladder as a methodology contract** with six rounds at six axes. Each round is allowed to introduce a new tooling hypothesis and a new finding class. Subsequent rounds inherit the prior rounds' tooling (a R6 cycle still runs the R1-R5 probes) and add their own.

**v0.13.2 ships the R6 closures:**

### 1. SSoT additions (closes drift class 14)

- **[`COMPONENT-INDEX.md`](../../COMPONENT-INDEX.md)** — auto-generated from `component.json`. Category-grouped table of all 98 components: link, purpose, version, status, examples. Re-runnable via `pnpm component-index`.
- **[`TOKEN-INDEX.md`](../../TOKEN-INDEX.md)** — auto-generated from `design-system/01-tokens/{semantic,components}/*.tokens.json`. Flat alphabetical index, ~750 tokens. Primitives intentionally omitted (per AGENTS.md hard rule 2 — consume semantic only). Re-runnable via `pnpm token-index`.
- **[`audit-dashboard/README.md`](../../audit-dashboard/README.md)** — proper onboarding doc (replaces create-next-app stub).
- **[`audit-dashboard/ROUTES.md`](../../audit-dashboard/ROUTES.md)** — per-route breakdown of the 9 dashboard routes.
- **[`design-system/00-foundations/data-visualization.md`](../../design-system/00-foundations/data-visualization.md)** — chart-type selection, axis / legend / color rules, accessibility, empty / loading / error states.
- **[`design-system/00-foundations/responsive.md`](../../design-system/00-foundations/responsive.md)** — breakpoints, layout-viewport contract (codifies ADR 0024 for consumers), sub-768 px authoring rules.
- **[`design-system/00-foundations/state-matrix.md`](../../design-system/00-foundations/state-matrix.md)** — 13 canonical states, which primitives must support which subset.

### 2. release.mjs widening (closes drift classes 2, 3, 4)

`scripts/release.mjs` now rewrites:
- Root `package.json` `"version"` field.
- README `Status:` line (plain multi-space format).
- USING-LUMEN.md install URL `<cdn>/lumen/vX.Y.Z/registry/{name}.json`.
- README `## What's new — vX.Y.Z` section heading.

Plus a **safety guard**: refuses to run if `[next]` is already in `CHANGELOG.md` (closes the 0.13.1 → 0.13.2 over-bump trap).

### 3. a11y closeout cascade (closes drift classes 8, 9, 10, 11, 12)

- `Switch` + `Checkbox` primitives — when `label` prop is provided, the primitive generates `{controlId}-label` and wires `aria-labelledby` to the Label's id. The R5 fix only covered the SwitchRow-wrapper pattern; R6 cascades the same pattern into the in-primitive label path.
- `Field` primitive children pattern — when children + label provided, the primitive uses `Children.toArray` + `cloneElement` to inject `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid` on the inner child element.
- `NumberInput` + `TagsInput` accept `id` + `aria-label` + `aria-labelledby` props and forward them to the inner `<input>`.
- `RangeSlider` ships `aria-label` per thumb input ("Range: minimum (val)" / "Range: maximum (val)") + a `label` prop for the prefix.
- `TypeToConfirm` ships `<label htmlFor>` via `useId` + `aria-describedby` to the help text + `aria-invalid` when the phrase doesn't match.

### 4. Token aliases (closes drift class 15)

New `semantic/size.tokens.json` (30 component-bound size aliases) + new `semantic/color.invariant.tokens.json` (theme-invariant text-on-* + status.*.border) + extensions to `motion`, `shadow`, `type`, `color.dark`, `color.light` semantic files.

### 5. Naming-collision cleanup (closes drift class 13)

`nav.tsx` showcase exports renamed: `FAB → FABDemo`, `SplitButton → SplitButtonDemo`, `CommandPalette → CommandPaletteDemo`. Only consumer (`library/client.tsx`) updated.

### 6. Narrative tagline rewrites (closes drift classes 5, 7)

`llms.txt`, `llms-full.txt`, `USING-LUMEN.md` taglines hand-rewritten to lead with R5 / ADR 0024 / responsive safety net.

### 7. README + CHANGELOG (closes drift classes 1, 3, 4, 6)

- README Status line → v0.13.1 + 24 ADRs.
- README `## What's new — v0.13.1` section added.
- README "What this repo is" → 98 components.
- CHANGELOG spurious `[0.13.2]` stub deleted (then v0.13.2 added properly via this release).
- USING-LUMEN.md §5, §12, install URL, three-sentence summary all updated.

## Consequences

### Positive

- 87 `validate:tokens` errors → 0. The contract a component LLM reads against is now internally consistent.
- 14 a11y findings (across foundations + library) → 0 at 320 px on all 8 routes. The a11y net is now structural (in the primitives), not consumer-side.
- The "what does Lumen ship" question has six discoverable doc paths: `README.md` (human front door), `USING-LUMEN.md` (unified manual), `COMPONENT-INDEX.md` (component catalog), `TOKEN-INDEX.md` (token catalog), `audit-dashboard/ROUTES.md` (route map), `00-foundations/*` (foundation docs).
- The "what's the audit cycle" question has one source: this ADR.
- The `release.mjs` regex set now covers 4 more drift sites; each release cycle the prose-banner SSoT is automatically more in sync.

### Negative

- Two new generator scripts (`component-index`, `token-index`) need to be run on every component-contract change. Mitigation: wired into `pnpm` scripts; can be added to a pre-commit hook in a follow-up.
- `release.mjs` is now more complex (8 → 11 banner rewrites + over-bump guard). Mitigation: the patterns are intentionally narrow (per ADR 0023) and well-commented.
- The Field cloneElement pattern is React-magic that could surprise consumers reaching for advanced children compositions (fragments, multiple children). Mitigation: documented in the field.tsx comment block; cloneElement applies only to single valid React-element children, falls through for composites.
- `semantic/size.tokens.json` adds 5 collisions to Style Dictionary's pre-existing 88. SD is sensitive to top-level namespace coexistence (`size.container` from primitives vs `size.avatar` from semantic). Mitigation: build was broken before v0.13.2 and remains broken; defer to v0.13.3 SD-config refactor.

### Trade-offs explicitly accepted

- COMPONENT-INDEX duplicates information already in `_registry/registry.json` + per-component `component.md`. Trade-off: a human-readable index is the better UX for both humans and agents than 98 component.md files to grep. The duplication is sync'd by the generator.
- The audit-cycle-ladder formalization risks becoming a checklist that's followed mechanically. Mitigation: ADR 0025's Product Edge (*the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be*) explicitly frames the ladder as exploratory, not exhaustive.

## Methodology rule (carried forward, refined)

*A carried blocker is a tooling hypothesis, not a fact.* — R5 lesson, unchanged.

*The audit cycle is itself a contract. Each round teaches what the next round's tooling axis should be.* — R6 contribution.

Future rounds:
- R7 candidates: Lighthouse performance metrics at mobile (LCP, CLS, INP); real iOS Safari (chrome-devtools-mcp is headless Chromium, not Webkit); offline / slow-network for loading-state correctness.
- R8 candidates: reduced-motion + high-contrast OS-mode contracts; keyboard-only navigation walk.
- R9 candidates: print stylesheet contract; export / share affordance contract.

## References

- [ADR 0023 — LLM-docs version lockstep](0023-llm-docs-version-lockstep-v013.md) — v0.13.0 introduced the release-script lockstep; R6 extends it.
- [ADR 0024 — Responsive safety net](0024-responsive-safety-net-v0131.md) — v0.13.1 introduced the `overflow-x: clip` contract; R6 codifies the consumer rules in `00-foundations/responsive.md`.
- [`.audit-runs/2026-05-18-round-6/ISSUES.md`](../../.audit-runs/2026-05-18-round-6/ISSUES.md) — full R6 audit log.
- [`CHANGELOG.md`](../../CHANGELOG.md) `[0.13.2]` — full per-file change set.
