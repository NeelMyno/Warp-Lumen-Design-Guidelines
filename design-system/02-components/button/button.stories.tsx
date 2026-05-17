// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "T1/Button",
  component: Button,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    "intent": "primary"
  },
  render: (args) => <Button {...args}>Get rates</Button>,
};

export const Secondary: Story = {
  args: {
    "intent": "secondary"
  },
  render: (args) => <Button {...args}>Cancel</Button>,
};

export const Danger: Story = {
  args: {
    "intent": "danger"
  },
  render: (args) => <Button {...args}>Delete account</Button>,
};

export const AI: Story = {
  args: {
    "intent": "ai"
  },
  render: (args) => <Button {...args}>Improve with AI</Button>,
};

export const Pill: Story = {
  args: {
    "intent": "primary",
    "shape": "pill",
    "size": "lg"
  },
  render: (args) => <Button {...args}>Start free trial</Button>,
};

export const Loading: Story = {
  args: {
    "intent": "primary",
    "loading": true
  },
  render: (args) => <Button {...args}>Saving…</Button>,
};

export const Disabled: Story = {
  args: {
    "intent": "primary",
    "disabled": true
  },
  render: (args) => <Button {...args}>Save changes</Button>,
};

