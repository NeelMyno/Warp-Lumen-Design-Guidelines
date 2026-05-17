// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Popover } from "./popover";

const meta = defineMeta({
  title: "T1/Popover",
  component: Popover,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Popover {...args}>Popover</Popover>,
});

export const RightAligned = meta.story({
  args: {
    "align": "end"
  },
  render: (args) => <Popover {...args}>Popover</Popover>,
});

