# R15 Audit Issues — 2026-05-20

Multi-route MCP audit via Edge browser on Personal Mac. Viewport 1440x900 (browser-effective 1501x812).

## R15-001 — Foundations Elevation preamble teaches retired lime-glow contract (P1)

**Where:** `/foundations` Elevation section preamble. Reads: *"Hairline borders do most of the surface separation work. Shadows are multi-layer, reserved for genuine lift — popovers, drawers, modals, toasts. Glow shadows (lime-tinted) carry hero CTAs and live-status."*

**Why it's wrong:** R11 ([ADR 0030](_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md)) retired green from every box-shadow color value system-wide. The `shadow.accent-glow` token now aliases neutral `{shadow.lg}`. The prose still teaches the pre-R11 contract — an LLM reading the live Foundations page would write `box-shadow: ... var(--lumen-lime-aN)` based on this sentence.

**File:** `audit-dashboard/src/app/foundations/page.tsx` (Elevation section preamble).

**Fix:** Rewrite to reflect R11 contract: shadows are neutral, no chromatic tint; the `shadow.accent-glow` alias is preserved for backward compat but now resolves to `shadow.lg`.


## R15-002 — Foundations Voice / Brand-Mood preamble teaches retired "spring-green-glow ambient" (P1)

**Where:** `audit-dashboard/src/app/foundations/page.tsx:821` — description prop reads: *"The three primitives that carry Warp's instrument-panel mood across every surface — Stat, LiveDot, RateTicker. v0.11 keeps these intact; the 8 pt grid + spring-green-glow ambient amplifies them."*

**Why it's wrong:** R11 retired the spring-green-glow ambient from every shadow. The "ambient" referenced here is the pre-R11 box-shadow halo contract that ADR 0030 retired wholesale. Showcase prose still teaches the retired contract — same defect class as R15-001 + R14's foundation-doc sweep, just in TSX instead of .md.

**Fix:** Rewrite to reflect R11 contract.

## R15-003 — `/tool` preset list focus-visible outline uses retired `--lumen-lime-a64` (P1)

**Where:** `audit-dashboard/src/app/tool/presets.client.tsx:48` and `:60` — both buttons declare `focus-visible:outline-[var(--lumen-lime-a64)]`.

**Why it's wrong:** ADR 0030 R11 retuned the global `:focus-visible` color from `var(--lumen-lime-a64)` to `var(--border-frame)` (neutral). The global rule in `globals.css:1417` and CLAUDE.md hard rule 11 both name `--border-frame`. The preset client island missed the sweep.

**Fix:** Replace `outline-[var(--lumen-lime-a64)]` → `outline-[var(--border-frame)]` on both lines.

## R15-004 — Stale "glow ladder" / "lime-tinted" code-comment prose in 6 TSX files (P2)

**Where:**
- `audit-dashboard/src/app/foundations/page.tsx:94, :431` — code comments teaching the retired primary glow ladder + lime-alpha focus ring
- `audit-dashboard/src/app/landing/page.tsx:64` — code comment "the standard primary glow ladder"
- `audit-dashboard/src/components/primitives/templates.tsx:33, :94` — code comments referencing "primary surface fg + bg + glow ladder"
- `audit-dashboard/src/components/primitives/button.tsx:19, :75` — JSDoc + code comment about "glow ladder" being current
- `audit-dashboard/src/components/ui/button.tsx:16` — JSDoc about "glow ladder"

**Why it matters (P2 — LLM-agent context):** None of these strings ship to users; they're internal comments. But an LLM agent reading these comments to understand the system would reconstruct the pre-R11 contract. R14's lint walks .md/.txt — TSX comments slip through.

**Fix:** Add `(retired in R11)` annotations or rewrite to the R11 contract.

## R15-005 — Methodology gap: R14 `lint:docs-no-retired-tokens` doesn't walk `.tsx` (P1 — structural)

**Why:** R14 closed the gap that R11 left in the docs layer (`.md` / `.txt`). But R14's lint scope ends there — `.tsx` files carry rendered prose (showcase descriptions, command-palette items, foundations callouts) that lint cannot see. R15-001 and R15-002 prove this: both are rendered prose in `.tsx`, both teach the retired contract, both passed R14's lint.

**Fix:** Extend `scripts/lint-docs-no-retired-tokens.mjs` to scan `.tsx` / `.ts` files for retired *prose patterns* (not retired token references — TSX legitimately references `--lumen-lime-aN` for BG fills, surface tints, status pills etc., which are R11-EXEMPT). Match phrases like "lime-tinted", "spring-green glow", "spring-green-glow ambient", "primary glow ladder", etc. Honor `lumen-lint-allow` directives. This is the third tier in the docs↔tokens↔TSX-prose three-lint contract.


---

## Fix verification (live re-audit via Claude in Chrome MCP @ Edge browser, Personal Mac)

### R15-001 — Foundations Elevation preamble — VERIFIED FIXED
- Pre-fix: *"Glow shadows (lime-tinted) carry hero CTAs and live-status."*
- Post-fix: *"v0.14 R11 retired chromatic-tinted shadows wholesale: every shadow token now resolves to a neutral cream/ink alpha, and primary CTAs ride their green BG fill — not a halo. See ADR 0030."*
- Renders correctly at /foundations under the "Elevation" h2 (screenshot in `screens-r15/`).

### R15-002 — Foundations Live-data signatures preamble — VERIFIED FIXED
- Pre-fix: *"…the 8 pt grid + spring-green-glow ambient amplifies them."*
- Post-fix: *"…v0.14 R11 retired the spring-green-glow ambient that earlier rounds layered behind these primitives; the 8 pt grid + neutral elevation now do the amplifying, and the green appears only on the LiveDot itself."*
- Renders correctly at /foundations under the "Live-data signatures" h2 (screenshot in `screens-r15/`).

### R15-003 — Tool preset list focus-visible outline color — VERIFIED FIXED
- Pre-fix: `focus-visible:outline-[var(--lumen-lime-a64)]`
- Post-fix: `focus-visible:outline-[var(--border-frame)]`
- Live probe: `getComputedStyle(refrigeratedButton).outlineColor` returns `rgb(154, 154, 154)` (neutral cream gray, ~text-secondary tier) on dark theme. `cssVarBorderFrame` = `#fff6` (40% white alpha). `isNeutral: true`.

### R15-004 — Code-comment annotations — VERIFIED via lint clean
All 7 sites + the dashboard-shell.tsx site caught by my own new TSX-prose lint were annotated with R11 supersession context. `pnpm lint:tsx-no-retired-prose` returns 0 violations across 191 scanned files.

### R15-005 — Methodology: lint:tsx-no-retired-prose ships as 10th lint rule — VERIFIED in `pnpm lint`
The new rule sits in the `pnpm lint` umbrella as rule #10. Initial scan caught 3 violations (R15-001, R15-002, and the dashboard-shell `lime-halo` site that I hadn't noticed in my manual sweep — proof the lint catches what manual review misses). Post-fix: 0 violations.

---

## Final validation matrix (all green)

| Check | Command | Result |
|---|---|---|
| Token validation | `pnpm validate:tokens` | ✓ 956 tokens valid (unchanged from R14) |
| Lint umbrella (10 rules) | `pnpm lint` | ✓ All 10 pass — `lint:no-primitives`, `lint:no-arbitrary-typography`, `lint:no-arbitrary-form-values`, `lint:no-off-grid-spacing`, `lint:no-white-on-accent`, `lint:button-conventions`, `lint:token-naming`, `lint:shadow-no-accent`, `lint:docs-no-retired-tokens`, **`lint:tsx-no-retired-prose` (NEW R15)** |
| TypeScript strict check | `pnpm exec tsc --noEmit` | ✓ PASS (audit-dashboard) |
| Next.js production build | `pnpm build` | ✓ 12 routes prerender clean |
| Playwright test suite | `pnpm exec playwright test` | ✓ 56 / 58 pass (2 skipped on axe-core gate; unchanged from R14) |

