// Lumen ModeScope — v0.13 Phase 1 reference implementation.
// Tokens come from /dist/css/lumen.css + /dist/css/lumen.expressive.css + /dist/css/lumen.scoping.css.
// Import all three in your app's global stylesheet for the mode rebinds to resolve.
import type { ReactNode } from "react";

export type LumenMode = "restrained" | "expressive";

export interface ModeScopeProps {
  /**
   * The Lumen mode applied to descendants.
   *
   * - "restrained" (default): dense operator surfaces. Solid obsidian canvas, no atmosphere, no animated mesh.
   * - "expressive": opt-in for landing / marketing / AI / onboarding / empty-state / hero panels. Mesh recipe on surface.hero, ambient gradient on surface.canvas-ambient, mesh-drift animation on motion.atmosphere.
   *
   * NEVER pass mode as a prop to any individual component. Mode is a scope attribute, not a per-component variant.
   * NEVER nest a ModeScope of opposite mode inside another ModeScope.
   */
  mode?: LumenMode;
  /**
   * HTML element used as the scope container. Default "div".
   * Use "section" / "main" / "article" for semantic page regions.
   */
  as?: "div" | "section" | "main" | "article";
  /**
   * Forwarded to the container element.
   */
  className?: string;
  children: ReactNode;
}

export function ModeScope({
  mode = "restrained",
  as: Component = "div",
  className,
  children,
}: ModeScopeProps) {
  return (
    <Component data-mode={mode} className={className}>
      {children}
    </Component>
  );
}
