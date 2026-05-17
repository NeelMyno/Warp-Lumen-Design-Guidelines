// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Spinner } from "./spinner";

const meta = defineMeta({
  title: "T1/Spinner",
  component: Spinner,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Spinner {...args}>Spinner</Spinner>,
});

export const Large = meta.story({
  args: {
    "size": 32
  },
  render: (args) => <Spinner {...args}>Spinner</Spinner>,
});

