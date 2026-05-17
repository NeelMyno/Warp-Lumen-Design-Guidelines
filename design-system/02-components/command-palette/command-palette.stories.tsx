// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { CommandPalette } from "./command-palette";

const meta = defineMeta({
  title: "T2/CommandPalette",
  component: CommandPalette,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "open": true
  },
  render: (args) => <CommandPalette {...args}>CommandPalette</CommandPalette>,
});

