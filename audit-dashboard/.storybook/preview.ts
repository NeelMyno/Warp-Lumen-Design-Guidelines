/**
 * Storybook preview — global decorators, parameters, mode toggle.
 *
 * Imports globals.css so every story renders with the Lumen token graph
 * (lumen-mode-tokens.css + lumen-scoping.css + Satoshi + Tailwind v4 theme).
 *
 * Mode toggle adds a Storybook toolbar dropdown ("Restrained" | "Expressive")
 * that flips data-mode on the story wrapper — exactly the same mechanism
 * <ModeScope> uses in production. Components stay mode-agnostic.
 */
import type { Preview } from "@storybook/nextjs";
import "../src/app/globals.css";
import React from "react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "lumen-canvas",
      values: [
        { name: "lumen-canvas", value: "var(--surface-canvas, #0D0D0D)" },
        { name: "paper", value: "var(--surface-paper, #FAFAFA)" },
      ],
    },
    layout: "centered",
    a11y: {
      // axe-core runs on every story; failing rules surface in the addon panel.
      config: { rules: [] },
      options: { restoreScroll: true },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    mode: {
      name: "Mode",
      description: "Lumen mode scope (data-mode)",
      defaultValue: "restrained",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "restrained", title: "Restrained" },
          { value: "expressive", title: "Expressive" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: "Theme",
      description: "Light / Dark cascade",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const mode = ctx.globals.mode ?? "restrained";
      const theme = ctx.globals.theme ?? "dark";
      return React.createElement(
        "div",
        {
          "data-mode": mode,
          "data-theme": theme,
          style: {
            padding: "var(--space-8, 32px)",
            minHeight: "100vh",
            background: "var(--surface-canvas, #0D0D0D)",
            color: "var(--text-primary, #E6E6E6)",
            fontFamily: "var(--font-sans, 'Satoshi Variable', system-ui, sans-serif)",
          },
        },
        React.createElement(Story, null),
      );
    },
  ],
};

export default preview;
