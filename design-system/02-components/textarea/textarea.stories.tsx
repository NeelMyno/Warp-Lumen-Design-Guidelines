// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "T1/Textarea",
  component: Textarea,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    "placeholder": "Notes for the carrier…"
  },
  render: (args) => <Textarea {...args}>Textarea</Textarea>,
};

export const Error: Story = {
  args: {
    "placeholder": "Required",
    "aria-invalid": true
  },
  render: (args) => <Textarea {...args}>Textarea</Textarea>,
};

