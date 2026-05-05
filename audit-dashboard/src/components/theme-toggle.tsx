"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Lumen v0.11.5 — Obsidian Mint is the brand stage. Dark is default; the OS
 * preference is intentionally ignored so every first impression lands on the
 * canonical canvas the system is named after. A user override (via the toggle)
 * persists in localStorage and wins on every subsequent visit.
 */
function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("lumen-theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readInitialTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("lumen-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="inline-flex h-control-cozy w-[var(--size-control-cozy)] items-center justify-center rounded-[var(--radius-full)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--surface-tint-accent)] transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
    >
      {mounted ? (
        theme === "dark" ? (
          <Moon size={15} strokeWidth={1.5} aria-hidden focusable={false} />
        ) : (
          <Sun size={15} strokeWidth={1.5} aria-hidden focusable={false} />
        )
      ) : (
        <Moon size={15} strokeWidth={1.5} aria-hidden focusable={false} />
      )}
    </button>
  );
}
