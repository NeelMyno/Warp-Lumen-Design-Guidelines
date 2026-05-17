// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Slider } from "./slider";

const meta = defineMeta({
  title: "T1/Slider",
  component: Slider,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "defaultValue": [
      40
    ]
  },
  render: (args) => <Slider {...args}>Slider</Slider>,
});

export const Range = meta.story({
  args: {
    "defaultValue": [
      20,
      80
    ]
  },
  render: (args) => <Slider {...args}>Slider</Slider>,
});

