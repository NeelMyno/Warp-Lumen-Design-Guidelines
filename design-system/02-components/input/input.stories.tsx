// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Input } from "./input";

const meta = defineMeta({
  title: "T1/Input",
  component: Input,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "placeholder": "Enter lane code"
  },
  render: (args) => <Input {...args}>Input</Input>,
});

export const Disabled = meta.story({
  args: {
    "placeholder": "Disabled",
    "disabled": true
  },
  render: (args) => <Input {...args}>Input</Input>,
});

export const Error = meta.story({
  args: {
    "placeholder": "Invalid",
    "aria-invalid": true,
    "defaultValue": "??"
  },
  render: (args) => <Input {...args}>Input</Input>,
});

