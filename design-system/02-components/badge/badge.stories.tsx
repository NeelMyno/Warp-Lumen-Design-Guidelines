// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Badge } from "./badge";

const meta = defineMeta({
  title: "T1/Badge",
  component: Badge,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Neutral = meta.story({
  args: {},
  render: (args) => <Badge {...args}>Neutral</Badge>,
});

export const Success = meta.story({
  args: {
    "status": "success"
  },
  render: (args) => <Badge {...args}>On time</Badge>,
});

export const Warning = meta.story({
  args: {
    "status": "warning"
  },
  render: (args) => <Badge {...args}>Delayed</Badge>,
});

export const Danger = meta.story({
  args: {
    "status": "danger"
  },
  render: (args) => <Badge {...args}>Failed</Badge>,
});

export const WithDot = meta.story({
  args: {
    "status": "success",
    "leadingDot": true
  },
  render: (args) => <Badge {...args}>Live</Badge>,
});

