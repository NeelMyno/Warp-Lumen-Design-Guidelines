// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "T2/Select",
  component: Select,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {},
  render: (args) => <Select {...args}>Select</Select>,
};

