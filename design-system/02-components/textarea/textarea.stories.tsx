// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Textarea } from "./textarea";

const meta = defineMeta({
  title: "T1/Textarea",
  component: Textarea,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "placeholder": "Notes for the carrier…"
  },
  render: (args) => <Textarea {...args}>Textarea</Textarea>,
});

export const Error = meta.story({
  args: {
    "placeholder": "Required",
    "aria-invalid": true
  },
  render: (args) => <Textarea {...args}>Textarea</Textarea>,
});

