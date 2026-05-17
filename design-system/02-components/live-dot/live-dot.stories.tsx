// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { LiveDot } from "./live-dot";

const meta: Meta<typeof LiveDot> = {
  title: "T3-SIG/LiveDot",
  component: LiveDot,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof LiveDot>;

export const Default: Story = {
  args: {
    "label": "Live"
  },
  render: (args) => <LiveDot {...args}>LiveDot</LiveDot>,
};

export const Red: Story = {
  args: {
    "label": "Down",
    "color": "var(--lumen-red-5)"
  },
  render: (args) => <LiveDot {...args}>LiveDot</LiveDot>,
};

