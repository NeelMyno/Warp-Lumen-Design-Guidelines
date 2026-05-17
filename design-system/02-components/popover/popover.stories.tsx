// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Popover } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "T1/Popover",
  component: Popover,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {},
  render: (args) => <Popover {...args}>Popover</Popover>,
};

export const RightAligned: Story = {
  args: {
    "align": "end"
  },
  render: (args) => <Popover {...args}>Popover</Popover>,
};

