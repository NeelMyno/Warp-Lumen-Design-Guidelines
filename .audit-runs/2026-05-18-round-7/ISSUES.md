# Audit Round 7 — SD-Pipeline + Lint Hygiene + Pre-Commit Hook

**Date:** 2026-05-18
**Scope:** Close the four R6-carried items (v0.13.3 build-pipeline session).
**Predecessor:** [`../2026-05-18-round-6/ISSUES.md`](../2026-05-18-round-6/ISSUES.md) (v0.13.2 R6 ship).
**Tooling axis:** Build-pipeline state (`pnpm build`) + lint hygiene (`pnpm lint`) + pre-commit ergonomics + cold-start consumer view (CSS var resolution).
**Methodology contribution:** R7 walks the *pipeline that produces consumed artifacts* — not the rendered UI (R1+R2+R3), not the LLM-docs prose layer (R4+R6), not the small-viewport runtime (R5). When the validators (`validate:tokens`) pass but the producers (`build`) fail, every downstream consumer of CSS variables is reading stale build output. This is the SD-pipeline axis.

## R6 carry-forward state (audit start)

From [`.audit-runs/2026-05-18-round-6/ISSUES.md`](../2026-05-18-round-6/ISSUES.md) closeout table:

| Gate | R6 state | R7 target |
|---|---|---|
| `pnpm validate:tokens` | ✅ PASS (958 tokens / 34 files) | ✅ PASS |
| `pnpm build` (Style Dictionary) | ❌ 93 collisions + 1 ref err | ✅ PASS |
| `pnpm lint` (umbrella) | ❌ 57 hardcoded-px/hex violations | ✅ PASS |
| `pnpm lint:token-naming` (NOT in umbrella) | ❌ 45 violations | ✅ PASS + wire into umbrella |
| Pre-commit hook | ❌ none — COMPONENT-INDEX / TOKEN-INDEX manual | ✅ auto-regenerate via simple-git-hooks |
| Lighthouse mobile audit | ❌ unrun since v0.13.x cycle began | ✅ R7 baseline captured |

## Discovery — `pnpm build` (93 collisions + 1 ref err)

Verbose SD run reveals four collision categories:

### Cat-1 — File-level $description "collisions" (~5 false positives)

Multiple files declare a `$description` at the same SD path level (`color`, `color.status`, root `""`). SD reports these as collisions but the *values* are descriptions, not tokens. No downstream impact — SD picks one description string at random for the path-level export, but the leaf tokens themselves are not affected. **Treatment:** N/A — informational, leave as-is.

### Cat-2 — Dark + light file bleed (~50 collisions)

Examples: `color.surface.page`, `color.text.primary`, `color.action.{intent}.*`, `color.status.{tone}.*`, `color.aurora`, `color.chart`, `color.avatar`, etc.

**Root cause:** `style-dictionary.config.ts` lightConfig.source uses `!` exclusion patterns:
```ts
source: [
  "design-system/01-tokens/**/*.tokens.json",
  "!design-system/01-tokens/semantic/color.dark.tokens.json",
  "!design-system/01-tokens/semantic/color.hc-light.tokens.json",
  "!design-system/01-tokens/semantic/color.hc-dark.tokens.json",
],
```

But SD v5's `lib/utils/combineJSON.js:62-65` runs `globSync(arr[i])` per pattern individually then concatenates the results. The `!path` syntax does **not** survive — `globSync("!color.dark.tokens.json")` matches nothing (the `!` is treated as a literal character) and the main `**/*.tokens.json` pattern still pulls the dark file. So dark+light values both load into lightConfig, and SD reports each path's "first vs second" load as a collision.

**Treatment:** Replace exclusion globs with a pre-resolved file list. Use `globSync` from `@bundled-es-modules/glob` (already pulled in by SD) to enumerate, then filter via `RegExp` to drop dark/hc files. Same fix applied to darkConfig source (currently explicit list — but I'll normalize both for consistency and audit-resilience).

### Cat-3 — `shadow.accent-glow` self-alias circular reference

`design-system/01-tokens/semantic/shadow.tokens.json:88-91`:
```json
"accent-glow": {
  "$value": "{shadow.accent-glow}",
  "$description": "Optional outer glow under primary CTAs. Warp signature."
}
```

This redeclares the canonical `shadow.accent-glow` from `primitives/shadow.tokens.json:N` as a **self-alias**. SD resolves `shadow.accent-glow` → `{shadow.accent-glow}` → cycle. Cascades to `color.action.primary.glow` (which aliases `{shadow.accent-glow}`).

The R6 ship added `shadow.glow.accent` (`semantic/shadow.tokens.json:11-14`) as the new semantic alias — which is correct. The line-88 entry is **obsolete duplicate dead code** with a stale description from before the R6 rename. Delete it.

**Treatment:** Delete `semantic/shadow.tokens.json:88-91`. The canonical definition remains in `primitives/shadow.tokens.json`. Consumers reference either `{shadow.accent-glow}` (primitive — discouraged per AGENTS.md rule 2) or `{shadow.glow.accent}` (semantic alias — preferred). The reference error for `color.action.primary.glow` resolves once the cycle breaks.

### Cat-4 — Output-name collisions (camelCase + kebab-case → same kebab output) (~3 SD warnings)

After Cat-2 fixes, three many-to-one outputs remain:

| Output | Path 1 | Path 2 | Status |
|---|---|---|---|
| `field-label-color-disabled` | `field.label.color-disabled` | `field.label.colorDisabled` (deprecated) | Both `#a8a8a8` — same value, but two declarations means SD warns. Delete deprecated. |
| `field-helper-color-disabled` | `field.helper.color-disabled` | `field.helper.colorDisabled` (deprecated) | Same as above. |
| `range-slider-track-height` | `rangeSlider.track.height` (4px — track bar) | `rangeSlider.trackHeight` (24px — slot containing track + thumbs) | **Different concepts.** Rename `trackHeight` → `track.slot-height` or similar. |

**Treatment:**
1. Delete `field.label.colorDisabled` + `field.helper.colorDisabled` — the `$deprecated` markers slated removal in v0.9.0; currently v0.13.2 (5+ minors past).
2. Rename `rangeSlider.trackHeight` → `rangeSlider.slot.height` (semantically "the slot containing the track and thumbs," matches existing `$description`).
3. Treatment-3 cascades into the token-naming hygiene phase: 45 camelCase paths to rename to kebab-case (which renames most of `rangeSlider.*` → `range-slider.*`, etc.).

### Cat-5 — Font-shorthand letterSpacing warnings (46 typography tokens)

SD's `css/variables` format emits the legacy `font` shorthand which doesn't carry letter-spacing / text-transform / font-feature-settings. So 46 typography tokens emit a warning that those properties are dropped in the CSS-shorthand output.

**Status:** *Known SD limitation, not blocking.* The runtime consumer reads from `audit-dashboard/src/app/globals.css` (the authored utility classes, per ADR 0010), not from SD's `_build/css/tokens.css`. Defer to v0.14.x when we wire `_build/tailwind/theme.css` into the audit-dashboard build. Document this in CHANGELOG / ADR 0026.

## Discovery — `pnpm lint` umbrella (57 violations)

Currently the umbrella runs 6 rules; 4 are clean, 2 flag:

| Rule | Count | Status |
|---|---|---|
| `lint:no-primitives` | **57** | Mix of real bugs + intentional brand fixtures |
| `lint:no-arbitrary-typography` | **2** | `landing/page.tsx` line 98 — `tracking-[var(--tracking-tight)]` ×2 |
| `lint:no-arbitrary-form-values` | 0 ✓ | — |
| `lint:no-off-grid-spacing` | **3** | Half-step utilities `py-2.5`, `top-0.5`, `gap-0.5` |
| `lint:no-white-on-accent` | 0 ✓ | — |
| `lint:button-conventions` | 0 ✓ | — |
| `lint:token-naming` (NOT in umbrella) | **45** | All camelCase token paths to rename |

### 57 `lint:no-primitives` triage

Each violation is hardcoded `\d{2,4}px` (literal pixel value) or `#[0-9a-fA-F]{6,8}` (literal hex color) in component example TSX or audit-dashboard primitive code. The lint script only currently allowlists matches preceded by `//` on the same line. I'll triage each violation into:

- **(R) Real bug — tokenize.** The value maps to an existing semantic token. Replace.
- **(F) Intentional fixture — allowlist.** The value documents a brand reality (third-party brand colors in payment icons, color-picker palette demonstrating brand anchors, avatar palette demonstrating fallback colors).

| File | Violation | Disposition |
|---|---|---|
| `02-components/ai-badge/examples/primary.tsx` | `10px` | **R** — replace with `var(--space-1_5)` or `var(--font-size-xs)` per use |
| `02-components/ai-prompt-input/examples/primary.tsx` | `20px` | **R** — `var(--space-2_5)` or token |
| `02-components/avatar/examples/primary.tsx` | hex `#14B8A6, #6366F1, #EC4899, #F59E0B` | **F** — avatar fallback palette diversity demo |
| `02-components/avatar/examples/primary.tsx` | `10px, 11px, 13px, 16px` | **R** — size tokens |
| `02-components/banner/examples/primary.tsx` | `1200px` | **F** — banner container width fixture (could go to `--size-container-lg`) |
| `02-components/bottom-nav/examples/primary.tsx` | `10px` | **R** — `var(--font-size-xs)` |
| `02-components/cart-drawer/examples/primary.tsx` | `480px` | **F** — drawer width fixture (cart drawer at standard width) |
| `02-components/chart/examples/primary.tsx` | hex `#60A5FA, #FBBF24, #A78BFA, #F472B6` | **R** — replace with `var(--color-chart-2..5)` (R6 added these) |
| `02-components/chart/examples/primary.tsx` | `12px` | **R** — small text/spacing |
| `02-components/chat-bubble/examples/primary.tsx` | `640px` | **F** — chat container fixture |
| `02-components/coach-mark/examples/primary.tsx` | `300px` | **F** — coach-mark tooltip width fixture |
| `02-components/code-block/examples/primary.tsx` | `13px` | **R** — code font size token |
| `02-components/color-picker/examples/primary.tsx` | hex `#00FA8A, #0D0D0D, #E6E6E6, #FAFAFA` | **F** — these ARE the brand anchors (the color picker IS the visualization) |
| `02-components/drawer/examples/primary.tsx` | `400px, 520px, 720px, 240px` | **F** — drawer width fixtures (small / md / lg / wide) |
| `02-components/kanban/examples/primary.tsx` | `280px` | **F** — kanban column width fixture |
| `02-components/kbd/examples/primary.tsx` | `10px, 11px` | **R** — kbd glyph size |
| `02-components/list/examples/primary.tsx` | `32px, 44px, 56px` | **R** — touch-target tokens (`size.touch.min` = 44px, etc.) |
| `02-components/logo-cloud/examples/primary.tsx` | `120px` | **F** — logo size fixture |
| `02-components/navbar/examples/primary.tsx` | `20px, 1200px` | mixed — `20px` **R**, `1200px` **F** |
| `02-components/notification-center/examples/primary.tsx` | `420px` | **F** — notification panel width fixture |
| `02-components/permission-prompt/examples/primary.tsx` | `400px` | **F** — modal width fixture |
| `02-components/phone-frame/examples/primary.tsx` | `42px, 34px, 11px, 18px` | **R** — phone-frame chrome sizes (R6 added `size.phone.*` tokens) |
| `02-components/popover/examples/primary.tsx` | `240px, 320px, 420px` | **F** — popover width fixtures (sm / md / lg) |
| `02-components/presence-indicator/examples/primary.tsx` | hex `#1F1F1F` | **R** — `var(--surface-raised)` |
| `02-components/presence-indicator/examples/primary.tsx` | `10px` | **R** — dot size token |
| `02-components/reaction-bar/examples/primary.tsx` | `10px` | **R** — emoji size token |
| `02-components/skeleton/examples/primary.tsx` | `40px, 24px, 192px, 44px` | **R** — skeleton-block sizes |
| `02-components/snackbar/examples/primary.tsx` | `16px, 280px, 560px` | mixed — `16px` **R**, `280px` + `560px` **F** |
| `02-components/status-bar/examples/primary.tsx` | `11px, 10px` | **R** — status-bar text size |
| `02-components/stepper/examples/primary.tsx` | `44px, 14px, 12px` | **R** — stepper dot + text |
| `02-components/tag/examples/primary.tsx` | `22px` | **R** — tag glyph size token (`size.tag.height`) |
| `02-components/testimonial-card/examples/primary.tsx` | `16px` | **R** — text size token |
| `02-components/trend/examples/primary.tsx` | `11px` | **R** — micro text token |
| `audit-dashboard/components/dashboard-shell.tsx` | `28px` | **R** — `size.control.md` or token |
| `audit-dashboard/primitives/ai.tsx` | hex `#07120D` | **R** — `var(--text-on-action)` (literally the accent-fg) |
| `audit-dashboard/primitives/ai.tsx` | `10px, 480px, 420px, 380px` | mixed — `10px` **R**, three widths **F** |
| `audit-dashboard/primitives/avatar.tsx` | `10px` | **R** — `var(--font-size-2xs)` |
| `audit-dashboard/primitives/charts.tsx` | hex `#00FA8A, #07120D, #ffffff` | **R** — `var(--lumen-accent-4)`, `var(--text-on-action)`, `var(--paper)` |
| `audit-dashboard/primitives/charts.tsx` | `14px, 160px, 10px` | mixed — `14px` **R**, `160px` **F**, `10px` **R** |
| `audit-dashboard/primitives/command-palette.tsx` | `420px` | **F** — palette width fixture |
| `audit-dashboard/primitives/commerce.tsx` | hex `#5a31f4, #ffc439, #003087, #0070ba` | **F** — Shop Pay + PayPal brand colors (3rd-party brand) |
| `audit-dashboard/primitives/commerce.tsx` | `10px, 22px, 21px, 18px` | mixed — `10px` **R**, others **R** (size tokens) |
| `audit-dashboard/primitives/display.tsx` | `10px, 60px, 200px, 320px` | mixed — `10px` + `60px` **R**, `200px` + `320px` **F** |
| `audit-dashboard/primitives/feedback.tsx` | hex `#E6E6E6` | **R** — `var(--paper)` (the canonical light anchor) |
| `audit-dashboard/primitives/feedback.tsx` | `300px, 400px, 640px, 500px` | **F** — empty-state container widths |
| `audit-dashboard/primitives/inputs.tsx` | hex `#171A18, #0D0D0D, #00FA8A, #00D675` | **R + stale-token-fix** — `#171A18` is v0.11 retired obsidian-mint (per ADR 0020 should be `#0D0D0D`); `#00D675` is darker accent stop; `#00FA8A` is accent. Tokenize all 4. |
| `audit-dashboard/primitives/inputs.tsx` | `80px, 260px` | **F** — input width fixtures |
| `audit-dashboard/primitives/mobile.tsx` | `320px, 40px, 112px, 30px` | **R** — phone-frame chrome dimensions (`size.phone.{width,island,statusbar.height}`) |
| `audit-dashboard/primitives/motion-demo.tsx` | `12px` | **R** — text/dot token |
| `audit-dashboard/primitives/nav.tsx` | `32px, 14px, 200px, 10px` | mixed — `32px` + `14px` + `10px` **R**, `200px` **F** |
| `audit-dashboard/primitives/scroll-reveal.tsx` | `12px` | **R** — text token |
| `audit-dashboard/primitives/stat.tsx` | `18px, 10px, 32px, 16px` | **R** — stat-grid sizes |
| `audit-dashboard/primitives/swatch.tsx` | `18px, 10px` | **R** — swatch dimensions |
| `audit-dashboard/primitives/tabs-inline.tsx` | `18px` | **R** — tab badge size |
| `audit-dashboard/primitives/templates.tsx` | hex `#4285f4, #34a853, #fbbc05, #ea4335` | **F** — Google brand colors (3rd-party brand) |
| `audit-dashboard/primitives/templates.tsx` | `480px, 380px, 10px, 440px` | mixed — `10px` **R**, three widths **F** |
| `audit-dashboard/components/tab-nav.tsx` | `32px` | **R** — control-size token |

**Net triage:**
- **Real bugs to tokenize:** ~38 violations across 25 files
- **Intentional fixtures to allowlist:** ~19 violations across 13 files

Both halves of the triage will close by Phase C.4. The lint script gets a new `lumen-lint-allow: primitives` directive convention (matches the existing convention in `lint-no-arbitrary-typography` and `lint-no-off-grid-spacing`).

### 2 `lint:no-arbitrary-typography` violations

Both in `audit-dashboard/src/app/landing/page.tsx:98`:
```tsx
tracking-[var(--tracking-tight)]
```
(twice on the same line.) The fix: replace with semantic typography utility — likely `text-display-xl` or `text-heading-*` already bundles tight tracking.

### 3 `lint:no-off-grid-spacing` violations

- `audit-dashboard/src/components/primitives/commerce.tsx:130` — `py-2.5` (10px)
- `audit-dashboard/src/components/primitives/commerce.tsx:109` — `top-0.5` (2px)
- `audit-dashboard/src/components/primitives/nav.tsx:163` — `gap-0.5` (2px)

All three half-step utilities. The 10px+2px values are non-grid. Either:
- (R) Round to 8px / 4px / 0px per case
- (F) Mark with `// lumen-lint-allow: off-grid` if the half-step is intentional

I'll inspect each in context.

### 45 `lint:token-naming` violations

All camelCase paths to rename to kebab-case across 16 component-token files + 2 semantic files:

| Path | New name | Component-root rename? |
|---|---|---|
| `combobox.trigger.caretColor` | `combobox.trigger.caret-color` | no |
| `combobox.trigger.caretRotation` | `combobox.trigger.caret-rotation` | no |
| `combobox.listbox.maxHeight` | `combobox.listbox.max-height` | no |
| `datePicker` (and 2 descendants) | `date-picker` | **yes — component root** |
| `fileDropzone` (and 7 descendants) | `file-dropzone` | **yes — component root** |
| `input.background.readOnly`, `input.border.readOnly`, `input.foreground.{valueDisabled,valueReadOnly,iconLeading,iconTrailing}`, `input.ring.litEdge` | `read-only` / `value-disabled` / `value-read-only` / `icon-leading` / `icon-trailing` / `lit-edge` | no |
| `numberInput` (+1 descendant) | `number-input` | **yes — component root** |
| `otpInput` (+1 descendant) | `otp-input` | **yes — component root** |
| `passwordInput` (+1 descendant) | `password-input` | **yes — component root** |
| `radio.groupGap` | `radio.group-gap` | no |
| `rangeSlider` (+2 descendants) | `range-slider` | **yes — component root** |
| `segmented.segment.color.inactiveHover` | `inactive-hover` | no |
| `select.trigger.caretColor`, `select.listbox.{minWidth,maxHeight}` | kebab equivalents | no |
| `switch.thumb.{translateOff,translateOn}` | `translate-off` / `translate-on` | no |
| `tagsInput` (+3 descendants) | `tags-input` | **yes — component root** |
| `textarea.{minHeight,maxHeight}` | `min-height` / `max-height` | no |
| `timePicker` | `time-picker` | **yes — component root** |
| `color.surface.input.readOnly` (in BOTH dark + light .tokens.json) | `read-only` | no |

**Downstream impact:** Component contracts (`component.json`) reference these token paths in their `tokens` arrays. Per Hard Rule 4, those must validate. So 16 component.json files need lockstep updates. Plus any example TSX that hardcoded the camelCase var name like `var(--combobox-trigger-caretColor)` — these would fail at runtime today (the actual emitted CSS var is `--combobox-trigger-caret-color`).

After rename: SD's `name/kebab` transform produces the same kebab CSS var output, so no consumer CSS changes (e.g., a contract paragraph that says "renders as `--combobox-trigger-caret-color`" stays accurate).

## Discovery — Pre-commit hook

`COMPONENT-INDEX.md` and `TOKEN-INDEX.md` are auto-generated from the source (`pnpm component-index`, `pnpm token-index`). R6 added them as SSoT docs but left regeneration manual. A pre-commit hook should:

1. Detect any staged `component.json` change → run `pnpm component-index` → restage `COMPONENT-INDEX.md`.
2. Detect any staged `*.tokens.json` change → run `pnpm token-index` → restage `TOKEN-INDEX.md`.

Lightweight options: `simple-git-hooks` (just registers `.git/hooks/pre-commit`, no .husky/ subdirectory) vs `husky` (more features, larger dep tree). Pick `simple-git-hooks` — Lumen prefers minimal devDeps.

## Discovery — Lighthouse R7 baseline

The R6 carry-forward labelled Lighthouse mobile audit as "R7 candidate." `lighthouse@^12.0.0` and `chrome-launcher@^1.0.0` are already in devDeps from prior cycles (probably for the v0.13.x CLS measurement). I'll:

1. `cd audit-dashboard && pnpm build` (production Next.js build)
2. `pnpm start` in background (port 3000)
3. Run mobile-profile Lighthouse on each of 8 routes (foundations, library, saas, landing, tool, commerce, mobile, desktop)
4. Capture LCP / CLS / INP / TBT / SI / Performance score
5. Document in `.audit-runs/2026-05-18-round-7/LIGHTHOUSE.md`
6. Fix any P0 (e.g., LCP > 4s, CLS > 0.25, INP > 500ms)
7. Carry the rest to R8 with explicit handoff

## R7 ship plan

| Phase | Closes |
|---|---|
| A | Discovery + this dossier |
| B.1 | Delete `shadow.accent-glow` self-alias (1 file edit, 4-line removal) |
| B.2 | Pre-resolve source files in `style-dictionary.config.ts` (drop `!` exclusion globs that SD v5 silently ignores) |
| B.3 | Token-naming: 45 camelCase → kebab-case renames across 16 component files + 2 semantic files. Lockstep update of 16 component.json files. Verify `combobox/examples/web-react.tsx` and `input/examples/primary.tsx` for half-kebab var() calls. Delete deprecated `field.*.colorDisabled` aliases. Rename `rangeSlider.trackHeight` → `range-slider.slot.height`. |
| B.4 | Verify `pnpm build` → 0 collisions + 0 reference errors. Verify `pnpm validate:tokens` still passes. |
| C.1 | Lint triage finalized in this dossier ✓ |
| C.2 | ~38 real-bug hardcoded values tokenized to semantic tokens |
| C.3 | ~19 intentional brand fixtures allowlisted via `// lumen-lint-allow: primitives` directive (extend the lint script to honor this directive — matches existing `typography` + `off-grid` conventions) |
| C.4 | Verify `pnpm lint` umbrella → 0 violations across all 7 rules (umbrella now includes `lint:token-naming`) |
| D | `simple-git-hooks` wired; `.simple-git-hooks.json` + `package.json` `simple-git-hooks` block; pre-commit runs `pnpm component-index` + `pnpm token-index` only when relevant staged files match; document in `CONTRIBUTING.md` |
| E | Lighthouse R7 mobile-profile across 8 routes; baseline in `LIGHTHOUSE.md`; any P0 fixed |
| F.1 | ADR 0026: `0026-sd-pipeline-lint-hygiene-pre-commit-v0133.md`. VERSION bump → 0.13.3. `release.mjs` runs the master-doc lockstep (no new patterns needed — R6's release.mjs already covers all sites). Hand-rewrite top callouts in AGENTS.md + CLAUDE.md. Regenerate COMPONENT-INDEX + TOKEN-INDEX. |
| F.2 | Single commit on `main`. AI-Log to vault. Warp Core MOC update. Self-critique. |

## Methodology contribution (R7 → audit-cycle ladder)

Each round of the audit-cycle ladder ramps the tooling along with the surface coverage. R7 adds the **pipeline-state axis** — the producers of consumed artifacts (`pnpm build` for CSS vars, `pnpm lint` for code-side rules, pre-commit hooks for doc-regen reliability).

**R6 rule:** *the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be.*
**R7 extension:** *the pipeline that produces the consumed contract is itself part of the consumed contract.* The validators (`validate:tokens`) check the source declarations; the producers (`build`) check that the source declarations *resolve into the consumed runtime artifact.* A green validator + red producer = consumers reading stale built artifacts. This is the R7 axis.

Future rounds:
- **R8** — Real iOS Safari (chrome-devtools-mcp is headless Chromium, not Webkit). Lighthouse mobile profile catches metrics but not WebKit-specific bugs.
- **R9** — Reduced-motion + high-contrast OS-mode contracts.
- **R10** — Print stylesheet + export / share affordance contracts.
- **R11** — Native build pipelines (Swift / Compose / Flutter) — currently SD emits but no live render check.
- **R12** — Storybook / a11y-tree probe across all 98 primitives at every state (rest / hover / focus / disabled / loading / success / error / empty).
