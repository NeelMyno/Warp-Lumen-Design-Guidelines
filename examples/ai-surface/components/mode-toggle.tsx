"use client";

/**
 * ModeToggle — closes Phase 5 deferral §"Mode dual-render not wired into
 * the reference AI surface UI." Sticky pill in the top-right that flips
 * `data-mode` between `restrained` (dense operator surfaces — the default
 * for chat / data flows) and `expressive` (atmospheric — for hero shells
 * and onboarding panels).
 *
 * The ai-surface globals.css carries the per-mode rebinds: surface.canvas,
 * surface.raised, and a subtle ambient gradient drop in expressive. The
 * AI primitives themselves are mode-agnostic per AGENTS.md hard rule 15
 * (mode is a scope attribute, never a per-component prop).
 *
 * Persists the operator's choice to `localStorage` so refreshes preserve
 * the active mode. Honors `prefers-reduced-motion` by hard-cutting the
 * transition (no spring) when the OS signals reduce.
 */
import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "lumen-ai-surface-mode";
type Mode = "restrained" | "expressive";

function readInitialMode(): Mode {
  if (typeof window === "undefined") return "restrained";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "expressive" ? "expressive" : "restrained";
}

export function ModeToggle() {
  const [mode, setMode] = useState<Mode>("restrained");

  // Hydrate from storage on mount + apply to <html data-mode>.
  useEffect(() => {
    const initial = readInitialMode();
    setMode(initial);
    document.documentElement.setAttribute("data-mode", initial);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === "restrained" ? "expressive" : "restrained";
      document.documentElement.setAttribute("data-mode", next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable (private mode etc.) — UI still works.
      }
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="lumen-mode-toggle"
      aria-label={`Switch to ${mode === "restrained" ? "expressive" : "restrained"} mode`}
      title={`Current: ${mode}. Click to switch.`}
    >
      <span aria-hidden className="lumen-mode-toggle__dot" />
      <span className="lumen-mode-toggle__label">{mode.toUpperCase()}</span>
    </button>
  );
}
