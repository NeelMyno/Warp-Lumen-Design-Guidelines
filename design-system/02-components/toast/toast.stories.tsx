// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Toaster } from "./toast";

const meta = defineMeta({
  title: "T1/Toaster",
  component: Toaster,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Toaster {...args}>Toaster</Toaster>,
});

export const Success = meta.story({
  args: {},
  render: (args) => <Toaster {...args}>Toaster</Toaster>,
});

