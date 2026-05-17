// Lumen v0.13 Phase 1 — landing-hero proof-of-concept route.
//
// Demonstrates the mode mechanism end-to-end by rendering the SAME LandingHero
// JSX inside a ModeScope and toggling the mode prop. The hero rebinds visually
// without any component-level branching.
//
// Run: cd audit-dashboard && pnpm dev → http://localhost:3000/examples/landing-hero
// Lighthouse gate: pnpm lighthouse:landing-hero (Phase 1 verification).
"use client";

import { useState } from "react";
import { ModeScope, type LumenMode } from "@/components/primitives/mode-scope";
import { LandingHero } from "./landing-hero";

export default function LandingHeroExample() {
  const [mode, setMode] = useState<LumenMode>("expressive");

  return (
    <div className="min-h-screen bg-[color:var(--surface-canvas)] text-[color:var(--text-primary)]">
      {/* Mode toggle strip — operator chrome, restrained-mode styled. NOT
          inside the ModeScope so it doesn't recolor based on the toggle. */}
      <div className="sticky top-0 z-50 border-b border-[color:var(--border-hairline)] bg-[color:var(--surface-raised)] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="lumen-mono-cap text-[color:var(--text-tertiary)]">
              LUMEN V0.13 · PHASE 1 PROOF · LANDING-HERO
            </span>
          </div>
          <fieldset className="flex items-center gap-1 rounded-[var(--radius-full)] border border-[color:var(--border-default)] p-1">
            <legend className="sr-only">Toggle Lumen mode</legend>
            {(["restrained", "expressive"] as const).map((m) => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setMode(m)}
                  // lumen-lint-allow: off-grid — py-1.5 (6 px) is the documented sub-grid stop for compact pills.
                  className={`px-4 py-1.5 rounded-[var(--radius-full)] text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-[color:var(--color-accent-500)] text-[color:var(--color-accent-fg)]"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </fieldset>
        </div>
      </div>

      {/* The ModeScope wraps the hero. Toggling the mode prop flips data-mode,
          which causes the lumen-mode-tokens.css rebinds to swap surface.hero /
          canvas-ambient / atmosphere / motion.atmosphere / noise-overlay — all
          without re-rendering the hero or branching on mode in component code. */}
      <ModeScope mode={mode} as="section" className="max-w-6xl mx-auto p-6 sm:p-12">
        <LandingHero />
      </ModeScope>

      {/* Caption strip — explains what's being demonstrated. */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-12 text-sm text-[color:var(--text-tertiary)] leading-relaxed">
        <p className="mb-2 lumen-mono-cap">PROOF-OF-CONCEPT NOTE</p>
        <p>
          The hero JSX above is{" "}
          <span className="text-[color:var(--text-primary)] font-medium">
            identical across both modes
          </span>
          . Only the surrounding <code>{`<ModeScope mode={…}>`}</code>{" "}
          attribute changes. In expressive mode the hero paints a Spring-Green
          aurora mesh, animates the mesh stops on a 24 s drift, and overlays an
          8% SVG grain. In restrained mode the same surface tokens collapse to
          flat obsidian, the drift animation stops, the grain opacity drops to
          0. Test{" "}
          <code>prefers-reduced-motion</code> /{" "}
          <code>prefers-reduced-transparency</code> via DevTools rendering tab —
          mesh-drift freezes, glass alphas bump to ≥ 85%, mesh collapses to
          solid surface.
        </p>
      </div>
    </div>
  );
}
