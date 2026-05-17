// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { DatePicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "T2/DatePicker",
  component: DatePicker,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Single: Story = {
  args: {},
  render: (args) => <DatePicker {...args}>DatePicker</DatePicker>,
};

export const Range: Story = {
  args: {
    "mode": "range"
  },
  render: (args) => <DatePicker {...args}>DatePicker</DatePicker>,
};

