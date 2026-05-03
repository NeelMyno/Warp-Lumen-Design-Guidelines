export type MoodId = "obsidian-lime";

export type Mood = {
  id: MoodId;
  label: string;
  oneLiner: string;
  recommended?: boolean;
};

/**
 * Lumen v0.4 — single canonical mood.
 *
 * "Obsidian Lime" replaces the v0.1–v0.3 "Quiet Industrial" mood. Anchor
 * references: SuperDesign · Glassmorphism Style ("Obsidian & Lime") and
 * SuperDesign · Neon Velocity Countdown ("Laser Green & Navy Black").
 *
 * The mood switcher hides itself when MOODS.length <= 1; alternates can be
 * introduced later by adding a new entry here AND a [data-mood="…"] block
 * in globals.css. The architecture supports it; v0.4 ships only one.
 */
export const MOODS: Mood[] = [
  {
    id: "obsidian-lime",
    label: "Obsidian Lime",
    oneLiner:
      "Near-black obsidian canvas, warm cream paper in light, lime as the only loud color, glass surfaces and a radial green ambient glow.",
    recommended: true,
  },
];

export const MOOD_BY_ID: Record<MoodId, Mood> = MOODS.reduce(
  (acc, m) => ({ ...acc, [m.id]: m }),
  {} as Record<MoodId, Mood>,
);
