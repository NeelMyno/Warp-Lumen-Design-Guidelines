// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { RouteMap } from "./route-map";

const meta: Meta<typeof RouteMap> = {
  title: "T4/RouteMap",
  component: RouteMap,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof RouteMap>;

export const Default: Story = {
  args: {},
  render: (args) => <RouteMap {...args}>RouteMap</RouteMap>,
};

