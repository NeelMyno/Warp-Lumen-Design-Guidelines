// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "T1/Slider",
  component: Slider,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    "defaultValue": [
      40
    ]
  },
  render: (args) => <Slider {...args}>Slider</Slider>,
};

export const Range: Story = {
  args: {
    "defaultValue": [
      20,
      80
    ]
  },
  render: (args) => <Slider {...args}>Slider</Slider>,
};

