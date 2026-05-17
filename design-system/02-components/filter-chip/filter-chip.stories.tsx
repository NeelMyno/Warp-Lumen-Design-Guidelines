// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { FilterChip } from "./filter-chip";

const meta: Meta<typeof FilterChip> = {
  title: "T2/FilterChip",
  component: FilterChip,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  args: {
    "field": "Lane",
    "operator": "is",
    "value": "LAX→SFO"
  },
  render: (args) => <FilterChip {...args}>FilterChip</FilterChip>,
};

