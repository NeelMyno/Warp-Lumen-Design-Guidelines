// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "T1/Spinner",
  component: Spinner,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
  render: (args) => <Spinner {...args}>Spinner</Spinner>,
};

export const Large: Story = {
  args: {
    "size": 32
  },
  render: (args) => <Spinner {...args}>Spinner</Spinner>,
};

