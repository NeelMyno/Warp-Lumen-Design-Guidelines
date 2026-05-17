/**
 * Storybook 10.4 (10.3 contract) configuration.
 * Component Manifests are emitted automatically at
 * /storybook-static/manifests/components.json from CSF stories.
 *
 * Storybook is hosted inside audit-dashboard so it inherits the Next.js 16.2
 * + Tailwind v4 setup. Stories live alongside their source in
 * design-system/02-components/<name>/<name>.stories.tsx.
 */
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  stories: [
    "../../design-system/02-components/**/*.stories.tsx",
    "../../design-system/02-components/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-a11y",
  ],
  features: {
    componentsManifest: true, // 10.3 default; explicit for the v0.13 contract.
  },
  staticDirs: [
    "../public",
    "../src/fonts",
  ],
  docs: {
    autodocs: "tag",
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
