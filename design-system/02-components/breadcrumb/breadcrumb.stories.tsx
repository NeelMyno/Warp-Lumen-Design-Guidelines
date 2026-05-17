// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Breadcrumb } from "./breadcrumb";

const meta = defineMeta({
  title: "T1/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
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
});

