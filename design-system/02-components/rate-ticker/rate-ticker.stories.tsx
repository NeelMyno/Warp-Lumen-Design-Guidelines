// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { RateTicker } from "./rate-ticker";

const meta: Meta<typeof RateTicker> = {
  title: "T3-SIG/RateTicker",
  component: RateTicker,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof RateTicker>;

export const Default: Story = {
  args: {},
  render: (args) => <RateTicker {...args}>RateTicker</RateTicker>,
};

export const Slow: Story = {
  args: {
    "speed": "slow"
  },
  render: (args) => <RateTicker {...args}>RateTicker</RateTicker>,
};

