// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { OTRTruckIso } from "./otr-truck-iso";

const meta: Meta<typeof OTRTruckIso> = {
  title: "T4/OTRTruckIso",
  component: OTRTruckIso,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof OTRTruckIso>;

export const Default: Story = {
  args: {
    "size": "md"
  },
  render: (args) => <OTRTruckIso {...args}>OTRTruckIso</OTRTruckIso>,
};

