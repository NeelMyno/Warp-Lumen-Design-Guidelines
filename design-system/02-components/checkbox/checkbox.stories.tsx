// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "T1/Checkbox",
  component: Checkbox,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
  render: (args) => <Checkbox {...args}>Checkbox</Checkbox>,
};

export const Checked: Story = {
  args: {
    "defaultChecked": true
  },
  render: (args) => <Checkbox {...args}>Checkbox</Checkbox>,
};

