// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Avatar } from "./avatar";

const meta = defineMeta({
  title: "T1/Avatar",
  component: Avatar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "name": "Avery Mercer"
  },
  render: (args) => <Avatar {...args}>Avatar</Avatar>,
});

export const WithImage = meta.story({
  args: {
    "name": "Kai Morgan",
    "src": "/avatar.jpg"
  },
  render: (args) => <Avatar {...args}>Avatar</Avatar>,
});

