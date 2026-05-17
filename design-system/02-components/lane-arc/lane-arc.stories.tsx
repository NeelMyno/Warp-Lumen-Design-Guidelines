// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { LaneArc } from "./lane-arc";

const meta: Meta<typeof LaneArc> = {
  title: "T4/LaneArc",
  component: LaneArc,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof LaneArc>;

export const Default: Story = {
  args: {},
  render: (args) => <LaneArc {...args}>LaneArc</LaneArc>,
};

