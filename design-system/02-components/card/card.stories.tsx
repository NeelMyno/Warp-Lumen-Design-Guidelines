// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "T1/Card",
  component: Card,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {},
  render: (args) => <Card {...args}>Card body</Card>,
};

export const WithHeader: Story = {
  args: {},
  render: (args) => <Card {...args}>WithHeader</Card>,
};

