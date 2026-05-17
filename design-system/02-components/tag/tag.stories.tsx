// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Tag } from "./tag";

const meta = defineMeta({
  title: "T1/Tag",
  component: Tag,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Tag {...args}>LAX → SFO</Tag>,
});

export const Removable = meta.story({
  args: {
    "onRemove": "() => {}"
  },
  render: (args) => <Tag {...args}>LAX → SFO</Tag>,
});

