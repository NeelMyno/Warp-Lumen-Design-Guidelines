// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Button } from "./button";

const meta = defineMeta({
  title: "T1/Button",
  component: Button,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Primary = meta.story({
  args: {
    "intent": "primary"
  },
  render: (args) => <Button {...args}>Get rates</Button>,
});

export const Secondary = meta.story({
  args: {
    "intent": "secondary"
  },
  render: (args) => <Button {...args}>Cancel</Button>,
});

export const Danger = meta.story({
  args: {
    "intent": "danger"
  },
  render: (args) => <Button {...args}>Delete account</Button>,
});

export const AI = meta.story({
  args: {
    "intent": "ai"
  },
  render: (args) => <Button {...args}>Improve with AI</Button>,
});

export const Pill = meta.story({
  args: {
    "intent": "primary",
    "shape": "pill",
    "size": "lg"
  },
  render: (args) => <Button {...args}>Start free trial</Button>,
});

export const Loading = meta.story({
  args: {
    "intent": "primary",
    "loading": true
  },
  render: (args) => <Button {...args}>Saving…</Button>,
});

export const Disabled = meta.story({
  args: {
    "intent": "primary",
    "disabled": true
  },
  render: (args) => <Button {...args}>Save changes</Button>,
});

