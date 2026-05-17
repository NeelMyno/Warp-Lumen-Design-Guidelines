// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { LaneCode } from "./lane-code";

const meta = defineMeta({
  title: "T4/LaneCode",
  component: LaneCode,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "origin": "LAX",
    "destination": "SFO"
  },
  render: (args) => <LaneCode {...args}>LaneCode</LaneCode>,
});

export const WithRate = meta.story({
  args: {
    "origin": "LAX",
    "destination": "SFO",
    "rate": "$262"
  },
  render: (args) => <LaneCode {...args}>LaneCode</LaneCode>,
});

export const Bordered = meta.story({
  args: {
    "origin": "LAX",
    "destination": "SFO",
    "bordered": true
  },
  render: (args) => <LaneCode {...args}>LaneCode</LaneCode>,
});

