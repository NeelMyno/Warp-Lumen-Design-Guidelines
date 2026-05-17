// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "T1/Skeleton",
  component: Skeleton,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    "width": 120,
    "height": 14
  },
  render: (args) => <Skeleton {...args}>Skeleton</Skeleton>,
};

