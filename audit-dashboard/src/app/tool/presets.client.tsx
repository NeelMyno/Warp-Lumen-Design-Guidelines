"use client";

import { useState } from "react";
import { Plus } from "@/components/primitives/icon";

/**
 * v0.12.9 — Tool surface preset list extracted to a client island so
 * the active preset moves with user clicks. Prior to this fix the
 * `page.tsx` rendered the list inline in a server component with a
 * hardcoded `active: true` on "Standard LTL"; clicking any other
 * preset got a hover-state background change but the accent ring
 * never moved off Standard LTL. Same class of bug as the v0.12.8
 * Commerce variant picker fix — a peak-moment interactive that lied
 * about being interactive. Preset choice is the first interaction on
 * /tool, so it sits on Premium Psychology principle 3 (peak-end rule)
 * and has to respond.
 *
 * Visual contract identical to the prior server-rendered shell:
 * accent-tint background on the active item, hover-only background
 * change on the rest, mono-cap eyebrow label, +-glyph "New preset"
 * row beneath. Adds a real `:focus-visible` ring via the existing
 * authored CSS shell (focus-visible: outline + box-shadow halo per
 * the v0.12.4 contract).
 */
const PRESETS = [
  "Standard LTL",
  "Refrigerated",
  "Flatbed open-deck",
  "Cross-dock express",
  "Last-mile residential",
  "International ocean",
] as const;

export function PresetList() {
  const [active, setActive] = useState<string>("Standard LTL");
  return (
    <>
      <div className="lumen-eyebrow px-2 mb-2">Presets</div>
      {PRESETS.map((name) => {
        const isActive = active === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "text-left px-3 py-[var(--space-1_5)] rounded-[var(--radius-md)] text-label-sm transition-colors duration-[var(--motion-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-frame)] focus-visible:outline-offset-1",
              isActive
                ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-primary)] font-semibold"
                : "text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)]",
            ].join(" ")}
          >
            {name}
          </button>
        );
      })}
      <button
        type="button"
        className="mt-3 flex items-center gap-2 px-3 py-[var(--space-1_5)] rounded-[var(--radius-md)] text-[color:var(--text-tertiary)] text-body-xs hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-frame)] focus-visible:outline-offset-1"
      >
        <Plus size={13} /> New preset
      </button>
    </>
  );
}
