"use client";

/**
 * v0.11.13 — ScrollReveal
 * ----------------------------------------------------------------------------
 * Wraps a region in an IntersectionObserver-driven fade-in. Per
 * micro-interactions.md §3 ("Scroll-driven fade-in"):
 *   - Fires once per element (never replays on re-scroll)
 *   - opacity 0 → 1 + translate-y 12px → 0
 *   - 260ms with easing.decelerate
 *   - Honors prefers-reduced-motion (snaps to end-state)
 *
 * No third-party deps. Uses a single observer instance per mount; cheap.
 *
 * Usage:
 *   <ScrollReveal>...</ScrollReveal>
 *   <ScrollReveal delay={120}>...</ScrollReveal>
 *   <ScrollReveal as="section">...</ScrollReveal>
 */

import { useEffect, useRef, useState, ReactNode, ElementType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type ScrollRevealProps = {
  children: ReactNode;
  /** Element tag. Defaults to <div>. */
  as?: ElementType;
  /** Stagger delay in ms — useful when stacking siblings. Default 0. */
  delay?: number;
  /** Threshold for the IntersectionObserver. Default 0.18 (~18% in view). */
  threshold?: number;
  className?: string;
  style?: CSSProperties;
};

export function ScrollReveal({
  children,
  as: Tag = "div",
  delay = 0,
  threshold = 0.18,
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    /* SSR safety + reduced-motion shortcut. */
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    /* Already in view on mount? Reveal next frame so the transition fires
       (the initial render must paint at opacity 0 first; otherwise we get a
       no-op transition and the element pops in flat). */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(() => setRevealed(true), delay);
            } else {
              requestAnimationFrame(() => setRevealed(true));
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <Tag
      ref={ref as never}
      data-revealed={revealed || undefined}
      className={cn("lumen-reveal-stagger", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
