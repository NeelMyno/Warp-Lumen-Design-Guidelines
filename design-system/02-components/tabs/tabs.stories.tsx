// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Tabs } from "./tabs";

const meta = defineMeta({
  title: "T1/Tabs",
  component: Tabs,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "defaultValue": "overview"
  },
  render: (args) => <Tabs {...args}>Tabs</Tabs>,
});

