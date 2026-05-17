// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Pagination } from "./pagination";

const meta = defineMeta({
  title: "T2/Pagination",
  component: Pagination,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "currentPage": 3,
    "totalPages": 10
  },
  render: (args) => <Pagination {...args}>Pagination</Pagination>,
});

