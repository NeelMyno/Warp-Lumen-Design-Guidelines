// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Drawer } from "./drawer";

const meta: Meta<typeof Drawer> = {
  title: "T2/Drawer",
  component: Drawer,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  args: {},
  render: (args) => <Drawer {...args}>Drawer</Drawer>,
};

export const Bottom: Story = {
  args: {},
  render: (args) => <Drawer {...args}>Drawer</Drawer>,
};

