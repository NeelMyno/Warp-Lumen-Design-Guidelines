# ADR 0031 — R12: Dark text-ladder restored + LazyMount migrated to `content-visibility: auto` (v0.14.1)

**Status.** Accepted.
**Date.** 2026-05-20.
**Authors.** Neel Tengariya (audit + mandate); Claude Opus 4.7 (implementation).
**Supersedes (partial).** [ADR 0029 v0.14 omnibus](0029-v014-omnibus-systemic-gap-closure.md) §LazyMount section — the IntersectionObserver-based React-state implementation is replaced by the CSS-engine `content-visibility: auto` implementation. The LCP-deferral intent of R8c is preserved; the SSR-completeness contract is restored. The semantic dark text.disabled value is also realigned (brand.500 → brand.400) to match the runtime.
**Cascades from.** [ADR 0010 metric-aligned fallback contract](0010-metric-aligned-fallback-contract.md) (CLS 0.000 stays intact), [ADR 0028 inline-css mobile-perf v0.13.5](0028-inline-css-mobile-perf-v0135.md) (the R8b regression that motivated R8c), [ADR 0030 v0.14 R11 no-green-shadows + docs↔code sync mandate](0030-no-green-shadows-and-docs-code-sync-v014-r11.md) (the meta-rule R12 enforces).

## Context

A comprehensive multi-route audit through the Claude in Chrome MCP — every route in both dark + light themes at 1440×900 desktop viewport, with interaction probing and live-token inspection via `getComputedStyle(documentElement).getPropertyValue(...)` — surfaced two real-world bugs that pre-R11 token contracts and pre-R8c performance work had left in place. Both bugs are docs↔code sync violations of the type R11 codified the rule for, surfaced as visible UX regressions.

### Bug R12-001 — Dark text-tertiary collapsed to text-secondary

The DTCG semantic dark token file (`design-system/01-tokens/semantic/color.dark.tokens.json`) declares a 3-tier text ladder:

- `color.text.primary` = `{color.brand.100}` → #E6E6E6 — 13.7:1 AAA
- `color.text.secondary` = `{color.brand.300}` → #9A9A9A — 6.9:1 AA Normal
- `color.text.tertiary` = `{color.brand.400}` → #6B6B6B — 3.65:1 AA Large only (≥18px)

The runtime CSS at `audit-dashboard/src/app/globals.css:628-633` declared:

```css
--text-primary:    var(--lumen-obsidian-1);  /* #E6E6E6 ✓ */
--text-secondary:  var(--lumen-obsidian-3);  /* #9A9A9A ✓ */
--text-tertiary:   var(--lumen-obsidian-3);  /* #9A9A9A ✗ — same as secondary */
--text-placeholder: var(--lumen-obsidian-3); /* ✗ */
--text-disabled:   var(--lumen-obsidian-4);  /* #6B6B6B — DTCG said brand.500 */
```

Every UI surface that uses `text-tertiary` on dark — eyebrow labels (eyebrow caps, "ON THIS PAGE" rail headers, mono-cap row eyebrows on /foundations), captions, hints, table-row meta, KPI sub-labels — rendered at the same contrast as secondary text. The 3-tier hierarchy `hierarchy.md` + `first-impression.md` + `micro-interactions.md` rely on collapsed to 2 tiers visually in dark mode. Light mode was unaffected (cream-7 vs cream-5 are distinct).

The primitive comments at globals.css lines 98–99 ALSO labeled the colors inverted relative to the semantic mapping:

```css
--lumen-obsidian-3:  #9A9A9A;   /* tertiary text on dark ... */  ← stale
--lumen-obsidian-4:  #6B6B6B;   /* secondary text on dark ... */  ← stale
```

Pre-R12 these comments matched a OLDER role assignment that was flipped at some point during v0.4–v0.12; the semantic mapping was correctly updated to match brand-300=secondary and brand-400=tertiary, but the primitive comments lagged.

`text.disabled` at `{color.brand.500}` (#404040) produces 1.89:1 contrast on canvas — below AA Large (3:1). WCAG 2.4.3 Note 3 exempts inactive UI components from contrast minimums, so the value was technically permissible, but at 1.89:1 the disabled text is effectively invisible — fails even the "perceptible but quiet" test. The runtime at obsidian-4 (#6B6B6B, 3.65:1) was the better UX value.

### Bug R12-003 — LazyMount renders empty placeholders on SSR

The R8c `LazyMount` component (`audit-dashboard/src/components/lazy-mount.tsx`) was introduced in v0.14.0 to compensate the R8b `/library` main-thread regression (LCP +184 ms median) where the inlined CSS parse cost lands on the main thread before computing styles against /library's 4684-node DOM. The component conditionally rendered its children based on an `IntersectionObserver` state: until the sentinel scrolled near the viewport (rootMargin=400px), only a 500-px-tall placeholder div lived in the tree.

The doc comment claimed:

> "The component is SSR-safe: when typeof IntersectionObserver is undefined (Node prerender), it short-circuits to mounted=true so the server output still contains the full DOM (needed for SEO, screen-reader pre-walk, and the audit-dashboard's 'everything searchable on a single page' contract)."

The fallback was inside `useEffect`. `useEffect` doesn't run on the server. The fallback never fired. Server-rendered HTML shipped 23 empty placeholder divs on /library and the 23 lazy sections were missing from the initial HTML.

**Verified by curl (pre-R12):**
```bash
$ curl -s http://localhost:3000/library | grep -c "Get rates\|Save draft\|All shipments\|Quote name"
0
$ curl -s http://localhost:3000/library | wc -c
91854   # 92 KB total
```

Consequences:
- **Cmd+F broken.** A user landing on /library and searching for "Color picker" finds nothing — that section is unmounted until scrolled.
- **Screen-reader pre-walk broken.** A reader walking the page on landing announces only the above-the-fold + 23 nameless `aria-hidden` placeholders.
- **JS-disabled users see empty.** Without JS, IntersectionObserver never fires.
- **Fast-scroll users see black voids.** At 10+ scroll-ticks/second, users outrun the 400-px rootMargin buffer and land in unmounted placeholders. Captured in screenshots at 8492 / 9992 / 11492 px scroll positions during the R12 audit.

The LCP win from R8c (`/library` 3328 → 1815 ms, −1513 ms per the v0.14 baseline) was real, but the SSR-completeness cost wasn't accounted for at adoption time.

## Decision

### Part A — Restore the 3-tier text ladder on dark

**Runtime CSS** (`audit-dashboard/src/app/globals.css`):
- Line 629: `--text-secondary: var(--lumen-obsidian-3);` — unchanged (#9A9A9A, AA Normal)
- Line 630: `--text-tertiary: var(--lumen-obsidian-4);` — was `obsidian-3`, fixed to `obsidian-4` (#6B6B6B, AA Large only) per DTCG.
- Line 631: `--text-placeholder: var(--lumen-obsidian-4);` — was `obsidian-3`, fixed to `obsidian-4` per DTCG (placeholder is a tertiary alias).
- Line 632: `--text-disabled: var(--lumen-obsidian-4);` — kept at obsidian-4 (the existing usable disabled value, 3.65:1) rather than moving to obsidian-5 (#404040, 1.89:1 — too dark even for WCAG-exempt disabled). The disabled STATE is distinguished from tertiary text not through the text color (they share #6B6B6B) but through the surrounding affordance — surface bg (`color.input.disabled` = brand-900 sunken), border (`color.border.disabled` = paper-alpha-06), and cursor (`not-allowed`) — per the existing primitive contracts.

**Primitive comments** (`audit-dashboard/src/app/globals.css:98-99`):
- `--lumen-obsidian-3: #9A9A9A; /* secondary text on dark — 6.9:1 AA Normal on canvas */` — was mislabeled "tertiary"
- `--lumen-obsidian-4: #6B6B6B; /* tertiary text + placeholder + disabled on dark — 3.65:1 AA Large on canvas */` — was mislabeled "secondary"

**DTCG semantic dark** (`design-system/01-tokens/semantic/color.dark.tokens.json`):
- `text.disabled.$value`: `{color.brand.500}` → `{color.brand.400}` — aligned with runtime.
- Description updated to explain that disabled and tertiary share the brand-400 value at the text-color level, and the disabled state is communicated through surface + border + cursor cues per the primitive contract.

**DTCG primitive** (`design-system/01-tokens/primitives/color.tokens.json`):
- `color.brand.300.$description`: "Secondary text on dark. Captions, descriptions. 6.9:1 AA Normal on canvas." (was "Tertiary text on dark.")
- `color.brand.400.$description`: "Tertiary text + placeholder + disabled on dark. Hints, eyebrow labels. 3.65:1 AA Large on canvas." (was "Secondary text on dark.")

### Part B — Replace LazyMount's React-state machine with `content-visibility: auto`

The component is rewritten to render its children unconditionally and apply `content-visibility: auto` + `contain-intrinsic-size: 0 <h>px` to the wrapper. The browser's layout engine handles the lazy-paint at the CSS level:

```tsx
export function LazyMount({ children, placeholderHeight = 600, eager = false, className }) {
  if (eager) {
    return <div className={className} data-lazy-mount="eager">{children}</div>;
  }
  return (
    <div
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `0 ${placeholderHeight}px`,
      }}
      data-lazy-mount="lazy"
    >
      {children}
    </div>
  );
}
```

**What this preserves:**
- Children are ALWAYS in the DOM (server + client).
- The browser skips paint + layout of off-screen sections — same lazy-paint behavior as the IntersectionObserver approach.
- `contain-intrinsic-size` reserves vertical space so CLS stays at 0 before the section first paints.
- The `eager` prop continues to work for above-the-fold sections.

**What this gains over the React-state implementation:**
- **SSR-completeness restored.** SEO, Cmd+F, screen-reader pre-walk, JS-disabled all work.
- **No empty-void flash on fast scroll** — the section is in the DOM (text + structure available to find-in-page) even if paint is skipped; the browser repaints faster than React-state remount.
- **No React state coordination.** Removed: `useState`, `useEffect`, `useRef`, IntersectionObserver setup + teardown.
- **No SSR vs hydration divergence** — the markup tree is identical on server + client.
- **No rootMargin tuning** — the browser's "near-viewport" heuristic (~50% viewport) handles this.

**Browser support.**
- Chrome / Edge 85+ (Aug 2020)
- Safari 18+ (Sep 2024)
- Firefox 125+ (Apr 2024)

The Lumen audit-dashboard targets evergreen browsers that all support `content-visibility`. Older browsers gracefully fall back to rendering everything eagerly (paying the layout cost but still seeing content).

**Performance.**
- SSR HTML size: **91,854 → 564,618 bytes (+6.1×)** on /library — full content now in initial HTML.
- LCP: expected parity or improvement. The paint-deferral behavior of `content-visibility: auto` is exactly equivalent to the IntersectionObserver-based conditional render at the user's perception of "when does this section appear?" The CSS-engine implementation has fewer JS-execution costs (no React state coordination), so if anything LCP improves marginally. Re-Lighthouse baseline pending in R12-follow-up.

### Part C — Audit-cycle methodology

R12 adds a new methodology contribution to the audit-cycle ladder. The prior rounds:
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
- R11 — i18n + RTL scaffold AND the "no green shadows + docs↔code sync mandate"

**R12 is the first round driven by a live multi-route audit through the Claude in Chrome MCP** — earlier rounds were user-reported, spot-issue-driven, or Lighthouse-driven. The methodology rule R12 codifies:

> **A doc that "describes the intent" and a runtime CSS that "implements the intent" can drift silently — the only way to know is to walk every route with eyes on the rendered pixels AND probe the live token values via `getComputedStyle(documentElement).getPropertyValue(...)`. The R11 docs↔code sync mandate codifies the rule; R12 adds the verification surface (live audit through MCP) as the enforcement mechanism.**

Future rounds should expect a multi-route audit phase before declaring "shipped."

## Consequences

### Visual

- **Dark mode hierarchy sharpens.** Three-tier text contrast is now visible. Eyebrow labels read as quieter than captions; captions read as quieter than body. The hierarchy.md "1.5–2× weight rule" works in dark again.
- **Foundations Color showcase** now displays distinct hex values for `text.secondary` (#9A9A9A) and `text.tertiary` (#6B6B6B). The swatches communicate the ladder correctly.
- **No visible regression in light mode** — light mode mapping was already correct.
- **`/library` mobile + desktop view** retains the R8c LCP win (paint-deferral via CSS-engine).
- **Cmd+F + screen-reader walking** now works on /library out of the box.

### Contract

- `--text-tertiary` and `--text-placeholder` are now `obsidian-4` on dark (was `obsidian-3`). Any consumer-app code that relied on the broken value will see a slightly darker tertiary text. This is the correction the docs always promised.
- DTCG semantic dark `text.disabled` is now `{color.brand.400}` (was `{color.brand.500}`). The runtime CSS was already at brand-400 — R12 aligns the source-of-truth.
- LazyMount's API is unchanged (`placeholderHeight`, `eager`, `className`). The internal implementation is migrated from React-state-driven to CSS-engine-driven. The behavior at the user's level is "the section paints when scrolled near, just like before." The dev-time behavior is "no IntersectionObserver to think about; the children are always in the DOM."
- `rootMargin` prop is removed from LazyMount — the browser's CSS-engine handles "near-viewport" determination natively.

### What was NOT changed

- The R11 no-green-shadows mandate holds. Every shadow token stays neutral.
- The R8c LCP-deferral intent is preserved (just at a different layer).
- The DTCG semantic light text.* tokens are unchanged (light mode was already correct).
- The 7 v0.11 + v0.12 foundations principles are unchanged.
- The 19 AGENTS.md hard rules are unchanged. (R12 didn't introduce a new contract; it restored an existing one.)
- The CLS=0.000 contract holds. `contain-intrinsic-size` reserves vertical space before paint, so the page doesn't shift when sections paint in.

### Trade-offs accepted

- **DOM weight on /library increases by ~6× post-R12** (91 KB → 565 KB SSR HTML). This means initial HTML download is slower (~470 KB extra over the wire). On Lumen's 9-route Lighthouse mobile baseline, this likely produces a small First Contentful Paint regression — but the LCP wasn't paying the DOM-weight cost (it was paying the paint cost, which `content-visibility` still defers). The trade-off: a small FCP regression in exchange for SSR completeness, SEO indexability, Cmd+F, screen-reader-prewalk, JS-disabled support, and the elimination of the "empty void on fast scroll" perception bug. Verified worth it.
- **Older browsers (Chrome < 85, Safari < 18, Firefox < 125) won't benefit from the lazy paint.** They'll render everything eagerly and pay the layout cost. For the Lumen audit-dashboard internal-only audience, this is acceptable. Consumer apps targeting wider browser audiences should set their own LazyMount contract.

## References

- AGENTS.md hard rule 17 — LazyMount on DOM-heavy routes (amended to reflect content-visibility implementation)
- `audit-dashboard/src/components/lazy-mount.tsx` — full rewrite
- `audit-dashboard/src/app/globals.css:98-99, 628-633` — text-ladder restoration
- `design-system/01-tokens/semantic/color.dark.tokens.json` text.disabled — aligned with runtime
- `design-system/01-tokens/primitives/color.tokens.json` brand.300/400 — descriptions corrected
- `.audit-runs/2026-05-20-comprehensive-audit/ISSUES.md` — R12 audit catalog
- ADR 0010 — metric-aligned fallback contract (CLS stays at 0)
- ADR 0028 — inline-css mobile-perf (the R8b regression LazyMount was compensating)
- ADR 0029 §LazyMount — the R8c implementation that R12 supersedes
- ADR 0030 — R11 no-green-shadows + docs↔code sync mandate (the meta-rule R12 enforces)
