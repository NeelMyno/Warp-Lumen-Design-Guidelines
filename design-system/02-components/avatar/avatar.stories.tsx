// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "T1/Avatar",
  component: Avatar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    "name": "Avery Mercer"
  },
  render: (args) => <Avatar {...args}>Avatar</Avatar>,
};

export const WithImage: Story = {
  args: {
    "name": "Kai Morgan",
    "src": "/avatar.jpg"
  },
  render: (args) => <Avatar {...args}>Avatar</Avatar>,
};

