// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Checkbox } from "./checkbox";

const meta = defineMeta({
  title: "T1/Checkbox",
  component: Checkbox,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Checkbox {...args}>Checkbox</Checkbox>,
});

export const Checked = meta.story({
  args: {
    "defaultChecked": true
  },
  render: (args) => <Checkbox {...args}>Checkbox</Checkbox>,
});

