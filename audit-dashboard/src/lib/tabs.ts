export type TabSlug =
  | "foundations"
  | "library"
  | "saas"
  | "landing"
  | "tool"
  | "ecommerce"
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
    slug: "ecommerce",
    href: "/ecommerce",
    label: "E-commerce",
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
