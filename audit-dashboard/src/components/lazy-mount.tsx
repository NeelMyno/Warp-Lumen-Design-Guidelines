/**
 * LazyMount — defer paint + layout work for below-the-fold sections during
 * the FIRST PAINT window, while keeping every node in the DOM for SSR, SEO,
 * Cmd+F, and screen-reader pre-walk.
 *
 * v0.14.2 — R13 rewrite (ADR 0032). The R12 implementation used
 * `content-visibility: auto` continuously (not just at first paint). The
 * R12 fix correctly closed the SSR-completeness gap that R8c had (R8c's
 * IntersectionObserver-based React-state-machine shipped 23 empty
 * placeholder divs in SSR). But `content-visibility: auto` skips paint
 * for off-screen elements EVERY frame, not just the first paint. During
 * fast scroll (10+ ticks/sec via wheel or touch), the browser's
 * paint-prediction lags behind viewport movement. The user lands in a
 * scroll position where multiple lazy-mounted sections sit in the
 * viewport — the browser hasn't finished painting them yet, so the
 * entire viewport reads as a black void until the next paint frame.
 *
 * R13 verified the black-void issue across 7+ scroll positions on /library
 * via Claude in Chrome MCP audit. The /library route's 23 LazyMount-wrapped
 * sections collectively produced ~3-5 distinct void encounters in a single
 * top-to-bottom scroll at the audit-tool's default scroll speed. Real users
 * on a fast-scrolling Magic Mouse / touchpad would hit the issue too.
 *
 * R13 swaps the implementation to **first-paint-only deferral**:
 *   - SSR + initial render: `content-visibility: auto` +
 *     `contain-intrinsic-size: 0 ${placeholderHeight}px` is applied. The
 *     browser skips paint + layout for off-screen sections during the
 *     LCP-critical first paint. The R8c → v0.14.0 LCP win (3328 → 1815 ms)
 *     is preserved because LCP is measured at first paint, and the deferral
 *     contract is identical in that window.
 *   - After hydration: a `useEffect` schedules a `requestAnimationFrame`
 *     callback that flips the style to `{}` (removes content-visibility +
 *     contain-intrinsic-size). All sections paint normally from then on.
 *     Subsequent scrolls have NO paint-defer, NO black voids, NO viewport
 *     latency.
 *   - JS-disabled fallback: the SSR-shipped style stays in effect. The
 *     browser handles paint-deferral natively (same UX as the v0.14.1 R12
 *     contract). JS-disabled users still get the SSR-complete DOM (Cmd+F,
 *     SEO, screen-reader pre-walk all work) plus paint-deferred behaviour;
 *     they don't get the "scrolled-through" no-flash UX, but they DO get
 *     functional rendering of every section.
 *   - Browser support: useEffect + requestAnimationFrame are universal.
 *     content-visibility is the same browser-support contract as v0.14.1
 *     (Chrome / Edge 85+, Safari 18+, Firefox 125+; older browsers ignore
 *     the property and render eagerly — graceful).
 *
 * `placeholderHeight` default reduced from 600 → 240 px. The 600 px default
 * over-reserved space for the average section's first paint (most sections
 * are 250-400 px tall in the first viewport). The R13 default better
 * matches the median, AND it's only used during the first paint window
 * before the useEffect flip — so the layout reservation is minimised.
 *
 * Performance verification: re-Lighthouse the audit-dashboard against the
 * v0.14.1 baseline after R13 ships. Expect: LCP geo-mean parity or
 * improvement (the first-paint deferral contract is identical), CLS held
 * at 0.000 (the placeholderHeight matches actual section heights more
 * accurately), no new render-blocking work (the useEffect flip is a single
 * RAF after hydration).
 *
 * USAGE — when to wrap (heuristic — unchanged from v0.14.0 R8c):
 *
 *   - Route DOM > 1500 nodes? Wrap below-the-fold sections.
 *   - Route shows > 30 primitive showcases or > 60 cards? Wrap.
 *   - Lighthouse insight `dom-size` flags the route? Wrap.
 *   - First 2 sections (above-the-fold) STAY EAGER (use `eager` prop) —
 *     applying content-visibility to above-the-fold sections costs
 *     paint-deferral overhead with no benefit (they're going to paint
 *     immediately anyway). v0.14.2 R13 keeps this contract.
 *   - Sections 3+ go inside LazyMount.
 *
 * USAGE — placeholderHeight:
 *
 *   Set `placeholderHeight` to roughly the section's first-viewport height
 *   (NOT the full mounted height — that's not what's being reserved). The
 *   default 240 px is a good baseline for most Section blocks at the
 *   `/library` typography ladder; override for taller sections (charts,
 *   phone-frame screens). The reservation only applies BEFORE hydration;
 *   after the RAF flip, the section uses its real intrinsic height.
 *
 * USAGE — eager prop:
 *
 *   Use `eager` for sections that should NEVER apply content-visibility
 *   (above-the-fold + the immediately-following section the user is most
 *   likely to see before scrolling). Equivalent to NOT wrapping, but
 *   preserves visual consistency in the JSX.
 *
 * ANTI-PATTERN — what NOT to wrap (unchanged from v0.14.0 R8c):
 *
 *   - Above-the-fold sections (hero, first one or two Section blocks)
 *   - Sticky / fixed-position chrome (header, footer, sidebar)
 *   - Anything inside a `<details open>` that must auto-mount on disclosure
 *   - Charts whose data is part of the initial paint contract
 *   - Floating UI that portals out of the wrapper (popovers, dropdowns) —
 *     they're not in this section's box anyway; wrapping the trigger is fine
 *
 * See AGENTS.md hard rule 17 + ADR 0032 (v0.14.2 R13) for the system
 * contract. v0.14.1 R12's pure-CSS `content-visibility: auto` predecessor
 * is preserved in git history but is no longer the contract.
 */
"use client";

import { useEffect, useState, type ReactNode, type CSSProperties } from "react";

type LazyMountProps = {
  children: ReactNode;
  /**
   * Reserved vertical space (CSS pixels) when the section is
   * content-visibility hidden during the first-paint window, so layout is
   * stable and CLS stays at 0. Passed to `contain-intrinsic-size`. Default
   * 240 — matches the median first-viewport height of audit-dashboard
   * sections. Override for taller hero sections (charts, phone frames).
   */
  placeholderHeight?: number;
  /**
   * If true, renders normally without content-visibility containment at any
   * point. Use for above-the-fold sections where paint-deferral would hurt
   * first paint. Default false.
   */
  eager?: boolean;
  /**
   * Optional className applied to the wrapper div.
   */
  className?: string;
};

export function LazyMount({
  children,
  placeholderHeight = 240,
  eager = false,
  className,
}: LazyMountProps) {
  // After hydration, flip out of content-visibility: auto so subsequent
  // scrolls have no paint-defer flash. The LCP win persists because the
  // first paint (the LCP-critical frame) used content-visibility: auto.
  const [paintReady, setPaintReady] = useState(false);

  useEffect(() => {
    if (eager) return;
    const id = requestAnimationFrame(() => setPaintReady(true));
    return () => cancelAnimationFrame(id);
  }, [eager]);

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
  const style: CSSProperties = paintReady
    ? {}
    : {
        contentVisibility: "auto",
        containIntrinsicSize: `0 ${placeholderHeight}px`,
      };

  return (
    <div
      className={className}
      style={style}
      data-lazy-mount={paintReady ? "ready" : "lazy"}
    >
      {children}
    </div>
  );
}
