// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "T1/Switch",
  component: Switch,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
  render: (args) => <Switch {...args}>Switch</Switch>,
};

export const Checked: Story = {
  args: {
    "defaultChecked": true
  },
  render: (args) => <Switch {...args}>Switch</Switch>,
};

