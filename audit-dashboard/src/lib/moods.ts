export type MoodId = "obsidian-mint";

export type Mood = {
  id: MoodId;
  label: string;
  oneLiner: string;
  recommended?: boolean;
};

/**
 * Lumen v0.11 — single canonical mood.
 *
 * "Obsidian Mint" is the v0.11 evolution of v0.4's "Obsidian Lime". Anchored
 * on three user-fixed brand values: accent #00FA8A (Spring Green), dark
 * #171A18 (obsidian-mint canvas, faint green undertone), and #E6E6E6 (the
 * neutral light, also used as primary text on the dark canvas).
 *
 * The mood switcher hides itself when MOODS.length <= 1; alternates can be
 * introduced later by adding a new entry here AND a [data-mood="…"] block
 * in globals.css. The architecture supports it; v0.11 ships only one.
 */
export const MOODS: Mood[] = [
  {
    id: "obsidian-mint",
    label: "Obsidian Mint",
    oneLiner:
      "Obsidian-mint near-black canvas, cool-neutral paper in light, Spring Green as the only loud color, glass surfaces and a radial spring-green ambient glow.",
    recommended: true,
  },
];

export const MOOD_BY_ID: Record<MoodId, Mood> = MOODS.reduce(
  (acc, m) => ({ ...acc, [m.id]: m }),
  {} as Record<MoodId, Mood>,
);
