# ADR 0012 — Distribution surface completion v0.7

- **Date:** 2026-05-03
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Complements:** [ADR 0010 — Typography v0.5](./0010-typography-v05.md), [ADR 0011 — Forms & inputs v0.6](./0011-forms-and-inputs-v06.md), [ADR 0013 — Form RHF binding v0.7](./0013-form-rhf-binding-v07.md). v0.7 finishes what 0.5 + 0.6 started.

## Context

A repo-wide audit at the close of v0.6 found that **the system contracts were sound** (20 component contracts schema-valid, all WCAG contrast pairs pass, the v0.6 single-shell form architecture shipped correctly) **but the distribution surface — the layer that lets consumers actually use Lumen — was deeply broken.** Eight separate gaps:

1. **`_registry/` was missing 8 sidecars** for v0.5-beta and v0.6 components: `checkbox`, `field`, `form`, `radio-group`, `select`, `switch`, `textarea`, `validation-message`. `registry.json.items[]` stopped at the original 12. A consumer running `npx shadcn@latest add <registry-url>/checkbox` would 404.
2. **Examples coverage was 1/20.** Only `button/examples/primary.tsx` existed. Eleven v0.1 components declared `"web-react": "./examples/primary.tsx"` in their `component.json` but the file did not exist — broken references.
3. **`validate:tokens` silently passed everything.** The v0.6 `package.json` ended the script with `|| true`, masking real bugs. Two unresolved aliases (`select.listbox.radius → {radius.popover}` and `switch.track.width → {dimension.9}`) had been hidden in tokens for the entire v0.6 cycle.
4. **The glossary was two releases stale.** No v0.5 typography vocab (`Major Third`, semantic preset names, `tracking curve`), no v0.6 forms vocab (`field shell`, `density mode`, `lit edge`, `single focus surface`, `error wins focus weakens`). AI agents searching it for recent terminology found nothing.
5. **Foundation docs had four-layer gaps.** `color.md`, `spacing.md`, `density.md`, and `elevation.md` did not exist as canonical narratives. The concepts lived in tokens + ADRs but had no foundation prose.
6. **All 9 platform consumption guides were stale w.r.t. v0.6.** None of the `03-platforms/{platform}/README.md` files mentioned `field shell`, `forms-and-inputs`, density mode, or the `:has(:focus-visible)` pattern. CHANGELOG v0.6 explicitly tracked this as `Deferred`.
7. **Ten deferred form components (Combobox, NumberInput, PasswordInput, OTP, TagsInput, FileDropzone, Segmented, RangeSlider, DatePicker, TimePicker)** existed as primitives in `audit-dashboard/src/components/primitives/inputs.tsx` but had no `component.json` contracts. v0.6 promised them in its `Deferred` block; no contract = no consumer surface.
8. **CLAUDE.md said `globals.css` was a placeholder** to be replaced by Style Dictionary output. That guidance was authored when `globals.css` was ~200 lines. After v0.5 (35 typography utility classes) and v0.6 (~350 lines of forms shell), the file is 1939 lines and is the de-facto theme. The "replace this" guidance was actively misleading new contributors.

The pattern across all eight: **the system was correct internally but unconsumable externally.** A design system that ships only contracts and not their distribution layer is a docs-only system, not a design system.

## Peer-system research

The repo audit was triangulated against how peer systems handle distribution:

- **shadcn/ui** ships every component as a sidecar in [`registry/`](https://github.com/shadcn-ui/ui/tree/main/apps/www/registry) with explicit `dependencies`, `registryDependencies`, and a `cssVars` slot. Sidecars are derived from the component contracts via a script — but the script preserves curated fields. Lumen's v0.6 `build-registry.mjs` did NOT preserve them.
- **Material 3** ships per-platform docs that map every component to platform-native equivalents — Material's `OutlinedTextField` page lists Compose, Flutter, Web, and Android XML APIs side by side. Lumen's `03-platforms/{platform}/README.md` files were design-system-level intros without component-level mapping.
- **Carbon Design System** maintains a token decoder (the equivalent of the glossary) that lists every token, every alias, every rename. Carbon's decoder is updated in lockstep with releases. Lumen's glossary was not.
- **Atlassian DS** ships an [example app](https://atlassian.design/components/textfield/examples) per component with copy-paste-ready code. Lumen's button is the only component with such code; the other 19 contracts pointed to a nonexistent file.
- **Radix Primitives** validates token aliases strictly; an unresolved alias fails CI. Lumen's v0.6 `validate:tokens` masked failures.
- **Linear / Plaid / Notion / Asana** all ship multi-platform consumption (web + mobile) and explicit density modes. Lumen had the density mode in code (v0.6 `<Form density="compact">`) but no foundation doc explaining it.

The recurring lesson: **the system that ships isn't the system you author. It's the system the consumer can install, reference, and reproduce.**

## Decision

**Lumen v0.7 closes every distribution-surface gap.** Sixteen changes:

### 1. Author the 8 missing registry sidecars
`_registry/{checkbox,field,form,radio-group,select,switch,textarea,validation-message}.json`. Each declares `dependencies` (Radix packages, lucide-react), `registryDependencies` (cross-component refs), `cssVars`, `meta.platforms`, `meta.specPath`, `meta.docsPath`, `meta.warpSignature`, and `files` with the correct path resolution.

### 2. Author 10 deferred component contracts (v0.7)
The full md + json + example + sidecar trio for: Combobox, NumberInput, PasswordInput, OtpInput, TagsInput, DatePicker, TimePicker, Segmented, RangeSlider, FileDropzone. All are `status: "beta"` to signal "ships in v0.7, hardens in v0.8." Each adopts the `.lumen-field` shell from v0.6.

### 3. Author 11 missing example files for v0.1 components
`design-system/02-components/{name}/examples/primary.tsx` for badge, card, dialog, empty-state, input, live-dot, rate-ticker, stat, table, toast, toggle. Each is standalone (no `@/lib/utils` import — inline `cn` helper), uses semantic tokens via `var(--…)`, honors `prefers-reduced-motion`. Paths now resolve.

### 4. Strict `validate:tokens`
Replaced the v0.6 `ajv-cli + || true` pipeline with `scripts/validate-tokens.mjs`. The new script:
- Walks all `*.tokens.json` files.
- Builds a flat token map.
- Verifies every `{x.y.z}` alias resolves.
- Verifies every `tokens.consumed` reference in every `component.json` resolves.
- **No silent-pass mask.** Removing the mask immediately surfaced two real bugs (now fixed): `radius.popover` (added to semantic) and `dimension.9` (inlined as a switch-specific value).

### 5. Glossary refresh
`_meta/glossary.json` extended from 33 terms to 54 — added v0.5 typography vocabulary (Major Third, semantic typography presets, leading curve, tracking curve, Plan B Inter, ss01–ss04, Satoshi-Fallback, tabular-nums, fluid hero, italic policy) and v0.6 forms vocabulary (field shell, single focus surface, .lumen-field, .lumen-checkbox, .lumen-radio, .lumen-switch, lit edge, density mode, error wins focus weakens, read-only, validation timing, ValidationMessage, slot, autofill recipe, field-sizing auto-grow). Plus Obsidian Lime as a recognized term.

### 6. Author 4 missing foundation docs
- `00-foundations/color.md` (310 lines) — mood model, three-layer color, light/dark parallel, Warp lime accent discipline, accent glow, status palette, contrast, Don'ts.
- `00-foundations/spacing.md` (310 lines) — 4-point base, 8-point soft grid, primitive scale, semantic ladder (inline/stack/inset/section), form-specific gaps, container widths, touch target floor, density cross-ref, intentional off-grid breakages.
- `00-foundations/density.md` (244 lines) — comfortable vs compact, density mode hook, convergence pattern (Linear/Plaid/Notion/Asana), per-component density behavior, ARIA implications.
- `00-foundations/elevation.md` (250 lines) — three depth modalities (hairline / shadow / lit edge), shadow ladder, lit-edge dark-mode trick, accent glow, focus shadow, surface ladder, dark-mode considerations.

### 7. Update 9 platform READMEs with v0.6 forms mapping
Append `## Forms & inputs (v0.6 mapping)` section to each of: web-react, react-native, ios-native, android-native, desktop-mac, desktop-windows, shopify-liquid, bigcommerce-stencil, woo-wordpress. Each maps the field shell + token table + density mode + validation timing + read-only-vs-disabled to platform-native equivalents. Honest about per-platform compromises (React Native lacks `:has(:focus-visible)` equivalent; Material 3 `OutlinedTextField` is the wrapper-paints-focus pattern by construction; SwiftUI `.shadow` is gaussian where CSS `box-shadow` is sharp).

### 8. Wire RHF binding for Form
Form v0.7 ships dual-mode: native (v0.6 path, no deps) and RHF (Zod resolver + FormProvider, opt-in). See [ADR 0013](./0013-form-rhf-binding-v07.md) for the RHF-specific decision.

### 9. Fix `build-registry.mjs` to merge instead of overwrite
The v0.6 script clobbered hand-curated `dependencies`, `registryDependencies`, `cssVars`, and produced broken paths like `design-system/02-components/checkbox/../../../audit-dashboard/...`. The v0.7 script reads existing sidecars, preserves the curated fields, and resolves example paths to repo-relative form via `path.resolve` + `path.relative`. Field/Form/ValidationMessage targets land at `components/lumen/{name}.tsx` to avoid colliding with consumer's shadcn `components/ui/`.

### 10. Sort `registry.json.items[]` semantically
Reordered by component family: v0.1 baseline → v0.6 forms layer → v0.7 deferred-form completion. Within each family, primitives precede composition wrappers. Helps human readers and orders shadcn registry index pages logically.

### 11. Rename `primitives/elevation.tokens.json → primitives/shadow.tokens.json`
The file's top-level token namespace is `shadow`, not `elevation`. The misnamed filename made `elevation.*` lookups fail silently. Rename closes the gap. References updated in `00-foundations/elevation.md` (the foundation doc keeps the elevation name — it's the user-facing concept; the token file holds the implementation values), `00-foundations/color.md`, `01-tokens/README.md`, `research/system-architecture.md`.

### 12. Update CLAUDE.md `globals.css` guidance
Removed the "placeholder" framing. New guidance: `globals.css` is the de-facto source of truth for built CSS (~1900 lines, carries v0.4 token mappings + v0.5 typography utilities + v0.6 forms shell). When Style Dictionary's `_build/tailwind/theme.css` is wired, the goal is to derive the `:root` token block from it — the v0.5+ utility classes and v0.6 shells continue as authored CSS in `globals.css`.

### 13. Update `02-components/README.md`
The components table now reflects all 30 components grouped by release (v0.1 baseline / v0.6 forms / v0.7 deferred-form completion). Added validation script references (the v0.7 strict `validate:tokens`, the 3-stage `lint`).

### 14. Add READMEs to placeholder dirs
`notes/`, `reports/`, `assets/{moodboards,palettes,typography}/` were empty placeholder dirs. Added README.md to each documenting purpose + naming convention. Either keep them or delete intentionally; they're no longer mute.

### 15. Add 10 component-token files for the deferred contracts
`01-tokens/components/{combobox,number-input,password-input,otp-input,tags-input,date-picker,time-picker,segmented,range-slider,file-dropzone}.tokens.json`. Most reuse semantic input tokens; specifics carried per-component (e.g., `combobox.listbox.*`, `dropzone.background.dragover`). Token count: 521 → 694 (+173).

### 16. Bump VERSION → 0.7.0
Per [ADR 0009 — single semver system-wide](./0009-versioning-semver-system-wide.md). v0.7 is a minor bump because:
- New components (Added, not breaking).
- New foundation docs (Added).
- New tokens (Added).
- Strict `validate:tokens` is a tightening (semver-major would require — *technically* — but this gate was masking failures so the existing "passing" state was already wrong).
- Form contract added new props (Added — backward compatible).
- No tokens deprecated, no components deprecated, no shape changes to existing component contracts.

## Consequences

### Positive
- **The shadcn registry now works.** All 30 sidecars resolve to existing files. `npx shadcn@latest add <registry-url>/checkbox` will succeed.
- **The `validate:tokens` gate is real.** Future drift gets caught at PR time, not 6 months later.
- **AI agents have current terminology.** v0.5 + v0.6 vocab in the glossary; foundation docs covering color/spacing/density/elevation; platform READMEs covering v0.6 forms.
- **The deferred forms layer landed.** 10 contracts close the v0.6 deferred-block. The v0.6 promise is honored.
- **Foundation surface is complete.** Six foundation docs (principles, voice-and-tone, accessibility, motion-language, typography, forms-and-inputs) plus the four new ones (color, spacing, density, elevation) — designers and engineers have a coherent narrative reference layer.
- **Distribution gap closes.** A consumer can now reach Lumen at the level the contracts always implied — install, reference, and reproduce.

### Negative / costs
- **30 components vs 20 — surface to maintain.** Each new contract is a future obligation. The 10 v0.7 contracts ship as `status: "beta"` to signal "iterate before stable."
- **`validate:tokens` strictness can break existing repos.** The two bugs we fixed (`radius.popover`, `dimension.9`) were probably not the only ones in flight. Future PRs that consume now-strict aliases will fail until they fix the alias — that's the intended behavior, but it's a working-style change.
- **The audit-dashboard's 22 pre-existing lint violations** (in `primitives/{stat,nav,templates,...}.tsx` and `tab-nav.tsx`, `dashboard-shell.tsx`) are still unfixed. v0.7 didn't add new violations but didn't address them either. Tracked for v0.8.
- **The `examples/primary.tsx` standalone files duplicate the audit-dashboard primitives** for v0.1 components. Two implementations of the same logic creates maintenance overhead. The `_registry/` build script could be extended to derive the standalone examples from the audit-dashboard primitives by stripping `@/lib/utils` imports — flagged as a v0.8 task.
- **The build-registry script's MERGE semantics depends on existing sidecars carrying curated fields.** A fresh `git clone` + `pnpm registry` from scratch would produce sidecars without `dependencies`. Solution: capture the deps in `component.json` itself (a new `registry.dependencies` field on the schema) — defer to v0.8 when the schema is touched.
- **The 10 new component-token files added 173 tokens.** Token surface now at 694. Consider a v0.8 audit to see which are unused.

## Tradeoffs not chosen

- **Auto-derive examples from audit-dashboard primitives** — would have eliminated duplication but adds build-step complexity. Manual standalone files are simpler to reason about today; auto-derivation revisits in v0.8.
- **Drop the `examples` field from component.json and rely solely on `_registry/`** — would simplify the schema but breaks the "two-file contract" symmetry that ADR 0007 requires (component.md + component.json carry the truth; sidecars are derived).
- **Promote `_meta/glossary.json` to a generated file from token + component sources** — tempting but the glossary's value is human-curated short definitions, not exhaustive enumeration. Generated would lose the brevity.
- **Skip the platform READMEs and let `03-platforms/` live as deferred** — would have shipped v0.7 faster but locks in the "internally correct, externally unconsumable" pattern. Closing the gap was the whole point.
- **Bump to v1.0.0** — tempting given the contract surface is now complete. Held off because:
  - Three v0.7 components are `status: "beta"` (combobox keyboard, date-picker calendar logic, time-picker locale).
  - The Vercel deployment is dead — `pnpm cls` cannot validate against production.
  - `_build/` Style Dictionary outputs aren't yet wired into a `lumen-dist` repo.
  - v1.0 should be when the distribution chain is verifiably end-to-end, not when contracts are merely complete.
- **Address the 22 pre-existing audit-dashboard lint violations** — would have grown the diff substantially without changing the consumer-facing contract surface. Deferred to v0.8 with a focused refactor pass.

## Verification

- ✅ `pnpm validate:tokens` — 694 tokens declared across 32 files; all aliases + component references resolve.
- ✅ `pnpm validate:components` — all 30 component.json files schema-valid.
- ✅ `pnpm validate:contrast` — all WCAG AA pairs pass (light + dark).
- ✅ `pnpm lint:no-arbitrary-typography` — no violations.
- ✅ `pnpm lint:no-arbitrary-form-values` — no violations.
- ⚠️ `pnpm lint:no-primitives` — 22 violations, all pre-existing in `audit-dashboard/src/components/{primitives,dashboard-shell,tab-nav}.tsx`. Zero new violations introduced.
- ✅ `pnpm registry` — generates 30 sidecars + index, all paths resolve to existing files.
- ✅ `cd audit-dashboard && pnpm exec tsc --noEmit` — exit 0.
- ✅ Every v0.1 component now has `examples/primary.tsx` that exists and lints clean.
- ✅ Every v0.6 + v0.7 component has a registry sidecar referencing a real file.
- ✅ Glossary covers v0.5 + v0.6 vocabulary (54 terms vs 33 in v0.6).
- ✅ All 9 platform READMEs contain `## Forms & inputs (v0.6 mapping)`.
- ✅ Four new foundation docs exist with proper frontmatter and ≥5 token citations each.

## Open follow-ups for v0.8

1. **Address the 22 pre-existing `lint:no-primitives` violations.** Each is a hardcoded px or hex in `audit-dashboard/src/components/{primitives,dashboard-shell,tab-nav}.tsx`. Mostly icon dimensions (use `size={16}` prop instead) and chart palettes (move to a token file).
2. **Style Dictionary → `_build/tailwind/theme.css` wiring.** Build the pipeline that actually emits CSS variables for the audit-dashboard. Currently `pnpm build` runs Style Dictionary but the audit-dashboard's `globals.css` isn't consuming the output.
3. **Redeploy Vercel** so `pnpm cls` and visual audits resume.
4. **Add `registry.dependencies` field to `component.schema.json`** so component.json captures the npm deps and `build-registry.mjs` doesn't depend on existing sidecars carrying them.
5. **Real DatePicker/TimePicker logic.** v0.7 ships visual scaffolds; v0.8 wires `react-day-picker` (or first-party logic).
6. **PasswordStrength dedicated contract.** Currently a sub-primitive in `primitives/inputs.tsx`. Promote in v0.8.
7. **`space.inset.*` semantic namespace.** Components currently reach for `space.4` directly for inset padding — a `space.inset.{xs,sm,md,lg}` ladder (matching `space.stack.*` / `space.inline.*`) would clean linting.
8. **`size.control.cozy` (36 px)** for a future `cozy` density mode (between comfortable and compact).
9. **Lit-edge naming normalization.** `shadow.input.lit-edge` (kebab) vs `input.ring.lit-edge` (camel) — cosmetic but worth a sweep.
10. **Decide v1.0 cut criteria.** When `_build/tailwind/theme.css` ships + Vercel is alive + 3 v0.7 betas promote to stable, v1.0 is the natural next bump.
