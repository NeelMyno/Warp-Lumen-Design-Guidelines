// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Card } from "./card";

const meta = defineMeta({
  title: "T1/Card",
  component: Card,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Card {...args}>Card body</Card>,
});

export const WithHeader = meta.story({
  args: {},
  render: (args) => <Card {...args}>WithHeader</Card>,
});

