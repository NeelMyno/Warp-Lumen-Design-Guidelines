"use client";

import { useEffect, useState } from "react";

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
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-full)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tint-accent)] transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
    >
      {mounted ? (theme === "dark" ? <MoonIcon /> : <SunIcon />) : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 2.5v2M12 19.5v2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M2.5 12h2M19.5 12h2M5.1 18.9l1.4-1.4M17.5 6.5l1.4-1.4"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.5 13.4A8.5 8.5 0 1 1 10.6 3.5a7 7 0 0 0 9.9 9.9z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
    </svg>
  );
}
