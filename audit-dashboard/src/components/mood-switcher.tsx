"use client";

import { useEffect, useState } from "react";
import { MOODS, type MoodId } from "@/lib/moods";

const DEFAULT_MOOD: MoodId = "obsidian-mint";

export function MoodSwitcher() {
  const [mood, setMood] = useState<MoodId>(DEFAULT_MOOD);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("lumen-mood") as MoodId | null;
    const initial =
      stored && MOODS.find((m) => m.id === stored) ? stored : DEFAULT_MOOD;
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
      <span className="text-eyebrow-sans text-[var(--text-tertiary)]">
        Mood
      </span>
      <select
        value={mounted ? mood : DEFAULT_MOOD}
        onChange={(e) => select(e.target.value as MoodId)}
        aria-label="Visual mood"
        className="h-control-cozy rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 text-body-sm text-[var(--text-primary)] focus-visible:border-[var(--border-focus)]"
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
