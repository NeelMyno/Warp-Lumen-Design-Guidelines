// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Sheet } from "./sheet";

const meta: Meta<typeof Sheet> = {
  title: "T1/Sheet",
  component: Sheet,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Right: Story = {
  args: {},
  render: (args) => <Sheet {...args}>Sheet</Sheet>,
};

export const Bottom: Story = {
  args: {},
  render: (args) => <Sheet {...args}>Sheet</Sheet>,
};

