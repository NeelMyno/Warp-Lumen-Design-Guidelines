export type MoodId = "quiet-industrial";

export type Mood = {
  id: MoodId;
  label: string;
  oneLiner: string;
  recommended?: boolean;
};

/**
 * Lumen v0.2 ships a single fully-developed mood: Quiet Industrial. The mood
 * switcher hides itself when MOODS.length <= 1; alternates can be introduced
 * later by adding a new entry here AND the matching CSS-variable block in
 * globals.css under [data-mood="..."]. The architecture supports it; the
 * audit baseline does not need to expose it.
 */
export const MOODS: Mood[] = [
  {
    id: "quiet-industrial",
    label: "Quiet Industrial",
    oneLiner:
      "Rams-inflected, Apple-disciplined. Paper-warm white in light, Warp's navy ladder in dark, one disciplined lime accent.",
    recommended: true,
  },
];

export const MOOD_BY_ID: Record<MoodId, Mood> = MOODS.reduce(
  (acc, m) => ({ ...acc, [m.id]: m }),
  {} as Record<MoodId, Mood>,
);
