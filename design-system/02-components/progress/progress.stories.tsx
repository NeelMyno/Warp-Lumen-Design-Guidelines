// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { ProgressBar } from "./progress";

const meta = defineMeta({
  title: "T1/Progress",
  component: ProgressBar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Bar = meta.story({
  args: {
    "value": 60
  },
  render: (args) => <ProgressBar {...args}>Progress</ProgressBar>,
});

export const Ring = meta.story({
  args: {
    "value": 75
  },
  render: (args) => <ProgressBar {...args}>Progress</ProgressBar>,
});

