// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { OTRTruckIso } from "./otr-truck-iso";

const meta = defineMeta({
  title: "T4/OTRTruckIso",
  component: OTRTruckIso,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "size": "md"
  },
  render: (args) => <OTRTruckIso {...args}>OTRTruckIso</OTRTruckIso>,
});

