// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Combobox } from "./combobox";

const meta: Meta<typeof Combobox> = {
  title: "T2/Combobox",
  component: Combobox,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: {
    "options": [
      {
        "value": "lax",
        "label": "LAX"
      }
    ]
  },
  render: (args) => <Combobox {...args}>Combobox</Combobox>,
};

