// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { FilterChip } from "./filter-chip";

const meta = defineMeta({
  title: "T2/FilterChip",
  component: FilterChip,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "field": "Lane",
    "operator": "is",
    "value": "LAX→SFO"
  },
  render: (args) => <FilterChip {...args}>FilterChip</FilterChip>,
});

