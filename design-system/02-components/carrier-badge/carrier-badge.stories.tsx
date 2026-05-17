// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { CarrierBadge } from "./carrier-badge";

const meta: Meta<typeof CarrierBadge> = {
  title: "T4/CarrierBadge",
  component: CarrierBadge,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof CarrierBadge>;

export const Default: Story = {
  args: {
    "name": "Sterling LTL",
    "vehicle": "LTL",
    "rating": 4.6,
    "otdPct": 97.8
  },
  render: (args) => <CarrierBadge {...args}>CarrierBadge</CarrierBadge>,
};

export const Compact: Story = {
  args: {
    "name": "Estes Express",
    "otdPct": 96.1,
    "compact": true
  },
  render: (args) => <CarrierBadge {...args}>CarrierBadge</CarrierBadge>,
};

