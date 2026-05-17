// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "T2/Pagination",
  component: Pagination,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    "currentPage": 3,
    "totalPages": 10
  },
  render: (args) => <Pagination {...args}>Pagination</Pagination>,
};

