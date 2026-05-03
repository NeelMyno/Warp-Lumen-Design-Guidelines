export type MoodId =
  | "quiet-industrial"
  | "soft-luminous"
  | "mono-editorial"
  | "premium-glass";

export type Mood = {
  id: MoodId;
  label: string;
  oneLiner: string;
  recommended?: boolean;
};

export const MOODS: Mood[] = [
  {
    id: "quiet-industrial",
    label: "Quiet Industrial",
    oneLiner:
      "Rams-inflected. Paper-white/near-black, one disciplined accent, hairlines, instrument-panel feel.",
    recommended: true,
  },
  {
    id: "soft-luminous",
    label: "Soft Luminous Minimal",
    oneLiner:
      "Apple-leaning. Off-white surfaces, subtle warm gradients, 6 desaturated category hues.",
  },
  {
    id: "mono-editorial",
    label: "Mono-Type Editorial",
    oneLiner:
      "Two colors plus one signal. Type does almost everything; Swiss/Vitsoe rhythm.",
  },
  {
    id: "premium-glass",
    label: "Premium Glass Operations",
    oneLiner:
      "Apple iOS-leaning. Vibrancy on overlays, branded blue. Best for mobile operator app.",
  },
];

export const MOOD_BY_ID: Record<MoodId, Mood> = MOODS.reduce(
  (acc, m) => ({ ...acc, [m.id]: m }),
  {} as Record<MoodId, Mood>,
);
