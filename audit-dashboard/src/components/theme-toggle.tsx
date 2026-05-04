"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Lumen v0.4 defaults to DARK (the obsidian canvas is the brand stage).
 * If the user has a stored preference, that wins; otherwise we honour the
 * OS preference; otherwise we land on dark.
 */
function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("lumen-theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
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
      className="inline-flex h-control-cozy w-[var(--size-control-cozy)] items-center justify-center rounded-[var(--radius-full)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tint-accent)] transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
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
