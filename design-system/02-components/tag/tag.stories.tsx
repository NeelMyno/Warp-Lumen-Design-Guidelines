// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "T1/Tag",
  component: Tag,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {},
  render: (args) => <Tag {...args}>LAX → SFO</Tag>,
};

export const Removable: Story = {
  args: {
    "onRemove": "() => {}"
  },
  render: (args) => <Tag {...args}>LAX → SFO</Tag>,
};

