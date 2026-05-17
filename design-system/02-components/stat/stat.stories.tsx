// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Stat } from "./stat";

const meta = defineMeta({
  title: "T3-SIG/Stat",
  component: Stat,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "label": "On-time index",
    "value": "98.2",
    "unit": "%",
    "delta": "+0.4pp",
    "trend": "up",
    "polarity": "good-up"
  },
  render: (args) => <Stat {...args}>Stat</Stat>,
});

export const WithSpark = meta.story({
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
});

export const Hero = meta.story({
  args: {
    "label": "Annual savings",
    "value": "$2.4M",
    "size": "hero"
  },
  render: (args) => <Stat {...args}>Stat</Stat>,
});

