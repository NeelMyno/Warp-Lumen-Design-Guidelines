// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { DatePicker } from "./date-picker";

const meta = defineMeta({
  title: "T2/DatePicker",
  component: DatePicker,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Single = meta.story({
  args: {},
  render: (args) => <DatePicker {...args}>DatePicker</DatePicker>,
});

export const Range = meta.story({
  args: {
    "mode": "range"
  },
  render: (args) => <DatePicker {...args}>DatePicker</DatePicker>,
});

