// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "T1/Badge",
  component: Badge,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: {},
  render: (args) => <Badge {...args}>Neutral</Badge>,
};

export const Success: Story = {
  args: {
    "status": "success"
  },
  render: (args) => <Badge {...args}>On time</Badge>,
};

export const Warning: Story = {
  args: {
    "status": "warning"
  },
  render: (args) => <Badge {...args}>Delayed</Badge>,
};

export const Danger: Story = {
  args: {
    "status": "danger"
  },
  render: (args) => <Badge {...args}>Failed</Badge>,
};

export const WithDot: Story = {
  args: {
    "status": "success",
    "leadingDot": true
  },
  render: (args) => <Badge {...args}>Live</Badge>,
};

