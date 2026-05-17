// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { RadioGroup } from "./radio";

const meta: Meta<typeof RadioGroup> = {
  title: "T1/Radio",
  component: RadioGroup,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    "defaultValue": "a"
  },
  render: (args) => <RadioGroup {...args}>Radio</RadioGroup>,
};

