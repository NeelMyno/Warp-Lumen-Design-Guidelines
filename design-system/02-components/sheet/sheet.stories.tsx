// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Sheet } from "./sheet";

const meta = defineMeta({
  title: "T1/Sheet",
  component: Sheet,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Right = meta.story({
  args: {},
  render: (args) => <Sheet {...args}>Sheet</Sheet>,
});

export const Bottom = meta.story({
  args: {},
  render: (args) => <Sheet {...args}>Sheet</Sheet>,
});

