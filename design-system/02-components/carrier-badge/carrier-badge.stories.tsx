// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { CarrierBadge } from "./carrier-badge";

const meta = defineMeta({
  title: "T4/CarrierBadge",
  component: CarrierBadge,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "name": "Sterling LTL",
    "vehicle": "LTL",
    "rating": 4.6,
    "otdPct": 97.8
  },
  render: (args) => <CarrierBadge {...args}>CarrierBadge</CarrierBadge>,
});

export const Compact = meta.story({
  args: {
    "name": "Estes Express",
    "otdPct": 96.1,
    "compact": true
  },
  render: (args) => <CarrierBadge {...args}>CarrierBadge</CarrierBadge>,
});

