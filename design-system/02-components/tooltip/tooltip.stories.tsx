// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "T1/Tooltip",
  component: Tooltip,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {},
  render: (args) => <Tooltip {...args}>Tooltip</Tooltip>,
};

