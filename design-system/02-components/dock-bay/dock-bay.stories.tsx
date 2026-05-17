// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { DockBay } from "./dock-bay";

const meta = defineMeta({
  title: "T4/DockBay",
  component: DockBay,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <DockBay {...args}>DockBay</DockBay>,
});

