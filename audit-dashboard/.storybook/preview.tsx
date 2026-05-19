import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

/**
 * Storybook preview config — wires the Lumen theme contract into every story.
 *
 * Decorator: every Story renders inside <html data-mood="obsidian" data-theme="dark">
 * so dark-mode tokens resolve correctly. Add a toolbar toggle for light mode in a
 * future round (R12) using @storybook/addon-themes.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "lumen-dark",
      values: [
        { name: "lumen-dark", value: "#0D0D0D" },
        { name: "lumen-light", value: "#FAFAFA" },
      ],
    },
    a11y: {
      // axe-core/storybook addon configuration
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <div data-mood="obsidian" data-theme="dark" style={{ padding: "24px" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
