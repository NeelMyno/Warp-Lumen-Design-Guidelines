// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { DockBay } from "./dock-bay";

const meta: Meta<typeof DockBay> = {
  title: "T4/DockBay",
  component: DockBay,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof DockBay>;

export const Default: Story = {
  args: {},
  render: (args) => <DockBay {...args}>DockBay</DockBay>,
};

