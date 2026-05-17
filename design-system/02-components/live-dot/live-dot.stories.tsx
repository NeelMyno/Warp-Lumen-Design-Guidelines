// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { LiveDot } from "./live-dot";

const meta = defineMeta({
  title: "T3-SIG/LiveDot",
  component: LiveDot,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {
    "label": "Live"
  },
  render: (args) => <LiveDot {...args}>LiveDot</LiveDot>,
});

export const Red = meta.story({
  args: {
    "label": "Down",
    "color": "var(--lumen-red-5)"
  },
  render: (args) => <LiveDot {...args}>LiveDot</LiveDot>,
});

