"use client";

import { useEffect, useState } from "react";
import { Layers, Sparkles } from "lucide-react";

type LumenMode = "restrained" | "expressive";

const STORAGE_KEY = "lumen-mode";

/**
 * Lumen v0.13 Phase 6 — Persistent dashboard-wide mode toggle.
 *
 * Writes `data-mode="restrained"` (default, dense operator surfaces) or
 * `data-mode="expressive"` (mesh + glass + aurora) onto `<html>` so the
 * mode-aware tokens in lumen-mode-tokens.css rebind in one place. Persists
 * the choice in localStorage so refresh + cross-tab continuity hold.
 *
 * Hard rule 15 (AGENTS.md): mode is a scope attribute, never a per-component
 * prop. The toggle sets one attribute at the root; every component below
 * inherits the rebind via CSS custom-property cascade. No component branches
 * on mode.
 *
 * SSR safety: the toggle reads localStorage in useEffect (not during render)
 * and gates its visual chrome on `mounted` so the first paint matches whatever
 * the server emitted (restrained default). The data-mode attribute is set in
 * the same useEffect, so the cascade lands on the second tick — accepted
 * tradeoff to avoid a layout shift on the no-JS path.
 */
function readInitialMode(): LumenMode {
  if (typeof window === "undefined") return "restrained";
  const stored = window.localStorage.getItem(STORAGE_KEY) as LumenMode | null;
  if (stored === "restrained" || stored === "expressive") return stored;
  return "restrained";
}

export function ModeToggle() {
  const [mode, setMode] = useState<LumenMode>("restrained");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readInitialMode();
    setMode(initial);
    document.documentElement.dataset.mode = initial;
    setMounted(true);

    // Cross-tab continuity.
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      if (event.newValue === "restrained" || event.newValue === "expressive") {
        setMode(event.newValue);
        document.documentElement.dataset.mode = event.newValue;
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function flip() {
    const next: LumenMode = mode === "restrained" ? "expressive" : "restrained";
    setMode(next);
    document.documentElement.dataset.mode = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage disabled (private mode / iframes) — degrade silently.
    }
  }

  const isExpressive = mode === "expressive";
  const Icon = isExpressive ? Sparkles : Layers;
  const label = isExpressive ? "Expressive mode" : "Restrained mode";
  const nextLabel = isExpressive
    ? "Switch to restrained"
    : "Switch to expressive";

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={nextLabel}
      title={label}
      aria-pressed={isExpressive}
      data-active={mounted ? "true" : "false"}
      className={[
        "inline-flex items-center gap-2 h-control-cozy px-3 rounded-[var(--radius-full)]",
        "text-overline normal-case tracking-normal",
        "border transition-[color,background-color,border-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        // Restrained: hairline, tertiary text. Expressive: accent border, accent text.
        isExpressive
          ? "border-[var(--border-accent)] text-[color:var(--text-accent)] bg-[var(--surface-tint-accent)]"
          : "border-[var(--border-hairline)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] hover:border-[var(--border-default)]",
      ].join(" ")}
    >
      <Icon
        size={14}
        strokeWidth={1.5}
        aria-hidden
        className="transition-transform duration-[var(--motion-fast)]"
      />
      <span className="font-semibold uppercase tracking-[0.16em]">
        {isExpressive ? "Expressive" : "Restrained"}
      </span>
    </button>
  );
}
