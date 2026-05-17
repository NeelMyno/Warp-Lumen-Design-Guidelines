// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { TopBar } from "./top-bar";

const meta: Meta<typeof TopBar> = {
  title: "T2/TopBar",
  component: TopBar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: {},
  render: (args) => <TopBar {...args}>TopBar</TopBar>,
};

