// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { ShipmentTimeline } from "./shipment-timeline";

const meta = defineMeta({
  title: "T4/ShipmentTimeline",
  component: ShipmentTimeline,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "stages": [
      {
        "id": "1",
        "label": "Picked up",
        "status": "done",
        "timestamp": "08:14"
      },
      {
        "id": "2",
        "label": "In transit",
        "status": "active",
        "timestamp": "10:42"
      },
      {
        "id": "3",
        "label": "Delivered",
        "status": "pending",
        "etaIso": "2026-05-17T14:00:00Z"
      }
    ]
  },
  render: (args) => <ShipmentTimeline {...args}>ShipmentTimeline</ShipmentTimeline>,
});

