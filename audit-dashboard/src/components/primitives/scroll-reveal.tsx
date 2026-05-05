/**
 * v0.11.13.2 — ScrollReveal (CSS-driven stagger)
 * ----------------------------------------------------------------------------
 * Pure CSS animation. No JS hook, no IntersectionObserver, no setTimeout.
 * Runs once on mount, decelerating opacity 0→1 + translateY 12px→0 over
 * 260ms after the per-instance `delay` (passed as `--reveal-delay`).
 *
 * Why pure CSS:
 *   - Hidden-tab throttling: IO + setTimeout fire unreliably when a user
 *     opens the link in a background tab. CSS animations are part of the
 *     paint cycle and start the moment the browser composites the frame
 *     (or, for hidden tabs, queue and play correctly when visible).
 *   - SSR-safe: the animation is in the rendered HTML's stylesheet —
 *     no hydration race, no flash of pre-reveal content.
 *   - Robust to JS failure: if scripts never run, the animation still plays.
 *
 * Reduced-motion: the CSS rule snaps to the end-state with no animation
 * (see globals.css `.lumen-reveal-stagger` @media block).
 *
 * For below-the-fold scroll-driven fade-in, use the existing `.lumen-reveal`
 * class (globals.css:2771) which runs CSS scroll-timeline. This component
 * is for above-the-fold mount-time staggers (heroes, headers).
 *
 * Usage:
 *   <ScrollReveal>           — fades in on mount, no delay
 *   <ScrollReveal delay={80}> — 80ms delay (use to stagger siblings)
 *   <ScrollReveal as="section" delay={160}>
 */

import { ReactNode, ElementType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type ScrollRevealProps = {
  children: ReactNode;
  /** Element tag. Defaults to <div>. */
  as?: ElementType;
  /** Stagger delay in ms before the reveal animation begins. Default 0. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

export function ScrollReveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  style,
}: ScrollRevealProps) {
  /* CSS reads --reveal-delay; missing var falls back to 0ms in the rule. */
  const mergedStyle: CSSProperties = delay
    ? { ...style, ["--reveal-delay" as string]: `${delay}ms` }
    : style ?? {};

  return (
    <Tag className={cn("lumen-reveal-stagger", className)} style={mergedStyle}>
      {children}
    </Tag>
  );
}
