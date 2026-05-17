// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { RateTicker } from "./rate-ticker";

const meta = defineMeta({
  title: "T3-SIG/RateTicker",
  component: RateTicker,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <RateTicker {...args}>RateTicker</RateTicker>,
});

export const Slow = meta.story({
  args: {
    "speed": "slow"
  },
  render: (args) => <RateTicker {...args}>RateTicker</RateTicker>,
});

