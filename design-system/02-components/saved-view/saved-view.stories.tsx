// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { SavedView } from "./saved-view";

const meta = defineMeta({
  title: "T2/SavedView",
  component: SavedView,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <SavedView {...args}>SavedView</SavedView>,
});

export const Dirty = meta.story({
  args: {
    "isDirty": true
  },
  render: (args) => <SavedView {...args}>SavedView</SavedView>,
});

