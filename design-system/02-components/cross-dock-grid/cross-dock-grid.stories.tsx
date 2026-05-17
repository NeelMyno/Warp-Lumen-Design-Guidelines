// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { CrossDockGrid } from "./cross-dock-grid";

const meta = defineMeta({
  title: "T4/CrossDockGrid",
  component: CrossDockGrid,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "rows": 6,
    "cols": 12
  },
  render: (args) => <CrossDockGrid {...args}>CrossDockGrid</CrossDockGrid>,
});

