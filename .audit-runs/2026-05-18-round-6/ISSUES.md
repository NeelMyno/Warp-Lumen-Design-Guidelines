# R6 — same-day audit round 6 (2026-05-18 evening) — LLM-docs SSoT + tooling-script hygiene

> Sixth round of the same-day live-audit cycle. Where R1–R5 walked the rendered UI (R1 chrome, R2 interaction, R3 contract-comparison, R4 meta-contract, R5 small-viewport metrics), R6 pivots to the layer one rung below: **the contracts authoring agents read against**. Documentation drift, naming-collision hygiene, tooling-script gaps, token-validation closure, primitive-layer a11y cascade.
>
> Shipped as **v0.13.2 (commit pending) — [ADR 0025](../../_meta/decisions/0025-audit-cycle-ladder-r6-llm-docs-ssot-v0132.md)**.

## Methodology

Same-day audit cycle continuing R5. Started with a comprehensive 5-validator baseline:

| Gate | Pre-R6 status |
|---|---|
| `pnpm exec tsc --noEmit` (audit-dashboard) | ❌ 4 stale `.next/types/validator.ts` errors (TS2307) — pre-existing from removed routes (`examples/landing-hero`, `library/registry`, `prompts`, `tokens`) |
| `pnpm validate:tokens` | ❌ 87 errors — component contracts reference tokens not declared in any tokens.json |
| `pnpm validate:components` | ✅ PASS — 100 component.json schema-valid |
| `pnpm validate:contrast` | ✅ PASS — all documented pairs AA/AAA |
| `pnpm registry` | ✅ PASS — 98 components |
| `pnpm lint` | ❌ 57 hardcoded-px / hex violations across 11 primitive files |
| `pnpm build` (Style Dictionary) | ❌ 88 collisions + 1 reference error — pre-existing |

R6 walked all 8 routes (`/foundations` `/library` `/landing` `/tool` `/saas` `/commerce` `/mobile` `/desktop`) at:
- Desktop 1500×812 in dark + light mode (visual quality + screenshot capture)
- Mobile 320×568×2-DPI via `chrome-devtools-mcp emulate` (a11y probe + responsive-net verification)

The a11y probe for nameless interactive elements:

```js
document.querySelectorAll('button, [role="button"], a[href], input, [role="switch"], [role="checkbox"], [role="tab"], [role="menuitem"]')
  .filter(el => {
    const visibleText = el.textContent?.trim() || '';
    const ariaLabel = el.getAttribute('aria-label');
    const labelledBy = el.getAttribute('aria-labelledby');
    const title = el.getAttribute('title');
    const placeholder = el.getAttribute('placeholder');
    const id = el.id;
    let hasLinkedLabel = false;
    if (id && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'))
      hasLinkedLabel = !!document.querySelector(`label[for="${CSS.escape(id)}"]`);
    return !visibleText && !ariaLabel && !labelledBy && !title && !placeholder && !hasLinkedLabel && !el.closest('label');
  });
```

The probe checks:
1. `textContent` — visible text within the element
2. `aria-label` / `aria-labelledby` — explicit aria-* attribute
3. `title` / `placeholder` — fallback names per WHATWG accessibility spec
4. `<label for={id}>` linkage for native inputs (id-via-htmlFor pattern)
5. `<label>` ancestor (implicit wrapping pattern)

A genuine "nameless" finding fails ALL of these. The probe is stricter than session 38's R5 probe (which didn't check `<label for>` linkage and produced false positives on Field inputs).

## Findings

### Group A — LLM-docs SSoT drift (12 sites)

| # | Site | Drift | Closure |
|---|---|---|---|
| R6-A01 | [`CHANGELOG.md`](../../CHANGELOG.md):9–15 | Spurious empty `## [0.13.2] — 2026-05-18` stub above the real v0.13.1 entry. Session 38's `release.mjs patch` on already-bumped VERSION created this. | Deleted; v0.13.2 ships a real entry. |
| R6-A02 | [`package.json`](../../package.json):3 | Root `"version": "0.12.4"` — 7 patches stale. `release.mjs` only bumped VERSION + `lib/version.ts`. | Bumped to 0.13.2. `scripts/release.mjs` widened to bump root pkg in lockstep. |
| R6-A03 | [`README.md`](../../README.md):27 | `Status: v0.13.0 · ... · 23 ADRs` — stuck at v0.13.0 narrative + ADR count. `release.mjs` regex caught bold-chip format but not plain multi-space `Status:` block. | Rewrote to v0.13.1 narrative + 24 ADRs. `release.mjs` widened with `^Status:\s+v\d+\.\d+\.\d+\s*·` pattern. |
| R6-A04 | [`README.md`](../../README.md):159 | `## What's new — v0.13.0` — no v0.13.1 section under What's new. | Added comprehensive v0.13.1 section. `release.mjs` widened to rewrite the heading. |
| R6-A05 | [`llms.txt`](../../llms.txt):3 | Chip v0.13.1 (correct) but narrative tagline still "LLM-docs version lockstep + R4 comprehensive audit" (v0.13.0 content). | Hand-rewrote narrative to lead with R5 / ADR 0024. |
| R6-A06 | [`llms.txt`](../../llms.txt):121 | "23 Architecture Decision Records (ADRs 0001–0023)" — missing ADR 0024. | Updated to 24 ADRs; added ADR 0024 description inline. |
| R6-A07 | [`llms-full.txt`](../../llms-full.txt):5 | Same drift class as A05. | Hand-rewrote. Also added rules 6 + 7 to the "patterns LLMs need to encode" block (root-layer responsive safety net + Radix-rooted-primitives a11y contract). |
| R6-A08 | [`USING-LUMEN.md`](../../USING-LUMEN.md):37, 147, 296, 298, 878, 914 | 6 sites claim "all 35 components". Actual count: 98 (registry). | Rewrote §5 catalog as 10-category 98-row table; updated TOC entry, ASCII art at §2, §12 totals table, three-sentence summary. |
| R6-A09 | [`USING-LUMEN.md`](../../USING-LUMEN.md):461 | Install URL hardcoded `<cdn>/lumen/v0.12.4/registry/{name}.json` — stale by 7 patches. | Updated to v0.13.1. `release.mjs` widened to bump this site (regex `<cdn>/lumen/v\d+\.\d+\.\d+/registry`). |
| R6-A10 | [`USING-LUMEN.md`](../../USING-LUMEN.md):51 | §1 tagline `Lumen v0.13.1 — ... LLM-docs version lockstep + R4 comprehensive audit ...` — chip bumped but tagline stuck at R4. | Hand-rewrote tagline to R5 + ADR 0024 + cascade. |
| R6-A11 | [`README.md`](../../README.md):240–251 | "Open questions (post-v0.12.5)" section title + body stale; v0.12.6–v0.13.1 cascade summary absent. | Renamed to `Open questions (post-v0.13.1)`; rewrote cascade story to include v0.12.6 → v0.13.1; updated ADR-floor question. |
| R6-A12 | LLM-discovery layer | No top-level `COMPONENT-INDEX.md`, `TOKEN-INDEX.md`, `audit-dashboard/ROUTES.md`, `data-visualization.md`, `responsive.md`, `state-matrix.md`. Agents asking "show me all components" / "what's the chart color contract" / "what state must a button support" had to assemble from scattered sources. | Authored all 6 docs. Two are auto-generated; four are hand-authored foundation docs. |

### Group B — primitive-layer a11y cascade (5 sites)

These are cascades of v0.13.1 R5-006 — the SAME root cause (Radix overrides host element role, breaking HTML's implicit `<label htmlFor>` association) propagated through unfixed primitives.

| # | Primitive | Bug | Closure |
|---|---|---|---|
| R6-B01 | [`switch.tsx`](../../audit-dashboard/src/components/primitives/switch.tsx) | When `label` prop is provided, the visible `<Label htmlFor={switchId}>` renders but the Radix `<button role="switch">` stays nameless (htmlFor doesn't propagate to a button-role element). Affected the foundations Switch+Checkbox showcase (3 instances). | When label is provided AND no explicit aria-* override, default `aria-labelledby` to the generated `{switchId}-label` id; assign `id={labelId}` on the Label. |
| R6-B02 | [`checkbox.tsx`](../../audit-dashboard/src/components/primitives/checkbox.tsx) | Same root cause as R6-B01. Affected 3 foundations Checkbox showcase instances. | Same fix as R6-B01 applied. |
| R6-B03 | [`field.tsx`](../../audit-dashboard/src/components/primitives/field.tsx) | Children pattern (`<Field label="X"><TextInput /></Field>`) renders the `<label htmlFor={inputId}>` but the inner TextInput renders its own `<input>` with its own id — the label-for-id link is broken. Affected ~6 library/client.tsx Field instances (First name, Last name, Email, Origin, Destination, etc.). | When children + label are provided, the primitive uses `Children.toArray` + `cloneElement` to inject `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid` on the first valid React-element child. Falls through for composite children (fragments, multiple). |
| R6-B04 | [`inputs.tsx`](../../audit-dashboard/src/components/primitives/inputs.tsx) NumberInput + TagsInput | Wrapper primitives that swallowed `id` + `aria-*` props from the parent Field's cloneElement — the inner `<input>` stayed nameless. | Both now accept `id` + `aria-label` + `aria-labelledby` props and forward to the inner `<input>`. NumberInput Decrement/Increment buttons get prefixed aria-labels when an outer label is given. |
| R6-B05 | [`inputs.tsx`](../../audit-dashboard/src/components/primitives/inputs.tsx) RangeSlider | Two `<input type="range">` thumb inputs shipped nameless. | New `label` prop on RangeSlider; thumb inputs get `aria-label={`${label}: minimum (${format(value[0])})`}` and `: maximum (${format(value[1])})` respectively. |
| R6-B06 | [`feedback.tsx`](../../audit-dashboard/src/components/primitives/feedback.tsx) TypeToConfirm | Modal-input shipped without `<label htmlFor>` (the label was a bare `<label>` without `for=`) and no aria-* fallback. | Added `useId` import, generated `inputId` + `helpId`, wired `htmlFor={inputId}` + `id={inputId}` + `aria-describedby={helpId}` + `aria-invalid` toggle. |

### Group C — naming-collision hygiene (3 sites)

| # | Site | Collision | Closure |
|---|---|---|---|
| R6-C01 | [`nav.tsx`](../../audit-dashboard/src/components/primitives/nav.tsx):450 vs `fab.tsx` | `export function FAB` in nav.tsx (showcase wrapper) collided with the canonical primitive in `fab.tsx`. LLM grepping `export function FAB` got two hits with no way to distinguish canonical from demo. | Renamed `nav.tsx`'s export to `FABDemo` (matches established convention: NavbarDemo, SidebarDemo, FooterDemo). |
| R6-C02 | [`nav.tsx`](../../audit-dashboard/src/components/primitives/nav.tsx):462 vs `split-button.tsx` | Same as R6-C01 for `SplitButton`. | Renamed to `SplitButtonDemo`. |
| R6-C03 | [`nav.tsx`](../../audit-dashboard/src/components/primitives/nav.tsx):491 vs `command-palette.tsx` | Same as R6-C01 for `CommandPalette`. The canonical one is the cmdk-backed Radix Dialog used by `command-palette-trigger.tsx` in the dashboard shell; nav.tsx's was a visual-only showcase. | Renamed to `CommandPaletteDemo`. Updated single consumer `library/client.tsx` import + JSX. |

Note: `Field` in `field.tsx` vs `form-rhf.tsx` — both export a `Field` symbol. NOT renamed because the form-rhf re-export is intentional (the RHF binding API). Different import paths; non-issue in practice. Documented in form-rhf.tsx comment.

### Group D — token-validation closure (87 errors)

87 `validate:tokens` errors closed by 6 token-file additions/extensions:

| File | Additions |
|---|---|
| `design-system/01-tokens/semantic/size.tokens.json` (new) | `size.{avatar,banner,bottom-nav,calendar,drawer,kanban,list,navbar,phone,popover,sidebar,slider,table,tree}.*` — 30 component-bound aliases. |
| `design-system/01-tokens/semantic/color.invariant.tokens.json` (new) | `color.text.{on-action,on-avatar}`, `color.status.{danger,warning,success,info}.border`. |
| `design-system/01-tokens/semantic/motion.tokens.json` (extend) | `motion.duration.shimmer` (= slower / 400ms), `motion.duration.spin` (= 1000ms). |
| `design-system/01-tokens/semantic/shadow.tokens.json` (extend) | `shadow.elevation.{sm,md,lg}` (= `shadow.{sm,md,lg}`), `shadow.glow.accent` (= `shadow.accent-glow`), `shadow.kbd` (new). |
| `design-system/01-tokens/semantic/type.tokens.json` (extend) | `type.tabular.nums` (new preset), `type.code.{sm,md}` (added inside existing `type.code` block). |
| `design-system/01-tokens/semantic/color.dark.tokens.json` + `color.light.tokens.json` (extend) | `color.chart.1–8` (Lumen chart palette), `color.avatar.bg.1–8` (avatar fallback palette). Both theme-invariant by contract; mirrored to dark + light for namespace parity. |

**Post-closure: 958 tokens declared across 34 files; all aliases + component-contract refs resolve.**

### Group E — release.mjs widening (closes drift classes A02 + A03 + A04 + A09)

Extended `scripts/release.mjs`:

```js
// v0.13.2 additions:
// (1) Refuse to run if [next] already in CHANGELOG.md (over-bump guard)
// (2) Bump root package.json "version" field
// (3) Rewrite README.md plain Status: block (^Status:\s+v...)
// (4) Rewrite USING-LUMEN.md install URL <cdn>/lumen/v.../registry
// (5) Rewrite README.md ## What's new — v... heading
```

Pre-flight contract: `release.mjs patch` now refuses if `## [next]` already exists in CHANGELOG.md (which is what happens when VERSION is hand-bumped to N+1 and the script is run again). This closes the 0.13.1 → 0.13.2 over-bump trap session 38 hit.

### Group F — consumer-side a11y polish

| # | Site | Fix |
|---|---|---|
| R6-F01 | [`library/client.tsx`](../../audit-dashboard/src/app/library/client.tsx) Input states demo | 5 bare `<TextInput>` instances now ship `aria-label` (the VariantRow sibling "Default"/"Filled"/"Focus"/"Error"/"Disabled" labels aren't wired `<label htmlFor>`). |
| R6-F02 | [`library/client.tsx`](../../audit-dashboard/src/app/library/client.tsx) NumberInputWrapper | Now accepts + forwards `id` + `aria-label` + `aria-labelledby` so the parent Field's cloneElement can wire the accessible name through. |

## Post-fix verification

### Per-route at 320 × 568 × 2-DPI (chrome-devtools-mcp emulate, mobile, touch)

| Route | innerWidth | scrollWidth | (max-width: 639px) | (max-width: 767px) | Interactive | Nameless |
|---|---|---|---|---|---|---|
| /foundations | 320 | 320 | ✓ active | ✓ active | 130 | **0** |
| /library | 320 | 320 | ✓ active | ✓ active | 393 | **0** |
| /landing | 320 | 320 | ✓ active | ✓ active | 19 | **0** |
| /tool | 320 | 320 | ✓ active | ✓ active | 38 | **0** |
| /saas | 320 | 320 | ✓ active | ✓ active | 36 | **0** |
| /commerce | 320 | 320 | ✓ active | ✓ active | 44 | **0** |
| /mobile | 320 | 320 | ✓ active | ✓ active | 23 | **0** |
| /desktop | 320 | 320 | ✓ active | ✓ active | 31 | **0** |

**Total: 714 interactive elements across 8 routes, 0 nameless. ADR 0024 responsive safety net continues to work — `overflow-x: clip` on `<html>`+`<body>` keeps `innerWidth = 320` at every route.**

### Desktop 1500 × 812 in dark + light mode

`/foundations` dark + light: both render correctly (screenshots captured at `.audit-runs/2026-05-18-round-6/{foundations-dark,foundations-light}-desktop.png`). Brand pill v0.13.1, single-accent rule, paper-canvas-in-light, Foundations hero display typography all intact.

### Validator suite

| Gate | Pre-R6 | Post-R6 |
|---|---|---|
| `pnpm exec tsc --noEmit` (audit-dashboard) | ❌ 4 stale `.next` errors | ✅ **PASS** (resolved by `.next` cleanup mid-cycle) |
| `pnpm validate:tokens` | ❌ 87 errors | ✅ **PASS** — 958 tokens / 34 files |
| `pnpm validate:components` | ✅ PASS | ✅ PASS |
| `pnpm validate:contrast` | ✅ PASS | ✅ PASS |
| `pnpm registry` | ✅ PASS (98) | ✅ PASS (98) |
| `pnpm lint` | ❌ 57 hardcoded-px/hex | ❌ 57 (UNCHANGED — see carried forward) |
| `pnpm build` (Style Dictionary) | ❌ 88 collisions + 1 ref err | ❌ 93 collisions + 1 ref err (5 new from `semantic/size.tokens.json` declaring `size.*` namespace overlap with `primitives/dimension.tokens.json`) |

## Methodology contribution

R6 adds **LLM-docs SSoT + tooling-script hygiene** as the sixth axis to the audit-cycle ladder. The methodology rule extends:

- R5 introduced: *a carried blocker is a tooling hypothesis, not a fact.*
- R6 introduces: *the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be.*

The R6 surface — what authoring agents read against — was invisible to R1–R5 because R1–R5 tooled around the rendered UI. R6 needed a different tooling axis: `validate:tokens` + `pnpm lint` + `pnpm exec tsc` + a more conservative a11y probe (with `<label for>` checks) + grep across LLM-facing docs.

Future rounds:
- **R7** (carried-forward candidates): Lighthouse performance metrics at mobile (LCP, CLS, INP); real iOS Safari (chrome-devtools-mcp uses headless Chromium); offline / slow-network for loading-state correctness.
- **R8** candidates: reduced-motion + high-contrast OS-mode contracts; keyboard-only navigation walk.
- **R9** candidates: print stylesheet contract; export / share affordance contract.

## Carried blockers

- **Style Dictionary `pnpm build` token-collision errors** — pre-existing since prior to v0.13.0; R6's new `semantic/size.tokens.json` adds 5 to the count (88 → 93). The validator path passes (the deeper LLM-facing contract check). Defer to v0.13.3 SD-config refactor or rename the size primitive namespace.
- **`pnpm lint` 57 hardcoded-px / hex violations** — all pre-existing; R6 did not introduce any. Mix of real bugs (display.tsx 22px) + intentional brand fixtures (templates.tsx Google brand hex + ColorPicker default swatches). Defer to v0.13.3 with a `// lumen-brand-fixture` allowlist + per-site token-ification.
- **Lighthouse perf gate at mobile** — would close R7 of the audit-cycle ladder.

## Browser-environment workaround (carried from R5)

`chrome-devtools-mcp` looks for Chrome at the default `/Applications/Google Chrome.app` path. The symlink session 38 created (`/Applications/Google Chrome.app -> /Applications/Browsers/Google Chrome.app`) is still in place. Reversible via `rm /Applications/Google\ Chrome.app`.

## Files touched (v0.13.2)

See `CHANGELOG.md` `[0.13.2]` "Files touched" subsection for the canonical list.

## Visual artefacts

- `.audit-runs/2026-05-18-round-6/foundations-dark-desktop.png` — dark mode @ 1500 × 812
- `.audit-runs/2026-05-18-round-6/foundations-light-desktop.png` — light mode @ 1500 × 812
