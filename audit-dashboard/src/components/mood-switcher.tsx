"use client";

import { useEffect, useState } from "react";
import { MOODS, type MoodId } from "@/lib/moods";

const DEFAULT_MOOD: MoodId = "obsidian";

/**
 * v0.12 — migrate the legacy v0.11 mood id "obsidian-mint" to "obsidian"
 * (the renaming that came with the obsidian-mint → neutral-obsidian recolor
 * in ADR 0020). Users coming from v0.11 keep their mood preference rather
 * than losing it to the DEFAULT_MOOD fallback.
 *
 * Without this, an "obsidian-mint" localStorage value would fail the MOODS
 * .find() check below (because MOODS no longer contains that id), the
 * fallback to DEFAULT would kick in, and the user would silently revert to
 * the default. Functionally identical right now (DEFAULT === "obsidian"),
 * but explicit migration is cheaper than the next contributor wondering
 * whether the localStorage key is broken or just stale.
 */
function migrateLegacyMood(stored: string | null): MoodId | null {
  if (stored === "obsidian-mint") return "obsidian";
  return stored as MoodId | null;
}

export function MoodSwitcher() {
  const [mood, setMood] = useState<MoodId>(DEFAULT_MOOD);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = migrateLegacyMood(window.localStorage.getItem("lumen-mood"));
    const initial =
      stored && MOODS.find((m) => m.id === stored) ? stored : DEFAULT_MOOD;
    if (window.localStorage.getItem("lumen-mood") !== initial) {
      window.localStorage.setItem("lumen-mood", initial);
    }
    setMood(initial);
    document.documentElement.dataset.mood = initial;
    setMounted(true);
  }, []);

  if (MOODS.length <= 1) {
    // Hide selector while only one mood is registered.
    return null;
  }

  function select(next: MoodId) {
    setMood(next);
    document.documentElement.dataset.mood = next;
    window.localStorage.setItem("lumen-mood", next);
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <span className="text-eyebrow-sans text-[color:var(--text-tertiary)]">
        Mood
      </span>
      <select
        value={mounted ? mood : DEFAULT_MOOD}
        onChange={(e) => select(e.target.value as MoodId)}
        aria-label="Visual mood"
        className="h-control-cozy rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 text-body-sm text-[color:var(--text-primary)] focus-visible:border-[var(--border-focus)]"
      >
        {MOODS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
