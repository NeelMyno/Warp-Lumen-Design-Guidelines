// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProgressBar } from "./progress";

const meta: Meta<typeof ProgressBar> = {
  title: "T1/Progress",
  component: ProgressBar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Bar: Story = {
  args: {
    "value": 60
  },
  render: (args) => <ProgressBar {...args}>Progress</ProgressBar>,
};

export const Ring: Story = {
  args: {
    "value": 75
  },
  render: (args) => <ProgressBar {...args}>Progress</ProgressBar>,
};

