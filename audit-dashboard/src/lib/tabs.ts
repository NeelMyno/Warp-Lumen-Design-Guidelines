export type TabSlug =
  | "foundations"
  | "library"
  | "registry"
  | "tokens"
  | "prompts"
  | "saas"
  | "landing"
  | "tool"
  | "commerce"
  | "mobile"
  | "desktop";

export type Tab = {
  slug: TabSlug;
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  group: "system" | "platform";
};

export const TABS: Tab[] = [
  {
    slug: "foundations",
    href: "/foundations",
    label: "Foundations",
    shortLabel: "Foundations",
    description:
      "Color, typography, spacing, radius, elevation, motion, and iconography — the primitives the rest of the system stands on.",
    group: "system",
  },
  {
    slug: "library",
    href: "/library",
    label: "Component Library",
    shortLabel: "Library",
    description:
      "Every component, state, and pattern in one navigable surface. Apple HIG / Material / Polaris-grade coverage, Lumen-tuned.",
    group: "system",
  },
  {
    slug: "registry",
    href: "/library/registry",
    label: "Registry Browser",
    shortLabel: "Registry",
    description:
      "Browse the shadcn `@lumen/*` registry — 149 items across foundation / Tier 1-5 / legacy v0.12.6 sidecars. Each card shows install command, tokens consumed, mode behavior, and NEVER-rule count.",
    group: "system",
  },
  {
    slug: "tokens",
    href: "/tokens",
    label: "Token Browser",
    shortLabel: "Tokens",
    description:
      "Live introspection of the DTCG 2025.10 token graph. Filter by layer + category, search by name, click for resolved value + references + copy commands.",
    group: "system",
  },
  {
    slug: "prompts",
    href: "/prompts",
    label: "Prompt Library",
    shortLabel: "Prompts",
    description:
      "gpt-image-2 templates — style anchor + 7 paste-ready prompts with copy buttons, reference assets, and canonical-subject manifests.",
    group: "system",
  },
  {
    slug: "saas",
    href: "/saas",
    label: "SaaS Dashboard",
    shortLabel: "SaaS",
    description:
      "Internal product UI: navigation, data tables, charts, side panels, status, empty states.",
    group: "platform",
  },
  {
    slug: "landing",
    href: "/landing",
    label: "Marketing & Landing",
    shortLabel: "Landing",
    description:
      "Marketing pages, hero, feature blocks, social proof, pricing, footer.",
    group: "platform",
  },
  {
    slug: "tool",
    href: "/tool",
    label: "Web Tool",
    shortLabel: "Tool",
    description:
      "Single-purpose web utilities: focused canvas, side controls, output panel.",
    group: "platform",
  },
  {
    slug: "commerce",
    href: "/commerce",
    label: "Commerce",
    shortLabel: "Commerce",
    description:
      "Product detail, cart, collections, account — Shopify / BigCommerce / WooCommerce theme patterns.",
    group: "platform",
  },
  {
    slug: "mobile",
    href: "/mobile",
    label: "Mobile",
    shortLabel: "Mobile",
    description:
      "iOS and Android frames side-by-side: tab bar, list, detail, modal, settings.",
    group: "platform",
  },
  {
    slug: "desktop",
    href: "/desktop",
    label: "Native Desktop",
    shortLabel: "Desktop",
    description:
      "macOS and Windows frames side-by-side: titlebar, sidebar, content, inspector.",
    group: "platform",
  },
];

export const TAB_BY_SLUG: Record<TabSlug, Tab> = TABS.reduce(
  (acc, t) => ({ ...acc, [t.slug]: t }),
  {} as Record<TabSlug, Tab>,
);
