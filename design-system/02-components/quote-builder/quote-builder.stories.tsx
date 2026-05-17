// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { QuoteBuilder } from "./quote-builder";

const meta: Meta<typeof QuoteBuilder> = {
  title: "T4/QuoteBuilder",
  component: QuoteBuilder,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof QuoteBuilder>;

export const Default: Story = {
  args: {},
  render: (args) => <QuoteBuilder {...args}>QuoteBuilder</QuoteBuilder>,
};

