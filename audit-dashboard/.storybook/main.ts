import type { StorybookConfig } from "@storybook/nextjs";

/**
 * Storybook config for audit-dashboard (v0.14 scaffold).
 *
 * v0.14.0 ships the wiring; full enablement requires `pnpm add -D
 * @storybook/nextjs @storybook/react @storybook/addon-essentials`. Once the
 * Storybook deps land, run `pnpm storybook` to start the dev server +
 * `pnpm build-storybook` to produce a static deploy artifact.
 *
 * Lumen's Storybook contract:
 *   - One Story file per primitive (98 primitives → 98 stories at maturity)
 *   - Each story exposes the primitive's prop matrix as Storybook Controls
 *   - The Lumen theme (data-mood="obsidian" + data-theme="dark") is wired
 *     via .storybook/preview.tsx so stories render in the canonical dark
 *     surface
 *   - a11y addon scans every story via axe-core, surfacing WCAG 2.2 AA
 *     violations as Storybook warnings
 *
 * R12 of the audit-cycle ladder: Storybook + a11y-tree per-state probes
 * across all 98 primitives. v0.14.0 establishes the foundation; R12 ships
 * the per-primitive Story files + the axe-addon gate.
 */
const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
