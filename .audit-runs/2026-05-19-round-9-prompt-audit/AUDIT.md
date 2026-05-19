# Lumen v0.14.0 — Round 9 prompt audit

**Date.** 2026-05-19  
**Auditor.** Claude (Opus 4.7, 1M context)  
**Tooling axes.** Playwright (chromium + Pixel 7) for screenshot + DOM probes; `pnpm validate` (DTCG + WCAG contrast); `pnpm lint` (7 rules); `pnpm exec tsc --noEmit`; `pnpm build` (Next.js 16 Turbopack); the existing `tests/smoke.spec.ts` + `tests/a11y.spec.ts` Playwright suites; one ad-hoc `tests/round-9-walk.spec.ts` capturing 8 routes × 2 themes × 4 viewports = 64 screenshots.  
**Mode.** Prompt-driven audit. The system was already at v0.14.0 with 29 ADRs and 7 prior audit rounds (R1–R8b + v0.14 omnibus). This round is layered on top of that work, not in place of it.

## Pipeline state at audit start

| Validator | Status | Notes |
|---|---|---|
| `pnpm validate:tokens` | ✓ 0 errors, 0 warnings | DTCG aliases all resolve; ADR-0026 fixes hold |
| `pnpm validate:components` | ✓ 98/98 valid | All `component.json` conform to schema |
| `pnpm validate:contrast` | ✓ all pairs pass | 16 documented pairs check WCAG AA |
| `pnpm lint` (7 rules) | ✓ 0 violations | no primitives, no arbitrary typography, no arbitrary form values, no off-grid spacing, no white-on-accent, button conventions, token-naming kebab |
| `pnpm exec tsc --noEmit` (audit-dashboard) | ✓ no errors | TypeScript strict, no `any` |
| `pnpm build` (audit-dashboard) | ✓ 12/12 routes prerendered | Next.js 16.2.4 Turbopack, `experimental.inlineCss: true` per ADR 0028 |
| `pnpm exec playwright test` (smoke + a11y, 36 tests) | ✓ 36 passed, 2 skipped | skipped tests gated on `@axe-core/playwright` install |

**Conclusion.** Producer-side pipeline (R7) is green. Consumer-side metrics (R8a/R8b/R8c) hold. The system is in a healthy steady state. The findings below are CONSUMER-LAYER residuals — visible UI defects that the existing axes don't catch.

## Methodology — what each axis covered

- **Browser walk.** 64 screenshots across 8 routes (foundations, library, saas, landing, tool, commerce, mobile, desktop) × 2 themes (dark, light) × 4 viewports (320, 375, 1280, 1920 px). All passing.
- **Probe — interactive accessible names.** Selector `button, [role="button"], [role="switch"], [role="tab"], [role="menuitem"], a[href]:not([href=""])`; computed `aria-label` / `aria-labelledby` / `title` / inner text / `<img alt>`. **0 nameless interactive elements** across all 64 walks (R5/R6 a11y cascade holds).
- **Probe — heading order.** Captures h1..h6 sequence per route; flags any level-skip > 1. **0 heading order jumps** across all routes.
- **Probe — h1 presence.** Every route has exactly one h1. ✓
- **Probe — DOM node count.** Foundations 1737 (R8c LazyMount eligible), Library 684 (post-LazyMount), SaaS 679, Landing 587, Tool 426, Commerce 493, Mobile 373, Desktop 379. **/foundations is now the heaviest route** — flagged as R10 candidate.
- **Probe — layout viewport.** All 8 routes report `innerWidth = 320` at 320 px device viewport. ADR 0024's `html, body { overflow-x: clip }` contract holds end-to-end.
- **Probe — console errors.** `tests/console-clean.spec.ts` — 8 routes × theme-toggle × ⌘K palette open + close. **0 console errors, 0 page errors** across all paths. The runtime is clean.
- **Probe — touch-target compliance @ mobile 320 px.** Selector as above; flag any interactive bounding box with width OR height < 44 px (WCAG 2.5.5 AAA). **Significant findings — see below.**

---

## Findings

| # | Area | Severity | Issue | Evidence | Recommended fix |
|---|---|---|---|---|---|
| 1 | **Responsive** | **CRITICAL** | `/saas` dashboard does not collapse its sidebar at mobile widths. The fixed `grid-cols-[240px_1fr]` makes the content area 79 px wide at 320 px viewport — KPIs, TopBar, ShipmentsTable, ActivityFeed are all clipped off-screen. Operator-pattern is the showpiece for the system; at mobile it shows only the sidebar. | `dark-mobile-320-saas.png` and `dark-mobile-375-saas.png` — sidebar fills viewport; content edge visible only as a 1 px sliver | `audit-dashboard/src/app/saas/page.tsx:30` — swap `grid-cols-[240px_1fr]` for a responsive ladder. At < md (768 px): stack — Sidebar collapses to a header drawer trigger, the dashboard main column takes full width. At ≥ md: 240px sidebar grid. Reuse existing `Sheet` primitive for the drawer overlay. |
| 2 | **Visualization / dashboard** | High | `/saas` KPI row labels (eyebrow "SHIPMENTS TODAY", etc.) use `.lumen-eyebrow` which resolves to `text-tertiary` at 11 px. In dark mode on `surface-raised` the contrast is 6.91:1 (passes 4.5). In light mode the same eyebrow against `surface-raised` is 7.49:1. Both pass. **However** at < 11 px on a busy KPI row the labels are still hard to scan at a glance vs. the giant 39 px values. | `light-desktop-1280-saas.png` — value-to-label hierarchy reads as "value first; labels are decorative" rather than as "labels orient, values answer" | Bump KPI-row labels from `.lumen-eyebrow` (11 px, tertiary) to `text-label-sm` (13 px, secondary). Apple HIG conventions for instrument-panel KPI cards (Stripe Dashboard, Linear Insights, Vercel Analytics) all use 12–13 px labels in `secondary` not `tertiary`. |
| 3 | **Responsive / library** | Medium | `/library` hero meta pill `v0.14.0 · 25 sections · 250+ components` exceeds viewport width at 320 px — last "compo" is clipped (no overflow handling on the badge inside the hero meta row). | `dark-mobile-320-library.png` | The meta-pill content can collapse — at < sm: drop "25 sections · 250+ components" and keep just `v0.14.0`. Use `<span className="hidden sm:inline">` to gate the long form. |
| 4 | **A11y / WCAG 2.5.5 AAA** | Medium | At mobile 320 px, **74 interactive elements on `/foundations`** have width OR height < 44 px (AAA target-size minimum). The largest cohort is `<SwatchRamp>` ramp tiles — 27×64 px buttons. They pass AA (24×24) but fail AAA. At 320 px on a phone, a 27 px wide tap target is hard to hit precisely. | `tt-deep.json` → /foundations bucket main:74, header:10, footer:1 | Two paths: (a) Lift swatch ramp tiles to `min-h-[44px] min-w-[44px]` at < md via `md:h-16 md:w-7` etc. Treat the ramp as a slider-at-large-scale on mobile. (b) The repo could declare this AAA gap explicitly: most regulatory contexts only require AA (24px), and the ramp is a specimen surface. Document the choice in `design-system/00-foundations/accessibility.md`. The right answer is probably (a) for ramp tiles — they're real action targets — and explicit (b) for color anchor squares (27×27 in hero row) which are passive specimens. |
| 5 | **A11y / responsive** | Medium | The Lumen mark + version chip in the header is `73×21` px at mobile 320 px — 21 px tall is below WCAG AA 24×24 minimum target size. It's also the primary brand-link to /foundations. | `tt-deep.json` first sample on every route — `a 73x21 "Lumenv0.14.0"` | `audit-dashboard/src/components/dashboard-shell.tsx:48-50` — bump the `<Link>` to `min-h-[36px]` (AA-compliant + visually matches the theme-toggle's 36 px control-cozy size). The link visually appears taller because of the LumenMark + text-heading-h5 baseline, but the tap-target box is short. Use `inline-flex items-center h-control-cozy` to enforce. |
| 6 | **Content** | Low | The Lumen mark + version chip renders as `Lumenv0.14.0` (no space) when read by the accessible-name composer because the chip sits inside the same `<Link>` and the `<span>` separator (the live-dot wrapper) has no whitespace. Screen readers will announce "Lumenv0.14.0 link" rather than "Lumen, v0.14.0 link". | Same probe sample as #5 | In the `<Link>` between `<span>Lumen</span>` and the version chip, inject `<span className="sr-only"> · </span>` so the accessible name reads naturally. Or set `aria-label="Lumen v0.14.0"` on the Link directly. |
| 7 | **Responsive** | Low | At mobile 320 px on `/mobile`, the eyebrow caption "Satoshi mapped to Apple Dynamic Type · 8pt grid · area padding · navigation back arrow + large title." reads to the right edge with no margin; the last "title." sits on the viewport edge. | `dark-mobile-320-mobile.png` | `audit-dashboard/src/app/mobile/page.tsx` — the eyebrow row needs a `pr-2 sm:pr-0` or wrap into a `max-w-[90vw]`. |
| 8 | **Responsive / commerce** | Medium | `/commerce` PDP "Cart" pill in the storefront header is clipped at mobile 320 px (text "Cart · 2" cut off). The storefront frame uses fixed-width nav buttons that don't collapse. | `dark-mobile-320-commerce.png` | `audit-dashboard/src/components/primitives/commerce.tsx` storefront chrome — collapse to icon-only at < sm; ensure `min-w-0` on flex children of the storefront top bar. |
| 9 | **A11y / tap targets** | Medium | The theme toggle (`button[aria-label="Switch to light theme"]`) is `36×36` px on every viewport. Passes AA (24×24); fails AAA (44×44). Acceptable for a desktop-first dashboard, but worth promoting to 44 px on mobile since it's a primary chrome control. | `tt-deep.json` first three header samples | Bump theme-toggle + mood-switcher to `h-control-comfortable` (44 px) at < sm. They already have generous padding so visual weight stays similar. |
| 10 | **LLM-docs** | High | `audit-dashboard/AGENTS.md` only says "This is NOT the Next.js you know — read node_modules/next/dist/docs/" — too terse to be useful to a fresh agent. The root `AGENTS.md` is excellent. But the audit-dashboard subdir lacks any reference to: (a) the prod-build-then-start workflow for Playwright tests; (b) the Storybook scaffold (`.storybook/main.ts` + `preview.tsx`); (c) the test directory layout; (d) the `inlineCss` flag. | `audit-dashboard/AGENTS.md` is 327 bytes, mostly a warning. | Expand `audit-dashboard/AGENTS.md` to a proper agent onboarding: (i) how to dev/build/start/test, (ii) where the routes live, (iii) what NOT to do (`pnpm dev` during heavy edits per the OOM warning), (iv) the prod-build prerequisites for Playwright tests, (v) reference to ROUTES.md for per-route detail. |
| 11 | **LLM-docs** | Medium | The new R8c `<LazyMount>` primitive at `audit-dashboard/src/components/lazy-mount.tsx` has no companion entry in `COMPONENT-INDEX.md` or `TOKEN-INDEX.md` (it's an audit-dashboard-only primitive, not a design-system component, so this is intentional). But agents reading the dashboard code won't find documentation explaining WHEN to wrap something in `<LazyMount>` (DOM weight heuristic, placeholder-height contract, SSR-safe pre-walk). The AGENTS.md hard rule 17 mentions it but doesn't have a code-level reference. | Top of `lazy-mount.tsx` carries some JSDoc but no formal contract doc. | Add a brief `audit-dashboard/src/components/lazy-mount.md` (or extend the JSDoc to include: heuristic for when to use, placeholder-height contract, SSR semantics, examples of where to wrap and where to keep eager). |
| 12 | **LLM-docs** | Low | `audit-dashboard/README.md` is excellent for humans but doesn't surface the Playwright test paths (`pnpm exec playwright test`) or the prerequisite (server must be running on port 3000 or PLAYWRIGHT_BASE_URL set). A fresh agent doesn't know how to run the tests without reading the playwright.config.ts header. | `audit-dashboard/README.md` | Add a "Tests" section to the README documenting smoke + a11y + how to run them, and the prerequisite of a running server. |
| 13 | **State coverage** | Low | The Stat primitive supports `polarity` (good-up / good-down / neutral) and renders trend pills correctly, but there's no documented STALE state (i.e., the data is older than acceptable). Operator dashboards conventionally show a "as of N min ago" stamp when freshness slips; Lumen doesn't have a recognized state for "stale-but-not-error". | `design-system/00-foundations/state-matrix.md` doesn't enumerate "stale" | Add `stale` to the 13 canonical states (becoming 14). Define it as: data is older than its freshness budget but not erroring. Visual: a small grey clock icon at the top-right corner, optional tooltip with the freshness timestamp. |
| 14 | **Documentation — content** | Low | The `/saas` page's title "SaaS Dashboard" is decent but the description "Navigation, KPI grid, live table, side panel. The operator-portal pattern — dense, scannable, instrument-panel." is implementation-flavored, not user-flavored. A user landing on this page wonders "what is the dashboard for?" not "what primitives is it composed of?". | `audit-dashboard/src/app/saas/page.tsx:25` | Rewrite the description to lead with the use case: "Operations command center for shipment tracking — KPIs, live shipment queue, lane performance, and the activity feed. The operator-portal pattern: dense, scannable, instrument-panel." (Same primitives still named at the end; lead with purpose.) Apply same lens to landing/tool/commerce/mobile/desktop descriptions. |
| 15 | **Build / DX** | Low | The Storybook scaffold ships `.storybook/main.ts` + `preview.tsx` + one `button.stories.tsx`, but no `package.json` script wires it up. A contributor or agent looking to view stories has to invoke `pnpm exec storybook dev -p 6006` raw. | `audit-dashboard/package.json` | Add `"storybook": "storybook dev -p 6006"` + `"storybook:build": "storybook build"` scripts. Or document the raw invocation in README. Or — if Storybook is genuinely scaffold-only and not actively maintained — document its status as "scaffold, not maintained" so agents don't waste effort there. |
| 16 | **Build / DX** | Low | The Playwright config defaults `baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000"`, which means tests will fail with no clear error if no server is running. There's no `webServer` block to auto-start the server. | `audit-dashboard/playwright.config.ts` | Add a `webServer: { command: "pnpm start", url: "http://localhost:3000", reuseExistingServer: !process.env.CI, timeout: 60_000 }` so `pnpm exec playwright test` works against a fresh checkout without needing to know about the prereq. |

---

## What the audit confirmed was NOT a bug (and why I'm calling it out)

- **/foundations brutalist frame at mobile 320 px** — "Foundations." period kisses the right edge of the frame. This IS the brutalist visual statement per CLAUDE.md's banner: "display-2xl ceiling at 128 px is *big enough to crop* — that IS the visual statement." Confirmed intentional.
- **/foundations color anchor squares (27×27 px)** — passive specimens, not interactive tap targets. The buttons-as-color-tiles in `<SwatchRamp>` are different (those ARE interactive and ARE flagged in #4).
- **/desktop and /mobile native-frame mockups at mobile** — the device-frame mockups stack at smaller widths but the inner UI is intentionally horizontal-scrollable. Confirmed by walking dark-mobile-320-desktop.png and dark-mobile-320-mobile.png.
- **/commerce PDP "Buy" panel state** — the v0.12.8 client-island fix holds; size + color pickers work via `useState`. Verified via the smoke + walk; no regression.
- **/saas KPI panel "dark in light mode" — previously suspected** — initial walk artifact (race between init-script setting `data-theme="light"` and ThemeToggle's useEffect resetting to default because of wrong localStorage key). Re-run with the correct `lumen-theme` key confirms the KPI card renders cleanly in both themes. Probe `saas-kpi-probe.json` confirms `card.bg = rgb(255,255,255)`, `value.color = rgb(20,20,20)` in light mode. Not a bug.

---

## Severity counts

- **CRITICAL** — 1 (#1: /saas sidebar at mobile)
- **High** — 2 (#2 KPI label weight, #10 audit-dashboard AGENTS.md)
- **Medium** — 6 (#3 library hero clip, #4 swatch ramp AAA, #5 LumenMark tap target, #8 commerce Cart clip, #9 theme toggle AAA, #11 LazyMount doc)
- **Low** — 7 (#6 LumenMark accessible name, #7 mobile eyebrow clip, #12 README tests section, #13 stale state, #14 page descriptions, #15 Storybook scripts, #16 Playwright webServer)

---

## Implementation plan (phased)

### Phase A — Quick safe fixes (low risk, immediate visible wins)
- **A1.** Library hero meta pill — gate long-form behind `hidden sm:inline` (issue #3).
- **A2.** Mobile eyebrow padding — `pr-2 sm:pr-0` (issue #7).
- **A3.** LumenMark accessible name — add `<span className="sr-only"> · </span>` separator (issue #6).
- **A4.** LumenMark tap-target size — enforce `min-h-[36px]` (issue #5).
- **A5.** Theme toggle + mood-switcher tap-target — promote to `h-control-comfortable` 44 px at < sm (issue #9).

### Phase B — Structural UI fixes (the critical responsive)
- **B1.** `/saas` sidebar collapses at mobile (issue #1). Use a `<Sheet>` drawer trigger at < md; full grid at ≥ md.
- **B2.** `/commerce` PDP storefront header — collapse Cart pill to icon-only at < sm (issue #8).
- **B3.** `/saas` KPI label weight — promote eyebrow → `text-label-sm secondary` (issue #2).

### Phase C — A11y / target size
- **C1.** Lift swatch ramp tiles to AA target-size at mobile (issue #4).

### Phase D — Documentation / LLM-readability
- **D1.** Expand `audit-dashboard/AGENTS.md` to proper agent onboarding (issue #10).
- **D2.** Add JSDoc-level usage guide to `lazy-mount.tsx` documenting the heuristic (issue #11).
- **D3.** Add "Tests" section to `audit-dashboard/README.md` (issue #12).
- **D4.** Rewrite route descriptions to lead with purpose (issue #14).
- **D5.** Add `state-matrix.md` "stale" state entry (issue #13).

### Phase E — DX / build
- **E1.** Add Storybook scripts to `package.json` (issue #15).
- **E2.** Add Playwright `webServer` config (issue #16).

### Phase F — Validation
- **F1.** Re-run `pnpm validate`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`.
- **F2.** Re-run smoke + a11y + round-9 walks.
- **F3.** Re-take screenshots for the 5 routes whose visuals changed (`/saas`, `/library`, `/commerce`, `/foundations`, `/mobile`).
- **F4.** Confirm `pnpm dev` is killed before committing (per the AGENTS.md OOM warning).

## Methodology contribution to the audit-cycle ladder

R1 (visual chrome @ desktop) → R2 (interaction @ desktop) → R3 (contract-comparison @ desktop) → R4 (meta-contract integrity) → R5 (small-viewport metrics @ mobile) → R6 (LLM-docs SSoT + tooling-script hygiene) → R7 (pipeline state + lint umbrella + mobile-perf Lighthouse) → R8a (Satoshi subset) → R8b (critical-CSS inlining) → R8c/d/v0.14 omnibus (LazyMount + OS modes + print + i18n + cross-platform + MCP) → **R9 prompt audit (responsive bugs in operator-pattern routes + tap-target gaps + LLM-docs holes the prior rounds missed)**.

R8a/R8b/R8c moved metric byte budgets; R6/R7 moved producer-side validators. R9 found that:

1. **Mobile responsive coverage is uneven across routes.** /foundations, /library, /landing, /tool, /commerce, /mobile, /desktop all handle 320 px gracefully (different content shapes, different graceful-degradation strategies). **/saas does not.** The operator-portal pattern was authored desktop-first and has no `< md` branch. ADR 0024's `overflow-x: clip` keeps the page from horizontal-scrolling, but the FIXED 240 px sidebar still dominates.
2. **Tap-target compliance is uniform at AA but uneven at AAA.** Most controls hit 36 px (AA-pass, AAA-fail). The Lumen mark link is the only chrome control under AA at mobile.
3. **The audit-dashboard's AGENTS.md is a stub.** Hard to onboard a fresh agent.

R9's methodology rule: ***the audit cycle must check small-viewport behavior of EVERY peak surface, not just the surface-level routes.*** R5 closed the cross-route at-mobile behavior (overflow-x: clip + sm:/md: token contract); R9 is finding that one of the eight peak surfaces wasn't authored with a mobile branch in the first place, so the layout-viewport fix at R5 protected against horizontal overflow but couldn't protect against "the content is just plain off-screen."
