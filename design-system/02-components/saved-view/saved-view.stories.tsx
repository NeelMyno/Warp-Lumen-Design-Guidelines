// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { SavedView } from "./saved-view";

const meta: Meta<typeof SavedView> = {
  title: "T2/SavedView",
  component: SavedView,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof SavedView>;

export const Default: Story = {
  args: {},
  render: (args) => <SavedView {...args}>SavedView</SavedView>,
};

export const Dirty: Story = {
  args: {
    "isDirty": true
  },
  render: (args) => <SavedView {...args}>SavedView</SavedView>,
};

