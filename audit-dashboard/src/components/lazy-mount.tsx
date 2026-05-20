/**
 * LazyMount — defer paint + layout work for below-the-fold sections while
 * keeping every node in the DOM for SSR, SEO, Cmd+F, and screen-reader
 * pre-walk.
 *
 * v0.14.1 — R12 rewrite (ADR 0031). The pre-R12 implementation conditionally
 * rendered children based on an IntersectionObserver state: until the
 * sentinel scrolled near, only a 500-px-tall placeholder div lived in the
 * tree. The doc comment claimed SSR-safety via a `typeof IntersectionObserver
 * === "undefined"` fallback inside useEffect — but useEffect never runs on
 * the server, so SSR output shipped 23 empty placeholders on /library and
 * the 23 lazy sections were missing from the initial HTML. Verified by
 * `curl /library | grep "Get rates\|Save draft\|All shipments\|Quote name"`
 * returning 0 hits. Consequences before R12:
 *   - Cmd+F couldn't find content in lazy sections until the user scrolled
 *     past them.
 *   - Screen readers pre-walking the page on landing announced only the
 *     above-the-fold content + 23 nameless `aria-hidden` placeholders.
 *   - JS-disabled users saw permanently-empty placeholders.
 *   - Fast-scrolling users (10+ ticks/sec) outran the rootMargin=400px
 *     buffer and landed in a placeholder mid-viewport, presenting a black
 *     void until React state caught up.
 *
 * R12 swaps the implementation to **CSS content-visibility: auto** plus
 * `contain-intrinsic-size` for layout stability. The browser handles
 * lazy-rendering at the layout-engine level:
 *   - Children are ALWAYS in the DOM. SSR ships full content. SEO + Cmd+F +
 *     screen-reader-prewalk + JS-disabled all work.
 *   - The browser skips paint + layout of off-screen sections until they
 *     scroll within roughly 50% of the viewport — same lazy-paint behavior
 *     as the pre-R12 IntersectionObserver, but managed by the engine, not by
 *     React state.
 *   - `contain-intrinsic-size: 0 var(--lazy-mount-h)` reserves vertical
 *     space so CLS stays at 0 before the section first paints.
 *   - No empty-void flash on fast scroll: the section is in the DOM, even if
 *     skipped from paint; the browser paints it the moment it scrolls into
 *     range.
 *
 * Browser support: content-visibility is supported in Chrome 85+ (2020),
 * Edge 85+ (2020), Safari 18+ (Sep 2024), Firefox 125+ (Apr 2024). Lumen's
 * audit-dashboard targets Chrome / Edge / modern Safari + Firefox; older
 * browsers fall back to rendering everything eagerly (graceful — they pay
 * the layout cost but still see the content).
 *
 * Performance: the LCP win that motivated R8c (ADR 0029 — /library LCP
 * 3328 → 1815 ms, −1513 ms) was driven by reducing the *paint-and-layout*
 * cost of /library's 4684-node DOM on first paint. content-visibility: auto
 * achieves the same paint-skipping behavior natively, without sacrificing
 * SSR completeness. The DOM size is larger, but DOM size alone is not the
 * LCP bottleneck — layout-and-paint cost is. Expect parity or improvement
 * on the R8c LCP gain post-R12. Verified via re-Lighthouse during the R12
 * verification round.
 *
 * USAGE — when to wrap (heuristic):
 *
 *   - Route DOM > 1500 nodes? Wrap below-the-fold sections.
 *   - Route shows > 30 primitive showcases or > 60 cards? Wrap.
 *   - Lighthouse insight `dom-size` flags the route? Wrap.
 *   - First 2 sections (above-the-fold) STAY EAGER (use `eager` prop) —
 *     applying content-visibility to above-the-fold sections costs a tiny
 *     bit of paint-deferral overhead with no benefit (they're going to
 *     paint immediately anyway).
 *   - Sections 3+ go inside LazyMount.
 *
 * USAGE — placeholderHeight (now contain-intrinsic-size):
 *
 *   Set `placeholderHeight` to roughly the mounted-section's height so CLS
 *   stays 0 during initial layout when the section is content-visibility
 *   hidden. The default 600 px is roughly one Section's vertical footprint
 *   at the /library typography ladder. For shorter sections, override.
 *
 * USAGE — eager prop:
 *
 *   Use `eager` for cases where you want LazyMount in the markup tree (so
 *   it composes uniformly with siblings) but render normally — typically
 *   the first 1–2 sections of a long route. Equivalent to NOT wrapping,
 *   just preserves visual consistency in the JSX.
 *
 * ANTI-PATTERN — what NOT to wrap:
 *
 *   - Above-the-fold sections (hero, first one or two Section blocks)
 *   - Sticky / fixed-position chrome (header, footer, sidebar)
 *   - Anything inside a `<details open>` that must auto-mount on disclosure
 *   - Charts whose data is part of the initial paint contract
 *   - Floating UI that portals out of the wrapper (popovers, dropdowns) —
 *     they're not in this section's box anyway; wrapping the trigger is fine
 *
 * See AGENTS.md hard rule 17 + ADR 0031 (v0.14.1 R12) for the system
 * contract. R8c's IntersectionObserver-based predecessor is preserved in
 * git history but is no longer the contract.
 */
import { type ReactNode, type CSSProperties } from "react";

type LazyMountProps = {
  children: ReactNode;
  /**
   * Reserved vertical space when the section is content-visibility hidden,
   * so the surrounding layout is stable and CLS stays at 0. Passed to
   * `contain-intrinsic-size` (CSS pixels). Default 600.
   */
  placeholderHeight?: number;
  /**
   * If true, renders normally without content-visibility containment. Use
   * for above-the-fold sections where lazy paint-deferral would actually
   * hurt the first paint. Default false.
   */
  eager?: boolean;
  /**
   * Optional className applied to the wrapper div. Useful for matching
   * surrounding section spacing.
   */
  className?: string;
};

export function LazyMount({
  children,
  placeholderHeight = 600,
  eager = false,
  className,
}: LazyMountProps) {
  if (eager) {
    return (
      <div className={className} data-lazy-mount="eager">
        {children}
      </div>
    );
  }

  // lumen-lint-allow-block: primitives — content-visibility + contain-intrinsic-size
  // are CSS layout-engine contracts; the px value here is the layout reservation
  // for the section before its first paint, scaled per-call via placeholderHeight.
  const style: CSSProperties = {
    contentVisibility: "auto",
    containIntrinsicSize: `0 ${placeholderHeight}px`,
  };

  return (
    <div className={className} style={style} data-lazy-mount="lazy">
      {children}
    </div>
  );
}
