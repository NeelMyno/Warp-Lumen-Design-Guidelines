// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "T1/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    "items": [
      {
        "href": "/",
        "label": "Home"
      },
      {
        "href": "/lanes",
        "label": "Lanes"
      },
      {
        "label": "LAX → SFO"
      }
    ]
  },
  render: (args) => <Breadcrumb {...args}>Breadcrumb</Breadcrumb>,
};

