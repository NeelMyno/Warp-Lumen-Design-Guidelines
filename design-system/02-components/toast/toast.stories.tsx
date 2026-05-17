// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Toaster } from "./toast";

const meta: Meta<typeof Toaster> = {
  title: "T1/Toaster",
  component: Toaster,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  args: {},
  render: (args) => <Toaster {...args}>Toaster</Toaster>,
};

export const Success: Story = {
  args: {},
  render: (args) => <Toaster {...args}>Toaster</Toaster>,
};

