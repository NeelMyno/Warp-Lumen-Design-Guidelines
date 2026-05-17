// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Skeleton } from "./skeleton";

const meta = defineMeta({
  title: "T1/Skeleton",
  component: Skeleton,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "width": 120,
    "height": 14
  },
  render: (args) => <Skeleton {...args}>Skeleton</Skeleton>,
});

