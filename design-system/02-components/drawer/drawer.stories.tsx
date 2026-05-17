// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Drawer } from "./drawer";

const meta = defineMeta({
  title: "T2/Drawer",
  component: Drawer,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Right = meta.story({
  args: {},
  render: (args) => <Drawer {...args}>Drawer</Drawer>,
});

export const Bottom = meta.story({
  args: {},
  render: (args) => <Drawer {...args}>Drawer</Drawer>,
});

