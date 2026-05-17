// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "T1/Input",
  component: Input,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    "placeholder": "Enter lane code"
  },
  render: (args) => <Input {...args}>Input</Input>,
};

export const Disabled: Story = {
  args: {
    "placeholder": "Disabled",
    "disabled": true
  },
  render: (args) => <Input {...args}>Input</Input>,
};

export const Error: Story = {
  args: {
    "placeholder": "Invalid",
    "aria-invalid": true,
    "defaultValue": "??"
  },
  render: (args) => <Input {...args}>Input</Input>,
};

