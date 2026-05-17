// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { CrossDockGrid } from "./cross-dock-grid";

const meta: Meta<typeof CrossDockGrid> = {
  title: "T4/CrossDockGrid",
  component: CrossDockGrid,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof CrossDockGrid>;

export const Default: Story = {
  args: {
    "rows": 6,
    "cols": 12
  },
  render: (args) => <CrossDockGrid {...args}>CrossDockGrid</CrossDockGrid>,
};

