// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Stat } from "./stat";

const meta: Meta<typeof Stat> = {
  title: "T3-SIG/Stat",
  component: Stat,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  args: {
    "label": "On-time index",
    "value": "98.2",
    "unit": "%",
    "delta": "+0.4pp",
    "trend": "up",
    "polarity": "good-up"
  },
  render: (args) => <Stat {...args}>Stat</Stat>,
};

export const WithSpark: Story = {
  args: {
    "label": "Active lanes",
    "value": "1,247",
    "delta": "+18",
    "trend": "up",
    "polarity": "good-up",
    "sparkData": [
      4,
      7,
      6,
      9,
      8,
      11,
      14
    ]
  },
  render: (args) => <Stat {...args}>Stat</Stat>,
};

export const Hero: Story = {
  args: {
    "label": "Annual savings",
    "value": "$2.4M",
    "size": "hero"
  },
  render: (args) => <Stat {...args}>Stat</Stat>,
};

