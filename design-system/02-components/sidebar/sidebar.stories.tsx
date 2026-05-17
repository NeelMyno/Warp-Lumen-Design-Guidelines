// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "T2/Sidebar",
  component: Sidebar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
  render: (args) => <Sidebar {...args}>Sidebar</Sidebar>,
};

export const Collapsed: Story = {
  args: {
    "collapsed": true
  },
  render: (args) => <Sidebar {...args}>Sidebar</Sidebar>,
};

