// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "T2/Modal",
  component: Modal,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {},
  render: (args) => <Modal {...args}>Modal</Modal>,
};

export const Destructive: Story = {
  args: {
    "destructive": true
  },
  render: (args) => <Modal {...args}>Modal</Modal>,
};

