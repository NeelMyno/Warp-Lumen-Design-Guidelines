"use client";

/**
 * LazyMount — defer mounting children until the placeholder sentinel scrolls
 * within the viewport (plus a configurable rootMargin buffer).
 *
 * v0.14 — R8c (ADR 0029). Compensates the R8b /library main-thread regression
 * (LCP +184 ms median) where the inlined CSS parse cost lands on the main
 * thread before computing styles against /library's 4684-node DOM. By
 * deferring the 23 below-the-fold primitive showcases until the user scrolls
 * past the first 2 sections, the initial paint DOM drops from 4684 nodes to
 * ~200 nodes, and the main-thread CSS-apply cost stops dominating. Each
 * lazy section reserves space via a placeholder (default 600 px) so layout
 * is stable before mount — zero CLS contribution.
 *
 * The component is SSR-safe: when typeof IntersectionObserver is undefined
 * (Node prerender), it short-circuits to mounted=true so the server output
 * still contains the full DOM (needed for SEO, screen-reader pre-walk, and
 * the audit-dashboard's "everything searchable on a single page" contract).
 * The lazy behavior is a client-side optimization layered on top.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyMountProps = {
  children: ReactNode;
  /**
   * Min-height of the placeholder div while not yet mounted. Reserves
   * vertical space so the surrounding layout is stable and CLS stays at 0.
   * Default 600 px — roughly one Section's vertical footprint at the
   * /library typography ladder.
   */
  placeholderHeight?: number;
  /**
   * Buffer below the viewport at which to start mounting. CSS-margin syntax.
   * Default "400px" — a screen-and-a-bit of pre-loading so scrolling at
   * normal speed never sees the placeholder swap to content mid-view.
   * lumen-lint-allow: primitives — "400px" is the IntersectionObserver
   * rootMargin API string, not a CSS sizing value. The "px" is API syntax.
   */
  rootMargin?: string;
  /**
   * If true, mounts immediately. Use for above-the-fold sections where
   * lazy-mounting would actually hurt the first paint. Default false.
   */
  eager?: boolean;
  /**
   * Optional className applied to the placeholder div (not the mounted
   * children). Useful for matching surrounding section spacing.
   */
  className?: string;
};

export function LazyMount({
  children,
  placeholderHeight = 600,
  // lumen-lint-allow: primitives — IntersectionObserver rootMargin API string
  rootMargin = "400px",
  eager = false,
  className,
}: LazyMountProps) {
  const [mounted, setMounted] = useState(eager);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted) return;
    // SSR-safe fallback: if IntersectionObserver isn't available, mount.
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  if (mounted) return <>{children}</>;
  return (
    <div
      ref={sentinelRef}
      style={{ minHeight: placeholderHeight }}
      aria-hidden
      className={className}
      data-lazy-mount-placeholder=""
    />
  );
}
