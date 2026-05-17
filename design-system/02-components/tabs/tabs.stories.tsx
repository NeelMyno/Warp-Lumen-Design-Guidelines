// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tabs } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "T1/Tabs",
  component: Tabs,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    "defaultValue": "overview"
  },
  render: (args) => <Tabs {...args}>Tabs</Tabs>,
};

