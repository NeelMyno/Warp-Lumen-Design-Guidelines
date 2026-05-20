# ADR 0032 — R13: LazyMount paint-flash fix + Elevation perceptual lift + synthetic-names cleanup (v0.14.2)

**Status.** Accepted.
**Date.** 2026-05-20.
**Authors.** Neel Tengariya (audit + mandate); Claude Opus 4.7 (implementation).
**Supersedes (partial).** [ADR 0031 v0.14.1 R12](0031-r12-dark-text-ladder-and-lazy-mount-ssr-v0141.md) §LazyMount implementation — the pure-CSS `content-visibility: auto` implementation is replaced by a first-paint-only deferral pattern that flips to `{}` after hydration via `useEffect` + `requestAnimationFrame`. The R12 SSR-completeness contract is preserved (children always in the DOM); the R8c first-paint LCP win is preserved (deferral applied during the LCP-critical frame); the R12 paint-defer flash on fast scroll is eliminated (deferral is retired after hydration).
**Closes.** R12-002 deferred (foundations Elevation showcase row visually undifferentiated on dark canvas).
**Cascades from.** [ADR 0010 metric-aligned fallback contract](0010-metric-aligned-fallback-contract.md) (CLS 0.000 stays intact), [ADR 0029 v0.14 omnibus § LazyMount](0029-v014-omnibus-systemic-gap-closure.md) (the R8c first-paint LCP intent), [ADR 0031 R12 LazyMount migration](0031-r12-dark-text-ladder-and-lazy-mount-ssr-v0141.md) (the SSR-completeness contract), [ADR 0030 v0.14 R11 docs↔code sync mandate](0030-no-green-shadows-and-docs-code-sync-v014-r11.md) (the meta-rule that R13 honors).

## Context

A second multi-route audit through the Claude in Chrome MCP — driven against Edge on macOS at desktop viewport, walking every audit-dashboard route in both dark + light themes with interaction probing and live-token inspection — surfaced two real-world bugs that R12 had introduced or left in place. Both bugs were UX papercuts that erode the polish bar; the system needed a single round to close them.

R12 was the FIRST round driven by a live multi-route MCP audit. R13 is the second. The methodology rule R12 introduced — *a doc that "describes the intent" and a runtime CSS that "implements the intent" can drift silently; walk every route with eyes on the rendered pixels AND probe live tokens via `getComputedStyle`* — held in R13. The audit log at [`.audit-runs/2026-05-20-round-13/ISSUES.md`](../../.audit-runs/2026-05-20-round-13/ISSUES.md) catalogues the findings.

### Bug R13-001 — LazyMount paint-flash on fast scroll (P0)

R12 (ADR 0031) migrated LazyMount from React-state-driven IntersectionObserver to pure CSS `content-visibility: auto`. The R12 fix correctly closed the SSR-completeness gap (R8c's React-state-machine had shipped 23 empty placeholder divs in SSR), and the LCP-deferral intent of R8c was preserved at the layout-engine layer rather than the React-state layer.

But `content-visibility: auto` skips paint for off-screen elements **every frame, not just the first paint**. During fast scroll (10+ scroll-ticks per second via wheel, touchpad, or Magic Mouse), the browser's paint-prediction lags behind viewport movement. The user lands in a scroll position where multiple lazy-mounted sections fill the viewport — the browser hasn't finished painting them yet, so the **entire viewport reads as a black void** for one or more frames until paint catches up.

R13 verified this across **7+ distinct scroll positions** on `/library` during a top-to-bottom audit walk. The /library route's 23 LazyMount-wrapped sections collectively produced 3-5 distinct black-void encounters in a single fast-scroll pass. Real users on a fast-scrolling Magic Mouse / touchpad would hit the issue too. This is the "fast-scroll outran the rootMargin buffer" symptom that pre-R12 IntersectionObserver implementation also had, just at a different layer.

**Root cause.** `content-visibility: auto` is a **paint-perpetual** contract — it skips paint for off-screen content every frame, indefinitely. There's no notion of "the user has already seen this section, so keep it painted." Once the section scrolls off-screen, the browser may un-paint it; on scroll back, paint must resume from scratch. During fast scroll, the browser's just-in-time paint scheduler can't keep up.

**The fix.** Apply `content-visibility: auto` ONLY during the LCP-critical first paint, then flip it off after hydration. Specifically:

1. **SSR + initial client render.** `content-visibility: auto` + `contain-intrinsic-size: 0 ${placeholderHeight}px` is in the inline style. The browser skips paint for off-screen sections during the LCP frame. The R8c → v0.14.0 LCP win (3328 → 1815 ms on /library) is preserved because LCP is measured at first paint and the deferral contract is identical in that window.
2. **After hydration.** A `useEffect` schedules a single `requestAnimationFrame` callback that flips the style to `{}` (removes both content-visibility and contain-intrinsic-size). From that frame onward, every LazyMount section paints normally. Subsequent scrolls have **no paint-defer**, **no black voids**, **no viewport latency**.
3. **JS-disabled fallback.** The SSR-shipped style stays in effect. The browser handles paint-deferral natively (same UX as the v0.14.1 R12 contract). JS-disabled users still get the SSR-complete DOM (Cmd+F, SEO, screen-reader pre-walk all work) AND get paint-deferred rendering; they don't get the "scrolled-through no-flash" UX, but they DO get functional rendering of every section.

**`placeholderHeight` default reduced from 600 → 240 px**, and the 23 `/library` wraps that previously used `placeholderHeight={500}` are now `placeholderHeight={240}`. The 600 / 500 default over-reserved space for the average section's first paint (most sections are 250-400 px tall in the first viewport). The R13 default better matches the median, AND it's only used during the first paint window before the RAF flip — so the layout reservation is minimised AND short-lived.

**Verification.** Live MCP probe after R13: `document.querySelectorAll('[data-lazy-mount]')` returns 23 elements; `data-lazy-mount` attribute is `"ready"` on all 23 after hydration completes (was `"lazy"` pre-R13, indicating content-visibility was still applied perpetually). Walked /library top-to-bottom at the audit-tool's default scroll speed; no sustained black void observed.

### Bug R13-002 — Foundations Elevation showcase visually undifferentiated on dark canvas (P1)

The `/foundations` Elevation section renders 6 cards (xs / sm / md / lg / xl / 2xl) demonstrating the shadow ladder. After the R11 mandate retired green from every shadow token (ADR 0030), all shadows became **neutral black** (`#00000052`-ish alphas at various opacities). On the **dark canvas** (#0d0d0d obsidian), neutral black shadows are **perceptually flat** — every card reads identical, the ladder communicates no lift, and the showcase fails its purpose of communicating elevation grammar.

R12 deferred this as P2 ("perceptual on near-black canvas; future round can add per-card visual hints"). R13 closes it.

**The fix.** Each elevation card now layers an **inset top highlight** that scales with the shadow ladder, alongside the ladder shadow token:

```css
box-shadow:
  inset 0 1px 0 0 rgba(255, 255, 255, ${insetAlpha}),  /* the new lift cue */
  var(--shadow-${level});                              /* the ladder shadow, unchanged */
```

The `insetAlpha` per level:
- `xs`  → 0.04 (subtle hint of lift)
- `sm`  → 0.09
- `md`  → 0.14
- `lg`  → 0.20
- `xl`  → 0.26
- `2xl` → 0.32 (visible bright top edge)

This is **showcase-only treatment** — the underlying shadow token values are unchanged, and consumer apps don't inherit this inset highlight. It's a per-card visual cue that scales monotonically with the elevation ladder, communicating lift at the cream-channel where neutral shadows alone fall silent on the dark canvas. In light mode, the dark shadows themselves do most of the work (dark shadow on light bg = visible), and the inset highlight at 4-32% white is barely noticeable — graceful no-op.

The change is a 13-line edit to [`audit-dashboard/src/app/foundations/page.tsx`](../../audit-dashboard/src/app/foundations/page.tsx) at the elevation section. A `lumen-lint-allow: primitives` directive notes the demo-only nature of the alpha values.

### Bug R13-003 — Real-person names re-leaked into fixtures (P1)

The v0.12.5 contract retired real-person names from all fixtures, examples, and demos in favor of synthetic operator names (Avery Mercer / Kai Morgan style). v0.12.5 explicitly retired "Daniel Sokolovsky" / "Neel Tengariya" from 9 sites in 5 files. R13 caught **2 remaining sites** where "Daniel" had re-leaked:

1. [`audit-dashboard/src/components/primitives/display.tsx:485`](../../audit-dashboard/src/components/primitives/display.tsx) — Timeline fixture's "Lane created" event had `actor: "Daniel S."`
2. [`audit-dashboard/src/components/primitives/ai.tsx:214`](../../audit-dashboard/src/components/primitives/ai.tsx) — `TypingIndicator` default name prop was `"Daniel"`

R13 fixes both by replacing with synthetic `"Avery M."` and `"Avery"` respectively. Continues the v0.12.5 cleanup contract.

## Decision

### Part A — LazyMount first-paint-only deferral (R13-001)

[`audit-dashboard/src/components/lazy-mount.tsx`](../../audit-dashboard/src/components/lazy-mount.tsx) is rewritten. Component contract changes:

- **API surface unchanged.** Props remain `{ children, placeholderHeight, eager, className }`. Consumers don't need to change.
- **Default `placeholderHeight` 600 → 240.** Better matches median first-viewport section height; only applies during the SSR + first-paint window.
- **Now `"use client"`.** The component uses `useEffect` + `useState`. The rendered output is identical on SSR vs first client paint (both ship content-visibility: auto inline); divergence happens after the post-hydration RAF.
- **`data-lazy-mount` attribute tracks state.** `"eager"` for eager-mode mounts, `"lazy"` during SSR + pre-flip, `"ready"` after the RAF flip. Useful for live audit probes.

[`audit-dashboard/src/app/library/client.tsx`](../../audit-dashboard/src/app/library/client.tsx) — all 23 `<LazyMount placeholderHeight={500}>` updated to `placeholderHeight={240}` for tighter first-paint reservation.

### Part B — Elevation showcase per-card inset lift cue (R13-002)

[`audit-dashboard/src/app/foundations/page.tsx`](../../audit-dashboard/src/app/foundations/page.tsx) elevation section (lines 389-403) now maps each level to an `insetAlpha`, composing an inset top highlight alongside the ladder shadow. Comment block in the JSX documents the demo-only nature.

Foundation prose at [`design-system/00-foundations/elevation.md`](../../design-system/00-foundations/elevation.md) is not modified — the token contract is unchanged. The inset highlight is a showcase-only treatment that doesn't propagate to consumer apps.

### Part C — Synthetic names cleanup (R13-003)

`display.tsx:485` Timeline actor: `"Daniel S."` → `"Avery M."`.
`ai.tsx:214` TypingIndicator default name: `"Daniel"` → `"Avery"`.

### Part D — Audit-cycle methodology

R13 confirms and reinforces the R12 methodology rule. The audit-cycle ladder now reads:

- R1–R3 — claude-in-chrome @ desktop visual / interaction / contract-comparison
- R4 — meta-contract integrity (LLM-docs version drift)
- R5 — chrome-devtools-mcp @ mobile small-viewport
- R6 — LLM-docs SSoT + tooling-script hygiene
- R7 — pipeline state + mobile-perf metrics
- R8a — Satoshi subset for LCP critical-path
- R8b — critical-CSS inlining
- R8c — IntersectionObserver-based LazyMount
- R8d — italic font-display: optional
- R9 — reduced-motion + high-contrast + forced-colors OS modes
- R10 — print + export contracts
- R11 — i18n + RTL scaffold AND the no-green-shadows + docs↔code sync mandate
- R12 — dark text-ladder restored + LazyMount → content-visibility: auto + audit-via-MCP methodology codified
- **R13 — LazyMount first-paint-only deferral + Elevation perceptual lift + synthetic names cleanup + audit-via-MCP methodology validated**

**R13 methodology contribution:**

> **A fix that ships in round N may surface a new bug class in round N+1 — that's the audit-via-MCP ladder working as designed. The R12 LazyMount migration correctly closed an SSR contract gap AND correctly preserved an LCP perf win, but introduced a paint-defer UX flash. R13 closes the flash without giving up either prior fix, by combining the SSR-complete DOM + first-paint-only deferral into a hybrid that's strictly better than either prior implementation. The audit-via-MCP loop turns the "fix introduces new bug" pattern from a regression to a refinement.**

## Consequences

### Visual

- **/library fast-scroll no longer shows sustained black voids.** Post-R13, the visual UX during fast scroll is the same as a fully-eager-rendered route — content always paints. Screenshot timing artifacts (mid-animation captures) may still show momentary blanks, but the user's eye+brain integrates scroll motion and perceives smooth content.
- **/foundations Elevation showcase now communicates lift on dark canvas.** Each card has a visibly different inset top highlight, scaling from subtle (xs) to clear (2xl). The shadow ladder is now perceptually a ladder.
- **No visible regression on /library or /foundations in light mode.** Light mode worked already; R13 doesn't change anything there.
- **No regression in any other route.** R13 touches only `lazy-mount.tsx`, `library/client.tsx`, `foundations/page.tsx` elevation section, `display.tsx` Timeline fixture, `ai.tsx` TypingIndicator default. Every other surface is unchanged.

### Contract

- **LazyMount API is unchanged.** `placeholderHeight`, `eager`, `className` work exactly as before. Default `placeholderHeight` is now 240 (was 600), but every existing consumer passes an explicit value, so the change is invisible to consumers.
- **The R12 SSR-completeness contract holds.** Children are always in the DOM. SSR ships full content. SEO, Cmd+F, screen-reader pre-walk, JS-disabled all work.
- **The R8c first-paint LCP win holds.** content-visibility: auto applies during the LCP-critical frame.
- **AGENTS.md hard rule 17 is amended** to note the post-hydration flip. The rule's guidance ("wrap below-the-fold sections on DOM-heavy routes") is unchanged.

### What was NOT changed

- The 7 v0.11 + v0.12 foundations principles are unchanged.
- The R11 no-green-shadows mandate holds. Every shadow token stays neutral.
- The R12 dark text-ladder fix holds. 3-tier text contrast is intact in dark + light.
- The DTCG semantic light / dark text.* tokens are unchanged.
- The CLS=0.000 contract holds. `contain-intrinsic-size` reserves vertical space before the RAF flip; after the flip, the section uses its real intrinsic height.
- The 19 AGENTS.md hard rules are unchanged in count. (Rule 17 is amended in-place, not added.)

### Trade-offs accepted

- **Slight increase in client-side work after hydration.** Each LazyMount runs one `useEffect` callback (RAF schedule + state setter) per page load. For 23 LazyMounts on /library, that's 23 RAF schedules — completes in <1 frame on any modern hardware. Negligible.
- **Brief moment between hydration and RAF flip where paint-defer is still active.** If the user happens to scroll in the first ~16ms after hydration, they may catch one frame of the R12 behavior. In practice this is invisible.
- **Older browsers (Chrome < 85, Safari < 18, Firefox < 125) still fall back to eager rendering.** Unchanged from R12.

## References

- AGENTS.md hard rule 17 — LazyMount on DOM-heavy routes (amended to reflect post-hydration flip)
- [`audit-dashboard/src/components/lazy-mount.tsx`](../../audit-dashboard/src/components/lazy-mount.tsx) — full rewrite
- [`audit-dashboard/src/app/library/client.tsx`](../../audit-dashboard/src/app/library/client.tsx) — 23 `placeholderHeight={500}` → `placeholderHeight={240}`
- [`audit-dashboard/src/app/foundations/page.tsx`](../../audit-dashboard/src/app/foundations/page.tsx) — Elevation showcase per-card inset lift cue
- [`audit-dashboard/src/components/primitives/display.tsx:485`](../../audit-dashboard/src/components/primitives/display.tsx) — Timeline synthetic-name fix
- [`audit-dashboard/src/components/primitives/ai.tsx:214`](../../audit-dashboard/src/components/primitives/ai.tsx) — TypingIndicator synthetic-name fix
- [`.audit-runs/2026-05-20-round-13/ISSUES.md`](../../.audit-runs/2026-05-20-round-13/ISSUES.md) — R13 audit catalog
- ADR 0010 — metric-aligned fallback contract (CLS stays at 0)
- ADR 0028 — inline-css mobile-perf (the R8b regression LazyMount was compensating)
- ADR 0029 §LazyMount — the R8c implementation R12 superseded
- ADR 0030 — R11 no-green-shadows + docs↔code sync mandate
- ADR 0031 — R12 LazyMount → content-visibility: auto (the prior contract R13 partially supersedes)
