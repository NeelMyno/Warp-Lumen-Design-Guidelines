export type MoodId = "obsidian";

export type Mood = {
  id: MoodId;
  label: string;
  oneLiner: string;
  recommended?: boolean;
};

/**
 * Lumen v0.12 — single canonical mood.
 *
 * "Obsidian" is the v0.12 retune of the v0.11 "Obsidian Mint" mood (which
 * itself was the v0.11 evolution of v0.4's "Obsidian Lime"). Anchored on
 * three user-fixed brand values: accent #00FA8A (Spring Green, unchanged),
 * dark #0D0D0D (neutral obsidian canvas — was #171A18 obsidian-mint pre-v0.12,
 * retired after user feedback flagged the +G channel undertone as "weird
 * green"), and #E6E6E6 (the neutral light, also used as primary text on the
 * dark canvas; unchanged).
 *
 * Migration: the v0.11 mood id was `obsidian-mint`. mood-switcher.tsx auto-
 * migrates stored "obsidian-mint" localStorage values to "obsidian" on first
 * load, so users coming from v0.11 don't lose their mood preference.
 *
 * The mood switcher hides itself when MOODS.length <= 1; alternates can be
 * introduced later by adding a new entry here AND a [data-mood="…"] block
 * in globals.css. The architecture supports it; v0.12 ships only one.
 */
export const MOODS: Mood[] = [
  {
    id: "obsidian",
    label: "Obsidian",
    oneLiner:
      "Neutral obsidian near-black canvas, cool-neutral paper in light, Spring Green as the only loud color, glass surfaces and a radial spring-green ambient glow. The v0.12 retune of v0.11 Obsidian Mint — the green undertone retired so the spring-green accent has the entire hue stage.",
    recommended: true,
  },
];

export const MOOD_BY_ID: Record<MoodId, Mood> = MOODS.reduce(
  (acc, m) => ({ ...acc, [m.id]: m }),
  {} as Record<MoodId, Mood>,
);
